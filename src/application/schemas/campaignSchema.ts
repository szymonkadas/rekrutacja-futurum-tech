import { z } from "zod";
import { MIN_BID_AMOUNT } from "/src/domain/constants/MIN_BID_AMOUNT";

function isValidNumber(value: unknown): boolean {
  return (
    typeof value === "number" && (Number.isFinite(value) || Number.isNaN(value))
  );
}
const keywordRequiredMessage = "At least one keyword is required";

export const campaignBaseSchema = z.object({
  name: z
    .string({ message: "Campaign name is required" })
    .min(1, "Campaign name is required")
    .max(128, "Campaign name is too long"),

  keywords: z
    .array(
      z
        .string({ message: keywordRequiredMessage })
        .min(1, "Keyword is required to be at least 1 character")
        .max(128, "Keyword is too long (max 128 characters)"),
    )
    .min(1, keywordRequiredMessage),

  bidAmount: z
    .number({ message: "Bid amount is required" })
    .min(MIN_BID_AMOUNT, `Bid amount must be at least ${MIN_BID_AMOUNT}`)
    .refine(isValidNumber, { message: "Bid amount must be a valid number" }),

  campaignFund: z
    .number({ message: "Campaign fund is required" })
    .min(0, "Campaign fund cannot be negative")
    .refine(isValidNumber, { message: "Campaign fund must be a valid number" }),

  statusOn: z.boolean({ message: "Status is required" }),

  town: z.string({ message: "Town is required" }).min(1, "Town is required"),

  radius: z
    .number({ message: "Radius is required" })
    .positive("Radius must be positive"),
});

export const campaignSchema = campaignBaseSchema.refine(
  (data) => data.campaignFund >= data.bidAmount,
  {
    message: "Campaign fund must be at least the bid amount",
    path: ["campaignFund"],
  },
);

export type CampaignFormData = z.infer<typeof campaignSchema>;
export type ValidationErrors = Record<string, string | undefined>;
