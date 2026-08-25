import { Router } from "express";

import { createEvent } from "../controllers/event.controller";
import {
  requireAuth,
  type AuthenticatedRequest,
} from "../middleware/auth.middleware";

const router = Router();

router.post(
  "/",
  requireAuth,
  (req: AuthenticatedRequest, res, next) => {
    void createEvent(req, res).catch(next);
  }
);

export default router;