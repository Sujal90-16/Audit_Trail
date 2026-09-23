import type { Response } from "express";

import type { AuthenticatedRequest } from "../middleware/auth.middleware.js";

import { AppError } from "../middleware/error.middleware.js";

import {
  appendEvent,
  getEventsByAggregateId,
  countEventsByAggregateId,
  VersionConflictError,
} from "../services/eventStore.service.js";

import {
  replayShipmentEvents,
} from "../services/eventReplay.service.js";

import {
  rebuildShipmentProjection,
} from "../services/shipmentProjector.service.js";

import type {
  AggregateIdParams,
  GetEventsQuery,
} from "../validators/event.validator.js";

// Create a new event
export const createEvent = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  if (!req.user?.userId) {
    throw new AppError(
      "Authentication required",
      401
    );
  }

  const {
    aggregateId,
    eventType,
    payload,
    expectedVersion,
  } = req.body;

  try {
    const event = await appendEvent({
      aggregateId,
      eventType,
      payload,
      expectedVersion,
      createdById: req.user.userId,
    });

    res.status(201).json({
      success: true,
      message: "Event created successfully",
      data: event,
    });
  } catch (error) {
    if (error instanceof VersionConflictError) {
      throw new AppError(
        "Version conflict",
        409,
        {
          currentVersion:
            error.currentVersion,
          expectedVersion:
            error.expectedVersion,
        }
      );
    }

    throw error;
  }
};

// Get paginated and filtered events for an aggregate
export const getEvents = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const {
    aggregateId,
  } = req.params as unknown as AggregateIdParams;

  const {
    limit,
    offset,
    eventType,
  } = req.query as unknown as GetEventsQuery;

  const [events, total] =
    await Promise.all([
      getEventsByAggregateId(
        aggregateId,
        {
          limit,
          offset,
          eventType,
        }
      ),
      countEventsByAggregateId(
        aggregateId,
        eventType
      ),
    ]);

  res.status(200).json({
    success: true,
    message: "Events retrieved successfully",
    data: events,
    pagination: {
      total,
      limit,
      offset,
      hasMore:
        offset + events.length < total,
    },
  });
};

// Reconstruct the current shipment state by replaying events
export const getShipmentState = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const {
    aggregateId,
  } = req.params as unknown as AggregateIdParams;

  const events =
    await getEventsByAggregateId(
      aggregateId,
      {
        limit: 100,
        offset: 0,
      }
    );

  if (events.length === 0) {
    throw new AppError(
      "No events found for this aggregate",
      404
    );
  }

  const state =
    replayShipmentEvents(events);

  res.status(200).json({
    success: true,
    message:
      "Shipment state reconstructed successfully",
    data: state,
  });
};

// Rebuild CQRS shipment read model from historical events
export const rebuildShipmentProjectionController =
  async (
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> => {
    const {
      aggregateId,
    } =
      req.params as unknown as AggregateIdParams;

    const projection =
      await rebuildShipmentProjection(
        aggregateId
      );

    if (!projection) {
      throw new AppError(
        "No events found for this aggregate",
        404
      );
    }

    res.status(200).json({
      success: true,
      message:
        "Shipment projection rebuilt successfully",
      data: projection,
    });
  };