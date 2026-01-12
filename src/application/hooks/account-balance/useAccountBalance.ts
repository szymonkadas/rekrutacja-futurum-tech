import { useQuery } from "@tanstack/react-query";
import ensureQuerySuccess from "/src/application/utils/ensure-query-success";
import { campaignService } from "/src/application/services/campaign_service/campaign-service";

export const ACCOUNT_BALANCE_QUERY_KEY = ["get-account-balance"];

/**
 * useAccountBalanceQuery is a hook that fetches the account balance.
 * It takes no arguments and returns a query object with a query key of ACCOUNT_BALANCE_QUERY_KEY.
 * The query function is campaignService.getAccountBalance() and is wrapped in ensureQuerySuccess to handle any errors that may occur during the query.
 * The hook will invalidate any queries in the cache with the key of ACCOUNT_BALANCE_QUERY_KEY when the query is successful.
 * The hook will also invalidate any queries in the cache with the key of AVAILABLE_KEYWORDS_QUERY_KEY and ACCOUNT_BALANCE_QUERY_KEY when the query is successful.
 * @returns {QueryResult<number>} A query object with a query key of ACCOUNT_BALANCE_QUERY_KEY.
 */
export const useAccountBalanceQuery = () =>
  useQuery({
    queryKey: ACCOUNT_BALANCE_QUERY_KEY,
    queryFn: () => ensureQuerySuccess(campaignService.getAccountBalance()),
  });
