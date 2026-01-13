import { useQuery } from "@tanstack/react-query";
import { campaignService } from "/src/application/services/campaign_service/campaign-service";
import ensureQuerySuccess from "/src/application/utils/ensure-query-success";
import type { Campaign } from "/src/domain/entities/Campaign";

export const CAMPAIGN_QUERY_KEY = (id?: string) => [
  "get-campaign",
  id ?? "first",
];

/**
 * useCampaignQuery fetches a single campaign.
 * If `id` is provided it will attempt to return that campaign, otherwise
 * it will return the first campaign from the list.
 */
export const useCampaignQuery = (id?: string) =>
  useQuery<Campaign | null | undefined, Error>({
    queryKey: CAMPAIGN_QUERY_KEY(id),
    queryFn: async () => {
      if (id) {
        return ensureQuerySuccess(campaignService.getCampaignById(id));
      }

      const all = await ensureQuerySuccess(campaignService.getAll());
      if(all.length === 0) {
        return null;
      }
      return all?.[0];
    },
  });

export default useCampaignQuery;
