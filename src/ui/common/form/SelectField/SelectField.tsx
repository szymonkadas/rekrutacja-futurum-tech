import FormField from "../FormField/FormField";
import styles from "./SelectField.module.css";

type SelectFieldProps = {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
};

const SelectField = ({
  label,
  value,
  options,
  onChange,
  placeholder,
  error,
  disabled,
}: SelectFieldProps) => {
  const controlClassName = error
    ? `${styles.control} ${styles.controlError}`
    : styles.control;

  return (
    <FormField label={label} error={error}>
      <select
        className={controlClassName}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
      >
        <option value="">{placeholder ?? "Select"}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </FormField>
  );
};

export default SelectField;
