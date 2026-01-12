import { useQuery } from "@tanstack/react-query";
import ensureQuerySuccess from "/src/application/utils/ensure-query-success";
import { campaignService } from "/src/application/services/campaign_service/campaign-service";

export const AVAILABLE_KEYWORDS_QUERY_KEY = ["get-available-keywords"];

/**
 * useAvailableKeywordsQuery is a hook that fetches all available keywords.
 * It takes no arguments and returns a query object with a query key of AVAILABLE_KEYWORDS_QUERY_KEY.
 * The query function is campaignService.getAvailableKeywords() and is wrapped in ensureQuerySuccess to handle any errors that may occur during the query.
 * @returns {QueryResult<string[]>} A query object with a query key of AVAILABLE_KEYWORDS_QUERY_KEY.
 */
export const useAvailableKeywordsQuery = () =>
  useQuery({
    queryKey: AVAILABLE_KEYWORDS_QUERY_KEY,
    queryFn: () => ensureQuerySuccess(campaignService.getAvailableKeywords()),
  });
