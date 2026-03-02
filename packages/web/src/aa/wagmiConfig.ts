import { http } from "wagmi";
import { sepolia } from "wagmi/chains";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";

/**
 * wagmi + RainbowKit 配置
 *
 * - 使用 RainbowKit 的 getDefaultConfig 一步完成 wagmi config + connectors 初始化
 * - 默认支持 MetaMask、Coinbase Wallet、WalletConnect 等主流钱包
 */
export const wagmiConfig = getDefaultConfig({
  appName: "AA Wallet Demo",
  // 从 https://cloud.walletconnect.com 获取（免费），用于 WalletConnect 连接
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "demo",
  chains: [sepolia],
  transports: {
    [sepolia.id]: http(),
  },
  ssr: true, // Next.js App Router 需要开启
});

export { sepolia as chain };
