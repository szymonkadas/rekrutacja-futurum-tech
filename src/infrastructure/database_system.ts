import type { Campaign } from "/src/domain/entities/Campaign";
import campaigns, {
  availableKeywords,
} from "/src/infrastructure/database_data";
import { accountStore } from "/src/infrastructure/database_data";
import { registerKeyword } from "/src/infrastructure/database_functions";

/**
 * Database system simulation.
 * Provides methods to interact with the mock database for campaigns, account balance, and keywords.
 */
export const db = {
  /**
   * Retrieves all campaigns from the database.
   * @returns {Promise<Campaign[]>} A promise that resolves to an array of all campaigns.
   */
  getCampaigns: async (): Promise<Campaign[]> => {
    // Sim async DB fetch with delay
    return new Promise((resolve) =>
      setTimeout(() => resolve([...campaigns]), 300),
    );
  },

  /**
   * Adds a new campaign to the database.
   * Deducts the campaign fund from the account balance.
   * @param {Omit<Campaign, "id">} campaign - The campaign data to add (without ID).
   * @returns {Promise<Campaign>} A promise that resolves to the created campaign with a generated ID.
   * @throws {Error} If there are insufficient funds in the account.
   */
  addCampaign: async (campaign: Omit<Campaign, "id">): Promise<Campaign> => {
    return new Promise((resolve, reject) => {
      if (campaign.campaignFund > accountStore.balance) {
        reject(new Error("Insufficient funds in Emerald Account"));
        return;
      }

      accountStore.balance -= campaign.campaignFund;

      const newCampaign = { ...campaign, id: crypto.randomUUID() };
      campaigns.push(newCampaign);
      setTimeout(() => resolve(newCampaign), 300);
    });
  },

  /**
   * Updates an existing campaign in the database.
   * Adjusts the account balance based on the difference in campaign funds.
   * @param {string} id - The ID of the campaign to update.
   * @param {Partial<Campaign>} updatedData - The partial data to update the campaign with.
   * @returns {Promise<Campaign>} A promise that resolves to the updated campaign.
   * @throws {Error} If the campaign is not found or if there are insufficient funds for the update.
   */
  updateCampaign: async (
    id: string,
    updatedData: Partial<Campaign>,
  ): Promise<Campaign> => {
    return new Promise((resolve, reject) => {
      const index = campaigns.findIndex((c) => c.id === id);
      if (index === -1) {
        reject(new Error("Campaign not found"));
        return;
      }

      const currentCampaign = campaigns[index];
      const nextCampaignFund =
        updatedData.campaignFund !== undefined
          ? updatedData.campaignFund
          : currentCampaign.campaignFund;

      const fundDelta = nextCampaignFund - currentCampaign.campaignFund;

      if (fundDelta > 0 && fundDelta > accountStore.balance) {
        reject(new Error("Insufficient funds in Emerald Account"));
        return;
      }

      accountStore.balance -= fundDelta;

      campaigns[index] = {
        ...currentCampaign,
        ...updatedData,
        campaignFund: nextCampaignFund,
      };
      setTimeout(() => resolve(campaigns[index]), 300);
    });
  },

  /**
   * Deletes a campaign from the database by its ID.
   * @param {string} id - The ID of the campaign to delete.
   * @returns {Promise<void>} A promise that resolves when the campaign is deleted.
   */
  deleteCampaign: async (id: string): Promise<void> => {
    return new Promise((resolve) => {
      const index = campaigns.findIndex((c) => c.id === id);
      if (index !== -1) {
        campaigns.splice(index, 1);
      }
      setTimeout(() => resolve(), 300);
    });
  },

  /**
   * Retrieves the current account balance.
   * @returns {number} The current balance of the account.
   */
  getAccountBalance: () => accountStore.balance,

  /**
   * Retrieves the list of available keywords from the database.
   * @returns {Promise<string[]>} A promise that resolves to an array of available keywords.
   */
  getAvailableKeywords: async (): Promise<string[]> => {
    return new Promise((resolve) =>
      setTimeout(() => resolve([...availableKeywords]), 150),
    );
  },

  /**
   * Upserts a list of keywords into the database.
   * Registers new keywords if they don't already exist.
   * @param {string[]} keywords - The list of keywords to upsert.
   * @returns {Promise<string[]>} A promise that resolves to the updated list of available keywords.
   */
  upsertKeywords: async (keywords: string[]): Promise<string[]> => {
    return new Promise((resolve) => {
      keywords.forEach(registerKeyword);
      setTimeout(() => resolve([...availableKeywords]), 150);
    });
  },
};
