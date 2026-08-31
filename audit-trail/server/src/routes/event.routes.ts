import { Router } from "express";

import {
  createEvent,
  getEvents,
  getShipmentState,
  rebuildShipmentProjectionController,
} from "../controllers/event.controller.js";

import {
  requireAuth,
  type AuthenticatedRequest,
} from "../middleware/auth.middleware.js";

const router = Router();

// Create a new event
router.post(
  "/",
  requireAuth,
  (req: AuthenticatedRequest, res, next) => {
    void createEvent(req, res).catch(next);
  }
);

// Rebuild the CQRS shipment projection
router.post(
  "/:aggregateId/rebuild",
  requireAuth,
  (req: AuthenticatedRequest, res, next) => {
    void rebuildShipmentProjectionController(
      req,
      res
    ).catch(next);
  }
);

// Reconstruct current state by replaying all events
router.get(
  "/:aggregateId/state",
  requireAuth,
  (req: AuthenticatedRequest, res, next) => {
    void getShipmentState(req, res).catch(next);
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