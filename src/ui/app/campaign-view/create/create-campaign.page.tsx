import CampaignViewPageTemplate from "../common/campaign-page/campaign-page-template";
import { buildCampaignFormTabs } from "/src/ui/app/campaign-view/common/utils/build-campaign-form-tabs";
import CreateCampaignForm from "/src/ui/app/campaign-view/create/create-campaign-form";

type CreateCampaignPageProps = {
  showTabs?: boolean;
};

const CreateCampaignPage = ({ showTabs = true }: CreateCampaignPageProps) => {
  return (
    <CampaignViewPageTemplate
      title="Create campaign"
      description="Launch a tailored promotion with granular control over bids and reach."
      tabs={showTabs ? buildCampaignFormTabs("create") : undefined}
    >
      <CreateCampaignForm />
    </CampaignViewPageTemplate>
  );
};

export default CreateCampaignPage;
