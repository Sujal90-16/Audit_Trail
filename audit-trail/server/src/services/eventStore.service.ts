import { prisma } from "../config/prisma.js";
import {
  EventType,
  type Prisma,
} from "../generated/prisma/client.js";

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
  return prisma.$transaction(async (tx) => {
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

    try {
      return await tx.event.create({
        data: {
          aggregateId,
          eventType,
          payload,
          version: nextVersion,
          createdById,
        },
      });
    } catch (error: unknown) {
      /*
       * PostgreSQL/Prisma final protection against a race condition.
       *
       * The Event model has:
       * @@unique([aggregateId, version])
       *
       * If two simultaneous transactions both attempt to create
       * the same aggregate version, one of them will fail here.
       */

      if (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        error.code === "P2002"
      ) {
        const latest = await tx.event.findFirst({
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

        throw new VersionConflictError(
          latest?.version ?? currentVersion,
          expectedVersion
        );
      }

      throw error;
    }
  });
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