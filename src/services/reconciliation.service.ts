import Result from "../models/result.model";
import { matchTransactions } from "../engines/matching.engine";

export const reconcileRun =
  async (
    runId: string,
    timestampToleranceSeconds = 300,
    quantityTolerancePct = 0.01
  ) => {
    const results =
      await matchTransactions(
        runId,
        timestampToleranceSeconds,
        quantityTolerancePct
      );
    await Result.insertMany(results);
    return results;
  };