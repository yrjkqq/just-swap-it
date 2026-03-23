import { expect } from "@playwright/test";
import { metaMaskFixtures } from "@synthetixio/synpress/playwright";
import { testWithSynpress } from "@synthetixio/synpress";
import walletSetup from "../test/wallet-setup/wallet-setup.setup.mjs";

// 使用 testWithSynpress 合并 metaMask fixtures
const test = testWithSynpress(metaMaskFixtures(walletSetup));

test("should connect wallet and display EOA and Smart Account addresses", async ({
  page,
  metamask,
}) => {
  // 1. 访问 AA 页面
  await page.goto("/aa");

  // 2. 绕过 Reown AppKit 弹窗，直接通过注入的 MetaMask provider 发起连接请求
  //    AppKit 底层使用 WalletConnect 协议，不会触发 MetaMask 的 notification popup，
  //    所以我们直接调用 window.ethereum.request 来触发 MetaMask extension 的授权弹窗。
  await page.evaluate(() => {
    window.ethereum?.request({ method: "eth_requestAccounts" });
  });

  // 3. Synpress 接管 MetaMask 弹窗，自动点击授权确认
  await metamask.connectToDapp();

  // 4. 等待 wagmi 感知到钱包已连接并触发页面更新
  //    wagmi 的 useAccount 会监听 provider 事件，连接后页面应自动刷新状态
  await expect(page.getByRole("button", { name: /已连接:/ })).toBeVisible({
    timeout: 15000,
  });

  // 5. 断言：EOA Owner 地址已渲染
  await expect(page.getByText("🦊 EOA Owner")).toBeVisible();
  const eoaLink = page
    .locator("text=🦊 EOA Owner")
    .locator("xpath=following-sibling::a")
    .first();
  await expect(eoaLink).toBeVisible();
  await expect(eoaLink).toContainText("0x");

  // 6. 断言：Safe Smart Account 地址已渲染
  await expect(page.getByText("🛡️ Safe Smart Account")).toBeVisible();
  const safeLink = page
    .locator("text=🛡️ Safe Smart Account")
    .locator("xpath=following-sibling::a")
    .first();
  await expect(safeLink).toBeVisible({ timeout: 20000 });
  await expect(safeLink).toContainText("0x");
});
