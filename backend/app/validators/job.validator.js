import { z } from "zod";

export const createJobSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(100, "Title is too long"),

  type: z
    .string()
    .trim()
    .min(1, "Type is required")
    .max(50, "Type is too long"),
});

export const statusSchema = z.object({
  status: z.enum([
    "pending",
    "running",
    "completed",
    "failed",
  ]),
  version: z.number().int().min(0),
});
