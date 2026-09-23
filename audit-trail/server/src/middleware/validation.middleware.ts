import type {
  NextFunction,
  Request,
  Response,
} from "express";

import type { ZodType } from "zod";

import { AppError } from "./error.middleware.js";

export type ValidationTarget =
  | "body"
  | "query"
  | "params";

export const validate = (
  schema: ZodType,
  target: ValidationTarget
) => {
  return (
    req: Request,
    _res: Response,
    next: NextFunction
  ): void => {
    const result = schema.safeParse(
      req[target]
    );

    if (!result.success) {
      const errors =
        result.error.issues.map(
          (issue) => ({
            field: issue.path.join("."),
            message: issue.message,
          })
        );

      throw new AppError(
        "Validation failed",
        400,
        errors
      );
    }

    if (target === "body") {
      req.body = result.data;
    }

    if (target === "query") {
      Object.assign(
        req.query,
        result.data
      );
    }

    if (target === "params") {
      Object.assign(
        req.params,
        result.data
      );
    }

    next();
  };
};