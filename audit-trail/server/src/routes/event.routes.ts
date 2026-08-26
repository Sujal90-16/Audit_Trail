import { Router } from "express";

import {
  createEvent,
  getEvents,
} from "../controllers/event.controller";

import {
  requireAuth,
  type AuthenticatedRequest,
} from "../middleware/auth.middleware";

const router = Router();

// Create a new event
router.post(
  "/",
  requireAuth,
  (req: AuthenticatedRequest, res, next) => {
    void createEvent(req, res).catch(next);
  }
);

// Get all events for an aggregate
router.get(
  "/:aggregateId",
  requireAuth,
  (req: AuthenticatedRequest, res, next) => {
    void getEvents(req, res).catch(next);
  }
);

export default router;