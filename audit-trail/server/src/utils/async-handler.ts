import type {
  NextFunction,
  Request,
  RequestHandler,
  Response,
} from "express";

export const asyncHandler = <
  TRequest extends Request = Request
>(
  handler: (
    req: TRequest,
    res: Response,
    next: NextFunction
  ) => Promise<unknown>
): RequestHandler => {
  return (
    req: Request,
    res: Response,
    next: NextFunction
  ): void => {
    void handler(
      req as TRequest,
      res,
      next
    ).catch(next);
  };
};