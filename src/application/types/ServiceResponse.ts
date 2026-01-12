import type { TreeifiedError } from "src/application/utils/treeify-error";
import type STATUS_CODE from "/src/domain/constants/STATUS_CODE";
import type { campaignSchema } from "src/application/schemas/campaignSchema";
import type z from "zod";
type CampaignValidationTree = TreeifiedError<z.infer<typeof campaignSchema>>;

export type ServiceResponse<T> =
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      errorMessage: string;
      statusCode?: (typeof STATUS_CODE)[keyof typeof STATUS_CODE];
      validationErrors?: CampaignValidationTree;
    };
