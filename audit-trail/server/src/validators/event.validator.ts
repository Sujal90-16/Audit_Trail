import { z } from "zod";

import { EventType } from "../generated/prisma/client.js";

/*
 * Schema for creating a new event.
 */
export const createEventSchema = z.object({
  aggregateId: z
    .string()
    .trim()
    .min(1, "aggregateId is required"),

  eventType: z.enum(EventType),

  payload: z
    .unknown()
    .refine(
      (value) => value !== undefined,
      "payload is required"
    ),

  expectedVersion: z
    .number({
      message:
        "expectedVersion must be a number",
    })
    .int("expectedVersion must be an integer")
    .min(
      0,
      "expectedVersion must be a non-negative integer"
    ),
});

/*
 * Schema for event list query parameters.
 */
export const getEventsQuerySchema = z.object({
  limit: z
    .coerce
    .number()
    .int("limit must be an integer")
    .min(
      1,
      "limit must be an integer between 1 and 100"
    )
    .max(
      100,
      "limit must be an integer between 1 and 100"
    )
    .default(20),

  offset: z
    .coerce
    .number()
    .int("offset must be an integer")
    .min(
      0,
      "offset must be a non-negative integer"
    )
    .default(0),

  eventType: z
    .enum(EventType)
    .optional(),
});

/*
 * Schema for routes containing an aggregate ID.
 */
export const aggregateIdParamsSchema = z.object({
  aggregateId: z
    .string()
    .trim()
    .min(1, "Invalid aggregateId"),
});

export type CreateEventInput = z.infer<
  typeof createEventSchema
>;

export type GetEventsQuery = z.infer<
  typeof getEventsQuerySchema
>;

export type AggregateIdParams = z.infer<
  typeof aggregateIdParamsSchema
>;