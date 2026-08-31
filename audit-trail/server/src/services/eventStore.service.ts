import { prisma } from "../config/prisma.js";
import {
  EventType,
  type Prisma,
} from "../generated/prisma/client.js";

import { projectShipmentEvent } from "./shipmentProjector.service.js";

export interface AppendEventInput {
  aggregateId: string;
  eventType: EventType;
  payload: Prisma.InputJsonValue;
  createdById?: string;
  expectedVersion: number;
}

export class VersionConflictError extends Error {
  public readonly currentVersion: number;
  public readonly expectedVersion: number;

  constructor(
    currentVersion: number,
    expectedVersion: number
  ) {
    super(
      `Version conflict: expected version ${expectedVersion}, current version is ${currentVersion}`
    );

    this.name = "VersionConflictError";
    this.currentVersion = currentVersion;
    this.expectedVersion = expectedVersion;
  }
}

export const appendEvent = async ({
  aggregateId,
  eventType,
  payload,
  createdById,
  expectedVersion,
}: AppendEventInput) => {
  const event = await prisma.$transaction(async (tx) => {
    const latestEvent = await tx.event.findFirst({
      where: {
        aggregateId,
      },
      orderBy: {
        version: "desc",
      },
      select: {
        version: true,
      },
    });

    const currentVersion = latestEvent?.version ?? 0;

    if (currentVersion !== expectedVersion) {
      throw new VersionConflictError(
        currentVersion,
        expectedVersion
      );
    }

    const nextVersion = currentVersion + 1;

    return tx.event.create({
      data: {
        aggregateId,
        eventType,
        payload,
        version: nextVersion,
        createdById,
      },
    });
  });

  // Update CQRS read model after the event is successfully stored
  await projectShipmentEvent(event);

  return event;
};

export const getEventsByAggregateId = async (
  aggregateId: string
) => {
  return prisma.event.findMany({
    where: {
      aggregateId,
    },
    orderBy: {
      version: "asc",
    },
  });
};