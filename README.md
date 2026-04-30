# Arc Dashboard

A live 4-page network dashboard for Arc Network — built with Next.js, deploys to Vercel in one command.

**No backend. No database. Pure Arc RPC calls.**

---

## Pages

| Page | URL | What it does |
|---|---|---|
| Overview | `/` | Live block height, gas price, recent blocks, network stats |
| Wallet Inspector | `/wallet` | Paste any address → live USDC balance + tx count |
| Transactions | `/transactions` | Real-time tx feed, tx hash search, type breakdown |
| Quickstart | `/docs` | Copy-paste code for Hardhat, Viem, MetaMask setup |

---

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000

---

## Deploy to Vercel (one command)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy — follow the prompts
vercel

# Or link to GitHub and it auto-deploys on every push
```

**That's it.** No environment variables needed. No backend to configure.

---

## How it works

All data comes directly from Arc's public RPC endpoint:

```
https://rpc.testnet.arc.network
```

Every page calls the Arc RPC directly from the browser — no proxy, no backend, no API keys.

---

## Arc Network Facts (shown live on the dashboard)

- **Chain ID:** 1657
- **Gas token:** USDC (predictable ~$0.006/tx)
- **Finality:** ~0.5 seconds (Malachite BFT)
- **EVM:** Fully compatible — Hardhat, Foundry, Viem all work
- **USDC contract:** `0x3600000000000000000000000000000000000000`
