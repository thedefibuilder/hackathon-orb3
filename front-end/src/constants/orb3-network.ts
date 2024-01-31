import type { Chain } from 'wagmi/chains';

const orb3Network = {
  id: 1_627_454_953_838_939,
  name: 'Orb3 Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Orb3 Görlitz Ether',
    symbol: 'GETH'
  },
  rpcUrls: {
    public: {
      http: ['https://test-rpc.orb3.tech']
    },
    default: { http: ['https://test-rpc.orb3.tech'] }
  },
  blockExplorers: {
    default: { name: 'Orb3 Testnet', url: 'https://test.orb3scan.tech' }
  }
} satisfies Chain;

export default orb3Network;
