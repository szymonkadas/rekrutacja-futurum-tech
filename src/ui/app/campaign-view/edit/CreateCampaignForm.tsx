import { useEffect, useState, startTransition } from "react";
import type { Campaign } from "/src/domain/entities/Campaign";
import CampaignForm from "../common/campaign-form/campaign-form";
import type {
  CampaignFormData,
  ValidationErrors,
} from "/src/application/schemas/campaignSchema";
import { mapValidationErrors } from "/src/application/utils/schema-errors";
import type { ServiceError } from "/src/application/types/ServiceError";
import { useUpdateCampaignMutation } from "/src/application/hooks/campaigns/useUpdateCampaign.mutation";

type EditCampaignFormProps = {
  campaign: Campaign;
  initialValues?: CampaignFormData;
  onDraftChange?: (values: CampaignFormData) => void;
};

const toFormData = (campaign: Campaign): CampaignFormData => ({
  name: campaign.name,
  keywords: campaign.keywords,
  bidAmount: campaign.bidAmount,
  campaignFund: campaign.campaignFund,
  statusOn: campaign.statusOn,
  town: campaign.town,
  radius: campaign.radius,
});

const EditCampaignForm = ({
  campaign,
  initialValues,
  onDraftChange,
}: EditCampaignFormProps) => {
  const mutation = useUpdateCampaignMutation();
  const [serverError, setServerError] = useState<string | null>(null);
  const [serverValidationErrors, setServerValidationErrors] =
    useState<ValidationErrors>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    startTransition(() => {
      setServerError(null);
      setServerValidationErrors({});
      setSuccessMessage(null);
    });
  }, [campaign.id]);

  const handleSubmit = async (values: CampaignFormData) => {
    setServerError(null);
    setServerValidationErrors({});
    setSuccessMessage(null);

    try {
      await mutation.mutateAsync({ id: campaign.id, data: values });
      setSuccessMessage("Campaign updated");
    } catch (error) {
      if (isServiceError(error) && error.validationErrors) {
        setServerValidationErrors(mapValidationErrors(error.validationErrors));
        return;
      }

      setServerError(
        error instanceof Error ? error.message : "Unable to update campaign",
      );
    }
  };

  return (
    <CampaignForm
      mode="edit"
      defaultValues={initialValues ?? toFormData(campaign)}
      submitLabel="Save changes"
      description={`Updating ${campaign.name}`}
      isSubmitting={mutation.isPending}
      onSubmit={handleSubmit}
      serverError={serverError}
      serverValidationErrors={serverValidationErrors}
      successMessage={successMessage}
      onDraftChange={onDraftChange}
    />
  );
};

const isServiceError = (error: unknown): error is ServiceError => {
  return error instanceof Error && "validationErrors" in error;
};

export default EditCampaignForm;
