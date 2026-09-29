import type {
  NextFunction,
  Request,
  Response,
} from "express";

import jwt from "jsonwebtoken";

export type UserRole =
  | "USER"
  | "MANAGER"
  | "ADMIN";

interface AuthPayload {
  userId: string;
  role: UserRole;
}

export interface AuthenticatedRequest
  extends Request {
  user?: AuthPayload;
}

const isUserRole = (
  value: unknown
): value is UserRole => {
  return (
    value === "USER" ||
    value === "MANAGER" ||
    value === "ADMIN"
  );
};

const isValidAuthPayload = (
  payload: unknown
): payload is AuthPayload => {
  if (
    typeof payload !== "object" ||
    payload === null
  ) {
    return false;
  }

  const candidate = payload as Record<
    string,
    unknown
  >;

  return (
    typeof candidate.userId === "string" &&
    candidate.userId.trim().length > 0 &&
    isUserRole(candidate.role)
  );
};

export const requireAuth = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader =
      req.headers.authorization;

    if (
      !authHeader ||
      !authHeader.startsWith("Bearer ")
    ) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });
      return;
    }

    const token = authHeader
      .slice("Bearer ".length)
      .trim();

    if (!token) {
      res.status(401).json({
        success: false,
        message:
          "Authentication token is missing",
      });
      return;
    }

    const secret = process.env.JWT_SECRET;

    if (!secret) {
      console.error(
        "JWT_SECRET is not configured"
      );

      res.status(500).json({
        success: false,
        message:
          "Server configuration error",
      });
      return;
    }

    const decoded = jwt.verify(
      token,
      secret,
      {
        algorithms: ["HS256"],
      }
    );

    if (!isValidAuthPayload(decoded)) {
      res.status(401).json({
        success: false,
        message:
          "Invalid authentication token",
      });
      return;
    }

    req.user = {
      userId: decoded.userId,
      role: decoded.role,
    };

    next();
  } catch (error) {
    console.error(
      "Authentication error:",
      error
    );

    if (
      error instanceof
      jwt.TokenExpiredError
    ) {
      res.status(401).json({
        success: false,
        message:
          "Authentication token has expired",
      });
      return;
    }

    if (
      error instanceof
      jwt.JsonWebTokenError
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
      message:
        "Authentication service error",
    });
  }
};