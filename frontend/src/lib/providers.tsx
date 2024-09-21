"use client";

import { DynamicContextProvider, mergeNetworks } from "../lib/dynamic";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DynamicWagmiConnector } from "@dynamic-labs/wagmi-connector";
import { config } from "./wagmi";

export default function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient();

  const myEvmNetworks = [
    {
      blockExplorerUrls: ['https://explorer.helium.fhenix.zone'],
      chainId: 8008135,
      chainName: 'Fhenix Helium',
      iconUrls: ['https://app.dynamic.xyz/assets/networks/eth.svg'],
      name: 'Fhenix Heloum',
      nativeCurrency: {
        decimals: 18,
        name: 'tFHE',
        symbol: 'tFHE',
      },
      networkId: 1,
  
      rpcUrls: ['https://api.helium.fhenix.zone'],
      vanityName: 'Fhenix Helium',
    },
    {
      blockExplorerUrls: ['127.0.0.1:42069'],
      chainId: 412346,
      chainName: 'Fhenix Helium',
      iconUrls: ['https://app.dynamic.xyz/assets/networks/eth.svg'],
      name: 'Fhenix Local',
      nativeCurrency: {
        decimals: 18,
        name: 'tFHE',
        symbol: 'tFHE',
      },
      networkId: 1,
  
      rpcUrls: ['127.0.0.1:42069'],
      vanityName: 'Fhenix Local',
    },
  ];

  return (
    <DynamicContextProvider
      theme="auto"
      settings={{
        environmentId: process.env.NEXT_PUBLIC_CLIENT_ID as string,
        walletConnectors: [EthereumWalletConnectors],
        overrides: {
          evmNetworks: (networks) => mergeNetworks(myEvmNetworks, networks),
        }
      }}
    >
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <DynamicWagmiConnector>{children}</DynamicWagmiConnector>
        </QueryClientProvider>
      </WagmiProvider>
    </DynamicContextProvider>
  );
}
