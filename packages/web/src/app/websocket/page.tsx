"use client";

import { useEffect, useRef } from "react";
import { useWebSocket } from "../../websocket/useWebSocket";
import type { EventLogEntry } from "../../websocket/websocketStore";

// ========== 状态 → 样式映射 ==========

const statusConfig = {
  OPEN: {
    color: "#22c55e",
    glow: "0 0 12px rgba(34,197,94,0.6)",
    label: "已连接",
    bg: "rgba(34,197,94,0.08)",
  },
  CONNECTING: {
    color: "#f59e0b",
    glow: "0 0 12px rgba(245,158,11,0.6)",
    label: "连接中...",
    bg: "rgba(245,158,11,0.08)",
  },
  RECONNECTING: {
    color: "#f59e0b",
    glow: "0 0 12px rgba(245,158,11,0.6)",
    label: "重连中...",
    bg: "rgba(245,158,11,0.08)",
  },
  CLOSED: {
    color: "#ef4444",
    glow: "0 0 12px rgba(239,68,68,0.6)",
    label: "已断开",
    bg: "rgba(239,68,68,0.08)",
  },
} as const;

const logTypeColors: Record<EventLogEntry["type"], string> = {
  info: "#60a5fa",
  data: "#22c55e",
  heartbeat: "#a78bfa",
  error: "#ef4444",
  reconnect: "#f59e0b",
};

// ========== 辅助格式化 ==========

function formatTime(ts: number): string {
  return new Date(ts).toLocaleTimeString("zh-CN", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function formatVolume(v: number): string {
  if (v >= 1_000_000_000) return `$${(v / 1_000_000_000).toFixed(1)}B`;
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`;
  return `$${v.toLocaleString()}`;
}

// ========== 组件 ==========

export default function WebSocketPage() {
  const {
    status,
    latestData,
    reconnectAttempts,
    eventLog,
    connect,
    disconnect,
    send,
    simulateError,
    clearLog,
  } = useWebSocket();

  const logRef = useRef<HTMLDivElement>(null);

  // 自动滚动日志到底部
  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [eventLog.length]);

  const cfg = statusConfig[status];

  // 提取价格数据
  const prices = latestData as {
    type?: string;
    prices?: Record<
      string,
      { price: number; change24h: number; volume: number }
    >;
  } | null;
  const btc = prices?.prices?.["BTC-USDC"];
  const eth = prices?.prices?.["ETH-USDC"];

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #0a0a0f 100%)",
        color: "#e2e8f0",
        fontFamily: "'Inter', 'SF Pro Display', -apple-system, sans-serif",
        padding: "2rem",
      }}
    >
      {/* Header */}
      <header
        style={{ maxWidth: 960, margin: "0 auto 2rem", textAlign: "center" }}
      >
        <h1
          style={{
            fontSize: "2rem",
            fontWeight: 700,
            background: "linear-gradient(135deg, #60a5fa, #a78bfa, #f472b6)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            margin: 0,
            letterSpacing: "-0.02em",
          }}
        >
          WebSocket 企业级架构 Demo
        </h1>
        <p
          style={{
            color: "#64748b",
            marginTop: "0.5rem",
            fontSize: "0.875rem",
          }}
        >
          useSyncExternalStore · 心跳保活 · 指数退避 · 防撕裂
        </p>
      </header>

      <div
        style={{
          maxWidth: 960,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "1.25rem",
        }}
      >
        {/* ===== 连接状态面板 ===== */}
        <GlassCard>
          <SectionTitle>连接状态</SectionTitle>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              marginTop: "1rem",
            }}
          >
            {/* 呼吸灯 */}
            <div
              style={{
                width: 14,
                height: 14,
                borderRadius: "50%",
                backgroundColor: cfg.color,
                boxShadow: cfg.glow,
                animation:
                  status === "CONNECTING" || status === "RECONNECTING"
                    ? "pulse 1.5s ease-in-out infinite"
                    : status === "OPEN"
                      ? "pulse 3s ease-in-out infinite"
                      : "none",
              }}
            />
            <span style={{ fontSize: "1.125rem", fontWeight: 600 }}>
              {cfg.label}
            </span>
          </div>

          {reconnectAttempts > 0 && (
            <div
              style={{
                marginTop: "0.75rem",
                padding: "0.5rem 0.75rem",
                borderRadius: 8,
                backgroundColor: "rgba(245,158,11,0.1)",
                border: "1px solid rgba(245,158,11,0.2)",
                fontSize: "0.8rem",
                color: "#f59e0b",
              }}
            >
              重连尝试: {reconnectAttempts} / 10
            </div>
          )}

          <div
            style={{ marginTop: "1rem", fontSize: "0.75rem", color: "#64748b" }}
          >
            <div>
              Endpoint: <code style={codeStyle}>wss://mock.dex.io/ws</code>
            </div>
            <div style={{ marginTop: "0.25rem" }}>
              Transport: <code style={codeStyle}>MockTransport</code>
            </div>
          </div>
        </GlassCard>

        {/* ===== 实时行情面板 ===== */}
        <GlassCard>
          <SectionTitle>实时行情</SectionTitle>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.75rem",
              marginTop: "1rem",
            }}
          >
            <PriceTicker symbol="BTC" pair="BTC-USDC" data={btc ?? null} />
            <PriceTicker symbol="ETH" pair="ETH-USDC" data={eth ?? null} />
          </div>
        </GlassCard>

        {/* ===== 控制面板 ===== */}
        <GlassCard>
          <SectionTitle>控制面板</SectionTitle>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "0.625rem",
              marginTop: "1rem",
            }}
          >
            <ActionButton
              onClick={connect}
              disabled={status === "OPEN" || status === "CONNECTING"}
              color="#22c55e"
            >
              🔌 连接
            </ActionButton>
            <ActionButton
              onClick={disconnect}
              disabled={status === "CLOSED"}
              color="#ef4444"
            >
              ✂️ 断开
            </ActionButton>
            <ActionButton
              onClick={simulateError}
              disabled={status !== "OPEN"}
              color="#f59e0b"
            >
              💥 模拟故障
            </ActionButton>
            <ActionButton
              onClick={() => send({ action: "subscribe", pair: "BTC-USDC" })}
              disabled={status !== "OPEN"}
              color="#a78bfa"
            >
              📡 订阅 BTC
            </ActionButton>
            <ActionButton
              onClick={clearLog}
              color="#64748b"
              style={{ gridColumn: "span 2" }}
            >
              🗑️ 清空日志
            </ActionButton>
          </div>
        </GlassCard>

        {/* ===== 架构说明 ===== */}
        <GlassCard>
          <SectionTitle>架构要点</SectionTitle>
          <div
            style={{
              fontSize: "0.775rem",
              lineHeight: 1.7,
              color: "#94a3b8",
              marginTop: "0.75rem",
            }}
          >
            <ArchPoint emoji="🏗️" title="Store 外置">
              WebSocket 实例完全脱离 React 树，避免 Strict Mode
              双次挂载导致连接重置
            </ArchPoint>
            <ArchPoint emoji="🔗" title="useSyncExternalStore">
              React 19 官方推荐的外部状态桥接，自带防撕裂（tearing-proof）
            </ArchPoint>
            <ArchPoint emoji="💓" title="心跳保活">
              15s Ping → 5s Pong 超时检测，解决幽灵断连（网线拔了但 onclose
              不触发）
            </ArchPoint>
            <ArchPoint emoji="📈" title="指数退避 + 抖动">
              2ⁿ 秒退避 + 随机 Jitter，防止万人同时重连击沉服务器
            </ArchPoint>
          </div>
        </GlassCard>

        {/* ===== 事件日志（跨两列） ===== */}
        <GlassCard style={{ gridColumn: "span 2" }}>
          <SectionTitle>事件日志</SectionTitle>
          <div
            ref={logRef}
            style={{
              marginTop: "0.75rem",
              maxHeight: 320,
              overflowY: "auto",
              fontFamily: "'JetBrains Mono', 'Fira Code', 'SF Mono', monospace",
              fontSize: "0.75rem",
              lineHeight: 1.8,
              scrollbarWidth: "thin",
              scrollbarColor: "#334155 transparent",
            }}
          >
            {eventLog.length === 0 ? (
              <div
                style={{
                  color: "#475569",
                  textAlign: "center",
                  padding: "2rem",
                }}
              >
                暂无事件，点击「连接」开始...
              </div>
            ) : (
              eventLog.map((entry, i) => (
                <div
                  key={`${entry.timestamp}-${i}`}
                  style={{
                    display: "flex",
                    gap: "0.75rem",
                    padding: "0.2rem 0",
                    borderBottom: "1px solid rgba(255,255,255,0.03)",
                  }}
                >
                  <span style={{ color: "#475569", flexShrink: 0 }}>
                    {formatTime(entry.timestamp)}
                  </span>
                  <span style={{ color: logTypeColors[entry.type] }}>
                    {entry.message}
                  </span>
                </div>
              ))
            )}
          </div>
        </GlassCard>
      </div>

      {/* 全局动画 */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}

// ========== 子组件 ==========

function GlassCard({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <div
      style={{
        backgroundColor: "rgba(255,255,255,0.03)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: 16,
        padding: "1.25rem",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2
      style={{
        fontSize: "0.8rem",
        fontWeight: 600,
        textTransform: "uppercase",
        letterSpacing: "0.08em",
        color: "#94a3b8",
        margin: 0,
      }}
    >
      {children}
    </h2>
  );
}

function PriceTicker({
  symbol,
  pair,
  data,
}: {
  symbol: string;
  pair: string;
  data: { price: number; change24h: number; volume: number } | null;
}) {
  const isUp = data ? data.change24h >= 0 : true;

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0.75rem",
        borderRadius: 10,
        backgroundColor: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.04)",
      }}
    >
      <div>
        <div style={{ fontWeight: 700, fontSize: "0.9rem" }}>{symbol}</div>
        <div style={{ fontSize: "0.7rem", color: "#64748b" }}>{pair}</div>
      </div>
      {data ? (
        <div style={{ textAlign: "right" }}>
          <div
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontWeight: 700,
              fontSize: "1rem",
            }}
          >
            $
            {data.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
          <div
            style={{
              display: "flex",
              gap: "0.5rem",
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            <span
              style={{
                fontSize: "0.75rem",
                fontWeight: 600,
                color: isUp ? "#22c55e" : "#ef4444",
              }}
            >
              {isUp ? "▲" : "▼"} {Math.abs(data.change24h).toFixed(2)}%
            </span>
            <span style={{ fontSize: "0.65rem", color: "#64748b" }}>
              Vol {formatVolume(data.volume)}
            </span>
          </div>
        </div>
      ) : (
        <div style={{ color: "#475569", fontSize: "0.8rem" }}>等待数据...</div>
      )}
    </div>
  );
}

function ActionButton({
  children,
  onClick,
  disabled,
  color,
  style,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  color: string;
  style?: React.CSSProperties;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: "0.625rem 1rem",
        borderRadius: 10,
        border: `1px solid ${disabled ? "rgba(255,255,255,0.05)" : color + "44"}`,
        backgroundColor: disabled ? "rgba(255,255,255,0.02)" : color + "14",
        color: disabled ? "#475569" : color,
        fontWeight: 600,
        fontSize: "0.8rem",
        cursor: disabled ? "not-allowed" : "pointer",
        transition: "all 0.2s ease",
        ...style,
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          e.currentTarget.style.backgroundColor = color + "28";
          e.currentTarget.style.borderColor = color + "66";
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          e.currentTarget.style.backgroundColor = color + "14";
          e.currentTarget.style.borderColor = color + "44";
        }
      }}
    >
      {children}
    </button>
  );
}

function ArchPoint({
  emoji,
  title,
  children,
}: {
  emoji: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ marginBottom: "0.5rem" }}>
      <span>{emoji}</span> <strong style={{ color: "#cbd5e1" }}>{title}</strong>
      <span style={{ margin: "0 0.35rem", color: "#334155" }}>—</span>
      {children}
    </div>
  );
}

const codeStyle: React.CSSProperties = {
  fontFamily: "'JetBrains Mono', monospace",
  fontSize: "0.7rem",
  padding: "0.15rem 0.4rem",
  borderRadius: 4,
  backgroundColor: "rgba(255,255,255,0.06)",
  color: "#a78bfa",
};
