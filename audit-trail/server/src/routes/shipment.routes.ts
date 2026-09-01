import { Router } from "express";

import { getShipmentById } from "../controllers/shipment.controller.js";

import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();

router.get(
  "/:aggregateId",
  requireAuth,
  (req, res, next) => {
    void getShipmentById(req, res).catch(next);
  }
);

export default router;