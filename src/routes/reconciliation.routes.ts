import express from "express";
import { reconcile } from "../controllers/reconciliation.controller.js";
import { upload } from "../middlewares/upload.middleware";

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

export default router;
