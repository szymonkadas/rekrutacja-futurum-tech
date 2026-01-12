import type { Campaign } from "/src/domain/entities/Campaign";
import { sanitizeKeyword } from "/src/infrastructure/database_functions";
import initialKeywords from "/src/infrastructure/database_keywords";

/**
 * In-memory storage for campaigns.
 * Acts as a mock database table for campaigns.
 */
const campaignsStore: Campaign[] = [
  {
    id: "1",
    name: "Summer Sale",
    keywords: ["fashion", "sport"],
    bidAmount: 150,
    campaignFund: 2000,
    statusOn: true,
    town: "Kraków",
    radius: 15,
  },
  {
    id: "2",
    name: "Tech Launch",
    keywords: ["tech", "food"],
    bidAmount: 200,
    campaignFund: 3000,
    statusOn: false,
    town: "Wiedeń",
    radius: 10,
  },
];

export default campaignsStore;

/**
 * Initial balance for the Emerald account. We're not deducting initial campaigns funds for simplicity
 */
const emeraldAccountDefaultBalance = 10_000;

/**
 * Mutable storage for the account balance.
 * Allows the balance to be updated across the application.
 */
export const accountStore = {
  balance: emeraldAccountDefaultBalance,
};

/**
 * A Set used for efficient, case-insensitive keyword lookups.
 * Ensures uniqueness of keywords in the availableKeywords list.
 */
export const keywordLookup = new Set<string>();

/**
 * List of available keywords for campaigns.
 * Initialized from a static list and sanitized/deduplicated.
 * Populates keywordLookup during initialization.
 */
export const availableKeywords = initialKeywords
  .map(sanitizeKeyword)
  .filter(Boolean)
  .filter((keyword) => {
    const lowered = keyword.toLowerCase();
    if (keywordLookup.has(lowered)) {
      return false;
    }

    keywordLookup.add(lowered);
    return true;
  });
