import { z } from "zod";
import { normalizeAsset } from "../normalizers/asset.normalizer";
import { normalizeType } from "../normalizers/type.normalizer";

const transactionSchema = z.object({
  transaction_id: z.string().min(1, "transaction_id is required"),
  timestamp: z
    .string()
    .min(1, "timestamp is required")
    .refine((value) => !isNaN(new Date(value).getTime()), {
      message: "Invalid timestamp",
    }),

  type: z.string().min(1, "type is required"),
  asset: z.string().min(1, "asset is required"),
  quantity: z.coerce
    .number({
      invalid_type_error: "quantity must be number",
    })
    .positive("quantity must be positive"),
  price_usd: z.coerce.number(),
  fee: z.coerce.number(),
  note: z.string().optional(),
});

export const validateTransaction = (row: unknown) => {
  const result = transactionSchema.safeParse(row);

  if (!result.success) {
    return {
      isValid: false,
      errors: result.error.issues.map((issue) => issue.message),
      data: null,
    };
  }

  const data = result.data;

  return {
    isValid: true,
    errors: [],
    data: {
      transactionId: data.transaction_id,
      timestamp: new Date(data.timestamp),
      type: data.type,
      normalizedType: normalizeType(data.type),
      asset: data.asset,
      normalizedAsset: normalizeAsset(data.asset),
      quantity: data.quantity,
      priceUsd: data.price_usd,
      fee: data.fee,
      note: data.note,
    },
  };
};
