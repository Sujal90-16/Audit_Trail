import {
  Prisma,
  EventType,
} from "../generated/prisma/client.js";

import { prisma } from "../config/prisma.js";

import {
  projectShipmentEvent,
} from "./shipmentProjector.service.js";

interface AppendEventInput {
  aggregateId: string;
  eventType: EventType;
  payload: unknown;
  expectedVersion: number;
  createdById: string;
}

interface GetEventsOptions {
  limit?: number;
  offset?: number;
  eventType?: EventType;
}

export class VersionConflictError extends Error {
  currentVersion: number;
  expectedVersion: number;

  constructor(
    currentVersion: number,
    expectedVersion: number
  ) {
    super(
      `Version conflict. Expected version ${expectedVersion}, but current version is ${currentVersion}`
    );

    this.name = "VersionConflictError";

    this.currentVersion =
      currentVersion;

    this.expectedVersion =
      expectedVersion;
  }
}

export const appendEvent = async ({
  aggregateId,
  eventType,
  payload,
  expectedVersion,
  createdById,
}: AppendEventInput) => {
  try {
    return await prisma.$transaction(
      async (tx) => {
        const latestEvent =
          await tx.event.findFirst({
            where: {
              aggregateId,
            },
            orderBy: {
              version: "desc",
            },
          });

        const currentVersion =
          latestEvent?.version ?? 0;

        if (
          currentVersion !==
          expectedVersion
        ) {
          throw new VersionConflictError(
            currentVersion,
            expectedVersion
          );
        }

        const nextVersion =
          currentVersion + 1;

        const event =
          await tx.event.create({
            data: {
              aggregateId,
              eventType,
              payload:
                payload as Parameters<
                  typeof tx.event.create
                >[0]["data"]["payload"],
              version: nextVersion,
              createdById,
            },
          });

        await projectShipmentEvent(
          event,
          tx
        );

        return event;
      }
    );
  } catch (error) {
    if (
      error instanceof VersionConflictError
    ) {
      throw error;
    }

    if (
      error instanceof
        Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      const latestEventAfterConflict =
        await prisma.event.findFirst({
          where: {
            aggregateId,
          },
          orderBy: {
            version: "desc",
          },
        });

      const actualVersion =
        latestEventAfterConflict
          ?.version ?? 0;

      throw new VersionConflictError(
        actualVersion,
        expectedVersion
      );
    }

    throw error;
  }
};

export const getEventsByAggregateId = async (
  aggregateId: string,
  options: GetEventsOptions = {}
) => {
  const {
    limit = 20,
    offset = 0,
    eventType,
  } = options;

  return prisma.event.findMany({
    where: {
      aggregateId,
      ...(eventType
        ? {
            eventType,
          }
        : {}),
    },
    orderBy: {
      version: "asc",
    },
    take: limit,
    skip: offset,
  });
};

export const countEventsByAggregateId = async (
  aggregateId: string,
  eventType?: EventType
) => {
  return prisma.event.count({
    where: {
      aggregateId,
      ...(eventType
        ? {
            eventType,
          }
        : {}),
    },
  });
};