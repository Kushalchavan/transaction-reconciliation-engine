import express from "express";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Reconciliation Engine API");
});

export default app;