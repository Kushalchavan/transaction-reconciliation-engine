const TYPE_MAPPING: Record<string, string> = {
  BUY: "BUY",
  SELL: "SELL",
  TRANSFER: "TRANSFER",
  TRANSFER_IN: "TRANSFER",
  TRANSFER_OUT: "TRANSFER",
};

export const normalizeType = (type: string) => {
  if (!type) return null;

  return TYPE_MAPPING[type.trim().toUpperCase()] || type.trim().toUpperCase();
};
