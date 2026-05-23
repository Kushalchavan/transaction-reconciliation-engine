import express from "express";
import reconciliationRoutes from "./routes/reconciliation.routes";

const app = express();

app.use(express.json());

app.use("/api", reconciliationRoutes);

export default app;
