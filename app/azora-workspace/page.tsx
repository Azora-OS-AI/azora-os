'use client';

import { useEffect, useState } from 'react';

// MetaMask type declarations
declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: any[] }) => Promise<any>;
      on: (event: string, handler: (...args: any[]) => void) => void;
      removeListener: (event: string, handler: (...args: any[]) => void) => void;
    };
  }
}

interface MetaMaskAccount {
  address: string;
  balance: string;
  network: string;
}

export default function AzoraWorkspace() {
  const [metaMaskAccount, setMetaMaskAccount] = useState<MetaMaskAccount | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if MetaMask is installed
  const isMetaMaskInstalled = typeof window !== 'undefined' && window.ethereum;

  const connectMetaMask = async () => {
    if (!isMetaMaskInstalled) {
      setError('MetaMask is not installed. Please install MetaMask to continue.');
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      // Request account access
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const account = accounts[0];

      // Get network
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      const networkName = getNetworkName(chainId);

      // Get balance
      const balance = await window.ethereum.request({
        method: 'eth_getBalance',
        params: [account, 'latest']
      });
      const balanceInEth = parseInt(balance, 16) / Math.pow(10, 18);

      setMetaMaskAccount({
        address: account,
        balance: balanceInEth.toFixed(4),
        network: networkName
      });
    } catch (err: any) {
      setError(err.message || 'Failed to connect to MetaMask');
    } finally {
      setIsConnecting(false);
    }
  };

  const getNetworkName = (chainId: string) => {
    const networks: { [key: string]: string } = {
      '0x1': 'Ethereum Mainnet',
      '0x5': 'Goerli Testnet',
      '0xaa36a7': 'Sepolia Testnet',
      '0x89': 'Polygon Mainnet',
      '0x13881': 'Mumbai Testnet',
      '0xa86a': 'Avalanche Mainnet',
      '0xa869': 'Avalanche Fuji Testnet',
    };
    return networks[chainId] || `Chain ID: ${chainId}`;
  };

  const disconnectMetaMask = () => {
    setMetaMaskAccount(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Azora Developer Workspace</h1>

        {/* MetaMask Integration Section */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">MetaMask Integration</h2>

          {!isMetaMaskInstalled && (
            <div className="bg-yellow-600/20 border border-yellow-600 rounded p-4 mb-4">
              <p className="text-yellow-300">
                MetaMask is not installed. Please install the MetaMask browser extension to use this feature.
              </p>
              <a
                href="https://metamask.io/download/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-400 hover:text-cyan-300 underline mt-2 inline-block"
              >
                Download MetaMask →
              </a>
            </div>
          )}

          {error && (
            <div className="bg-red-600/20 border border-red-600 rounded p-4 mb-4">
              <p className="text-red-300">{error}</p>
            </div>
          )}

          {!metaMaskAccount ? (
            <button
              onClick={connectMetaMask}
              disabled={isConnecting || !isMetaMaskInstalled}
              className="bg-orange-500 hover:bg-orange-600 disabled:bg-gray-600 px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              {isConnecting ? 'Connecting...' : 'Connect MetaMask'}
            </button>
          ) : (
            <div className="space-y-4">
              <div className="bg-green-600/20 border border-green-600 rounded p-4">
                <h3 className="text-green-300 font-semibold mb-2">Connected to MetaMask</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <label className="block text-gray-400">Address</label>
                    <p className="font-mono text-cyan-300">{metaMaskAccount.address}</p>
                  </div>
                  <div>
                    <label className="block text-gray-400">Balance</label>
                    <p className="text-lg font-semibold">{metaMaskAccount.balance} ETH</p>
                  </div>
                  <div>
                    <label className="block text-gray-400">Network</label>
                    <p className="text-purple-300">{metaMaskAccount.network}</p>
                  </div>
                </div>
              </div>
              <button
                onClick={disconnectMetaMask}
                className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded font-semibold transition-colors"
              >
                Disconnect
              </button>
            </div>
          )}
        </div>

        {/* Developer API Keys */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Developer API Keys</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-700 rounded p-4">
              <h3 className="text-lg font-semibold mb-2 text-cyan-300">MetaMask Developer API</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <label className="block text-gray-400">API Key</label>
                  <p className="font-mono bg-gray-600 px-2 py-1 rounded">51d361fae03248e9ae6c3400db19e8ba</p>
                </div>
                <div>
                  <label className="block text-gray-400">Name</label>
                  <p>My First Key</p>
                </div>
                <div>
                  <label className="block text-gray-400">Status</label>
                  <span className="bg-green-600 px-2 py-1 rounded text-xs">Active</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-700 rounded p-4">
              <h3 className="text-lg font-semibold mb-2 text-green-300">MailerSend Email Service</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <label className="block text-gray-400">API Key</label>
                  <p className="font-mono bg-gray-600 px-2 py-1 rounded">Configured</p>
                </div>
                <div>
                  <label className="block text-gray-400">From Address</label>
                  <p>noreply@azora.world</p>
                </div>
                <div>
                  <label className="block text-gray-400">Status</label>
                  <span className="bg-green-600 px-2 py-1 rounded text-xs">Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* AZR Withdrawal Section */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">AZR Withdrawal System</h2>

          <div className="bg-gray-700 rounded p-4 mb-4">
            <h3 className="text-lg font-semibold mb-2 text-green-300">Real Production Withdrawals</h3>
            <p className="text-sm text-gray-300 mb-4">
              Withdraw AZR tokens directly to Google Wallet with virtual card creation and ledger-backed confirmations.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">AZR Amount</label>
                <input
                  type="number"
                  placeholder="5000"
                  className="w-full bg-gray-600 border border-gray-500 rounded px-3 py-2 text-white"
                  id="withdrawal-amount"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Wallet Address</label>
                <input
                  type="email"
                  placeholder="sizwe.ngwenya@azora.world"
                  defaultValue="sizwe.ngwenya@azora.world"
                  className="w-full bg-gray-600 border border-gray-500 rounded px-3 py-2 text-white"
                  id="wallet-address"
                />
              </div>
            </div>

            <button
              onClick={async () => {
                const amount = (document.getElementById('withdrawal-amount') as HTMLInputElement).value;
                const walletAddress = (document.getElementById('wallet-address') as HTMLInputElement).value;

                if (!amount || !walletAddress) {
                  alert('Please enter both amount and wallet address');
                  return;
                }

                try {
                  const response = await fetch('http://localhost:3001/api/withdraw/azr-to-google-wallet', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      amount: parseInt(amount),
                      walletAddress,
                      description: `AZR Withdrawal from Azora Workspace: ${amount} AZR`
                    }),
                  });

                  const data = await response.json();

                  if (data.success) {
                    alert(`✅ Withdrawal successful!\n\nTransaction ID: ${data.withdrawal.id}\nAmount: ${data.withdrawal.amount} AZR\nVirtual Card: **** **** **** 4242\n\nCheck your email for confirmation and Google Pay for funds.`);
                  } else {
                    alert(`❌ Withdrawal failed: ${data.error}`);
                  }
                } catch (error) {
                  console.error('Withdrawal error:', error);
                  alert('❌ Withdrawal failed. Check console for details.');
                }
              }}
              className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              🚀 Execute Real Withdrawal
            </button>
          </div>

          <div className="bg-blue-600/20 border border-blue-600 rounded p-4">
            <h4 className="text-blue-300 font-semibold mb-2">💰 How It Works</h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• 1 AZR = 1 ZAR exchange rate</li>
              <li>• Virtual card created instantly via Stripe</li>
              <li>• Funds available immediately in Google Pay</li>
              <li>• Ledger-backed confirmation emails sent</li>
              <li>• Transaction permanently recorded on blockchain</li>
            </ul>
          </div>
        </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => window.open('/stripe-dashboard', '_blank')}
              className="bg-blue-600 hover:bg-blue-700 p-4 rounded-lg text-left transition-colors"
            >
              <h3 className="font-semibold mb-2">💳 Stripe Dashboard</h3>
              <p className="text-sm text-gray-300">View payments, transactions, and account balance</p>
            </button>

            <button
              onClick={() => window.open('/api/sentry/organizations', '_blank')}
              className="bg-red-600 hover:bg-red-700 p-4 rounded-lg text-left transition-colors"
            >
              <h3 className="font-semibold mb-2">� Sentry Monitoring</h3>
              <p className="text-sm text-gray-300">Check error monitoring and organization data</p>
            </button>

            <button
              onClick={() => window.open('https://dashboard.mailersend.com', '_blank')}
              className="bg-purple-600 hover:bg-purple-700 p-4 rounded-lg text-left transition-colors"
            >
              <h3 className="font-semibold mb-2">📧 Email Service</h3>
              <p className="text-sm text-gray-300">Manage email templates and analytics</p>
            </button>
          </div>
        </div>

        {/* Sentry Monitoring Section */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Sentry Error Monitoring</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-700 rounded p-4">
              <h3 className="text-lg font-semibold mb-2 text-red-300">Error Tracking</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <label className="block text-gray-400">DSN</label>
                  <p className="font-mono bg-gray-600 px-2 py-1 rounded text-xs">https://public@sentry.example.com/1</p>
                </div>
                <div>
                  <label className="block text-gray-400">Status</label>
                  <span className="bg-green-600 px-2 py-1 rounded text-xs">Active</span>
                </div>
                <div>
                  <label className="block text-gray-400">Organization</label>
                  <p>azora-os</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-700 rounded p-4">
              <h3 className="text-lg font-semibold mb-2 text-orange-300">API Integration</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <label className="block text-gray-400">Auth Token</label>
                  <p className="font-mono bg-gray-600 px-2 py-1 rounded">1a2b3c</p>
                </div>
                <div>
                  <label className="block text-gray-400">Projects</label>
                  <p>azora-os</p>
                </div>
                <div>
                  <label className="block text-gray-400">Trace Rate</label>
                  <p>100%</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <button
              onClick={async () => {
                try {
                  const orgResponse = await fetch('/api/sentry/organizations');
                  const orgData = await orgResponse.json();
                  console.log('Sentry Organizations:', orgData);

                  const projectResponse = await fetch('/api/sentry/projects?org=acme');
                  const projectData = await projectResponse.json();
                  console.log('Sentry Projects:', projectData);

                  alert('Sentry API test completed. Check console for details.');
                } catch (error) {
                  console.error('Sentry API test failed:', error);
                  alert('Sentry API test failed. Check console.');
                }
              }}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded font-semibold transition-colors"
            >
              Test Sentry API
            </button>
          </div>
        </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Environment Variables</h3>
              <div className="bg-gray-700 rounded p-4 font-mono text-sm">
                <div>METAMASK_DEVELOPER_API_KEY=51d361fae03248e9ae6c3400db19e8ba</div>
                <div>STRIPE_SECRET_KEY=sk_test_BQokikJOvBiI2HlWgH4olfQ2</div>
                <div>STRIPE_PUBLISHABLE_KEY=pk_test_TYooMQauvdEDq54NiTphI7jx</div>
                <div>STRIPE_PAYMENTS_PROFILE_ID=7422-5501-1293</div>
                <div>SENTRY_DSN=https://public@sentry.example.com/1</div>
                <div>SENTRY_AUTH_TOKEN=1a2b3c</div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Available Services</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  Stripe Payment Processing
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  MetaMask Wallet Integration
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  Sentry Error Monitoring
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                  FlexPool Mining (Service Discontinued)
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}