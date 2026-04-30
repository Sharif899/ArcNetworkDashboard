'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getNetworkStats, getRecentBlocks, EXPLORER, type NetworkStats, type Block } from '@/lib/arc';

export default function HomePage() {
  const [stats, setStats] = useState<NetworkStats | null>(null);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  async function load() {
    try {
      const [s, b] = await Promise.all([getNetworkStats(), getRecentBlocks(8)]);
      setStats(s);
      setBlocks(b);
      setLastUpdate(new Date());
      setError('');
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to fetch network data');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    const t = setInterval(load, 12000);
    return () => clearInterval(t);
  }, []);

  function timeAgo(ts: number) {
    const diff = Math.floor(Date.now() / 1000) - ts;
    if (diff < 5) return 'just now';
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return `${Math.floor(diff / 3600)}h ago`;
  }

  function short(addr: string) {
    return addr ? addr.slice(0, 8) + '…' + addr.slice(-6) : '—';
  }

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 32px' }}>

      {/* Hero */}
      <div className="animate-fade-up" style={{ marginBottom: 56, maxWidth: 720 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <span className="live-dot" />
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: 'rgba(232,237,245,0.45)', letterSpacing: '0.08em' }}>
            LIVE · ARC TESTNET
          </span>
          {lastUpdate && (
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'rgba(232,237,245,0.25)' }}>
              updated {lastUpdate.toLocaleTimeString()}
            </span>
          )}
        </div>
        <h1 style={{ fontSize: 52, fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: 20, color: '#e8edf5' }}>
          Arc Network<br />
          <span style={{ color: '#3b9eff' }}>Live Dashboard</span>
        </h1>
        <p style={{ fontSize: 18, color: 'rgba(232,237,245,0.55)', lineHeight: 1.7, maxWidth: 560 }}>
          Real-time blockchain data from Arc Network — the Layer-1 built for onchain finance with stablecoins. Gas paid in USDC. Sub-second finality.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div style={{ marginBottom: 32, padding: '14px 20px', borderRadius: 10, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444', fontSize: 14 }}>
          ⚠ {error} — retrying automatically…
        </div>
      )}

      {/* Stats grid */}
      <div className="animate-fade-up delay-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
        {[
          { label: 'Block Height', value: stats ? stats.blockNumber.toLocaleString() : '—', sub: 'current chain tip', color: '#3b9eff', icon: '⬡' },
          { label: 'Gas Price', value: stats ? `$${stats.gasPrice}` : '—', sub: 'per transaction (USDC)', color: '#22c55e', icon: '⛽' },
          { label: 'Finality', value: '~0.5s', sub: 'deterministic, no reorgs', color: '#a855f7', icon: '⚡' },
          { label: 'Chain ID', value: '1657', sub: 'EVM-compatible testnet', color: '#f59e0b', icon: '🔗' },
        ].map((s, i) => (
          <div key={s.label} className={`card animate-fade-up delay-${i + 2}`} style={{ padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <span style={{ fontSize: 20 }}>{s.icon}</span>
              <div className="badge badge-arc" style={{ fontSize: 10 }}>LIVE</div>
            </div>
            <div className="stat-num" style={{ color: s.color, marginBottom: 6, fontSize: loading ? 28 : 36 }}>
              {loading ? <div className="skeleton" style={{ height: 36, width: 120 }} /> : s.value}
            </div>
            <div style={{ fontSize: 12, color: 'rgba(232,237,245,0.35)', fontWeight: 500 }}>{s.label}</div>
            <div style={{ fontSize: 11, color: 'rgba(232,237,245,0.25)', marginTop: 2 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Why Arc callout */}
      <div className="animate-fade-up delay-3" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 48 }}>
        {[
          { title: 'USDC as Gas', desc: 'No volatile native token. Every transaction costs a predictable ~$0.006 in USDC.', icon: '💵' },
          { title: 'EVM Compatible', desc: 'Deploy any Solidity contract. Use Hardhat, Foundry, Viem, ethers.js — all work unchanged.', icon: '🔧' },
          { title: 'No Reorgs', desc: 'Malachite BFT consensus delivers deterministic finality. One confirmation is final.', icon: '🔒' },
        ].map(f => (
          <div key={f.title} className="card" style={{ padding: 24 }}>
            <div style={{ fontSize: 28, marginBottom: 12 }}>{f.icon}</div>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 8 }}>{f.title}</div>
            <div style={{ fontSize: 13, color: 'rgba(232,237,245,0.5)', lineHeight: 1.6 }}>{f.desc}</div>
          </div>
        ))}
      </div>

      {/* Recent blocks */}
      <div className="animate-fade-up delay-4">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em' }}>Recent Blocks</h2>
          <Link href="/transactions" className="btn btn-ghost" style={{ fontSize: 13, padding: '7px 16px' }}>
            View all transactions →
          </Link>
        </div>

        <div className="card">
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Block</th>
                  <th>Age</th>
                  <th>Transactions</th>
                  <th>Gas Used</th>
                  <th>Miner</th>
                  <th>Hash</th>
                </tr>
              </thead>
              <tbody>
                {loading ? Array(6).fill(0).map((_, i) => (
                  <tr key={i}>
                    {Array(6).fill(0).map((_, j) => (
                      <td key={j}><div className="skeleton" style={{ height: 16, width: j === 0 ? 80 : 120 }} /></td>
                    ))}
                  </tr>
                )) : blocks.map(block => (
                  <tr key={block.number}>
                    <td>
                      <span style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 600, color: '#3b9eff', fontSize: 13 }}>
                        #{block.number.toLocaleString()}
                      </span>
                    </td>
                    <td style={{ color: 'rgba(232,237,245,0.5)', fontSize: 12 }}>{timeAgo(block.timestamp)}</td>
                    <td>
                      <span style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 500 }}>
                        {block.transactions.length}
                      </span>
                      {block.transactions.length > 0 && (
                        <span style={{ marginLeft: 6, fontSize: 10, color: '#22c55e' }}>txns</span>
                      )}
                    </td>
                    <td style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: 'rgba(232,237,245,0.6)' }}>
                      {block.gasUsed.toLocaleString()}
                    </td>
                    <td style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: 'rgba(232,237,245,0.45)' }}>
                      {short(block.miner)}
                    </td>
                    <td>
                      <a href={`${EXPLORER}/block/${block.number}`} target="_blank" rel="noopener noreferrer" className="hash">
                        {block.hash.slice(0, 18)}…
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* CTA row */}
      <div className="animate-fade-up delay-5" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 48 }}>
        <Link href="/wallet" style={{ textDecoration: 'none' }}>
          <div className="card glow-arc" style={{ padding: 28, cursor: 'pointer', display: 'flex', gap: 20, alignItems: 'center' }}>
            <div style={{ fontSize: 36 }}>🔍</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>Wallet Inspector</div>
              <div style={{ fontSize: 13, color: 'rgba(232,237,245,0.5)' }}>
                Check any address — live USDC balance, transaction count, full history
              </div>
            </div>
            <div style={{ marginLeft: 'auto', color: '#3b9eff', fontSize: 20 }}>→</div>
          </div>
        </Link>
        <Link href="/docs" style={{ textDecoration: 'none' }}>
          <div className="card" style={{ padding: 28, cursor: 'pointer', display: 'flex', gap: 20, alignItems: 'center' }}>
            <div style={{ fontSize: 36 }}>📘</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>Quickstart Guide</div>
              <div style={{ fontSize: 13, color: 'rgba(232,237,245,0.5)' }}>
                Deploy to Arc in 5 minutes. Copy-paste code for Hardhat, Viem, and ethers.js
              </div>
            </div>
            <div style={{ marginLeft: 'auto', color: 'rgba(232,237,245,0.3)', fontSize: 20 }}>→</div>
          </div>
        </Link>
      </div>
    </div>
  );
}
