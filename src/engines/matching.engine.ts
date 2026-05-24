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
    let bestMatch = null;

    // Find the best matching exchange transaction for this user transaction
    for (const exchangeTx of exchangeTransactions) {
      if (matchedExchangeIds.has(exchangeTx._id.toString())) {
        continue;
      }

      if (userTx.normalizedAsset !== exchangeTx.normalizedAsset) {
        continue;
      }

      if (userTx.normalizedType !== exchangeTx.normalizedType) {
        continue;
      }

      if (userTx.quantity == null || exchangeTx.quantity == null) {
        continue;
      }

      if (!userTx.timestamp || !exchangeTx.timestamp) {
        continue;
      }

      // calcualting quality
      const quantityDifferencePct = calculateQuantityDifferencePct(
        userTx.quantity,
        exchangeTx.quantity,
      );

      // calculating timestamp difference 
      const timestampDifferenceSeconds = calculateTimestampDifferenceSeconds(
        userTx.timestamp,
        exchangeTx.timestamp,
      );

      const quantityMatches = quantityDifferencePct <= quantityTolerancePct;
      const timestampMatches =
        timestampDifferenceSeconds <= timestampToleranceSeconds;

      if (quantityMatches && timestampMatches) {
        bestMatch = {
          exchangeTx,
          quantityDifferencePct,
          timestampDifferenceSeconds,
        };
        break;
      }
    }

    if (bestMatch) {
      matchedExchangeIds.add(bestMatch.exchangeTx._id.toString());

      results.push({
        runId,
        userTransactionId: userTx._id,
        exchangeTransactionId: bestMatch.exchangeTx._id,
        category: "MATCHED",
        reason: "Matched within tolerance",
        quantityDifferencePct: bestMatch.quantityDifferencePct,
        timestampDifferenceSeconds: bestMatch.timestampDifferenceSeconds,
      });
    } else {
      results.push({
        runId,
        userTransactionId: userTx._id,
        category: "UNMATCHED_USER",
        reason: "No matching exchange transaction found",
      });
    }
  }

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
