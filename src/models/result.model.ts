import mongoose from "mongoose";

const resultSchema = new mongoose.Schema(
  {
    runId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Run",
      required: true,
    },

    userTransactionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Transaction",
    },

    exchangeTransactionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Transaction",
    },

    category: {
      type: String,
      enum: [
        "MATCHED",
        "CONFLICTING",
        "UNMATCHED_USER",
        "UNMATCHED_EXCHANGE",
      ],

      required: true,
    },

    reason: String,

    quantityDifferencePct: Number,

    timestampDifferenceSeconds: Number,
  },
  {
    timestamps: true,
  }
);

const Result = mongoose.model("Result", resultSchema);

export default Result;
