import Transaction from "../models/transaction.model";

const calculateQuantityDifferencePct = (a: number, b: number) => {
  return (Math.abs(a - b) / b) * 100;
};

const calculateTimestampDifferenceSeconds = (a: Date, b: Date) => {
  return Math.abs(a.getTime() - b.getTime()) / 1000;
};

export const matchTransactions = async (
  runId: string,
  timestampToleranceSeconds: number,
  quantityTolerancePct: number,
) => {
  const userTransactions = await Transaction.find({
    runId,
    source: "USER",
    validationStatus: "VALID",
  });

  const exchangeTransactions = await Transaction.find({
    runId,
    source: "EXCHANGE",
    validationStatus: "VALID",
  });

  const matchedExchangeIds = new Set<string>();
  const results = [];

  for (const userTx of userTransactions) {
    let bestMatchedCandidate = null;
    let bestConflictingCandidate = null;

    for (const exchangeTx of exchangeTransactions) {
      // Prevent duplicate matching
      if (matchedExchangeIds.has(exchangeTx._id.toString())) {
        continue;
      }

      // Asset matching
      if (userTx.normalizedAsset !== exchangeTx.normalizedAsset) {
        continue;
      }

      // Type matching
      if (userTx.normalizedType !== exchangeTx.normalizedType) {
        continue;
      }

      // Defensive checks
      if (userTx.quantity == null || exchangeTx.quantity == null) {
        continue;
      }

      if (!userTx.timestamp || !exchangeTx.timestamp) {
        continue;
      }

      // Difference calculations
      const quantityDifferencePct = calculateQuantityDifferencePct(
        userTx.quantity,
        exchangeTx.quantity,
      );

      const timestampDifferenceSeconds = calculateTimestampDifferenceSeconds(
        userTx.timestamp,
        exchangeTx.timestamp,
      );

      // Tolerance checks
      const quantityMatches = quantityDifferencePct <= quantityTolerancePct;

      const timestampMatches =
        timestampDifferenceSeconds <= timestampToleranceSeconds;

      // PERFECT MATCH
      if (quantityMatches && timestampMatches) {
        if (
          !bestMatchedCandidate ||
          timestampDifferenceSeconds <
            bestMatchedCandidate.timestampDifferenceSeconds
        ) {
          bestMatchedCandidate = {
            exchangeTx,
            quantityDifferencePct,
            timestampDifferenceSeconds,
          };
        }

        continue;
      }

      // CONFLICTING MATCH
      if (timestampMatches) {
        if (
          !bestConflictingCandidate ||
          timestampDifferenceSeconds <
            bestConflictingCandidate.timestampDifferenceSeconds
        ) {
          bestConflictingCandidate = {
            exchangeTx,
            quantityDifferencePct,
            timestampDifferenceSeconds,
          };
        }
      }
    }

    // SAVE MATCHED RESULT
    if (bestMatchedCandidate) {
      matchedExchangeIds.add(bestMatchedCandidate.exchangeTx._id.toString());

      results.push({
        runId,
        userTransactionId: userTx._id,
        exchangeTransactionId: bestMatchedCandidate.exchangeTx._id,
        category: "MATCHED",
        reason: "Matched within tolerance",
        quantityDifferencePct: bestMatchedCandidate.quantityDifferencePct,
        timestampDifferenceSeconds:
          bestMatchedCandidate.timestampDifferenceSeconds,
      });

      continue;
    }

    // SAVE CONFLICTING RESULT
    if (bestConflictingCandidate) {
      matchedExchangeIds.add(
        bestConflictingCandidate.exchangeTx._id.toString(),
      );

      results.push({
        runId,
        userTransactionId: userTx._id,
        exchangeTransactionId: bestConflictingCandidate.exchangeTx._id,
        category: "CONFLICTING",
        reason: "Transaction differs beyond tolerance",
        quantityDifferencePct: bestConflictingCandidate.quantityDifferencePct,
        timestampDifferenceSeconds:
          bestConflictingCandidate.timestampDifferenceSeconds,
      });

      continue;
    }

    // UNMATCHED USER
    results.push({
      runId,
      userTransactionId: userTx._id,
      category: "UNMATCHED_USER",
      reason: "No matching exchange transaction found",
    });
  }

  // UNMATCHED EXCHANGE
  for (const exchangeTx of exchangeTransactions) {
    if (matchedExchangeIds.has(exchangeTx._id.toString())) {
      continue;
    }

    results.push({
      runId,
      exchangeTransactionId: exchangeTx._id,
      category: "UNMATCHED_EXCHANGE",
      reason: "No matching user transaction found",
    });
  }

  return results;
};
