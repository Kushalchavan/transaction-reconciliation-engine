import mongoose from "mongoose";

const runSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ["PENDING", "PROCESSING", "COMPLETED", "FAILED"],
      default: "PENDING",
    },
    config: {
      timestampToleranceSeconds: {
        type: Number,
        default: 300,
      },
      quantityTolerancePct: {
        type: Number,
        default: 0.01,
      },
    },
    summary: {
      matched: {
        type: Number,
        default: 0,
      },
      conflicting: {
        type: Number,
        default: 0,
      },
      unmatchedUser: {
        type: Number,
        default: 0,
      },
      unmatchedExchange: {
        type: Number,
        default: 0,
      },
      invalid: {
        type: Number,
        default: 0,
      },
    },
    startedAt: Date,
    completedAt: Date,
    errorMessage: String,
  },
  {
    timestamps: true,
  },
);

const Run = mongoose.model("Run", runSchema);

export default Run;
