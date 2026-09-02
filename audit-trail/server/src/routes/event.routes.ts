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

import { requireRole } from "../middleware/role.middleware.js";

const router = Router();

/*
 * Create a new event
 *
 * Only MANAGER and ADMIN can create events.
 */
router.post(
  "/",
  requireAuth,
  requireRole("MANAGER", "ADMIN"),
  (req: AuthenticatedRequest, res, next) => {
    void createEvent(req, res).catch(next);
  }
);

/*
 * Rebuild the CQRS shipment projection.
 *
 * Only MANAGER and ADMIN can rebuild projections.
 */
router.post(
  "/:aggregateId/rebuild",
  requireAuth,
  requireRole("MANAGER", "ADMIN"),
  (req: AuthenticatedRequest, res, next) => {
    void rebuildShipmentProjectionController(
      req,
      res
    ).catch(next);
  }
);

/*
 * Reconstruct the current shipment state
 * by replaying all events.
 *
 * Any authenticated user can access this.
 */
router.get(
  "/:aggregateId/state",
  requireAuth,
  (req: AuthenticatedRequest, res, next) => {
    void getShipmentState(req, res).catch(next);
  }
);

/*
 * Get all events for an aggregate.
 *
 * Any authenticated user can access this.
 */
router.get(
  "/:aggregateId",
  requireAuth,
  (req: AuthenticatedRequest, res, next) => {
    void getEvents(req, res).catch(next);
  }
);

export default router;