/**
 * MockTransport — 在浏览器内完整模拟 WebSocket 协议行为
 *
 * 实现了和原生 WebSocket 相同的接口（onopen / onmessage / onclose / onerror / send / close / readyState），
 * 让 WebSocketManager 可以无缝切换真实 WS 和 Mock，核心引擎代码零修改。
 *
 * 功能：
 * - 模拟连接延迟（200~500ms）
 * - 响应心跳 ping → pong
 * - 周期性推送模拟行情数据（BTC / ETH）
 * - 支持手动触发断连（chaos mode）
 */

// 与 WebSocket 原生常量对齐
export const ReadyState = {
  CONNECTING: 0,
  OPEN: 1,
  CLOSING: 2,
  CLOSED: 3,
} as const;

export interface ITransport {
  readyState: number;
  onopen: ((ev: Event) => void) | null;
  onmessage: ((ev: MessageEvent) => void) | null;
  onclose: ((ev: CloseEvent) => void) | null;
  onerror: ((ev: Event) => void) | null;
  send(data: string): void;
  close(code?: number, reason?: string): void;
}

export class MockTransport implements ITransport {
  public readyState: number = ReadyState.CONNECTING;
  public onopen: ((ev: Event) => void) | null = null;
  public onmessage: ((ev: MessageEvent) => void) | null = null;
  public onclose: ((ev: CloseEvent) => void) | null = null;
  public onerror: ((ev: Event) => void) | null = null;

  private dataTimer: ReturnType<typeof setInterval> | null = null;
  private connectTimer: ReturnType<typeof setTimeout> | null = null;

  // 模拟价格状态
  private btcPrice = 62_000 + Math.random() * 4_000;
  private ethPrice = 3_200 + Math.random() * 400;
  private subscriptions = new Set<string>();

  constructor(_url: string) {
    // 模拟异步连接延迟
    const delay = 200 + Math.random() * 300;
    this.connectTimer = setTimeout(() => {
      this.readyState = ReadyState.OPEN;
      this.onopen?.(new Event("open"));
      this.startDataPush();
    }, delay);
  }

  public send(data: string): void {
    if (this.readyState !== ReadyState.OPEN) return;

    // 心跳协议：收到 ping 立即回 pong
    if (data === "ping") {
      setTimeout(
        () => {
          if (this.readyState === ReadyState.OPEN) {
            this.onmessage?.(new MessageEvent("message", { data: "pong" }));
          }
        },
        20 + Math.random() * 50,
      ); // 模拟微小网络延迟
      return;
    }

    // 处理业务消息（如订阅）
    try {
      const msg = JSON.parse(data);
      if (msg.action === "subscribe" && msg.pair) {
        this.subscriptions.add(msg.pair);
        // 立即推送一条确认
        setTimeout(() => {
          if (this.readyState === ReadyState.OPEN) {
            this.onmessage?.(
              new MessageEvent("message", {
                data: JSON.stringify({
                  type: "subscribed",
                  pair: msg.pair,
                  timestamp: Date.now(),
                }),
              }),
            );
          }
        }, 30);
      } else if (msg.action === "unsubscribe" && msg.pair) {
        this.subscriptions.delete(msg.pair);
      }
    } catch {
      // 非 JSON，忽略
    }
  }

  public close(_code?: number, _reason?: string): void {
    if (
      this.readyState === ReadyState.CLOSED ||
      this.readyState === ReadyState.CLOSING
    )
      return;

    this.readyState = ReadyState.CLOSING;
    this.stopDataPush();

    if (this.connectTimer) {
      clearTimeout(this.connectTimer);
      this.connectTimer = null;
    }

    // 模拟异步关闭
    setTimeout(() => {
      this.readyState = ReadyState.CLOSED;
      this.onclose?.(new CloseEvent("close", { code: 1000, wasClean: true }));
    }, 50);
  }

  /**
   * 模拟网络故障 — 从外部调用以触发非正常断连
   * 这会模拟 TCP 层面的异常断开（不发 close frame）
   */
  public simulateNetworkError(): void {
    this.stopDataPush();
    this.readyState = ReadyState.CLOSED;
    this.onerror?.(new Event("error"));
    this.onclose?.(new CloseEvent("close", { code: 1006, wasClean: false }));
  }

  // --- 模拟数据推送 ---

  private startDataPush(): void {
    this.dataTimer = setInterval(
      () => {
        if (this.readyState !== ReadyState.OPEN) return;

        // 布朗运动式价格波动
        this.btcPrice += (Math.random() - 0.5) * 200;
        this.ethPrice += (Math.random() - 0.5) * 20;

        const data = {
          type: "ticker",
          timestamp: Date.now(),
          prices: {
            "BTC-USDC": {
              price: parseFloat(this.btcPrice.toFixed(2)),
              change24h: parseFloat(((Math.random() - 0.45) * 5).toFixed(2)),
              volume: parseFloat((Math.random() * 500_000_000).toFixed(0)),
            },
            "ETH-USDC": {
              price: parseFloat(this.ethPrice.toFixed(2)),
              change24h: parseFloat(((Math.random() - 0.45) * 5).toFixed(2)),
              volume: parseFloat((Math.random() * 100_000_000).toFixed(0)),
            },
          },
        };

        this.onmessage?.(
          new MessageEvent("message", { data: JSON.stringify(data) }),
        );
      },
      1000 + Math.random() * 2000,
    ); // 1~3 秒随机间隔
  }

  private stopDataPush(): void {
    if (this.dataTimer) {
      clearInterval(this.dataTimer);
      this.dataTimer = null;
    }
  }
}
