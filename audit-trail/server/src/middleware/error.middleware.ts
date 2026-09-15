import type {
  ErrorRequestHandler,
  NextFunction,
  Request,
  Response,
} from "express";

export class AppError extends Error {
  statusCode: number;

  constructor(
    message: string,
    statusCode: number
  ) {
    super(message);

    this.name = "AppError";
    this.statusCode = statusCode;

    Object.setPrototypeOf(
      this,
      new.target.prototype
    );
  }
}

export const errorMiddleware: ErrorRequestHandler = (
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error("Unhandled error:", error);

  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      success: false,
      message: error.message,
    });
    return;
  }

  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
};