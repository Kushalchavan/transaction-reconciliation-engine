import fs from "fs/promises";
import Transaction from "../models/transaction.model";
import { parseCsv } from "../parsers/csv.parser";
import { validateTransaction } from "../validators/transaction.validator";

export const ingestTransactions = async (
  filePath: string,
  source: "USER" | "EXCHANGE",
  runId: string,
) => {
  const rows = await parseCsv(filePath);

  const documents = rows.map((row) => {
    const validation = validateTransaction(row);

    return {
      runId,
      source,
      transactionId: row.transaction_id,
      timestamp: validation.data?.timestamp || null,
      type: validation.data?.type || row.type,
      normalizedType: validation.data?.normalizedType || null,
      asset: validation.data?.asset || row.asset,
      normalizedAsset: validation.data?.normalizedAsset || null,
      quantity: validation.data?.quantity || null,
      priceUsd: validation.data?.priceUsd || null,
      fee: validation.data?.fee || null,
      note: validation.data?.note || row.note,
      validationStatus: validation.isValid ? "VALID" : "INVALID",
      validationErrors: validation.errors,
      rawRow: row,
    };
  });

  await Transaction.insertMany(documents);
  await fs.unlink(filePath);
  return documents.length;
};
