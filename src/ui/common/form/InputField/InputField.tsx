import { type ComponentProps } from "react";

import FormField from "../FormField/FormField";
import styles from "./InputField.module.css";

type InputFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  hint?: string;
} & Pick<
  ComponentProps<"input">,
  "type" | "step" | "min" | "placeholder" | "disabled" | "autoComplete"
>;

const InputField = ({
  label,
  value,
  onChange,
  error,
  hint,
  ...inputProps
}: InputFieldProps) => {
  const controlClassName = error
    ? `${styles.control} ${styles.controlError}`
    : styles.control;

  return (
    <FormField label={label} error={error} hint={hint}>
      <input
        {...inputProps}
        className={controlClassName}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </FormField>
  );
};

export default InputField;
