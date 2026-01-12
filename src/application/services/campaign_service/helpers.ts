import { db } from "/src/infrastructure/database_system";

/**
 * Syncs the given keywords with the database.
 * If no keywords are given or if the array is empty, the function does nothing.
 * @param {string[]} [keywords] - The keywords to be synced with the database.
 */
export const syncCampaignServiceKeywords = async (keywords?: string[]) => {
  if (!keywords || keywords.length === 0) {
    return;
  }

  await db.upsertKeywords(keywords);
};
