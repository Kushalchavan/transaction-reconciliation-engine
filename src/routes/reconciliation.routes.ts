import express from "express";
import { reconcile } from "../controllers/reconciliation.controller";
import { upload } from "../middlewares/upload.middleware";
import {
  fetchReport,
  fetchSummary,
  fetchUnmatched,
} from "../controllers/report.controller";

const router = express.Router();

router.post(
  "/reconcile",
  upload.fields([
    {
      name: "userFile",
      maxCount: 1,
    },
    {
      name: "exchangeFile",
      maxCount: 1,
    },
  ]),
  reconcile,
);
router.get("/report/:runId", fetchReport);
router.get("/report/:runId/summary", fetchSummary);
router.get("/report/:runId/unmatched", fetchUnmatched);

export default router;
