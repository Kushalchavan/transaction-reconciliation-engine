const ASSET_ALIASES: Record<string, string> = {
  BTC: "BTC",
  BITCOIN: "BTC",
  ETH: "ETH",
  ETHEREUM: "ETH",
  USDT: "USDT",
  SOL: "SOL",
  MATIC: "MATIC",
  LINK: "LINK",
};

export const normalizeAsset = (asset: string) => {
  if (!asset) return null;

  return (
    ASSET_ALIASES[asset.trim().toUpperCase()] || asset.trim().toUpperCase()
  );
};
