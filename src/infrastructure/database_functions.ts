import {
  availableKeywords,
  keywordLookup,
} from "/src/infrastructure/database_data";

export const sanitizeKeyword = (keyword: string) => keyword.trim();

export const registerKeyword = (keyword: string) => {
  const normalized = sanitizeKeyword(keyword);
  if (!normalized) {
    return;
  }

  const lowered = normalized.toLowerCase();
  if (keywordLookup.has(lowered)) {
    return;
  }

  keywordLookup.add(lowered);
  availableKeywords.push(normalized);
};
