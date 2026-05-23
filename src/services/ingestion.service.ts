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
      ...(validation.data || {}),
      validationStatus: validation.isValid ? "VALID" : "INVALID",
      validationErrors: validation.errors,
      rawRow: row,
    };
  });

  await Transaction.insertMany(documents);
  await fs.unlink(filePath);
  return documents.length;
};
