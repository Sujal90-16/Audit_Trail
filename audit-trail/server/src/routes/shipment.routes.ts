import { Router } from "express";

import {
  getAllShipments,
  getShipmentById,
  getShipmentStats,
} from "../controllers/shipment.controller.js";

import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();

// Get shipment dashboard statistics
router.get(
  "/stats",
  requireAuth,
  (req, res, next) => {
    void getShipmentStats(req, res).catch(next);
  }
);

// Get all shipments with pagination and filtering
router.get(
  "/",
  requireAuth,
  (req, res, next) => {
    void getAllShipments(req, res).catch(next);
  }
);

// Get one shipment by aggregate ID
router.get(
  "/:aggregateId",
  requireAuth,
  (req, res, next) => {
    void getShipmentById(req, res).catch(next);
  }
);

export default router;