import { useAccountBalanceQuery } from "/src/application/hooks/account-balance/useAccountBalance";
import { useCampaignsQuery } from "/src/application/hooks/campaigns/useCampaigns";
import styles from "./balance-panel.module.css";

/**
 * BalancePanel component displaying the Emerald account balance.
 *
 * Fetches and displays the current account balance using React Query.
 * Shows loading state while fetching, error messages if the fetch fails,
 * and the formatted balance when successfully loaded.
 */
const BalancePanel = () => {
  const {
    data: balance,
    isPending: isBalancePending,
    isError: isBalanceError,
    error: balanceError,
  } = useAccountBalanceQuery();

  const {
    data: campaigns,
  } = useCampaignsQuery();

  const maxFunds = Array.isArray(campaigns)
    ? campaigns.reduce((sum, c) => sum + (typeof c.campaignFund === "number" ? c.campaignFund : 0), 0)
    : 0;

  return (
    <div
      className={
        isBalanceError
          ? `${styles.balancePanel} ${styles.balancePanel__error}`
          : styles.balancePanel
      }
      role={isBalanceError ? "alert" : undefined}
      aria-live="polite"
    >
      <p className={styles.balancePanel__label}>Emerald account balance</p>
      <p className={styles.balancePanel__value}>
        {isBalancePending && "Fetching balance..."}
        {isBalanceError &&
          (balanceError instanceof Error
            ? balanceError.message
            : "Unable to fetch balance")}
        {!isBalancePending &&
          !isBalanceError &&
          typeof balance === "number" &&
          formatCurrency(balance)}
        {!isBalancePending &&
          !isBalanceError &&
          typeof balance !== "number" &&
          "--"}
      </p>
      <p className={styles.balancePanel__label}>Already invested funds</p>
      <p className={styles.balancePanel__value}>
        {typeof maxFunds === "number" ? formatCurrency(maxFunds) : "--"}
      </p>
    </div>
  );
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    value,
  );

export default BalancePanel;
