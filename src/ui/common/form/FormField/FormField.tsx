import { type ReactNode } from "react";

import styles from "./FormField.module.css";

type FormFieldProps = {
  label: string;
  children: ReactNode;
  error?: string;
  hint?: string;
  className?: string;
  htmlFor?: string;
};

const FormField = ({
  label,
  children,
  error,
  hint,
  className,
  htmlFor,
}: FormFieldProps) => {
  const labelClassName = className
    ? `${styles.field} ${className}`
    : styles.field;

  return (
    <label className={labelClassName} htmlFor={htmlFor}>
      <span className={styles.labelText}>{label}</span>
      {children}
      {error && <p className={styles.error}>{error}</p>}
      {hint && <p className={styles.hint}>{hint}</p>}
    </label>
  );
};

export default FormField;
