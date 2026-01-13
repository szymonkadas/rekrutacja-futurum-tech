import { Link } from "react-router-dom";
import { useState } from "react";
import type { Campaign } from "/src/domain/entities/Campaign";
import DeleteModal from "/src/ui/common/delete-modal/DeleteModal";
import { routes } from "/src/config/routes";
import { useDeleteCampaignMutation } from "/src/application/hooks/campaigns/useDeleteCampaign.mutation";
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
  const [campaignPendingDeletion, setCampaignPendingDeletion] =
    useState<Campaign | null>(null);
  const {
    mutateAsync: deleteCampaign,
    isPending: isDeleting,
  } = useDeleteCampaignMutation();

  const confirmDeletion = async () => {
    if (!campaignPendingDeletion) {
      return;
    }

    try {
      await deleteCampaign(campaignPendingDeletion.id);
      setCampaignPendingDeletion(null);
    } catch (mutationError) {
      console.error("Failed to delete campaign", mutationError);
    }
  };

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
    <>
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
            <Link to={routes.edit(campaign.id)}>Open page</Link>
            <button
              type="button"
              className={styles.deleteAction}
              onClick={() => setCampaignPendingDeletion(campaign)}
              disabled={isDeleting}
            >
              Delete
            </button>
          </div>
        </li>
      ))}
      </ul>
      <DeleteModal
        isOpen={Boolean(campaignPendingDeletion)}
        title="Delete campaign"
        description={`This will permanently remove "${campaignPendingDeletion?.name ?? "this campaign"}".`}
        confirmLabel="Delete campaign"
        onCancel={() => setCampaignPendingDeletion(null)}
        onConfirm={confirmDeletion}
        isConfirming={isDeleting}
      />
    </>
  );
};

export default CampaignList;