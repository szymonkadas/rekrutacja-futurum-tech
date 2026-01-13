import type { ReactNode } from "react";
import CampaignViewPageTemplate from "../common/campaign-page/campaign-page-template";
import EditCampaignForm from "/src/ui/app/campaign-view/edit/CreateCampaignForm";
import { buildCampaignFormTabs } from "/src/ui/app/campaign-view/common/utils/build-campaign-form-tabs";
import { useCampaignsQuery } from "/src/application/hooks/campaigns/useCampaigns";

type EditCampaignPageProps = {
  campaignId?: string;
  showTabs?: boolean;
};

const EditCampaignPage = ({
  campaignId,
  showTabs = true,
}: EditCampaignPageProps) => {
  const { data, isPending, isError, error } = useCampaignsQuery();
  const campaign = data?.find((entry) => entry.id === campaignId) ?? data?.[0];

  let content: ReactNode = null;

  if (isPending) {
    content = <p className="muted">Loading campaign…</p>;
  } else if (isError) {
    const message =
      error instanceof Error ? error.message : "Unable to load campaigns";
    content = (
      <p role="alert" className="status-chip status-chip--error">
        {message}
      </p>
    );
  } else if (!campaign) {
    content = <p className="muted">No campaign selected yet.</p>;
  } else {
    content = <EditCampaignForm campaign={campaign} />;
  }

  return (
    <CampaignViewPageTemplate
      title="Edit campaign"
      description="Tune bids, copy, and reach without leaving this workspace."
      tabs={showTabs ? buildCampaignFormTabs("edit") : undefined}
    >
      {content}
    </CampaignViewPageTemplate>
  );
};

export default EditCampaignPage;
