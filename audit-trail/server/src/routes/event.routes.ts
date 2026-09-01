import { Router } from "express";

import {
  createEvent,
  getEvents,
  getShipmentState,
  rebuildShipmentProjectionController,
} from "../controllers/event.controller.js";

import {
  requireAuth,
  requireRole,
  type AuthenticatedRequest,
} from "../middleware/auth.middleware.js";

const router = Router();

// Create a new event
// Only MANAGER and ADMIN can modify the event stream
router.post(
  "/",
  requireAuth,
  requireRole("MANAGER", "ADMIN"),
  (req: AuthenticatedRequest, res, next) => {
    void createEvent(req, res).catch(next);
  }
);

// Rebuild the CQRS shipment projection
// Only ADMIN can rebuild projections
router.post(
  "/:aggregateId/rebuild",
  requireAuth,
  requireRole("ADMIN"),
  (req: AuthenticatedRequest, res, next) => {
    void rebuildShipmentProjectionController(
      req,
      res
    ).catch(next);
  }
);

// Reconstruct current state by replaying all events
// Any authenticated user can view the reconstructed state
router.get(
  "/:aggregateId/state",
  requireAuth,
  (req: AuthenticatedRequest, res, next) => {
    void getShipmentState(req, res).catch(next);
  }
);

// Get all events for an aggregate
// Any authenticated user can view event history
router.get(
  "/:aggregateId",
  requireAuth,
  (req: AuthenticatedRequest, res, next) => {
    void getEvents(req, res).catch(next);
  }
);

export default router;