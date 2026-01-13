import type { TabDefinition } from "../types/TabDefinition";

/**
 * Builds an array of TabDefinition objects for the campaign form tabs.
 * The active param determines which tab is marked as active.
 * @param {string} active - The active tab, either "create" or "edit"
 * @returns {TabDefinition[]} An array of TabDefinition objects
 */
export const buildCampaignFormTabs = (
  active: "create" | "edit",
): TabDefinition[] => [
  {
    id: "create",
    label: "Create",
    to: "/create",
    isActive: active === "create",
  },
  {
    id: "edit",
    label: "Edit",
    to: "/edit",
    isActive: active === "edit",
  },
];
