import { Router } from "express";

import {
  getAllShipments,
  getShipmentById,
} from "../controllers/shipment.controller.js";

import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();

// Get all shipment read models
router.get(
  "/",
  requireAuth,
  (req, res, next) => {
    void getAllShipments(req, res).catch(next);
  }
);

// Get one shipment read model by aggregate ID
router.get(
  "/:aggregateId",
  requireAuth,
  (req, res, next) => {
    void getShipmentById(req, res).catch(next);
  }
);

export default router;