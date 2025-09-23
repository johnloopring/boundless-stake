import React, { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { useWallet } from '../hooks/useWallet';
import { getContractAddresses, getNetworkConfig, NETWORKS } from '../config/contracts';
import { ZKC_TOKEN_ABI } from '../abi/ZkcToken';
import { STAKING_CONTRACT_ABI } from '../abi/StakingContract';

const StakingComponent = () => {
  const { account, signer, chainId, isConnected, connectWallet, switchNetwork } = useWallet();
  const [zkcBalance, setZkcBalance] = useState('0');
  const [stakingBalance, setStakingBalance] = useState('0');
  const [stakeAmount, setStakeAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [allowance, setAllowance] = useState('0');
  const [currentNetwork, setCurrentNetwork] = useState('sepolia');

  const getCurrentNetworkName = useCallback(() => {
    const networkNames = Object.keys(NETWORKS);
    for (const name of networkNames) {
      if (NETWORKS[name].chainId === chainId) {
        return name;
      }
    }
    return 'sepolia';
  }, [chainId]);

  useEffect(() => {
    if (chainId) {
      setCurrentNetwork(getCurrentNetworkName());
    }
  }, [chainId, getCurrentNetworkName]);

  const fetchBalances = useCallback(async () => {
    if (!account || !signer) return;

    try {
      const addresses = getContractAddresses(currentNetwork);
      const zkcContract = new ethers.Contract(addresses.zkc, ZKC_TOKEN_ABI, signer);
      const stakingContract = new ethers.Contract(addresses.staking, STAKING_CONTRACT_ABI, signer);

      const [balance, staked, allowanceAmount] = await Promise.all([
        zkcContract.balanceOf(account),
        stakingContract.balanceOf(account),
        zkcContract.allowance(account, addresses.staking)
      ]);

      setZkcBalance(ethers.formatEther(balance));
      setStakingBalance(ethers.formatEther(staked));
      setAllowance(ethers.formatEther(allowanceAmount));
    } catch (error) {
      console.error('Failed to fetch balances:', error);
    }
  }, [account, signer, currentNetwork]);

  useEffect(() => {
    fetchBalances();
  }, [fetchBalances]);

  const handleApprove = async () => {
    if (!signer || !stakeAmount) return;

    setIsLoading(true);
    try {
      const addresses = getContractAddresses(currentNetwork);
      const zkcContract = new ethers.Contract(addresses.zkc, ZKC_TOKEN_ABI, signer);

      const amount = ethers.parseEther(stakeAmount);
      const tx = await zkcContract.approve(addresses.staking, amount);

      console.log('Approval transaction sent:', tx.hash);
      await tx.wait();

      console.log('Approval confirmed');
      await fetchBalances();
    } catch (error) {
      console.error('Approval failed:', error);
      alert('Approval failed: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStake = async () => {
    if (!signer || !stakeAmount) return;

    setIsLoading(true);
    try {
      const addresses = getContractAddresses(currentNetwork);
      const stakingContract = new ethers.Contract(addresses.staking, STAKING_CONTRACT_ABI, signer);

      const amount = ethers.parseEther(stakeAmount);
      const tx = await stakingContract.stake(amount);

      console.log('Stake transaction sent:', tx.hash);
      await tx.wait();

      console.log('Stake confirmed');
      setStakeAmount('');
      await fetchBalances();
    } catch (error) {
      console.error('Stake failed:', error);
      alert('Stake failed: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const needsApproval = () => {
    if (!stakeAmount) return false;
    const amount = ethers.parseEther(stakeAmount);
    const currentAllowance = ethers.parseEther(allowance);
    return currentAllowance < amount;
  };

  const isCorrectNetwork = () => {
    return NETWORKS[currentNetwork]?.chainId === chainId;
  };

  if (!isConnected) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>ZKC Staking</h2>
        <button onClick={connectWallet}>Connect Wallet</button>
      </div>
    );
  }

  if (!isCorrectNetwork()) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Wrong Network</h2>
        <p>Please switch to {NETWORKS[currentNetwork]?.name}</p>
        <button onClick={() => switchNetwork(currentNetwork)}>
          Switch to {NETWORKS[currentNetwork]?.name}
        </button>
        <div style={{ marginTop: '20px' }}>
          <label>
            Network:
            <select
              value={currentNetwork}
              onChange={(e) => setCurrentNetwork(e.target.value)}
              style={{ marginLeft: '10px' }}
            >
              {Object.keys(NETWORKS).map(network => (
                <option key={network} value={network}>
                  {NETWORKS[network].name}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>ZKC Staking</h2>

      <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ccc', borderRadius: '5px' }}>
        <p><strong>Connected Account:</strong> {account}</p>
        <p><strong>Network:</strong> {NETWORKS[currentNetwork]?.name}</p>
        <p><strong>ZKC Balance:</strong> {parseFloat(zkcBalance).toFixed(4)} ZKC</p>
        <p><strong>Staked Balance:</strong> {parseFloat(stakingBalance).toFixed(4)} veZKC</p>
        <p><strong>Allowance:</strong> {parseFloat(allowance).toFixed(4)} ZKC</p>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label>
          Network:
          <select
            value={currentNetwork}
            onChange={(e) => setCurrentNetwork(e.target.value)}
            style={{ marginLeft: '10px', padding: '5px' }}
          >
            {Object.keys(NETWORKS).map(network => (
              <option key={network} value={network}>
                {NETWORKS[network].name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label>
          Stake Amount (ZKC):
          <input
            type="number"
            value={stakeAmount}
            onChange={(e) => setStakeAmount(e.target.value)}
            placeholder="Enter amount to stake"
            style={{
              marginLeft: '10px',
              padding: '8px',
              width: '200px',
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
          />
        </label>
      </div>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        {needsApproval() && (
          <button
            onClick={handleApprove}
            disabled={isLoading || !stakeAmount}
            style={{
              padding: '10px 20px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: isLoading || !stakeAmount ? 'not-allowed' : 'pointer',
              opacity: isLoading || !stakeAmount ? 0.6 : 1
            }}
          >
            {isLoading ? 'Approving...' : `Approve ${stakeAmount} ZKC`}
          </button>
        )}

        <button
          onClick={handleStake}
          disabled={isLoading || !stakeAmount || needsApproval()}
          style={{
            padding: '10px 20px',
            backgroundColor: needsApproval() ? '#ccc' : '#2196F3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isLoading || !stakeAmount || needsApproval() ? 'not-allowed' : 'pointer',
            opacity: isLoading || !stakeAmount || needsApproval() ? 0.6 : 1
          }}
        >
          {isLoading ? 'Staking...' : `Stake ${stakeAmount} ZKC`}
        </button>
      </div>

      <div style={{ fontSize: '14px', color: '#666' }}>
        <p><strong>Instructions:</strong></p>
        <ol>
          <li>Enter the amount of ZKC you want to stake</li>
          <li>Click "Approve" to allow the staking contract to spend your ZKC tokens</li>
          <li>After approval is confirmed, click "Stake" to stake your tokens</li>
        </ol>
      </div>
    </div>
  );
};

export default StakingComponent;