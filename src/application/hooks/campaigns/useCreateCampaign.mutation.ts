import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { CAMPAIGNS_QUERY_KEY } from "/src/application/hooks/campaigns/useCampaigns";
import { AVAILABLE_KEYWORDS_QUERY_KEY } from "/src/application/hooks/keywords/useAvailableKeywords";
import { campaignService } from "/src/application/services/campaign_service/campaign-service";
import { buildBalanceChangeMessage, snapshotAccountBalance } from "/src/application/utils/account-balance-change";
import ensureQuerySuccess from "/src/application/utils/ensure-query-success";
import type { Campaign } from "/src/domain/entities/Campaign";

/**
 * useCreateCampaignMutation is a hook that creates a new campaign.
 * It takes a campaign object argument and returns a mutation object with a mutation function set to campaignService.create() and is wrapped in ensureQuerySuccess to handle any errors that may occur during the mutation.
 * On success, it invalidates all queries that have a query key of CAMPAIGNS_QUERY_KEY, AVAILABLE_KEYWORDS_QUERY_KEY, and ACCOUNT_BALANCE_QUERY_KEY.
 * @returns {useMutation} with mutationFn set to campaignService.create(), onError set to toast error, and onSuccess set to refetch and invalidate queries.
 */
type CreateCampaignContext = {
  previousBalance?: number;
};

export const useCreateCampaignMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<
    Campaign,
    Error,
    Omit<Campaign, "id">,
    CreateCampaignContext
  >({
    mutationFn: (campaign) =>
      ensureQuerySuccess(campaignService.create(campaign)),
    onMutate: async () => {
      const previousBalance = await snapshotAccountBalance(queryClient);
      return { previousBalance };
    },
    onSuccess: async (_campaign, _variables, context) => {
      const balanceMessage = await buildBalanceChangeMessage(
        queryClient,
        context?.previousBalance,
      );

      toast.success(
        ["Campaign created successfully.", balanceMessage]
          .filter(Boolean)
          .join(" "),
      );

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: CAMPAIGNS_QUERY_KEY }),
        queryClient.invalidateQueries({
          queryKey: AVAILABLE_KEYWORDS_QUERY_KEY,
        }),
      ]);
    },
    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to create the campaign.",
      );
    },
  });
};
