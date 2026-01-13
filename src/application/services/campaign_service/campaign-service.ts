import { z } from "zod";
import { type Campaign } from "/src/domain/entities/Campaign";
import { db } from "/src/infrastructure/database_system";
import STATUS_CODE from "/src/domain/constants/STATUS_CODE";
import {
  treeifyError,
} from "/src/application/utils/treeify-error";
import {
  campaignBaseSchema,
  campaignSchema,
} from "/src/application/schemas/campaignSchema";
import { syncCampaignServiceKeywords } from "/src/application/services/campaign_service/helpers";
import type { ServiceResponse } from "src/application/types/ServiceResponse";


// We could split each method into its own file, but that might be overkill for now, it didn't grow too much yet
export const campaignService = {
  /**
   * Retrieves all campaigns from the database.
   * @returns {Promise<ServiceResponse<Campaign[]>>} A promise that resolves to a ServiceResponse containing an array of campaigns.
   */
  getAll: async (): Promise<ServiceResponse<Campaign[]>> => {
    try {
      const campaigns = await db.getCampaigns();
      return { success: true, data: campaigns };
    } catch (error) {
      return {
        success: false,
        errorMessage:
          error instanceof Error ? error.message : "Failed to fetch campaigns",
        statusCode: STATUS_CODE.INTERNAL_SERVER_ERROR,
      };
    }
  },

  /**
   * Retrieves a single campaign by ID.
   * @param {string} id - Campaign identifier.
   * @returns {Promise<ServiceResponse<Campaign>>}
   */
  getCampaignById: async (
    id: string,
  ): Promise<ServiceResponse<Campaign>> => {
    try {
      const campaign = await db.getCampaignById(id);
      return { success: true, data: campaign };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch campaign";

      if (errorMessage.includes("not found")) {
        return {
          success: false,
          errorMessage,
          statusCode: STATUS_CODE.NOT_FOUND,
        };
      }

      return {
        success: false,
        errorMessage,
        statusCode: STATUS_CODE.INTERNAL_SERVER_ERROR,
      };
    }
  },

  /**
   * Creates a new campaign.
   * Validates the campaign data against the schema, checks for sufficient funds, and adds the campaign to the database.
   * Also syncs any new keywords found in the campaign.
   * @param {Omit<Campaign, "id">} campaign - The campaign data to create (excluding the ID).
   * @returns {Promise<ServiceResponse<Campaign>>} A promise that resolves to a ServiceResponse containing the created campaign.
   */
  create: async (
    campaign: Omit<Campaign, "id">,
  ): Promise<ServiceResponse<Campaign>> => {
    try {
      const validatedData = campaignSchema.parse(campaign);
      const newCampaign = await db.addCampaign(validatedData);
      await syncCampaignServiceKeywords(validatedData.keywords);
      return { success: true, data: newCampaign };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          success: false,
          errorMessage: "Validation failed",
          statusCode: STATUS_CODE.BAD_REQUEST,
          validationErrors: treeifyError(error),
        };
      }

      const errorMessage =
        error instanceof Error ? error.message : "Failed to create campaign";

      if (errorMessage.includes("Insufficient funds")) {
        return {
          success: false,
          errorMessage,
          statusCode: STATUS_CODE.PAYMENT_REQUIRED,
        };
      }

      return {
        success: false,
        errorMessage,
        statusCode: STATUS_CODE.INTERNAL_SERVER_ERROR,
      };
    }
  },

  /**
   * Updates an existing campaign.
   * Validates the partial campaign data, checks for sufficient funds if the fund is being increased, and updates the campaign in the database.
   * Also syncs any new keywords found in the update data.
   * @param {string} id - The ID of the campaign to update.
   * @param {Partial<Campaign>} data - The partial campaign data to update.
   * @returns {Promise<ServiceResponse<Campaign>>} A promise that resolves to a ServiceResponse containing the updated campaign.
   */
  update: async (
    id: string,
    data: Partial<Campaign>,
  ): Promise<ServiceResponse<Campaign>> => {
    try {
      const validatedData = campaignBaseSchema.partial().parse(data);
      const updatedCampaign = await db.updateCampaign(id, validatedData);
      await syncCampaignServiceKeywords(validatedData.keywords);
      return { success: true, data: updatedCampaign };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          success: false,
          errorMessage: "Validation failed",
          statusCode: STATUS_CODE.BAD_REQUEST,
          validationErrors: treeifyError(error),
        };
      }

      const errorMessage =
        error instanceof Error ? error.message : "Failed to update campaign";

      if (errorMessage.includes("Insufficient funds")) {
        return {
          success: false,
          errorMessage,
          statusCode: STATUS_CODE.PAYMENT_REQUIRED,
        };
      }

      if (errorMessage.includes("not found")) {
        return {
          success: false,
          errorMessage,
          statusCode: STATUS_CODE.NOT_FOUND,
        };
      }

      return {
        success: false,
        errorMessage,
        statusCode: STATUS_CODE.INTERNAL_SERVER_ERROR,
      };
    }
  },

  /**
   * Deletes a campaign by its ID.
   * @param {string} id - The ID of the campaign to delete.
   * @returns {Promise<ServiceResponse<void>>} A promise that resolves to a ServiceResponse indicating success or failure.
   */
  delete: async (id: string): Promise<ServiceResponse<void>> => {
    try {
      await db.deleteCampaign(id);
      return { success: true, data: undefined };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to delete campaign";

      if (errorMessage.includes("not found")) {
        return {
          success: false,
          errorMessage,
          statusCode: STATUS_CODE.NOT_FOUND,
        };
      }

      return {
        success: false,
        errorMessage,
        statusCode: STATUS_CODE.INTERNAL_SERVER_ERROR,
      };
    }
  },

  /**
   * Retrieves the current account balance.
   * @returns {Promise<ServiceResponse<number>>} A promise that resolves to a ServiceResponse containing the account balance.
   */
  getAccountBalance: async (): Promise<ServiceResponse<number>> => {
    try {
      const balance = await db.getAccountBalance();
      return { success: true, data: balance };
    } catch (error) {
      return {
        success: false,
        errorMessage:
          error instanceof Error
            ? error.message
            : "Failed to fetch account balance",
        statusCode: STATUS_CODE.INTERNAL_SERVER_ERROR,
      };
    }
  },

  /**
   * Retrieves the list of available keywords.
   * @returns {Promise<ServiceResponse<string[]>>} A promise that resolves to a ServiceResponse containing an array of available keywords.
   */
  getAvailableKeywords: async (): Promise<ServiceResponse<string[]>> => {
    try {
      const keywords = await db.getAvailableKeywords();
      return { success: true, data: keywords };
    } catch (error) {
      return {
        success: false,
        errorMessage:
          error instanceof Error ? error.message : "Failed to fetch keywords",
        statusCode: STATUS_CODE.INTERNAL_SERVER_ERROR,
      };
    }
  },
};
