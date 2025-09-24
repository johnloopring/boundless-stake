export const STAKING_CONTRACT_ABI = [
  {
    "type": "function",
    "name": "stake",
    "inputs": [
      {"name": "amount", "type": "uint256", "internalType": "uint256"}
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "getStakedAmountAndWithdrawalTime",
    "inputs": [
      {"name": "account", "type": "address", "internalType": "address"}
    ],
    "outputs": [
      {"name": "stakedAmount", "type": "uint256", "internalType": "uint256"},
      {"name": "withdrawalTime", "type": "uint256", "internalType": "uint256"}
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "totalSupply",
    "inputs": [],
    "outputs": [{"name": "", "type": "uint256", "internalType": "uint256"}],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "delegate",
    "inputs": [
      {"name": "delegatee", "type": "address", "internalType": "address"}
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "delegateRewards",
    "inputs": [
      {"name": "delegatee", "type": "address", "internalType": "address"}
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "delegates",
    "inputs": [
      {"name": "account", "type": "address", "internalType": "address"}
    ],
    "outputs": [{"name": "", "type": "address", "internalType": "address"}],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "rewardDelegates",
    "inputs": [
      {"name": "account", "type": "address", "internalType": "address"}
    ],
    "outputs": [{"name": "", "type": "address", "internalType": "address"}],
    "stateMutability": "view"
  },
  {
    "type": "event",
    "name": "Staked",
    "inputs": [
      {"name": "user", "type": "address", "indexed": true, "internalType": "address"},
      {"name": "amount", "type": "uint256", "indexed": false, "internalType": "uint256"}
    ],
    "anonymous": false
  }
];