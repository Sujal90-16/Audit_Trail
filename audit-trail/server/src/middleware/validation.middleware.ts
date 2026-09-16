import type {
  NextFunction,
  Request,
  Response,
} from "express";

import type { ZodType } from "zod";

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
    res: Response,
    next: NextFunction
  ): void => {
    const result = schema.safeParse(
      req[target]
    );

    if (!result.success) {
      res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: result.error.issues.map(
          (issue) => ({
            field: issue.path.join("."),
            message: issue.message,
          })
        ),
      });
      return;
    }

    if (target === "body") {
      req.body = result.data;
    }

    if (target === "query") {
      Object.assign(req.query, result.data);
    }

    if (target === "params") {
      Object.assign(req.params, result.data);
    }

    next();
  };
};