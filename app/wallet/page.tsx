'use client';
import { useState } from 'react';
import { getWalletInfo, getBlock, getBlockNumber, EXPLORER, type WalletInfo } from '@/lib/arc';

const EXAMPLE_ADDRESSES = [
  { label: 'Example Wallet A', addr: '0xF2EE634847d39161ec7De7879d7d0d241B932Ad4' },
  { label: 'Example Wallet B', addr: '0xE30C78226640a169097669BA4ADAD416Faa6521c' },
];

export default function WalletPage() {
  const [input, setInput] = useState('');
  const [info, setInfo] = useState<WalletInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  async function inspect(addr?: string) {
    const address = (addr || input).trim();
    if (!address || !address.startsWith('0x') || address.length !== 42) {
      setError('Enter a valid Ethereum address (0x… 42 characters)');
      return;
    }
    setLoading(true);
    setError('');
    setInfo(null);
    setSearched(true);
    try {
      const data = await getWalletInfo(address);
      setInfo(data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to fetch wallet data');
    } finally {
      setLoading(false);
    }
  }

  function useExample(addr: string) {
    setInput(addr);
    inspect(addr);
  }

  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: '48px 32px' }}>

      {/* Header */}
      <div className="animate-fade-up" style={{ marginBottom: 40 }}>
        <h1 style={{ fontSize: 42, fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 12 }}>
          Wallet Inspector
        </h1>
        <p style={{ fontSize: 16, color: 'rgba(232,237,245,0.5)', lineHeight: 1.7 }}>
          Paste any wallet address to see its live USDC balance, transaction count, and on-chain activity on Arc Network testnet.
        </p>
      </div>

      {/* Search */}
      <div className="animate-fade-up delay-1 card" style={{ padding: 28, marginBottom: 32 }}>
        <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
          <input
            className="input"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="0x… paste any Arc wallet address"
            onKeyDown={e => e.key === 'Enter' && inspect()}
            style={{ flex: 1 }}
          />
          <button
            className="btn btn-primary"
            onClick={() => inspect()}
            disabled={loading}
            style={{ minWidth: 120 }}
          >
            {loading ? <><span className="spinner" /> Inspecting…</> : '🔍 Inspect'}
          </button>
        </div>

        {/* Example addresses */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 12, color: 'rgba(232,237,245,0.3)' }}>Try:</span>
          {EXAMPLE_ADDRESSES.map(e => (
            <button
              key={e.addr}
              onClick={() => useExample(e.addr)}
              style={{
                background: 'none', border: '1px solid rgba(59,158,255,0.2)',
                borderRadius: 6, padding: '4px 12px', cursor: 'pointer',
                fontSize: 12, color: '#3b9eff', fontFamily: 'JetBrains Mono, monospace',
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => { (e.target as HTMLButtonElement).style.background = 'rgba(59,158,255,0.08)'; }}
              onMouseLeave={e => { (e.target as HTMLButtonElement).style.background = 'none'; }}
            >
              {e.label}
            </button>
          ))}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="animate-fade-in" style={{ marginBottom: 24, padding: '14px 20px', borderRadius: 10, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444', fontSize: 14 }}>
          {error}
        </div>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div className="animate-fade-in">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 24 }}>
            {[1,2,3].map(i => (
              <div key={i} className="card" style={{ padding: 24 }}>
                <div className="skeleton" style={{ height: 12, width: 80, marginBottom: 12 }} />
                <div className="skeleton" style={{ height: 36, width: 120, marginBottom: 8 }} />
                <div className="skeleton" style={{ height: 10, width: 100 }} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Results */}
      {info && !loading && (
        <div className="animate-fade-in">

          {/* Address header */}
          <div className="card" style={{ padding: 24, marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <div style={{ fontSize: 11, color: 'rgba(232,237,245,0.35)', letterSpacing: '0.1em', marginBottom: 6 }}>WALLET ADDRESS</div>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 14, wordBreak: 'break-all', color: '#e8edf5' }}>
                {info.address}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, flexShrink: 0 }}>
              <a
                href={`${EXPLORER}/address/${info.address}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost"
                style={{ fontSize: 13, padding: '8px 16px' }}
              >
                ↗ View on Arcscan
              </a>
              <button
                className="btn btn-ghost"
                style={{ fontSize: 13, padding: '8px 16px' }}
                onClick={() => navigator.clipboard.writeText(info.address)}
              >
                Copy
              </button>
            </div>
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 20 }}>
            <div className="card glow-green" style={{ padding: 28 }}>
              <div style={{ fontSize: 11, color: 'rgba(232,237,245,0.35)', letterSpacing: '0.1em', marginBottom: 10 }}>USDC BALANCE</div>
              <div className="stat-num" style={{ color: '#22c55e', marginBottom: 6 }}>
                ${info.usdcBalance}
              </div>
              <div style={{ fontSize: 12, color: 'rgba(232,237,245,0.3)' }}>on Arc Testnet</div>
              <div className="badge badge-green" style={{ marginTop: 12 }}>
                <span className="live-dot" style={{ width: 5, height: 5 }} />
                Live
              </div>
            </div>

            <div className="card" style={{ padding: 28 }}>
              <div style={{ fontSize: 11, color: 'rgba(232,237,245,0.35)', letterSpacing: '0.1em', marginBottom: 10 }}>TRANSACTIONS</div>
              <div className="stat-num" style={{ color: '#3b9eff', marginBottom: 6 }}>
                {info.txCount.toLocaleString()}
              </div>
              <div style={{ fontSize: 12, color: 'rgba(232,237,245,0.3)' }}>nonce / total sent</div>
            </div>

            <div className="card" style={{ padding: 28 }}>
              <div style={{ fontSize: 11, color: 'rgba(232,237,245,0.35)', letterSpacing: '0.1em', marginBottom: 10 }}>NETWORK</div>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 20, fontWeight: 700, color: '#a855f7', marginBottom: 6 }}>
                Arc Testnet
              </div>
              <div style={{ fontSize: 12, color: 'rgba(232,237,245,0.3)' }}>Chain ID 1657</div>
              <div className="badge badge-arc" style={{ marginTop: 12 }}>EVM Compatible</div>
            </div>
          </div>

          {/* Info cards */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>

            <div className="card" style={{ padding: 24 }}>
              <div style={{ fontWeight: 700, marginBottom: 16, fontSize: 15 }}>📋 Add to MetaMask</div>
              <div style={{ fontSize: 13, color: 'rgba(232,237,245,0.5)', marginBottom: 16, lineHeight: 1.6 }}>
                Connect MetaMask to Arc Testnet to send transactions from this address.
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  ['Network Name', 'Arc Testnet'],
                  ['RPC URL', 'rpc.testnet.arc.network'],
                  ['Chain ID', '1657'],
                  ['Currency', 'USDC'],
                ].map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <span style={{ color: 'rgba(232,237,245,0.4)' }}>{k}</span>
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', color: '#3b9eff' }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="card" style={{ padding: 24 }}>
              <div style={{ fontWeight: 700, marginBottom: 16, fontSize: 15 }}>⚡ Arc Advantages</div>
              {[
                { icon: '💵', text: 'Gas paid in USDC — predictable costs, no ETH needed' },
                { icon: '⚡', text: 'Sub-second finality — one confirmation and it\'s final' },
                { icon: '🔧', text: 'Full EVM — your existing Solidity code works unchanged' },
                { icon: '🔒', text: 'No reorgs — Malachite BFT consensus is deterministic' },
              ].map(item => (
                <div key={item.text} style={{ display: 'flex', gap: 12, marginBottom: 12, fontSize: 13 }}>
                  <span>{item.icon}</span>
                  <span style={{ color: 'rgba(232,237,245,0.55)', lineHeight: 1.5 }}>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!loading && !info && !error && !searched && (
        <div className="animate-fade-in card" style={{ padding: 60, textAlign: 'center' }}>
          <div style={{ fontSize: 52, marginBottom: 16 }}>🔍</div>
          <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>Inspect any Arc wallet</div>
          <div style={{ fontSize: 14, color: 'rgba(232,237,245,0.4)' }}>
            Enter an address above or try one of the examples
          </div>
        </div>
      )}
    </div>
  );
}
