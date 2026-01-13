import {
  type FormEvent,
  startTransition,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  campaignSchema,
  type CampaignFormData,
  type ValidationErrors,
} from "/src/application/schemas/campaignSchema";
import { mapValidationErrors } from "/src/application/utils/schema-errors";
import { useAvailableKeywordsQuery } from "/src/application/hooks/keywords/useAvailableKeywords";
import styles from "./campaignForm.module.css";
import SelectField from "/src/ui/common/form/SelectField/SelectField";
import StatusToggleField from "/src/ui/common/form/StatusToggle/StatusToggle";
import InputField from "/src/ui/common/form/InputField/InputField";
import KeywordsField from "/src/ui/common/form/KeywordsField";

// TODO: allow user to fetch towns from DB & add their own towns
const TOWN_OPTIONS = [
  "Kraków",
  "Warszawa",
  "Wiedeń",
  "Berlin",
  "Gdańsk",
  "Poznań",
];

type CampaignFormProps = {
  mode: "create" | "edit";
  defaultValues: CampaignFormData;
  submitLabel: string;
  description?: string;
  isSubmitting?: boolean;
  serverError?: string | null;
  serverValidationErrors?: ValidationErrors;
  successMessage?: string | null;
  onSubmit: (values: CampaignFormData) => Promise<void>;
};

type CampaignFormState = {
  name: string;
  keywords: string[];
  bidAmount: string;
  campaignFund: string;
  statusOn: boolean;
  town: string;
  radius: string;
};

const toFormState = (values: CampaignFormData): CampaignFormState => ({
  name: values.name ?? "",
  keywords: (values.keywords ?? [])
    .map((keyword) => keyword.trim())
    .filter(Boolean),
  bidAmount: values.bidAmount !== undefined ? String(values.bidAmount) : "",
  campaignFund:
    values.campaignFund !== undefined ? String(values.campaignFund) : "",
  statusOn: values.statusOn,
  town: values.town ?? "",
  radius: values.radius !== undefined ? String(values.radius) : "",
});

const toFormData = (state: CampaignFormState): CampaignFormData => ({
  name: state.name.trim(),
  keywords: state.keywords.map((keyword) => keyword.trim()).filter(Boolean),
  bidAmount: Number(state.bidAmount),
  campaignFund: Number(state.campaignFund),
  statusOn: state.statusOn,
  town: state.town.trim(),
  radius: Number(state.radius),
});

const CampaignForm = ({
  mode,
  defaultValues,
  submitLabel,
  description,
  isSubmitting,
  serverError,
  serverValidationErrors,
  successMessage,
  onSubmit,
}: CampaignFormProps) => {
  const keywordsQuery = useAvailableKeywordsQuery();
  const [formState, setFormState] = useState<CampaignFormState>(() =>
    toFormState(defaultValues),
  );
  const [errors, setErrors] = useState<ValidationErrors>({});

  useEffect(() => {
    startTransition(() => {
      setFormState(toFormState(defaultValues));
      setErrors({});
    });
  }, [defaultValues]);

  useEffect(() => {
    if (
      serverValidationErrors &&
      Object.keys(serverValidationErrors).length > 0
    ) {
      startTransition(() =>
        setErrors((prev) => ({ ...prev, ...serverValidationErrors })),
      );
    }
  }, [serverValidationErrors]);

  const handleChange = <Field extends keyof CampaignFormState>(
    field: Field,
    value: CampaignFormState[Field],
  ) => {
    setFormState((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleKeywordsChange = (keywords: string[]) => {
    handleChange("keywords", keywords);
    setErrors((prev) => ({ ...prev, keywords: undefined }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrors({});

    const payload = toFormData(formState);
    const parsed = campaignSchema.safeParse(payload);

    if (!parsed.success) {
      setErrors(mapValidationErrors(parsed.error));
      return;
    }

    await onSubmit(parsed.data);
  };

  const formLegend = useMemo(
    () => (mode === "create" ? "Create a new campaign" : "Update campaign"),
    [mode],
  );

  return (
    <form className={styles.campaignForm} onSubmit={handleSubmit} noValidate>
      <div className={styles.intro}>
        <p className="eyebrow">{mode === "create" ? "New" : "Editing"}</p>
        <h3>{formLegend}</h3>
        {description && <p className="muted">{description}</p>}
      </div>

      <div className={styles.formGrid}>
        <InputField
          label="Name"
          value={formState.name}
          onChange={(value) => handleChange("name", value)}
          error={errors.name}
          placeholder="Emerald spring push"
          autoComplete="off"
        />

        <StatusToggleField
          label="Status"
          value={formState.statusOn}
          onToggle={() => handleChange("statusOn", !formState.statusOn)}
          error={errors.statusOn}
          disabled={isSubmitting}
        />

        <KeywordsField
          label="Keywords"
          value={formState.keywords}
          suggestions={keywordsQuery.data ?? []}
          onChange={handleKeywordsChange}
          error={errors.keywords}
          hint="Select keywords from suggestions or add your own custom terms."
          placeholder="Type a keyword and press Enter"
          disabled={isSubmitting}
          isLoading={keywordsQuery.isPending}
        />

        <InputField
          label="Bid amount"
          type="number"
          step="0.01"
          min="0"
          value={formState.bidAmount}
          onChange={(value) => handleChange("bidAmount", value)}
          error={errors.bidAmount}
          placeholder="150"
        />

        <InputField
          label="Campaign fund"
          type="number"
          step="1"
          min="0"
          value={formState.campaignFund}
          onChange={(value) => handleChange("campaignFund", value)}
          error={errors.campaignFund}
          placeholder="2000"
        />

        <SelectField
          label="Town"
          value={formState.town}
          onChange={(value) => handleChange("town", value)}
          options={TOWN_OPTIONS}
          placeholder="Select a town"
          error={errors.town}
        />

        <InputField
          label="Radius (km)"
          type="number"
          min="1"
          step="1"
          value={formState.radius}
          onChange={(value) => handleChange("radius", value)}
          error={errors.radius}
          placeholder="15"
        />
      </div>

      {serverError && (
        <p role="alert" className="status-chip status-chip--error">
          {serverError}
        </p>
      )}

      {successMessage && !serverError && (
        <p className="status-chip status-chip--success">{successMessage}</p>
      )}

      <button
        className={styles.primaryButton}
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Processing..." : submitLabel}
      </button>
    </form>
  );
};

export default CampaignForm;
