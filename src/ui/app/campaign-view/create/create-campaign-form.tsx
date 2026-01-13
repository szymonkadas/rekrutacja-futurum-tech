import { useState } from "react";
import { MIN_BID_AMOUNT } from "/src/domain/constants/MIN_BID_AMOUNT";

import CampaignForm from "../common/campaign-form/campaign-form";
import type {
  CampaignFormData,
  CampaignFormInput,
  ValidationErrors,
} from "/src/application/schemas/campaignSchema";
import { mapValidationErrors } from "/src/application/utils/schema-errors";
import type { ServiceError } from "/src/application/types/ServiceError";
import { useCreateCampaignMutation } from "/src/application/hooks/campaigns/useCreateCampaign.mutation";

const INITIAL_VALUES: CampaignFormData = {
  name: "",
  keywords: [],
  bidAmount: MIN_BID_AMOUNT,
  campaignFund: 0,
  statusOn: true,
  town: "",
  radius: 5,
};

type CreateCampaignFormProps = {
  initialValues?: CampaignFormData;
  onDraftChange?: (values: CampaignFormInput) => void;
};

const CreateCampaignForm = ({
  initialValues,
  onDraftChange,
}: CreateCampaignFormProps) => {
  const mutation = useCreateCampaignMutation();
  const [serverError, setServerError] = useState<string | null>(null);
  const [serverValidationErrors, setServerValidationErrors] =
    useState<ValidationErrors>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [formVersion, setFormVersion] = useState(0);

  const handleSubmit = async (values: CampaignFormData) => {
    setServerError(null);
    setServerValidationErrors({});
    setSuccessMessage(null);

    try {
      await mutation.mutateAsync(values);
      setSuccessMessage("Campaign created successfully");
      setFormVersion((prev) => prev + 1);
    } catch (error) {
      if (isServiceError(error) && error.validationErrors) {
        setServerValidationErrors(mapValidationErrors(error.validationErrors));
        return;
      }

      setServerError(
        error instanceof Error ? error.message : "Unable to create campaign",
      );
    }
  };

  return (
    <CampaignForm
      key={formVersion}
      mode="create"
      defaultValues={initialValues ?? INITIAL_VALUES}
      submitLabel="Create campaign"
      description="Define targeting, budget, and status before activating the campaign."
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

export default CreateCampaignForm;
