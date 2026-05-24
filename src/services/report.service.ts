import Result from "../models/result.model";
import Run from "../models/run.model";

export const getFullReport = async (runId: string) => {
  return Result.find({
    runId,
  })
    .populate("userTransactionId")
    .populate("exchangeTransactionId");
};

export const getSummary = async (runId: string) => {
  const run = await Run.findById(runId);

  if (!run) {
    throw new Error("Run not found");
  }

  return run.summary;
};

export const getUnmatched = async (runId: string) => {
  return Result.find({
    runId,

    category: {
      $in: ["UNMATCHED_USER", "UNMATCHED_EXCHANGE"],
    },
  })
    .populate("userTransactionId")
    .populate("exchangeTransactionId");
};
