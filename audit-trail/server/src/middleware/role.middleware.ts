import { Router } from "express";

import {
  register,
  login,
} from "../controllers/auth.controller";

import {
  requireAuth,
  type AuthenticatedRequest,
} from "../middleware/auth.middleware";

const router = Router();

// Register
router.post("/register", register);

// Login
router.post("/login", login);

// Get current authenticated user
router.get(
  "/me",
  requireAuth,
  (req: AuthenticatedRequest, res) => {
    res.status(200).json({
      success: true,
      message: "Authenticated user",
      data: {
        userId: req.user?.userId,
        role: req.user?.role,
      },
    });
  }
);

export default router;