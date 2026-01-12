import { z } from "zod";

export type TreeifiedError<T = unknown> = z.ZodFormattedError<T, string>;

// We'll see how it'll work, for now it's just a simple wrapper around zod's format method, we'll maybe use not deprecated treeifyError from zod in future
export const treeifyError = <T>(error: z.ZodError<T>): TreeifiedError<T> => {
  return error.format();
};
