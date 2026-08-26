import { prisma } from "../config/prisma";
import {
  EventType,
  type Prisma,
} from "../generated/prisma/client.js";

export interface AppendEventInput {
  aggregateId: string;
  eventType: EventType;
  payload: Prisma.InputJsonValue;
  createdById?: string;
}

export const appendEvent = async ({
  aggregateId,
  eventType,
  payload,
  createdById,
}: AppendEventInput) => {
  const latestEvent = await prisma.event.findFirst({
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

  const nextVersion = (latestEvent?.version ?? 0) + 1;

  return prisma.event.create({
    data: {
      aggregateId,
      eventType,
      payload,
      version: nextVersion,
      createdById,
    },
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