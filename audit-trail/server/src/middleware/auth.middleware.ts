import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export type UserRole = "USER" | "MANAGER" | "ADMIN";

interface AuthPayload {
  userId: string;
  role: UserRole;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthPayload;
}

const isUserRole = (value: unknown): value is UserRole => {
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
    const authHeader = req.headers.authorization;

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
        message: "Authentication token is missing",
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
        message: "Server configuration error",
      });
      return;
    }

    const decoded = jwt.verify(
      token,
      secret
    );

    if (!isValidAuthPayload(decoded)) {
      res.status(401).json({
        success: false,
        message: "Invalid authentication token",
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

    res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

export const requireRole = (
  ...allowedRoles: UserRole[]
) => {
  return (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });
      return;
    }

    if (
      !allowedRoles.includes(req.user.role)
    ) {
      res.status(403).json({
        success: false,
        message:
          "You do not have permission to perform this action",
      });
      return;
    }

    next();
  };
};