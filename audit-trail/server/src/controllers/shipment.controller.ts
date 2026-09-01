import type { Response } from "express";

import type { AuthenticatedRequest } from "../middleware/auth.middleware.js";

import { prisma } from "../config/prisma.js";

export const getShipmentById = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { aggregateId } = req.params;

    if (!aggregateId || Array.isArray(aggregateId)) {
      res.status(400).json({
        success: false,
        message: "Invalid aggregateId",
      });
      return;
    }

    const shipment = await prisma.shipmentReadModel.findUnique({
      where: {
        aggregateId,
      },
    });

    if (!shipment) {
      res.status(404).json({
        success: false,
        message: "Shipment not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Shipment retrieved successfully",
      data: shipment,
    });
  } catch (error) {
    console.error("Get shipment error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};