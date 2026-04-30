'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/', label: 'Overview' },
  { href: '/wallet', label: 'Wallet' },
  { href: '/transactions', label: 'Transactions' },
  { href: '/docs', label: 'Quickstart' },
];

export default function Nav() {
  const path = usePathname();

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 100,
      borderBottom: '1px solid rgba(255,255,255,0.07)',
      backdropFilter: 'blur(20px)',
      background: 'rgba(5,8,15,0.85)',
    }}>
      <div style={{
        maxWidth: 1200, margin: '0 auto',
        padding: '0 32px',
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between',
        height: 64,
      }}>
        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <path d="M16 3L29 26H3L16 3Z" stroke="#3b9eff" strokeWidth="1.5" fill="none" opacity="0.4"/>
            <path d="M16 9L25 24H7L16 9Z" fill="rgba(59,158,255,0.15)" stroke="#3b9eff" strokeWidth="1.5"/>
            <circle cx="16" cy="19" r="3" fill="#3b9eff"/>
          </svg>
          <div>
            <div style={{ fontWeight: 800, fontSize: 15, letterSpacing: '-0.01em', color: '#e8edf5' }}>
              Arc Dashboard
            </div>
            <div style={{ fontSize: 10, color: 'rgba(232,237,245,0.35)', letterSpacing: '0.12em', marginTop: -1 }}>
              TESTNET · CHAIN 1657
            </div>
          </div>
        </Link>

        {/* Nav links */}
        <div style={{ display: 'flex', gap: 4 }}>
          {links.map(({ href, label }) => {
            const active = href === '/' ? path === '/' : path.startsWith(href);
            return (
              <Link key={href} href={href} style={{
                padding: '6px 16px',
                borderRadius: 8,
                fontSize: 14,
                fontWeight: active ? 600 : 400,
                color: active ? '#3b9eff' : 'rgba(232,237,245,0.55)',
                background: active ? 'rgba(59,158,255,0.1)' : 'transparent',
                textDecoration: 'none',
                transition: 'all 0.15s',
                border: active ? '1px solid rgba(59,158,255,0.2)' : '1px solid transparent',
              }}>
                {label}
              </Link>
            );
          })}
        </div>

        {/* Network status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'rgba(232,237,245,0.4)' }}>
          <span className="live-dot" />
          <span style={{ fontFamily: 'JetBrains Mono, monospace' }}>rpc.testnet.arc.network</span>
        </div>
      </div>
    </nav>
  );
}
