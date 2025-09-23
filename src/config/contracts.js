export const NETWORKS = {
  sepolia: {
    chainId: 11155111,
    name: 'Sepolia',
    rpcUrl: 'https://ethereum-sepolia-rpc.publicnode.com',
    contracts: {
      zkc: '0xb4FC69A452D09D2662BD8C3B5BB756902260aE28',
      staking: '0xc23340732038ca6C5765763180E81B395d2e9cCA'
    }
  },
  mainnet: {
    chainId: 1,
    name: 'Ethereum Mainnet',
    rpcUrl: 'https://ethereum-rpc.publicnode.com',
    contracts: {
      zkc: '0x000006c2A22ff4A44ff1f5d0F2ed65F781F55555',
      staking: '0xE8Ae8eE8ffa57F6a79B6Cbe06BAFc0b05F3ffbf4'
    }
  },
  // base: {
  //   chainId: 84531,
  //   name: 'Base',
  //   rpcUrl: 'https://mainnet.base.org',
  //   contracts: {
  //     zkc: '0xaa61bb7777bd01b684347961918f1e07fbbce7cf',
  //     staking: ''
  //   }
  // }
};

export const DEFAULT_NETWORK = 'sepolia';

export const getContractAddresses = (network = DEFAULT_NETWORK) => {
  return NETWORKS[network]?.contracts || NETWORKS[DEFAULT_NETWORK].contracts;
};

export const getNetworkConfig = (network = DEFAULT_NETWORK) => {
  return NETWORKS[network] || NETWORKS[DEFAULT_NETWORK];
};