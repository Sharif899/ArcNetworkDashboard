// All Arc Network RPC calls — pure frontend, no backend needed

export const ARC_RPC = 'https://rpc.testnet.arc.network';
export const EXPLORER = 'https://testnet.arcscan.app';
export const CHAIN_ID = 1657;
export const USDC_ADDRESS = '0x3600000000000000000000000000000000000000';

// Low-level JSON-RPC call
async function rpc(method: string, params: unknown[] = []): Promise<unknown> {
  const res = await fetch(ARC_RPC, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params }),
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error.message);
  return data.result;
}

// ── Network ──────────────────────────────────────────────────────────────────

export async function getBlockNumber(): Promise<number> {
  const hex = await rpc('eth_blockNumber') as string;
  return parseInt(hex, 16);
}

export async function getBlock(blockNum?: number): Promise<Block> {
  const param = blockNum != null
    ? '0x' + blockNum.toString(16)
    : 'latest';
  const block = await rpc('eth_getBlockByNumber', [param, true]) as RawBlock;
  return formatBlock(block);
}

export async function getGasPrice(): Promise<string> {
  const hex = await rpc('eth_gasPrice') as string;
  const wei = parseInt(hex, 16);
  // Arc gas is in USDC (6 decimals on ERC-20, 18 internally)
  return (wei / 1e18).toFixed(8);
}

export async function getChainId(): Promise<number> {
  const hex = await rpc('eth_chainId') as string;
  return parseInt(hex, 16);
}

export async function getNetworkStats(): Promise<NetworkStats> {
  const [blockNum, gasPrice] = await Promise.all([
    getBlockNumber(),
    getGasPrice(),
  ]);
  const block = await getBlock(blockNum);
  return {
    blockNumber: blockNum,
    gasPrice,
    txCount: block.transactions.length,
    timestamp: block.timestamp,
    finality: '~0.5s',
    chainId: CHAIN_ID,
  };
}

// ── Wallet ───────────────────────────────────────────────────────────────────

export async function getEthBalance(address: string): Promise<string> {
  const hex = await rpc('eth_getBalance', [address, 'latest']) as string;
  const wei = BigInt(hex);
  return (Number(wei) / 1e18).toFixed(6);
}

export async function getUsdcBalance(address: string): Promise<string> {
  // ERC-20 balanceOf call
  const data = '0x70a08231' + address.slice(2).padStart(64, '0');
  const hex = await rpc('eth_call', [
    { to: USDC_ADDRESS, data },
    'latest'
  ]) as string;
  if (!hex || hex === '0x') return '0.00';
  const raw = BigInt(hex);
  return (Number(raw) / 1e6).toFixed(2);
}

export async function getTxCount(address: string): Promise<number> {
  const hex = await rpc('eth_getTransactionCount', [address, 'latest']) as string;
  return parseInt(hex, 16);
}

export async function getWalletInfo(address: string): Promise<WalletInfo> {
  const [usdcBalance, txCount] = await Promise.all([
    getUsdcBalance(address),
    getTxCount(address),
  ]);
  return { address, usdcBalance, txCount };
}

// ── Transactions ─────────────────────────────────────────────────────────────

export async function getRecentBlocks(count = 10): Promise<Block[]> {
  const latest = await getBlockNumber();
  const blockNums = Array.from({ length: count }, (_, i) => latest - i).filter(n => n >= 0);
  const blocks = await Promise.all(blockNums.map(n => getBlock(n)));
  return blocks;
}

export async function getTransaction(hash: string): Promise<Transaction | null> {
  try {
    const tx = await rpc('eth_getTransactionByHash', [hash]) as RawTx | null;
    if (!tx) return null;
    return formatTx(tx);
  } catch {
    return null;
  }
}

export async function getTransactionReceipt(hash: string): Promise<TxReceipt | null> {
  try {
    const receipt = await rpc('eth_getTransactionReceipt', [hash]) as RawReceipt | null;
    if (!receipt) return null;
    return {
      status: receipt.status === '0x1' ? 'success' : 'failed',
      gasUsed: parseInt(receipt.gasUsed, 16),
      blockNumber: parseInt(receipt.blockNumber, 16),
    };
  } catch {
    return null;
  }
}

// ── Formatters ────────────────────────────────────────────────────────────────

function formatBlock(b: RawBlock): Block {
  const txs = (b.transactions || []).map(formatTx);
  return {
    number: parseInt(b.number, 16),
    hash: b.hash,
    timestamp: parseInt(b.timestamp, 16),
    transactions: txs,
    gasUsed: parseInt(b.gasUsed || '0x0', 16),
    miner: b.miner,
  };
}

function formatTx(tx: RawTx): Transaction {
  const value = BigInt(tx.value || '0x0');
  return {
    hash: tx.hash,
    from: tx.from,
    to: tx.to,
    value: (Number(value) / 1e18).toFixed(6),
    blockNumber: tx.blockNumber ? parseInt(tx.blockNumber, 16) : null,
    gasPrice: tx.gasPrice ? (parseInt(tx.gasPrice, 16) / 1e18).toFixed(8) : '0',
    isUsdcTransfer: tx.to?.toLowerCase() === USDC_ADDRESS.toLowerCase(),
    input: tx.input,
  };
}

// ── Types ────────────────────────────────────────────────────────────────────

export interface NetworkStats {
  blockNumber: number;
  gasPrice: string;
  txCount: number;
  timestamp: number;
  finality: string;
  chainId: number;
}

export interface WalletInfo {
  address: string;
  usdcBalance: string;
  txCount: number;
}

export interface Block {
  number: number;
  hash: string;
  timestamp: number;
  transactions: Transaction[];
  gasUsed: number;
  miner: string;
}

export interface Transaction {
  hash: string;
  from: string;
  to: string | null;
  value: string;
  blockNumber: number | null;
  gasPrice: string;
  isUsdcTransfer: boolean;
  input: string;
}

export interface TxReceipt {
  status: 'success' | 'failed';
  gasUsed: number;
  blockNumber: number;
}

interface RawBlock {
  number: string;
  hash: string;
  timestamp: string;
  transactions: RawTx[];
  gasUsed: string;
  miner: string;
}

interface RawTx {
  hash: string;
  from: string;
  to: string | null;
  value: string;
  blockNumber: string | null;
  gasPrice: string;
  input: string;
}

interface RawReceipt {
  status: string;
  gasUsed: string;
  blockNumber: string;
}
