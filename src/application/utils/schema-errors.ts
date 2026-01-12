import z from "zod";
import type {
  CampaignFormData,
  ValidationErrors,
} from "/src/application/schemas/campaignSchema";
import {
  treeifyError,
  type TreeifiedError,
} from "/src/application/utils/treeify-error";
type ValidationErrorSource<T> =
  | z.ZodError<T>
  | TreeifiedError<T>
  | null
  | undefined;

// It's kinda generic, we could use it for other schemas too with T extends CFD | other schemas
/**
 * Maps Zod validation errors to a flat object where keys are field names
 * and values are the first error message for that field.
 *
 * This simplifies error handling in the UI by providing a direct lookup:
 * errors['fieldName'] -> "Error message"
 */
export const mapValidationErrors = <T extends CampaignFormData>(
  source: ValidationErrorSource<T>,
): ValidationErrors => {
  if (!source) {
    return {};
  }

  const fieldErrors =
    source instanceof z.ZodError ? treeifyError(source) : source;
  const mappedErrors: ValidationErrors = {};

  /**
   * Sets the first error message for a given path to the first message found
   * in the array of maybeMessages. If maybeMessages is not an array or
   * if the array does not contain any strings, the function does nothing.
   *
   * @param path - The path for which the first error message is to be set.
   * @param maybeMessages - The array of messages from which the first error message
   * is to be found.
   */
  const setFirstMessage = (path: string, maybeMessages: unknown): void => {
    if (!path || !Array.isArray(maybeMessages)) {
      return;
    }

    const firstMessage = maybeMessages.find(
      (message): message is string => typeof message === "string",
    );
    if (firstMessage) {
      mappedErrors[path] = firstMessage;
    }
  };

  /**
   * Recursively walks a nested object or array and sets the first error message
   * for each path to the first message found in the array of maybeMessages.
   * If maybeMessages is not an array or if the array does not contain any strings,
   * the function does nothing.
   *
   * @param node - The node to be walked, which can be an object or an array.
   * @param currentPath - The current path being processed.
   */
  const walkErrors = (node: unknown, currentPath: string): void => {
    if (Array.isArray(node)) {
      setFirstMessage(currentPath, node);
      return;
    }

    if (node && typeof node === "object") {
      const record = node as { _errors?: unknown; [key: string]: unknown };

      setFirstMessage(currentPath, record._errors);

      for (const [key, value] of Object.entries(record)) {
        if (key === "_errors") {
          continue;
        }

        const nextPath = currentPath
          ? /^\d+$/.test(key)
            ? `${currentPath}[${key}]`
            : `${currentPath}.${key}`
          : key;

        walkErrors(value, nextPath);
      }
    }
  };

  walkErrors(fieldErrors, "");

  return mappedErrors;
};

/**
 * Utility to get the CSS class for a form field based on its error state.
 * This fulfills the requirement to "color components with the appropriate class".
 *
 * @param fieldName - The name of the field (key in errors object)
 * @param errors - The object containing validation errors
 * @param baseClass - The base CSS class for the input (default: 'form-control')
 * @param errorClass - The CSS class to add on error (default: 'is-invalid')
 */
export const getFieldClass = (
  fieldName: string,
  errors: ValidationErrors,
  baseClass = "field-control",
  errorClass = "field-control--error",
): string => {
  return errors[fieldName] ? `${baseClass} ${errorClass}` : baseClass;
};
