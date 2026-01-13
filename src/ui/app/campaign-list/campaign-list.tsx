import { Link } from "react-router-dom";
import type { Campaign } from "/src/domain/entities/Campaign";
import styles from "./campaignList.module.css";

type CampaignListProps = {
  campaigns?: Campaign[];
  isPending: boolean;
  isError: boolean;
  error: unknown;
  selectedCampaignId?: string | null;
  onSelect: (id: string) => void;
};

const CampaignList = ({
  campaigns,
  isPending,
  isError,
  error,
  selectedCampaignId,
  onSelect,
}: CampaignListProps) => {
  if (isPending) {
    return <p className="muted">Loading campaigns…</p>;
  }

  if (isError) {
    return (
      <p role="alert" className="status-chip status-chip--error">
        {error instanceof Error ? error.message : "Unable to load campaigns"}
      </p>
    );
  }

  if (!campaigns?.length) {
    return <p className="muted">No campaigns yet. Start by creating one.</p>;
  }

  return (
    <ul className={styles.campaignList}>
      {campaigns.map((campaign) => (
        <li
          key={campaign.id}
          className={
            selectedCampaignId === campaign.id
              ? `${styles.campaignCard} ${styles.campaignCard_active}`
              : styles.campaignCard
          }
        >
          <div>
            <p className="eyebrow">
              {campaign.town} ({campaign.radius} km radius)
            </p>
            <h2>{campaign.name}</h2>
            <p className={`muted ${styles.keywords}`}>
              {campaign.keywords.map((keyword) => `#${keyword}`).join(" ")}
            </p>
          </div>
          <dl>
            <div>
              <dt>Bid</dt>
              <dd>${campaign.bidAmount.toFixed(2)}</dd>
            </div>
            <div>
              <dt>Fund</dt>
              <dd>${campaign.campaignFund.toFixed(2)}</dd>
            </div>
            <div>
              <dt>Status</dt>
              <dd className={campaign.statusOn ? styles.statusOn : styles.statusOff}>
                {campaign.statusOn ? "Active" : "Paused"}
              </dd>
            </div>
          </dl>
          <div className={styles.cardActions}>
            <button type="button" onClick={() => onSelect(campaign.id)}>
              Edit in form
            </button>
            <Link to={`/edit/${campaign.id}`}>Open page</Link>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default CampaignList;