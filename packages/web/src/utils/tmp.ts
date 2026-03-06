// websocketStore.ts
export type WSStatus = "CONNECTING" | "OPEN" | "CLOSED" | "RECONNECTING";

class WebSocketManager {
  private url: string;
  private ws: WebSocket | null = null;

  // 状态快照，供 React 订阅
  private state = { status: "CLOSED" as WSStatus, latestData: null as any };
  private listeners: Set<() => void> = new Set();

  // 重连策略控制
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 10;
  private reconnectTimer: NodeJS.Timeout | null = null;

  // 心跳保活控制
  private pingInterval = 15000; // 15秒一Ping
  private pongTimeout = 5000; // 等5秒，没Pong就杀掉
  private pingTimer: NodeJS.Timeout | null = null;
  private pongTimer: NodeJS.Timeout | null = null;

  constructor(url: string) {
    this.url = url;
  }

  // --- 核心连接逻辑 ---
  public connect() {
    if (this.ws?.readyState === WebSocket.OPEN) return;

    this.updateState({
      status: this.reconnectAttempts > 0 ? "RECONNECTING" : "CONNECTING",
    });
    this.ws = new WebSocket(this.url);

    this.ws.onopen = () => {
      this.reconnectAttempts = 0; // 重置退避计数器
      this.updateState({ status: "OPEN" });
      this.startHeartbeat(); // 握手成功，心跳起搏
    };

    this.ws.onmessage = (event) => {
      // 收到任何消息，说明网络是活的，重置死亡倒计时
      this.resetPongTimer();

      // 拦截心跳包，业务数据推给 React
      if (event.data === "pong") return;

      try {
        const data = JSON.parse(event.data);
        this.updateState({ latestData: data }); // 触发 React 渲染
      } catch (e) {
        /* 解析失败处理 */
      }
    };

    this.ws.onclose = () => this.handleDisconnect();
    this.ws.onerror = () => this.handleDisconnect();
  }

  // --- 幽灵断连与心跳保活 ---
  private startHeartbeat() {
    this.clearHeartbeat();
    this.pingTimer = setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.ws.send("ping");
        // 发出 Ping 后，开始等 Pong 的死亡倒计时
        this.pongTimer = setTimeout(() => {
          console.warn("⚠️ 心跳超时，遭遇幽灵断连，准备强制重连");
          this.ws?.close(); // 强制触发 onclose 进入重连逻辑
        }, this.pongTimeout);
      }
    }, this.pingInterval);
  }

  private resetPongTimer() {
    if (this.pongTimer) clearTimeout(this.pongTimer);
  }

  private clearHeartbeat() {
    if (this.pingTimer) clearInterval(this.pingTimer);
    if (this.pongTimer) clearTimeout(this.pongTimer);
  }

  // --- 指数退避与抖动 (Jitter) ---
  private handleDisconnect() {
    this.clearHeartbeat();
    this.ws = null;
    this.updateState({ status: "CLOSED" });

    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error("❌ 重连次数耗尽，彻底死亡");
      return;
    }

    // 核心算法：2的指数级退避 + 0~1000ms的随机抖动打散洪峰
    const baseDelay = Math.min(1000 * 2 ** this.reconnectAttempts, 30000); // 封顶30秒
    const jitter = Math.random() * 1000;
    const finalDelay = baseDelay + jitter;

    this.reconnectAttempts++;
    console.log(
      `⏳ ${finalDelay.toFixed(0)}ms 后发起第 ${this.reconnectAttempts} 次重连...`,
    );

    this.reconnectTimer = setTimeout(() => this.connect(), finalDelay);
  }

  // --- 手动发消息 ---
  public send(payload: any) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(payload));
    }
  }

  // --- 供 useSyncExternalStore 对接的粘合层 ---
  public subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    // 当没有任何组件订阅时，可以按需断开 WS（节约资源）
    return () => this.listeners.delete(listener);
  };

  public getSnapshot = () => this.state; // React 通过它获取当前不可变快照

  private updateState(newState: Partial<typeof this.state>) {
    // 强制每次生成新的对象引用，保证 React 能监听到变更
    this.state = { ...this.state, ...newState };
    this.listeners.forEach((listener) => listener());
  }
}

// 导出一个全局单例 (也可以结合 Context 注入)
export const orderbookWS = new WebSocketManager("wss://api.yourdex.com/ws");
