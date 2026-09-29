import { Router } from "express";

import {
  getAllShipments,
  getShipmentById,
  getShipmentStats,
} from "../controllers/shipment.controller.js";

import { requireAuth } from "../middleware/auth.middleware.js";

import { asyncHandler } from "../utils/async-handler.js";

import { validate } from "../middleware/validation.middleware.js";

import {
  getShipmentsQuerySchema,
  shipmentAggregateIdParamsSchema,
} from "../validators/shipment.validator.js";

const router = Router();

// Get shipment dashboard statistics
router.get(
  "/stats",
  requireAuth,
  asyncHandler(getShipmentStats)
);

// Get all shipments with pagination and filtering
router.get(
  "/",
  requireAuth,
  validate(
    getShipmentsQuerySchema,
    "query"
  ),
  asyncHandler(getAllShipments)
);

// Get one shipment by aggregate ID
router.get(
  "/:aggregateId",
  requireAuth,
  validate(
    shipmentAggregateIdParamsSchema,
    "params"
  ),
  asyncHandler(getShipmentById)
);

export default router;