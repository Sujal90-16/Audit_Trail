import { EventType, type Prisma } from "../generated/prisma/client.js";

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

  /*
   * Ignore events that have already been projected.
   *
   * This makes the projector idempotent.
   */
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
    shipName: existingProjection?.shipName ?? undefined,
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
      /*
       * A temperature spike is an audit event.
       * It currently does not modify the shipment
       * read model fields.
       */
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
      containerNumber: projection.containerNumber,
      shipName: projection.shipName,
      port: projection.port,
      deliveredAt: projection.deliveredAt,
    },

    update: {
      version: projection.version,
      status: projection.status,
      location: projection.location,
      containerNumber: projection.containerNumber,
      shipName: projection.shipName,
      port: projection.port,
      deliveredAt: projection.deliveredAt,
    },
  });
};