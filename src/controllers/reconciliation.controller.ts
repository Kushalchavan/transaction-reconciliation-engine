import { Request, Response } from "express";
import Run from "../models/run.model";
import { ingestTransactions } from "../services/ingestion.service";
import { reconcileRun } from "../services/reconciliation.service";

export const reconcile = async (req: Request, res: Response) => {
  try {
    const files = req.files as {
      [fieldname: string]: Express.Multer.File[];
    };

    const userFile = files.userFile?.[0];
    const exchangeFile = files.exchangeFile?.[0];

    if (!userFile || !exchangeFile) {
      return res.status(400).json({
        success: false,
        message: "Both CSV files are required",
      });
    }

    const run = await Run.create({
      status: "PROCESSING",
      startedAt: new Date(),
    });

    const userCount = await ingestTransactions(
      userFile.path,
      "USER",
      run._id.toString(),
    );

    const exchangeCount = await ingestTransactions(
      exchangeFile.path,
      "EXCHANGE",
      run._id.toString(),
    );

    // Matching engine
    await reconcileRun(
      run._id.toString(),
      run.config?.timestampToleranceSeconds || 300,
      run.config?.quantityTolerancePct || 0.01,
    );

    run.status = "COMPLETED";
    run.completedAt = new Date();
    await run.save();

    return res.status(200).json({
      success: true,
      message: "Transactions ingested successfully",
      data: {
        runId: run._id,
        totalTransactions: userCount + exchangeCount,
        userTransactions: userCount,
        exchangeTransactions: exchangeCount,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to process reconciliation",
    });
  }
};
