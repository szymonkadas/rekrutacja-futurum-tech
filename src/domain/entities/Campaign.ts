export const getStatus = (statusOn: boolean): string => {
  return statusOn ? "on" : "off";
};

export interface Campaign {
  id: string;
  name: string; // Mandatory
  keywords: string[]; // Mandatory, pre-populated
  bidAmount: number; // Mandatory, min amount
  campaignFund: number; // Mandatory, deducted from EMERALD account
  statusOn: boolean; // Mandatory
  town: string; // Pre-populated dropdown
  radius: number; // Mandatory in km
}
