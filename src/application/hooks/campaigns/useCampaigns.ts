import { useQuery } from "@tanstack/react-query";
import { campaignService } from "/src/application/services/campaign_service/campaign-service";
import ensureQuerySuccess from "/src/application/utils/ensure-query-success";

export const CAMPAIGNS_QUERY_KEY = ["get-campaigns"];

/**
 * useCampaignsQuery is a hook that fetches all campaigns.
 * It takes no arguments and returns a query object with a query key of CAMPAIGNS_QUERY_KEY.
 * The query function is campaignService.getAll() and is wrapped in ensureQuerySuccess to handle any errors that may occur during the query.
 * @returns {QueryResult<Campaign[]>} A query object with a query key of CAMPAIGNS_QUERY_KEY.
 */
export const useCampaignsQuery = () =>
  useQuery({
    queryKey: CAMPAIGNS_QUERY_KEY,
    queryFn: () => ensureQuerySuccess(campaignService.getAll()),
  });
