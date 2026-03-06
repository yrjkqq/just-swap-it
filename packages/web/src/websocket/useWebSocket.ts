/**
 * useWebSocket — React 19 Hook
 *
 * 通过 useSyncExternalStore 桥接外部 WebSocketManager 状态。
 * 自带防撕裂（tearing-proof），兼容 Concurrent Mode 和 Strict Mode 双次挂载。
 *
 * 核心理念：脏活全在 WebSocketManager 里干，Hook 只做"状态搬运工"。
 */

"use client";

import { useSyncExternalStore, useCallback } from "react";
import { wsManager, type WSState } from "./websocketStore";

export function useWebSocket() {
  // 1. 完美桥接外部状态 — 自带防撕裂，无需手写 useState / useRef
  const state: WSState = useSyncExternalStore(
    wsManager.subscribe,
    wsManager.getSnapshot,
    wsManager.getSnapshot, // SSR fallback（Next.js 需要）
  );

  // 2. 稳定引用的操作方法
  const connect = useCallback(() => wsManager.connect(), []);
  const disconnect = useCallback(() => wsManager.disconnect(), []);
  const send = useCallback((payload: unknown) => wsManager.send(payload), []);
  const simulateError = useCallback(() => wsManager.simulateNetworkError(), []);
  const clearLog = useCallback(() => wsManager.clearLog(), []);

  return {
    status: state.status,
    latestData: state.latestData,
    reconnectAttempts: state.reconnectAttempts,
    eventLog: state.eventLog,
    connect,
    disconnect,
    send,
    simulateError,
    clearLog,
  };
}
