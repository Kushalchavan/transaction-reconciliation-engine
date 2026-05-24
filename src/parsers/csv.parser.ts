import fs from "fs";
import csv from "csv-parser";
import { RawTransactionRow } from "../types/transaction.types";

export const parseCsv = async (
  filePath: string,
): Promise<RawTransactionRow[]> => {
  return new Promise((resolve, reject) => {
    const results: RawTransactionRow[] = [];

    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data) => {
        results.push(data);
      })
      .on("end", () => {
        resolve(results);
      })
      .on("error", (error) => {
        reject(error);
      });
  });
};
