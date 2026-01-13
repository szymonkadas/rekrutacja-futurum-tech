import { z } from "zod";
import { MIN_BID_AMOUNT } from "/src/domain/constants/MIN_BID_AMOUNT";

const keywordRequiredMessage = "At least one keyword is required";

/**
 * Preprocessor that converts string values to numbers while properly handling
 * empty strings and invalid inputs. Unlike z.coerce.number(), this returns NaN
 * for empty strings instead of 0, ensuring proper validation error messages.
 */
const toNumber = (val: unknown): number => {
  if (val === "" || val === null || val === undefined) {
    return NaN;
  }
  return Number(val);
};

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

  bidAmount: z.preprocess(
    toNumber,
    z
      .number({ message: "Bid amount must be a valid number" })
      .min(MIN_BID_AMOUNT, `Bid amount must be at least ${MIN_BID_AMOUNT}`),
  ),

  campaignFund: z.preprocess(
    toNumber,
    z
      .number({ message: "Campaign fund must be a valid number" })
      .min(0, "Campaign fund cannot be negative"),
  ),

  statusOn: z.boolean({ message: "Status is required" }),

  town: z.string({ message: "Town is required" }).min(1, "Town is required"),

  radius: z.preprocess(
    toNumber,
    z
      .number({ message: "Radius must be a valid number" })
      .positive("Radius must be positive"),
  ),
});

export const campaignSchema = campaignBaseSchema.refine(
  (data) => data.campaignFund >= data.bidAmount,
  {
    message: "Campaign fund must be at least the bid amount",
    path: ["campaignFund"],
  },
);

/** Output type - after parsing and validation (numbers are actual numbers) */
export type CampaignFormData = z.infer<typeof campaignSchema>;
/** Input type - before parsing (numbers can be strings from form inputs) */
export type CampaignFormInput = z.input<typeof campaignSchema>;
export type ValidationErrors = Record<string, string | undefined>;
