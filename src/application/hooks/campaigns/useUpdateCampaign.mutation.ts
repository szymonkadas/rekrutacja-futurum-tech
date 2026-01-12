import { useMutation, useQueryClient } from "@tanstack/react-query";
import ensureQuerySuccess from "/src/application/utils/ensure-query-success";
import { campaignService } from "/src/application/services/campaign_service/campaign-service";
import type { Campaign } from "/src/domain/entities/Campaign";
import { CAMPAIGNS_QUERY_KEY } from "/src/application/hooks/campaigns/useCampaigns";
import { AVAILABLE_KEYWORDS_QUERY_KEY } from "/src/application/hooks/keywords/useAvailableKeywords";
import { ACCOUNT_BALANCE_QUERY_KEY } from "/src/application/hooks/account-balance/useAccountBalance";

/**
 * useUpdateCampaignMutation is a hook that updates a campaign.
 * It takes no arguments and returns a mutation object with a mutation function set to campaignService.update() and is wrapped in ensureQuerySuccess to handle any errors that may occur during the mutation.
 * On success, it invalidates all queries that have a query key of CAMPAIGNS_QUERY_KEY, AVAILABLE_KEYWORDS_QUERY_KEY, and ACCOUNT_BALANCE_QUERY_KEY.
 * @returns {useMutation} with mutationFn set to campaignService.update(), onError set to toast error, and onSuccess set to refetch and invalidate queries.
 */
export const useUpdateCampaignMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Campaign> }) =>
      ensureQuerySuccess(campaignService.update(id, data)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CAMPAIGNS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: AVAILABLE_KEYWORDS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ACCOUNT_BALANCE_QUERY_KEY });
    },
  });
};
