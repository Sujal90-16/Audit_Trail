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

import { asyncHandler } from "../utils/async-handler.js";

import { validate } from "../middleware/validation.middleware.js";

import {
  aggregateIdParamsSchema,
  createEventSchema,
  getEventsQuerySchema,
} from "../validators/event.validator.js";

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
  validate(createEventSchema, "body"),
  asyncHandler<AuthenticatedRequest>(createEvent)
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
  validate(
    aggregateIdParamsSchema,
    "params"
  ),
  asyncHandler<AuthenticatedRequest>(
    rebuildShipmentProjectionController
  )
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
  validate(
    aggregateIdParamsSchema,
    "params"
  ),
  asyncHandler<AuthenticatedRequest>(
    getShipmentState
  )
);

/*
 * Get all events for an aggregate.
 *
 * Any authenticated user can access this.
 */
router.get(
  "/:aggregateId",
  requireAuth,
  validate(
    aggregateIdParamsSchema,
    "params"
  ),
  validate(
    getEventsQuerySchema,
    "query"
  ),
  asyncHandler<AuthenticatedRequest>(
    getEvents
  )
);

export default router;