import { useLocation } from "react-router-dom";
import CampaignViewPageTemplate from "../common/campaign-page/campaign-page-template";
import { buildCampaignFormTabs } from "/src/ui/app/campaign-view/common/utils/build-campaign-form-tabs";
import CreateCampaignForm from "/src/ui/app/campaign-view/create/create-campaign-form";
import type { CampaignFormData } from "/src/application/schemas/campaignSchema";

type CreateCampaignPageProps = {
  showTabs?: boolean;
  showStandaloneLink?: boolean;
  onOpenStandalone?: () => void;
  initialDraft?: CampaignFormData;
  onDraftChange?: (draft: CampaignFormData) => void;
};

type CreatePageState = {
  draft?: CampaignFormData;
} | null;

const CreateCampaignPage = ({
  showTabs = true,
  showStandaloneLink = false,
  onOpenStandalone,
  initialDraft,
  onDraftChange,
}: CreateCampaignPageProps) => {
  const location = useLocation();
  const locationState = (location.state as CreatePageState) ?? null;
  const resolvedDraft = initialDraft ?? locationState?.draft;
  const headerAction =
    showStandaloneLink && onOpenStandalone
      ? { label: "Open full page", onClick: onOpenStandalone }
      : undefined;

  return (
    <CampaignViewPageTemplate
      title="Create campaign"
      description="Launch a tailored promotion with granular control over bids and reach."
      tabs={showTabs ? buildCampaignFormTabs("create") : undefined}
      headerAction={headerAction}
    >
      <CreateCampaignForm
        initialValues={resolvedDraft}
        onDraftChange={onDraftChange}
      />
    </CampaignViewPageTemplate>
  );
};

export default CreateCampaignPage;
