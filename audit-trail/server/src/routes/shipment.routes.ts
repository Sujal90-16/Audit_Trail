import { Router } from "express";

import {
  getAllShipments,
  getShipmentById,
  getShipmentStats,
} from "../controllers/shipment.controller.js";

import { requireAuth } from "../middleware/auth.middleware.js";

import { asyncHandler } from "../utils/async-handler.js";

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
  asyncHandler(getAllShipments)
);

// Get one shipment by aggregate ID
router.get(
  "/:aggregateId",
  requireAuth,
  asyncHandler(getShipmentById)
);

export default router;