'use client';
import { useEffect, useState } from 'react';
import { getRecentBlocks, getTransaction, EXPLORER, type Block, type Transaction } from '@/lib/arc';

export default function TransactionsPage() {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [allTxs, setAllTxs] = useState<(Transaction & { blockNumber: number; blockTime: number })[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchHash, setSearchHash] = useState('');
  const [searchResult, setSearchResult] = useState<Transaction | null>(null);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  async function load() {
    try {
      const b = await getRecentBlocks(12);
      setBlocks(b);
      // Flatten all transactions across blocks
      const txs = b.flatMap(block =>
        block.transactions.map(tx => ({
          ...tx,
          blockNumber: block.number,
          blockTime: block.timestamp,
        }))
      ).slice(0, 50);
      setAllTxs(txs);
      setLastUpdate(new Date());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    const t = setInterval(load, 12000);
    return () => clearInterval(t);
  }, []);

  async function searchTx() {
    if (!searchHash.trim()) return;
    setSearching(true);
    setSearchError('');
    setSearchResult(null);
    try {
      const tx = await getTransaction(searchHash.trim());
      if (!tx) setSearchError('Transaction not found on Arc Testnet');
      else setSearchResult(tx);
    } catch (e: unknown) {
      setSearchError(e instanceof Error ? e.message : 'Search failed');
    } finally {
      setSearching(false);
    }
  }

  function timeAgo(ts: number) {
    const diff = Math.floor(Date.now() / 1000) - ts;
    if (diff < 5) return 'just now';
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return `${Math.floor(diff / 3600)}h ago`;
  }

  function short(s: string, len = 8) {
    if (!s) return '—';
    return s.slice(0, len) + '…' + s.slice(-6);
  }

  function txType(tx: Transaction) {
    if (tx.isUsdcTransfer) return { label: 'USDC', color: '#22c55e', bg: 'rgba(34,197,94,0.1)' };
    if (!tx.to) return { label: 'Deploy', color: '#a855f7', bg: 'rgba(168,85,247,0.1)' };
    if (tx.input && tx.input !== '0x') return { label: 'Call', color: '#3b9eff', bg: 'rgba(59,158,255,0.1)' };
    return { label: 'Transfer', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' };
  }

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 32px' }}>

      {/* Header */}
      <div className="animate-fade-up" style={{ marginBottom: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 42, fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 8 }}>
            Transactions
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: 'rgba(232,237,245,0.4)' }}>
            <span className="live-dot" />
            <span>Auto-refreshing every 12 seconds</span>
            {lastUpdate && <span>· Last: {lastUpdate.toLocaleTimeString()}</span>}
          </div>
        </div>
        <button className="btn btn-ghost" onClick={load} style={{ fontSize: 13 }}>
          ↻ Refresh
        </button>
      </div>

      {/* Summary stats */}
      <div className="animate-fade-up delay-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 32 }}>
        {[
          { label: 'Blocks Loaded', value: blocks.length, color: '#3b9eff' },
          { label: 'Total Transactions', value: allTxs.length, color: '#22c55e' },
          { label: 'USDC Transfers', value: allTxs.filter(t => t.isUsdcTransfer).length, color: '#a855f7' },
        ].map(s => (
          <div key={s.label} className="card" style={{ padding: 20, display: 'flex', gap: 16, alignItems: 'center' }}>
            <div className="stat-num" style={{ color: s.color, fontSize: 28 }}>
              {loading ? '—' : s.value}
            </div>
            <div style={{ fontSize: 13, color: 'rgba(232,237,245,0.4)', fontWeight: 500 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* TX search */}
      <div className="animate-fade-up delay-2 card" style={{ padding: 24, marginBottom: 32 }}>
        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Search Transaction by Hash</div>
        <div style={{ display: 'flex', gap: 12 }}>
          <input
            className="input"
            value={searchHash}
            onChange={e => setSearchHash(e.target.value)}
            placeholder="0x… transaction hash"
            onKeyDown={e => e.key === 'Enter' && searchTx()}
            style={{ flex: 1 }}
          />
          <button className="btn btn-primary" onClick={searchTx} disabled={searching} style={{ minWidth: 100 }}>
            {searching ? <><span className="spinner" /> Searching</> : 'Search'}
          </button>
        </div>

        {searchError && (
          <div style={{ marginTop: 12, fontSize: 13, color: '#ef4444' }}>{searchError}</div>
        )}

        {searchResult && (
          <div className="animate-fade-in" style={{ marginTop: 16, padding: 16, borderRadius: 8, background: 'rgba(59,158,255,0.05)', border: '1px solid rgba(59,158,255,0.15)' }}>
            <div style={{ fontWeight: 600, marginBottom: 12, color: '#3b9eff' }}>Transaction Found</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, fontSize: 12, fontFamily: 'JetBrains Mono, monospace' }}>
              {[
                ['Hash', searchResult.hash],
                ['From', searchResult.from],
                ['To', searchResult.to || 'Contract Deploy'],
                ['Value', searchResult.value + ' ETH'],
                ['Gas Price', '$' + searchResult.gasPrice],
                ['Type', searchResult.isUsdcTransfer ? 'USDC Transfer' : 'Transaction'],
              ].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <span style={{ color: 'rgba(232,237,245,0.35)', fontSize: 10, letterSpacing: '0.08em' }}>{k.toUpperCase()}</span>
                  <span style={{ color: '#e8edf5', wordBreak: 'break-all' }}>{v}</span>
                </div>
              ))}
            </div>
            <a href={`${EXPLORER}/tx/${searchResult.hash}`} target="_blank" rel="noopener noreferrer"
              className="btn btn-ghost" style={{ marginTop: 12, fontSize: 12, padding: '6px 14px' }}>
              ↗ View on Arcscan
            </a>
          </div>
        )}
      </div>

      {/* TX table */}
      <div className="animate-fade-up delay-3">
        <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 16 }}>
          Latest Transactions
          {allTxs.length === 0 && !loading && (
            <span style={{ fontWeight: 400, fontSize: 14, color: 'rgba(232,237,245,0.4)', marginLeft: 12 }}>
              No transactions in recent blocks
            </span>
          )}
        </div>

        <div className="card">
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Hash</th>
                  <th>Block</th>
                  <th>Age</th>
                  <th>Type</th>
                  <th>From</th>
                  <th>To</th>
                  <th>Value</th>
                  <th>Gas Price</th>
                </tr>
              </thead>
              <tbody>
                {loading ? Array(8).fill(0).map((_, i) => (
                  <tr key={i}>
                    {Array(8).fill(0).map((_, j) => (
                      <td key={j}><div className="skeleton" style={{ height: 14, width: j === 0 ? 140 : 80 }} /></td>
                    ))}
                  </tr>
                )) : allTxs.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ textAlign: 'center', padding: 48, color: 'rgba(232,237,245,0.3)' }}>
                      No transactions found in recent blocks
                    </td>
                  </tr>
                ) : allTxs.map(tx => {
                  const type = txType(tx);
                  return (
                    <tr key={tx.hash}>
                      <td>
                        <a href={`${EXPLORER}/tx/${tx.hash}`} target="_blank" rel="noopener noreferrer" className="hash">
                          {tx.hash.slice(0, 16)}…
                        </a>
                      </td>
                      <td style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: '#3b9eff' }}>
                        #{tx.blockNumber.toLocaleString()}
                      </td>
                      <td style={{ fontSize: 12, color: 'rgba(232,237,245,0.4)' }}>{timeAgo(tx.blockTime)}</td>
                      <td>
                        <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 4, background: type.bg, color: type.color, fontWeight: 600, fontFamily: 'JetBrains Mono, monospace' }}>
                          {type.label}
                        </span>
                      </td>
                      <td>
                        <a href={`${EXPLORER}/address/${tx.from}`} target="_blank" rel="noopener noreferrer"
                          style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: 'rgba(232,237,245,0.6)', textDecoration: 'none' }}>
                          {short(tx.from)}
                        </a>
                      </td>
                      <td>
                        {tx.to ? (
                          <a href={`${EXPLORER}/address/${tx.to}`} target="_blank" rel="noopener noreferrer"
                            style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: 'rgba(232,237,245,0.6)', textDecoration: 'none' }}>
                            {short(tx.to)}
                          </a>
                        ) : <span style={{ fontSize: 11, color: '#a855f7' }}>Contract Deploy</span>}
                      </td>
                      <td style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12 }}>
                        {parseFloat(tx.value) > 0 ? tx.value : '—'}
                      </td>
                      <td style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: '#22c55e' }}>
                        ${tx.gasPrice}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
