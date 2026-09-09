import type { Response } from "express";

import type { AuthenticatedRequest } from "../middleware/auth.middleware.js";

import { prisma } from "../config/prisma.js";

// Get shipment dashboard statistics
export const getShipmentStats = async (
  _req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const [
      totalShipments,
      deliveredShipments,
      shipmentsByStatus,
    ] = await Promise.all([
      prisma.shipmentReadModel.count(),

      prisma.shipmentReadModel.count({
        where: {
          status: "DELIVERED",
        },
      }),

      prisma.shipmentReadModel.groupBy({
        by: ["status"],
        _count: {
          _all: true,
        },
      }),
    ]);

    const statusCounts = shipmentsByStatus.reduce(
      (acc, item) => {
        const status = item.status ?? "UNKNOWN";

        acc[status] = item._count._all;

        return acc;
      },
      {} as Record<string, number>
    );

    res.status(200).json({
      success: true,
      message:
        "Shipment statistics retrieved successfully",
      data: {
        totalShipments,
        deliveredShipments,
        activeShipments:
          totalShipments - deliveredShipments,
        statusCounts,
      },
    });
  } catch (error) {
    console.error(
      "Get shipment statistics error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get all shipment read models with pagination, filtering, and search
export const getAllShipments = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const pageValue = req.query.page;
    const limitValue = req.query.limit;
    const statusValue = req.query.status;
    const locationValue = req.query.location;
    const searchValue = req.query.search;

    const page =
      typeof pageValue === "string"
        ? Number.parseInt(pageValue, 10)
        : 1;

    const limit =
      typeof limitValue === "string"
        ? Number.parseInt(limitValue, 10)
        : 10;

    if (
      !Number.isInteger(page) ||
      page < 1
    ) {
      res.status(400).json({
        success: false,
        message: "page must be a positive integer",
      });
      return;
    }

    if (
      !Number.isInteger(limit) ||
      limit < 1 ||
      limit > 100
    ) {
      res.status(400).json({
        success: false,
        message:
          "limit must be an integer between 1 and 100",
      });
      return;
    }

    const status =
      typeof statusValue === "string" &&
      statusValue.trim() !== ""
        ? statusValue.trim()
        : undefined;

    const location =
      typeof locationValue === "string" &&
      locationValue.trim() !== ""
        ? locationValue.trim()
        : undefined;

    const search =
      typeof searchValue === "string" &&
      searchValue.trim() !== ""
        ? searchValue.trim()
        : undefined;

    const where = {
      ...(status
        ? {
            status,
          }
        : {}),

      ...(location
        ? {
            location: {
              equals: location,
              mode: "insensitive" as const,
            },
          }
        : {}),

      ...(search
        ? {
            OR: [
              {
                aggregateId: {
                  contains: search,
                  mode: "insensitive" as const,
                },
              },
              {
                containerNumber: {
                  contains: search,
                  mode: "insensitive" as const,
                },
              },
              {
                shipName: {
                  contains: search,
                  mode: "insensitive" as const,
                },
              },
              {
                port: {
                  contains: search,
                  mode: "insensitive" as const,
                },
              },
              {
                location: {
                  contains: search,
                  mode: "insensitive" as const,
                },
              },
            ],
          }
        : {}),
    };

    const skip = (page - 1) * limit;

    const [shipments, totalShipments] =
      await Promise.all([
        prisma.shipmentReadModel.findMany({
          where,
          orderBy: {
            updatedAt: "desc",
          },
          skip,
          take: limit,
        }),

        prisma.shipmentReadModel.count({
          where,
        }),
      ]);

    const totalPages = Math.ceil(
      totalShipments / limit
    );

    res.status(200).json({
      success: true,
      message: "Shipments retrieved successfully",
      data: shipments,
      pagination: {
        page,
        limit,
        totalShipments,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
      filters: {
        status: status ?? null,
        location: location ?? null,
        search: search ?? null,
      },
    });
  } catch (error) {
    console.error("Get all shipments error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get one shipment read model by aggregate ID
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

    const shipment =
      await prisma.shipmentReadModel.findUnique({
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