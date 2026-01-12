import type { TreeifiedError } from "/src/application/utils/treeify-error";

// We keep treeified error in utils/treeify-error to avoid going back and forth - everything has its limits
export type ServiceError = Error & {
  statusCode?: number;
  validationErrors?: TreeifiedError;
};
