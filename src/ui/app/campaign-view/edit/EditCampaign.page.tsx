import type { ReactNode } from "react";
import CampaignViewPageTemplate from "../common/campaign-page/campaign-page-template";
import EditCampaignForm from "/src/ui/app/campaign-view/edit/CreateCampaignForm";
import { buildCampaignFormTabs } from "/src/ui/app/campaign-view/common/utils/build-campaign-form-tabs";
import { useCampaignQuery } from "/src/application/hooks/campaigns/useCampaign";
import { useLocation, useParams } from "react-router-dom";
import type { CampaignFormData } from "/src/application/schemas/campaignSchema";

type EditCampaignPageProps = {
  campaignId?: string;
  showTabs?: boolean;
  showStandaloneLink?: boolean;
  onOpenStandalone?: () => void;
  initialDraft?: CampaignFormData;
  onDraftChange?: (draft: CampaignFormData, campaignId: string) => void;
};

type EditPageState = {
  draft?: CampaignFormData;
  campaignId?: string;
} | null;

const EditCampaignPage = ({
  campaignId: campaignIdProp,
  showTabs = true,
  showStandaloneLink = false,
  onOpenStandalone,
  initialDraft,
  onDraftChange,
}: EditCampaignPageProps) => {
  const params = useParams<{ campaignId?: string }>();
  const campaignId = campaignIdProp ?? params.campaignId;
  const location = useLocation();
  const locationState = (location.state as EditPageState) ?? null;
  const { data: campaign, isPending, isError, error } = useCampaignQuery(campaignId);
  const resolvedDraft =
    initialDraft ??
    (locationState?.campaignId === campaignId ? locationState?.draft : undefined);

  const handleDraftChange = (draft: CampaignFormData) => {
    if (campaign?.id) {
      onDraftChange?.(draft, campaign.id);
    }
  };

  const headerAction =
    showStandaloneLink && onOpenStandalone
      ? {
          label: "Open full page",
          onClick: onOpenStandalone,
          disabled: !campaignId,
        }
      : undefined;

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
    content = (
      <EditCampaignForm
        campaign={campaign}
        initialValues={resolvedDraft}
        onDraftChange={handleDraftChange}
      />
    );
  }

  return (
    <CampaignViewPageTemplate
      title="Edit campaign"
      description="Tune bids, copy, and reach without leaving this workspace."
      tabs={showTabs ? buildCampaignFormTabs("edit") : undefined}
      headerAction={headerAction}
    >
      {content}
    </CampaignViewPageTemplate>
  );
};

export default EditCampaignPage;
