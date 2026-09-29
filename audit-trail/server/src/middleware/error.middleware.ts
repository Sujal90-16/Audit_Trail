import type {
  ErrorRequestHandler,
  NextFunction,
  Request,
  Response,
} from "express";

import jwt from "jsonwebtoken";

import {
  Prisma,
} from "../generated/prisma/client.js";

export class AppError extends Error {
  statusCode: number;
  details?: unknown;

  constructor(
    message: string,
    statusCode: number,
    details?: unknown
  ) {
    super(message);

    this.name = "AppError";
    this.statusCode = statusCode;
    this.details = details;

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
  console.error(
    "Unhandled error:",
    error
  );

  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      success: false,
      message: error.message,
      ...(error.details !== undefined
        ? {
            details: error.details,
          }
        : {}),
    });

    return;
  }

  if (
    error instanceof
    Prisma.PrismaClientKnownRequestError
  ) {
    switch (error.code) {
      case "P2002":
        res.status(409).json({
          success: false,
          message:
            "A record with the provided value already exists",
        });
        return;

      case "P2025":
        res.status(404).json({
          success: false,
          message:
            "The requested record was not found",
        });
        return;

      default:
        res.status(500).json({
          success: false,
          message:
            "Database operation failed",
        });
        return;
    }
  }

  if (
    error instanceof
    Prisma.PrismaClientValidationError
  ) {
    res.status(500).json({
      success: false,
      message:
        "Database request validation failed",
    });

    return;
  }

  if (
    error instanceof jwt.TokenExpiredError
  ) {
    res.status(401).json({
      success: false,
      message:
        "Authentication token has expired",
    });

    return;
  }

  if (
    error instanceof jwt.JsonWebTokenError
  ) {
    res.status(401).json({
      success: false,
      message:
        "Invalid authentication token",
    });

    return;
  }

  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
};