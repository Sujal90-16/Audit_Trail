import {
  EventType,
  type Prisma,
} from "../generated/prisma/client.js";

import { prisma } from "../config/prisma.js";

type ProjectableEvent = {
  aggregateId: string;
  eventType: EventType;
  payload: Prisma.JsonValue;
  version: number;
};

type ShipmentProjection = {
  aggregateId: string;
  version: number;
  status?: string;
  location?: string;
  containerNumber?: string;
  shipName?: string;
  port?: string;
  deliveredAt?: string;
};

const getPayload = (
  payload: Prisma.JsonValue
): Record<string, unknown> => {
  if (
    payload !== null &&
    typeof payload === "object" &&
    !Array.isArray(payload)
  ) {
    return payload as Record<string, unknown>;
  }

  return {};
};

const getString = (
  payload: Record<string, unknown>,
  key: string
): string | undefined => {
  const value = payload[key];

  return typeof value === "string"
    ? value
    : undefined;
};

export const projectShipmentEvent = async (
  event: ProjectableEvent
) => {
  const payload = getPayload(event.payload);

  const existingProjection =
    await prisma.shipmentReadModel.findUnique({
      where: {
        aggregateId: event.aggregateId,
      },
    });

  if (
    existingProjection &&
    existingProjection.version >= event.version
  ) {
    return existingProjection;
  }

  const projection: ShipmentProjection = {
    aggregateId: event.aggregateId,
    version: event.version,

    status: existingProjection?.status ?? undefined,
    location: existingProjection?.location ?? undefined,
    containerNumber:
      existingProjection?.containerNumber ?? undefined,
    shipName:
      existingProjection?.shipName ?? undefined,
    port: existingProjection?.port ?? undefined,
    deliveredAt:
      existingProjection?.deliveredAt ?? undefined,
  };

  switch (event.eventType) {
    case EventType.CONTAINER_CREATED:
      projection.status =
        getString(payload, "status") ?? "CREATED";

      projection.location =
        getString(payload, "location");

      projection.containerNumber =
        getString(payload, "containerNumber");

      break;

    case EventType.LOADED_ON_SHIP:
      projection.status =
        getString(payload, "status") ?? "LOADED";

      projection.shipName =
        getString(payload, "shipName");

      projection.port =
        getString(payload, "port");

      break;

    case EventType.ARRIVED_AT_PORT:
      projection.status =
        getString(payload, "status") ?? "ARRIVED";

      projection.port =
        getString(payload, "port");

      projection.location =
        getString(payload, "location") ??
        projection.location;

      break;

    case EventType.MOVED:
      projection.status =
        getString(payload, "status") ?? "MOVED";

      projection.location =
        getString(payload, "location") ??
        projection.location;

      break;

    case EventType.DELIVERED:
      projection.status =
        getString(payload, "status") ?? "DELIVERED";

      projection.deliveredAt =
        getString(payload, "deliveredAt");

      projection.location =
        getString(payload, "location") ??
        projection.location;

      break;

    case EventType.TEMPERATURE_SPIKE:
      break;

    default:
      break;
  }

  return prisma.shipmentReadModel.upsert({
    where: {
      aggregateId: event.aggregateId,
    },

    create: {
      aggregateId: projection.aggregateId,
      version: projection.version,
      status: projection.status,
      location: projection.location,
      containerNumber:
        projection.containerNumber,
      shipName: projection.shipName,
      port: projection.port,
      deliveredAt: projection.deliveredAt,
    },

    update: {
      version: projection.version,
      status: projection.status,
      location: projection.location,
      containerNumber:
        projection.containerNumber,
      shipName: projection.shipName,
      port: projection.port,
      deliveredAt: projection.deliveredAt,
    },
  });
};

export const rebuildShipmentProjection = async (
  aggregateId: string
) => {
  await prisma.shipmentReadModel.deleteMany({
    where: {
      aggregateId,
    },
  });

  const events = await prisma.event.findMany({
    where: {
      aggregateId,
    },
    orderBy: {
      version: "asc",
    },
  });

  if (events.length === 0) {
    return null;
  }

  for (const event of events) {
    await projectShipmentEvent({
      aggregateId: event.aggregateId,
      eventType: event.eventType,
      payload: event.payload,
      version: event.version,
    });
  }

  return prisma.shipmentReadModel.findUnique({
    where: {
      aggregateId,
    },
  });
};