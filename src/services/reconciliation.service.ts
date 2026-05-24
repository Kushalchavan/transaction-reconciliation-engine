import Result from "../models/result.model.js";
import Run from "../models/run.model.js";
import { matchTransactions } from "../engines/matching.engine.js";

export const reconcileRun = async (
  runId: string,
  timestampToleranceSeconds = 300,
  quantityTolerancePct = 0.01,
) => {
  const results = await matchTransactions(
    runId,
    timestampToleranceSeconds,
    quantityTolerancePct,
  );

  await Result.insertMany(results);

  const summary = {
    matched: results.filter((r) => r.category === "MATCHED").length,
    conflicting: results.filter((r) => r.category === "CONFLICTING").length,
    unmatchedUser: results.filter((r) => r.category === "UNMATCHED_USER")
      .length,
    unmatchedExchange: results.filter(
      (r) => r.category === "UNMATCHED_EXCHANGE",
    ).length,
  };

  await Run.findByIdAndUpdate(runId, {
    summary,
  });

  return results;
};
