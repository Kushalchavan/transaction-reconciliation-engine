import { Parser } from "json2csv";
import Result from "../models/result.model";

export const exportReportCsv = async (runId: string) => {
  const results = await Result.find({
    runId,
  })
    .populate("userTransactionId")
    .populate("exchangeTransactionId");

  const formattedResults = results.map((result: any) => ({
    category: result.category,
    reason: result.reason,
    userTransactionId: result.userTransactionId?.transactionId || "",
    exchangeTransactionId: result.exchangeTransactionId?.transactionId || "",
    asset:
      result.userTransactionId?.normalizedAsset ||
      result.exchangeTransactionId?.normalizedAsset ||
      "",
    quantity:
      result.userTransactionId?.quantity ||
      result.exchangeTransactionId?.quantity ||
      "",
  }));

  const parser = new Parser();

  return parser.parse(formattedResults);
};
