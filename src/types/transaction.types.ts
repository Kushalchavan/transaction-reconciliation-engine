export interface RawTransactionRow {
  transaction_id: string;
  timestamp: string;
  type: string;
  asset: string;
  quantity: string;
  price_usd: string;
  fee: string;
  note?: string;
}
