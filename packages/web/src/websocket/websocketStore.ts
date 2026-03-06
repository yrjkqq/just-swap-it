/**
 * WebSocketManager — 企业级 WebSocket 网络引擎
 *
 * 完全脱离 React 渲染树的纯 Vanilla TS 实现。
 * 通过 subscribe / getSnapshot 暴露 useSyncExternalStore 接口，
 * 实现"防撕裂"的状态桥接。
 *
 * 核心能力：
 * 1. 心跳保活（Ping/Pong）— 检测幽灵断连
 * 2. 指数退避 + 抖动（Exponential Backoff + Jitter）— 防雪崩
 * 3. 不可变状态快照 — 配合 React Concurrent Mode
 * 4. Transport 抽象 — 可注入 MockTransport 用于测试/演示
 */

import { type ITransport, MockTransport, ReadyState } from "./mockTransport";

export type WSStatus = "CONNECTING" | "OPEN" | "CLOSED" | "RECONNECTING";

export interface EventLogEntry {
  timestamp: number;
  type: "info" | "data" | "heartbeat" | "error" | "reconnect";
  message: string;
}

export interface WSState {
  status: WSStatus;
  latestData: Record<string, unknown> | null;
  reconnectAttempts: number;
  eventLog: EventLogEntry[];
}

type TransportFactory = (url: string) => ITransport;

class WebSocketManager {
  private url: string;
  private transport: ITransport | null = null;
  private createTransport: TransportFactory;

  // 状态快照，供 React 订阅（每次修改必须生成新引用）
  private state: WSState = {
    status: "CLOSED",
    latestData: null,
    reconnectAttempts: 0,
    eventLog: [],
  };

  private listeners: Set<() => void> = new Set();

  // 重连策略
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 10;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private shouldReconnect = true; // 手动断开时设为 false

  // 心跳保活
  private pingInterval = 15_000; // 15 秒一 Ping
  private pongTimeout = 5_000; // Pong 超时 5 秒
  private pingTimer: ReturnType<typeof setInterval> | null = null;
  private pongTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(url: string, transportFactory?: TransportFactory) {
    this.url = url;
    this.createTransport =
      transportFactory ?? ((u: string) => new MockTransport(u));
  }

  // ========== 核心连接逻辑 ==========

  public connect(): void {
    if (this.transport?.readyState === ReadyState.OPEN) return;
    if (this.transport?.readyState === ReadyState.CONNECTING) return;

    this.shouldReconnect = true;
    this.updateState({
      status: this.reconnectAttempts > 0 ? "RECONNECTING" : "CONNECTING",
    });
    this.log(
      "info",
      this.reconnectAttempts > 0
        ? `🔄 第 ${this.reconnectAttempts} 次重连中...`
        : "🔌 正在建立连接...",
    );

    this.transport = this.createTransport(this.url);

    this.transport.onopen = () => {
      this.reconnectAttempts = 0;
      this.updateState({ status: "OPEN", reconnectAttempts: 0 });
      this.log("info", "✅ 连接建立成功");
      this.startHeartbeat();
    };

    this.transport.onmessage = (event: MessageEvent) => {
      // 收到任何消息 → 网络存活 → 重置死亡倒计时
      this.resetPongTimer();

      // 拦截心跳 pong，不推给业务层
      if (event.data === "pong") {
        this.log("heartbeat", "💓 收到 Pong");
        return;
      }

      // 业务数据推给 React
      try {
        const data = JSON.parse(event.data as string);
        this.updateState({ latestData: data });

        if (data.type === "ticker") {
          const btc = data.prices?.["BTC-USDC"];
          if (btc) {
            this.log(
              "data",
              `📊 BTC $${btc.price.toLocaleString()} (${btc.change24h > 0 ? "+" : ""}${btc.change24h}%)`,
            );
          }
        } else if (data.type === "subscribed") {
          this.log("info", `📡 已订阅 ${data.pair}`);
        }
      } catch {
        this.log("error", "⚠️ 消息解析失败");
      }
    };

    this.transport.onclose = () => this.handleDisconnect();
    this.transport.onerror = () => this.handleDisconnect();
  }

  public disconnect(): void {
    this.shouldReconnect = false;
    this.reconnectAttempts = 0;
    this.clearHeartbeat();
    this.clearReconnectTimer();

    if (this.transport) {
      this.transport.close();
      this.transport = null;
    }

    this.updateState({
      status: "CLOSED",
      reconnectAttempts: 0,
    });
    this.log("info", "🔌 已手动断开连接");
  }

  // ========== 心跳保活机制 ==========

  private startHeartbeat(): void {
    this.clearHeartbeat();
    this.pingTimer = setInterval(() => {
      if (this.transport?.readyState === ReadyState.OPEN) {
        this.transport.send("ping");
        this.log("heartbeat", "💗 发送 Ping");

        // 发出 Ping 后，启动死亡倒计时
        this.pongTimer = setTimeout(() => {
          this.log("error", "⚠️ 心跳超时！遭遇幽灵断连，强制重连");
          this.transport?.close(); // 强制触发 onclose → 进入重连
        }, this.pongTimeout);
      }
    }, this.pingInterval);
  }

  private resetPongTimer(): void {
    if (this.pongTimer) {
      clearTimeout(this.pongTimer);
      this.pongTimer = null;
    }
  }

  private clearHeartbeat(): void {
    if (this.pingTimer) {
      clearInterval(this.pingTimer);
      this.pingTimer = null;
    }
    this.resetPongTimer();
  }

  // ========== 指数退避 + 抖动 (Jitter) ==========

  private handleDisconnect(): void {
    this.clearHeartbeat();
    this.transport = null;
    this.updateState({ status: "CLOSED" });

    if (!this.shouldReconnect) return;

    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      this.log("error", "❌ 重连次数耗尽，彻底放弃");
      return;
    }

    // 核心算法：2^n 指数退避 + 随机抖动打散洪峰
    const baseDelay = Math.min(1000 * 2 ** this.reconnectAttempts, 30_000); // 封顶 30 秒
    const jitter = Math.random() * 1000;
    const finalDelay = baseDelay + jitter;

    this.reconnectAttempts++;
    this.updateState({ reconnectAttempts: this.reconnectAttempts });
    this.log(
      "reconnect",
      `⏳ ${(finalDelay / 1000).toFixed(1)}s 后发起第 ${this.reconnectAttempts} 次重连 (退避: ${(baseDelay / 1000).toFixed(1)}s + 抖动: ${(jitter / 1000).toFixed(1)}s)`,
    );

    this.reconnectTimer = setTimeout(() => this.connect(), finalDelay);
  }

  private clearReconnectTimer(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }

  // ========== 消息发送 ==========

  public send(payload: unknown): void {
    if (this.transport?.readyState === ReadyState.OPEN) {
      this.transport.send(JSON.stringify(payload));
    }
  }

  // ========== 模拟网络故障（供 demo 页控制面板使用） ==========

  public simulateNetworkError(): void {
    if (this.transport && "simulateNetworkError" in this.transport) {
      this.log("error", "💥 模拟网络故障！");
      (this.transport as MockTransport).simulateNetworkError();
    }
  }

  // ========== useSyncExternalStore 粘合层 ==========

  public subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  public getSnapshot = (): WSState => this.state;

  // 每次更新都生成新的对象引用，保证 React 能 diff 到变更
  private updateState(patch: Partial<WSState>): void {
    this.state = { ...this.state, ...patch };
    this.listeners.forEach((l) => l());
  }

  private log(type: EventLogEntry["type"], message: string): void {
    const entry: EventLogEntry = { timestamp: Date.now(), type, message };
    // 最多保留 200 条日志
    const newLog = [...this.state.eventLog, entry].slice(-200);
    this.updateState({ eventLog: newLog });
  }

  public clearLog(): void {
    this.updateState({ eventLog: [] });
  }

  // 获取当前 transport（供外部判断类型）
  public getTransport(): ITransport | null {
    return this.transport;
  }
}

// 导出全局单例（Demo 用 MockTransport，生产环境可替换为真实 WebSocket）
export const wsManager = new WebSocketManager("wss://mock.dex.io/ws");
