import React from 'react';

import type { PropsWithChildren } from 'react';

import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi';
import { WagmiProvider as WagmiContext } from 'wagmi';

import orb3Network from '@/constants/orb3-network';

import config from '../../_config';

const metadata = {
  name: config.metadata.title,
  description: config.metadata.description,
  url: 'https://web3modal.com',
  verifyUrl: '',
  icons: ['https://avatars.githubusercontent.com/u/142919060']
};

const projectId = (import.meta.env.VITE_WALLETCONNECT_PROJECT_ID ?? '') as string;
const wagmiConfig = defaultWagmiConfig({
  chains: [orb3Network],
  projectId,
  metadata
});

createWeb3Modal({
  chains: [orb3Network],
  projectId,
  wagmiConfig,
  themeMode: 'dark',
  themeVariables: {
    '--w3m-font-family': '',
    '--w3m-accent': '#6d28d9',
    '--w3m-color-mix': '#6d28d9',
    '--w3m-color-mix-strength': 1,
    '--w3m-border-radius-master': '0.5rem'
  }
});

interface IWagmiProvider extends PropsWithChildren {}

export default function WagmiProvider({ children }: IWagmiProvider) {
  return <WagmiContext config={wagmiConfig}>{children}</WagmiContext>;
}
