import { useMutation, useQueryClient } from "@tanstack/react-query";
import ensureQuerySuccess from "/src/application/utils/ensure-query-success";
import { campaignService } from "/src/application/services/campaign_service/campaign-service";
import { CAMPAIGNS_QUERY_KEY } from "/src/application/hooks/campaigns/useCampaigns";

/**
 * useDeleteCampaignMutation is a hook that deletes a campaign.
 * It takes a string id argument and returns a mutation object with a mutation function set to campaignService.delete() and is wrapped in ensureQuerySuccess to handle any errors that may occur during the mutation.
 * On success, it invalidates all queries that have a query key of CAMPAIGNS_QUERY_KEY.
 * @returns {useMutation} with mutationFn set to campaignService.delete(), onError set to toast error, and onSuccess set to refetch and invalidate queries.
 */
export const useDeleteCampaignMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => ensureQuerySuccess(campaignService.delete(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CAMPAIGNS_QUERY_KEY });
    },
  });
};
