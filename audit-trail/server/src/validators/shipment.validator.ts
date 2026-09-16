import { z } from "zod";

/*
 * Schema for shipment list query parameters.
 */
export const getShipmentsQuerySchema = z.object({
  page: z
    .coerce
    .number()
    .int("page must be a positive integer")
    .min(
      1,
      "page must be a positive integer"
    )
    .default(1),

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
    .default(10),

  status: z
    .string()
    .trim()
    .optional(),

  location: z
    .string()
    .trim()
    .optional(),

  search: z
    .string()
    .trim()
    .optional(),
});

/*
 * Schema for routes containing an aggregate ID.
 */
export const shipmentAggregateIdParamsSchema =
  z.object({
    aggregateId: z
      .string()
      .trim()
      .min(1, "Invalid aggregateId"),
  });

export type GetShipmentsQuery = z.infer<
  typeof getShipmentsQuerySchema
>;

export type ShipmentAggregateIdParams =
  z.infer<
    typeof shipmentAggregateIdParamsSchema
  >;