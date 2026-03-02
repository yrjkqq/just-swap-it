import { createPublicClient, http } from "viem";
import { sepolia } from "viem/chains";
import { createPimlicoClient } from "permissionless/clients/pimlico";
import { entryPoint07Address } from "viem/account-abstraction";

// ---------- RPC ----------
const apiKey = process.env.NEXT_PUBLIC_PIMLICO_API_KEY;
if (!apiKey) {
  console.warn(
    "⚠️ NEXT_PUBLIC_PIMLICO_API_KEY is not set. AA wallet features will not work.",
  );
}

const pimlicoUrl = `https://api.pimlico.io/v2/${sepolia.id}/rpc?apikey=${apiKey}`;

// ---------- Clients ----------

/** viem PublicClient — 用于读取链上数据 */
export const publicClient = createPublicClient({
  chain: sepolia,
  transport: http(),
});

/** Pimlico Client — Bundler + Paymaster */
export const pimlicoClient = createPimlicoClient({
  transport: http(pimlicoUrl),
  entryPoint: {
    address: entryPoint07Address,
    version: "0.7",
  },
});
