'use client';
import { useState } from 'react';

function CodeBlock({ code, language = 'bash' }: { code: string; language?: string }) {
  const [copied, setCopied] = useState(false);

  function copy() {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div style={{ position: 'relative', marginBottom: 24 }}>
      <div style={{
        background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 10, overflow: 'hidden',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.02)' }}>
          <span style={{ fontSize: 11, color: 'rgba(232,237,245,0.3)', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.08em' }}>{language}</span>
          <button onClick={copy} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: copied ? '#22c55e' : 'rgba(232,237,245,0.4)', fontFamily: 'JetBrains Mono, monospace', transition: 'color 0.2s' }}>
            {copied ? '✓ Copied' : 'Copy'}
          </button>
        </div>
        <pre style={{ padding: '20px', overflowX: 'auto', margin: 0 }}>
          <code style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 13, color: '#e8edf5', lineHeight: 1.7, whiteSpace: 'pre' }}>
            {code}
          </code>
        </pre>
      </div>
    </div>
  );
}

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} style={{ marginBottom: 64, scrollMarginTop: 80 }}>
      <h2 style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        {title}
      </h2>
      {children}
    </section>
  );
}

export default function DocsPage() {
  const sections = [
    { id: 'network', label: 'Network Info' },
    { id: 'connect', label: 'Connect' },
    { id: 'deploy', label: 'Deploy Contract' },
    { id: 'usdc', label: 'USDC Transfers' },
    { id: 'viem', label: 'Viem / Wagmi' },
    { id: 'hardhat', label: 'Hardhat' },
    { id: 'agents', label: 'AI Agents' },
  ];

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 32px', display: 'grid', gridTemplateColumns: '220px 1fr', gap: 48, alignItems: 'start' }}>

      {/* Sidebar */}
      <div style={{ position: 'sticky', top: 88 }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: 'rgba(232,237,245,0.3)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12 }}>On this page</div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {sections.map(s => (
            <a key={s.id} href={`#${s.id}`} style={{ fontSize: 13, color: 'rgba(232,237,245,0.5)', textDecoration: 'none', padding: '6px 12px', borderRadius: 6, transition: 'all 0.15s', display: 'block' }}
              onMouseEnter={e => { (e.target as HTMLAnchorElement).style.color = '#e8edf5'; (e.target as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.05)'; }}
              onMouseLeave={e => { (e.target as HTMLAnchorElement).style.color = 'rgba(232,237,245,0.5)'; (e.target as HTMLAnchorElement).style.background = 'none'; }}
            >
              {s.label}
            </a>
          ))}
        </nav>

        <div className="card" style={{ marginTop: 32, padding: 16 }}>
          <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 8 }}>🔗 Quick Links</div>
          {[
            { label: 'Testnet Faucet', url: 'https://faucet.circle.com' },
            { label: 'Arc Docs', url: 'https://docs.arc.network' },
            { label: 'Arcscan Explorer', url: 'https://testnet.arcscan.app' },
            { label: 'Arc GitHub', url: 'https://github.com/arc-network' },
          ].map(l => (
            <a key={l.label} href={l.url} target="_blank" rel="noopener noreferrer"
              style={{ display: 'block', fontSize: 12, color: '#3b9eff', textDecoration: 'none', padding: '4px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              ↗ {l.label}
            </a>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="animate-fade-up">
        <div style={{ marginBottom: 48 }}>
          <div className="badge badge-arc" style={{ marginBottom: 16 }}>Developer Quickstart</div>
          <h1 style={{ fontSize: 42, fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 16 }}>
            Build on Arc Network
          </h1>
          <p style={{ fontSize: 16, color: 'rgba(232,237,245,0.55)', lineHeight: 1.8, maxWidth: 640 }}>
            Arc is an EVM-compatible Layer-1 built for stablecoin finance. Gas is paid in USDC, finality is sub-second, and your existing Solidity code works unchanged.
          </p>
        </div>

        <Section id="network" title="Network Information">
          <div className="card" style={{ padding: 0, overflow: 'hidden', marginBottom: 24 }}>
            <table style={{ width: '100%' }}>
              <tbody>
                {[
                  ['Network Name', 'Arc Testnet'],
                  ['RPC URL', 'https://rpc.testnet.arc.network'],
                  ['Chain ID', '1657'],
                  ['Currency Symbol', 'USDC'],
                  ['Block Explorer', 'https://testnet.arcscan.app'],
                  ['USDC Contract', '0x3600000000000000000000000000000000000000'],
                  ['Identity Registry (ERC-8004)', '0x8004A818BFB912233c491871b3d84c89A494BD9e'],
                  ['AgenticCommerce (ERC-8183)', '0x0747EEf0706327138c69792bF28Cd525089e4583'],
                ].map(([k, v]) => (
                  <tr key={k}>
                    <td style={{ fontWeight: 600, fontSize: 13, color: 'rgba(232,237,245,0.6)', width: 260 }}>{k}</td>
                    <td style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 13, color: '#3b9eff' }}>{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        <Section id="connect" title="Connect MetaMask">
          <p style={{ color: 'rgba(232,237,245,0.55)', marginBottom: 20, lineHeight: 1.7 }}>
            Add Arc Testnet to MetaMask manually or run this code snippet to add it programmatically.
          </p>
          <CodeBlock language="javascript" code={`await window.ethereum.request({
  method: 'wallet_addEthereumChain',
  params: [{
    chainId: '0x671',           // 1657 in hex
    chainName: 'Arc Testnet',
    nativeCurrency: {
      name: 'USDC',
      symbol: 'USDC',
      decimals: 18
    },
    rpcUrls: ['https://rpc.testnet.arc.network'],
    blockExplorerUrls: ['https://testnet.arcscan.app']
  }]
});`} />
          <div style={{ padding: '16px 20px', borderRadius: 10, background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.15)', fontSize: 13, color: 'rgba(232,237,245,0.6)', lineHeight: 1.7 }}>
            💡 <strong style={{ color: '#22c55e' }}>Get testnet USDC:</strong> Visit{' '}
            <a href="https://faucet.circle.com" target="_blank" rel="noopener noreferrer" style={{ color: '#3b9eff' }}>faucet.circle.com</a>{' '}
            → select Arc Testnet → paste your wallet address → receive test USDC instantly.
          </div>
        </Section>

        <Section id="deploy" title="Deploy a Contract">
          <p style={{ color: 'rgba(232,237,245,0.55)', marginBottom: 20, lineHeight: 1.7 }}>
            Standard Solidity deployment — no changes to your code needed. Just point your tooling at Arc's RPC.
          </p>
          <CodeBlock language="solidity" code={`// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IUSDC {
    function transfer(address to, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

contract ArcPayment {
    address constant USDC = 0x3600000000000000000000000000000000000000;

    event Payment(address indexed from, address indexed to, uint256 amount);

    function pay(address recipient, uint256 usdcAmount) external {
        // usdcAmount in 6 decimals: 1 USDC = 1_000_000
        IUSDC(USDC).transfer(recipient, usdcAmount);
        emit Payment(msg.sender, recipient, usdcAmount);
    }

    function balance(address account) external view returns (uint256) {
        return IUSDC(USDC).balanceOf(account);
    }
}`} />
        </Section>

        <Section id="usdc" title="Send USDC with Viem">
          <CodeBlock language="typescript" code={`import { createWalletClient, createPublicClient, http, parseUnits } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';

const arcTestnet = {
  id: 1657,
  name: 'Arc Testnet',
  nativeCurrency: { name: 'USDC', symbol: 'USDC', decimals: 18 },
  rpcUrls: { default: { http: ['https://rpc.testnet.arc.network'] } },
} as const;

const USDC = '0x3600000000000000000000000000000000000000';
const account = privateKeyToAccount('0xYOUR_PRIVATE_KEY');

const client = createWalletClient({
  account,
  chain: arcTestnet,
  transport: http(),
});

// Send 5 USDC (6 decimals)
const hash = await client.writeContract({
  address: USDC,
  abi: [{ name: 'transfer', type: 'function', stateMutability: 'nonpayable',
    inputs: [{ name: 'to', type: 'address' }, { name: 'amount', type: 'uint256' }],
    outputs: [{ type: 'bool' }]
  }],
  functionName: 'transfer',
  args: ['0xRECIPIENT_ADDRESS', parseUnits('5', 6)],
});

console.log('TX:', hash);
// Confirmed in < 1 second!`} />
        </Section>

        <Section id="viem" title="Read Balance with Viem">
          <CodeBlock language="typescript" code={`import { createPublicClient, http, formatUnits } from 'viem';

const publicClient = createPublicClient({
  chain: arcTestnet,  // defined above
  transport: http(),
});

// Read USDC balance
const balance = await publicClient.readContract({
  address: '0x3600000000000000000000000000000000000000',
  abi: [{ name: 'balanceOf', type: 'function', stateMutability: 'view',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ type: 'uint256' }]
  }],
  functionName: 'balanceOf',
  args: ['0xYOUR_ADDRESS'],
});

console.log(\`Balance: \${formatUnits(balance, 6)} USDC\`);`} />
        </Section>

        <Section id="hardhat" title="Hardhat Configuration">
          <CodeBlock language="typescript" code={`// hardhat.config.ts
import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';

const config: HardhatUserConfig = {
  solidity: '0.8.20',
  networks: {
    arcTestnet: {
      url: 'https://rpc.testnet.arc.network',
      chainId: 1657,
      accounts: [process.env.PRIVATE_KEY!],
    },
  },
};

export default config;`} />
          <CodeBlock language="bash" code={`# Deploy to Arc Testnet
npx hardhat run scripts/deploy.ts --network arcTestnet

# Verify contract
npx hardhat verify --network arcTestnet 0xYOUR_CONTRACT_ADDRESS`} />
        </Section>

        <Section id="agents" title="AI Agents on Arc (ERC-8004 + ERC-8183)">
          <p style={{ color: 'rgba(232,237,245,0.55)', marginBottom: 20, lineHeight: 1.7 }}>
            Arc has native standards for autonomous AI agents — onchain identity (ERC-8004) and job settlement (ERC-8183).
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
            {[
              { title: 'ERC-8004 — Agent Identity', desc: 'Mint an NFT identity for each AI agent. Stores capabilities, reputation scores, and KYC validation onchain.' },
              { title: 'ERC-8183 — Job Lifecycle', desc: 'Create jobs, fund USDC escrow, submit deliverables (as hashes), and release payment — all onchain, sub-second.' },
            ].map(f => (
              <div key={f.title} className="card" style={{ padding: 20 }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: '#3b9eff', marginBottom: 8 }}>{f.title}</div>
                <div style={{ fontSize: 13, color: 'rgba(232,237,245,0.5)', lineHeight: 1.6 }}>{f.desc}</div>
              </div>
            ))}
          </div>
          <CodeBlock language="typescript" code={`// Register an AI agent on Arc (ERC-8004)
const hash = await walletClient.writeContract({
  address: '0x8004A818BFB912233c491871b3d84c89A494BD9e',
  abi: identityRegistryAbi,
  functionName: 'register',
  args: ['ipfs://YOUR_AGENT_METADATA_URI'],
});

// Create a job and fund USDC escrow (ERC-8183)
const jobId = await walletClient.writeContract({
  address: '0x0747EEf0706327138c69792bF28Cd525089e4583',
  abi: agenticCommerceAbi,
  functionName: 'createJob',
  args: [providerAddress, evaluatorAddress, expiry, 'Task description', zeroAddress],
});

// Agent submits deliverable hash — payment released instantly
await walletClient.writeContract({
  address: '0x0747EEf0706327138c69792bF28Cd525089e4583',
  abi: agenticCommerceAbi,
  functionName: 'complete',
  args: [jobId, keccak256(toHex('approved')), '0x'],
});
// USDC settles in < 1 second ⚡`} />
        </Section>

      </div>
    </div>
  );
}
