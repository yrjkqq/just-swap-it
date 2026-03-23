import { defineWalletSetup } from "@synthetixio/synpress";
import { MetaMask } from "@synthetixio/synpress/playwright";

const SEED_PHRASE = "test test test test test test test test test test test junk";
const WALLET_PASSWORD = "Tester@1234";

export default defineWalletSetup(
  WALLET_PASSWORD,
  async (context, walletPage) => {
    const metamask = new MetaMask(context, walletPage, WALLET_PASSWORD);
    await metamask.importWallet(SEED_PHRASE);
  }
);
