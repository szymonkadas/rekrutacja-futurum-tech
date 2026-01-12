import type { ServiceResponse } from "src/application/types/ServiceResponse";
import type { ServiceError } from "/src/application/types/ServiceError";

/**
 * Ensures that a promise resolves to a successful service response, or throws an error otherwise.
 * @param {Promise<ServiceResponse<T>>} promise - A promise that resolves to a ServiceResponse.
 * @returns {Promise<T>} - A promise that resolves to the data part of the ServiceResponse if it is successful, or throws an error if it is not.
 */
const ensureQuerySuccess = async <T>(
  promise: Promise<ServiceResponse<T>>,
): Promise<T> => {
  const response = await promise;

  if (response.success) {
    return response.data;
  }

  const error: ServiceError = new Error(response.errorMessage);
  error.statusCode = response.statusCode;
  error.validationErrors = response.validationErrors;
  throw error;
};

export default ensureQuerySuccess;
