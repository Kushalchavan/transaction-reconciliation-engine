import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    runId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Run",
      required: true,
    },
    source: {
      type: String,
      enum: ["USER", "EXCHANGE"],
      required: true,
    },
    transactionId: {
      type: String,
      required: true,
    },
    timestamp: Date,
    type: String,
    normalizedType: String,
    asset: String,
    normalizedAsset: String,
    quantity: Number,
    priceUsd: Number,
    fee: Number,
    note: String,
    validationStatus: {
      type: String,
      enum: ["VALID", "INVALID"],
      default: "VALID",
    },
    validationErrors: [
      {
        type: String,
      },
    ],
    rawRow: {
      type: Object,
    },
  },
  {
    timestamps: true,
  },
);

const Transaction = mongoose.model("Transaction", transactionSchema);

export default Transaction;
