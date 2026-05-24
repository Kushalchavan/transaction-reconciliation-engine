import { Request, Response } from "express";
import {
  getFullReport,
  getSummary,
  getUnmatched,
} from "../services/report.service";

export const fetchReport = async (req: Request, res: Response) => {
  try {
    const { runId } = req.params;
    if (!runId || Array.isArray(runId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid runId",
      });
    }
    const report = await getFullReport(runId);

    return res.status(200).json({
      success: true,
      data: report,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch report",
    });
  }
};

export const fetchSummary = async (req: Request, res: Response) => {
  try {
    const { runId } = req.params;
    if (!runId || Array.isArray(runId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid runId",
      });
    }
    const summary = await getSummary(runId);

    return res.status(200).json({
      success: true,
      data: summary,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch summary",
    });
  }
};

export const fetchUnmatched = async (req: Request, res: Response) => {
  try {
    const { runId } = req.params;
    if (!runId || Array.isArray(runId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid runId",
      });
    }
    const unmatched = await getUnmatched(runId);

    return res.status(200).json({
      success: true,
      data: unmatched,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch unmatched transactions",
    });
  }
};
