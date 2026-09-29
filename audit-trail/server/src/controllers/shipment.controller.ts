import type { Response } from "express";

import type { AuthenticatedRequest } from "../middleware/auth.middleware.js";

import { AppError } from "../middleware/error.middleware.js";

import { prisma } from "../config/prisma.js";

import type {
  GetShipmentsQuery,
  ShipmentAggregateIdParams,
} from "../validators/shipment.validator.js";

// Get shipment dashboard statistics
export const getShipmentStats = async (
  _req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
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

  const statusCounts =
    shipmentsByStatus.reduce(
      (acc, item) => {
        const status =
          item.status ?? "UNKNOWN";

        acc[status] =
          item._count._all;

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
        totalShipments -
        deliveredShipments,
      statusCounts,
    },
  });
};

// Get all shipment read models with pagination,
// filtering, and search
export const getAllShipments = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const {
    page,
    limit,
    status,
    location,
    search,
  } =
    req.query as unknown as GetShipmentsQuery;

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

  const [
    shipments,
    totalShipments,
  ] = await Promise.all([
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

  const totalPages =
    Math.ceil(
      totalShipments / limit
    );

  res.status(200).json({
    success: true,
    message:
      "Shipments retrieved successfully",
    data: shipments,
    pagination: {
      page,
      limit,
      totalShipments,
      totalPages,
      hasNextPage:
        page < totalPages,
      hasPreviousPage:
        page > 1,
    },
    filters: {
      status: status ?? null,
      location: location ?? null,
      search: search ?? null,
    },
  });
};

// Get one shipment read model by aggregate ID
export const getShipmentById = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const {
    aggregateId,
  } =
    req.params as unknown as ShipmentAggregateIdParams;

  const shipment =
    await prisma.shipmentReadModel.findUnique({
      where: {
        aggregateId,
      },
    });

  if (!shipment) {
    throw new AppError(
      "Shipment not found",
      404
    );
  }

  res.status(200).json({
    success: true,
    message:
      "Shipment retrieved successfully",
    data: shipment,
  });
};