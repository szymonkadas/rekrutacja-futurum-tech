import { useMutation, useQueryClient } from "@tanstack/react-query";
import ensureQuerySuccess from "/src/application/utils/ensure-query-success";
import type { Campaign } from "/src/domain/entities/Campaign";
import { campaignService } from "/src/application/services/campaign_service/campaign-service";
import { CAMPAIGNS_QUERY_KEY } from "/src/application/hooks/campaigns/useCampaigns";
import { ACCOUNT_BALANCE_QUERY_KEY } from "/src/application/hooks/account-balance/useAccountBalance";
import { AVAILABLE_KEYWORDS_QUERY_KEY } from "/src/application/hooks/keywords/useAvailableKeywords";

/**
 * useCreateCampaignMutation is a hook that creates a new campaign.
 * It takes a campaign object argument and returns a mutation object with a mutation function set to campaignService.create() and is wrapped in ensureQuerySuccess to handle any errors that may occur during the mutation.
 * On success, it invalidates all queries that have a query key of CAMPAIGNS_QUERY_KEY, AVAILABLE_KEYWORDS_QUERY_KEY, and ACCOUNT_BALANCE_QUERY_KEY.
 * @returns {useMutation} with mutationFn set to campaignService.create(), onError set to toast error, and onSuccess set to refetch and invalidate queries.
 */
export const useCreateCampaignMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (campaign: Omit<Campaign, "id">) =>
      ensureQuerySuccess(campaignService.create(campaign)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CAMPAIGNS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: AVAILABLE_KEYWORDS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ACCOUNT_BALANCE_QUERY_KEY });
    },
  });
};
