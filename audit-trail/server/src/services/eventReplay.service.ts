import { EventType, type Prisma } from "../generated/prisma/client.js";

export interface ShipmentState {
  aggregateId: string;
  version: number;

  status?: string;
  location?: string;
  containerNumber?: string;

  shipName?: string;
  port?: string;

  deliveredAt?: string;
}

type EventForReplay = {
  aggregateId: string;
  eventType: EventType;
  payload: Prisma.JsonValue;
  version: number;
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

export const replayShipmentEvents = (
  events: EventForReplay[]
): ShipmentState | null => {
  if (events.length === 0) {
    return null;
  }

  const sortedEvents = [...events].sort(
    (a, b) => a.version - b.version
  );

  const state: ShipmentState = {
    aggregateId: sortedEvents[0].aggregateId,
    version: 0,
  };

  for (const event of sortedEvents) {
    const payload = getPayload(event.payload);

    switch (event.eventType) {
      case EventType.CONTAINER_CREATED:
        state.status = getString(payload, "status") ?? "CREATED";
        state.location = getString(payload, "location");
        state.containerNumber = getString(
          payload,
          "containerNumber"
        );
        break;

      case EventType.LOADED_ON_SHIP:
        state.status = getString(payload, "status") ?? "LOADED";
        state.shipName = getString(payload, "shipName");
        state.port = getString(payload, "port");
        break;

      case EventType.ARRIVED_AT_PORT:
        state.status = getString(payload, "status") ?? "ARRIVED";
        state.port = getString(payload, "port");
        state.location =
          getString(payload, "location") ??
          state.location;
        break;

      case EventType.DELIVERED:
        state.status = getString(payload, "status") ?? "DELIVERED";
        state.deliveredAt = getString(payload, "deliveredAt");
        state.location =
          getString(payload, "location") ??
          state.location;
        break;

      default:
        break;
    }

    state.version = event.version;
  }

  return state;
};