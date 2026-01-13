import FormField from "../FormField/FormField";
import styles from "./StatusToggle.module.css";

type StatusToggleFieldProps = {
  label: string;
  value: boolean;
  onToggle: () => void;
  error?: string;
  disabled?: boolean;
};

const StatusToggleField = ({
  label,
  value,
  onToggle,
  error,
  disabled,
}: StatusToggleFieldProps) => {
  return (
    <FormField label={label} error={error} className={styles.field}>
      <button
        type="button"
        className={
          value ? `${styles.toggle} ${styles.toggleOn}` : styles.toggle
        }
        onClick={onToggle}
        aria-pressed={value}
        disabled={disabled}
      >
        <span className={styles.toggleOption}>Off</span>
        <span className={styles.toggleOption}>On</span>
      </button>
    </FormField>
  );
};

export default StatusToggleField;
