import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { CAMPAIGNS_QUERY_KEY } from "/src/application/hooks/campaigns/useCampaigns";
import { campaignService } from "/src/application/services/campaign_service/campaign-service";
import {
  buildBalanceChangeMessage,
  snapshotAccountBalance,
} from "/src/application/utils/account-balance-change";
import ensureQuerySuccess from "/src/application/utils/ensure-query-success";

/**
 * useDeleteCampaignMutation is a hook that deletes a campaign.
 * It takes a string id argument and returns a mutation object with a mutation function set to campaignService.delete() and is wrapped in ensureQuerySuccess to handle any errors that may occur during the mutation.
 * On success, it invalidates all queries that have a query key of CAMPAIGNS_QUERY_KEY.
 * @returns {useMutation} with mutationFn set to campaignService.delete(), onError set to toast error, and onSuccess set to refetch and invalidate queries.
 */
type DeleteCampaignContext = {
  previousBalance?: number;
};

export const useDeleteCampaignMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string, DeleteCampaignContext>({
    mutationFn: (id) => ensureQuerySuccess(campaignService.delete(id)),
    onMutate: async () => {
      const previousBalance = await snapshotAccountBalance(queryClient);
      return { previousBalance };
    },
    onSuccess: async (_result, _id, context) => {
      const balanceMessage = await buildBalanceChangeMessage(
        queryClient,
        context?.previousBalance,
      );

      toast.success(
        ["Campaign removed successfully.", balanceMessage]
          .filter(Boolean)
          .join(" "),
      );

      await queryClient.invalidateQueries({ queryKey: CAMPAIGNS_QUERY_KEY });
    },
    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to delete the campaign.",
      );
    },
  });
};
