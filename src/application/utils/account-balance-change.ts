import type { QueryClient } from "@tanstack/react-query";
import { campaignService } from "/src/application/services/campaign_service/campaign-service";
import { ACCOUNT_BALANCE_QUERY_KEY } from "/src/application/hooks/account-balance/useAccountBalance";
import ensureQuerySuccess from "/src/application/utils/ensure-query-success";
import formatCurrency from "/src/application/utils/format-currency";

const BALANCE_FALLBACK_MESSAGE =
  "Unable to fetch the latest Emerald balance.";

export const snapshotAccountBalance = async (
  queryClient: QueryClient,
): Promise<number> => {
  const cachedBalance = queryClient.getQueryData<number>(
    ACCOUNT_BALANCE_QUERY_KEY,
  );

  if (typeof cachedBalance === "number") {
    return cachedBalance;
  }

  const latestBalance = await ensureQuerySuccess(
    campaignService.getAccountBalance(),
  );

  queryClient.setQueryData(ACCOUNT_BALANCE_QUERY_KEY, latestBalance);
  return latestBalance;
};

export const buildBalanceChangeMessage = async (
  queryClient: QueryClient,
  previousBalance?: number,
): Promise<string> => {
  if (typeof previousBalance !== "number") {
    return BALANCE_FALLBACK_MESSAGE;
  }

  try {
    const nextBalance = await ensureQuerySuccess(
      campaignService.getAccountBalance(),
    );
    queryClient.setQueryData(ACCOUNT_BALANCE_QUERY_KEY, nextBalance);

    const delta = nextBalance - previousBalance;
    const formattedBalance = formatCurrency(nextBalance);

    if (delta === 0) {
      return `Emerald balance stayed the same (current: ${formattedBalance}).`;
    }

    const direction = delta > 0 ? "increased" : "decreased";
    const formattedDelta = formatCurrency(Math.abs(delta));
    return `Emerald balance ${direction} by ${formattedDelta} (current: ${formattedBalance}).`;
  } catch (error) {
    console.error("Failed to refresh Emerald balance", error);
    return BALANCE_FALLBACK_MESSAGE;
  }
};
