import type { Response } from "express";
import { EventType } from "../generated/prisma/client.js";

import type { AuthenticatedRequest } from "../middleware/auth.middleware.js";

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

// Create a new event
export const createEvent = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const {
      aggregateId,
      eventType,
      payload,
      expectedVersion,
    } = req.body;

    if (
      !aggregateId ||
      !eventType ||
      payload === undefined ||
      expectedVersion === undefined
    ) {
      res.status(400).json({
        success: false,
        message:
          "aggregateId, eventType, payload and expectedVersion are required",
      });
      return;
    }

    if (!Object.values(EventType).includes(eventType)) {
      res.status(400).json({
        success: false,
        message: "Invalid eventType",
      });
      return;
    }

    if (
      typeof expectedVersion !== "number" ||
      !Number.isInteger(expectedVersion) ||
      expectedVersion < 0
    ) {
      res.status(400).json({
        success: false,
        message:
          "expectedVersion must be a non-negative integer",
      });
      return;
    }

    if (!req.user?.userId) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });
      return;
    }

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
      res.status(409).json({
        success: false,
        message: "Version conflict",
        data: {
          currentVersion: error.currentVersion,
          expectedVersion: error.expectedVersion,
        },
      });
      return;
    }

    console.error("Create event error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get paginated and filtered events for an aggregate
export const getEvents = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { aggregateId } = req.params;

    if (!aggregateId || Array.isArray(aggregateId)) {
      res.status(400).json({
        success: false,
        message: "Invalid aggregateId",
      });
      return;
    }

    const limitValue = Number(req.query.limit ?? 20);
    const offsetValue = Number(req.query.offset ?? 0);

    if (
      !Number.isInteger(limitValue) ||
      limitValue < 1 ||
      limitValue > 100
    ) {
      res.status(400).json({
        success: false,
        message:
          "limit must be an integer between 1 and 100",
      });
      return;
    }

    if (
      !Number.isInteger(offsetValue) ||
      offsetValue < 0
    ) {
      res.status(400).json({
        success: false,
        message:
          "offset must be a non-negative integer",
      });
      return;
    }

    let eventType: EventType | undefined;

    if (req.query.eventType !== undefined) {
      const eventTypeValue = String(
        req.query.eventType
      );

      if (!Object.values(EventType).includes(eventTypeValue as EventType)) {
        res.status(400).json({
          success: false,
          message: "Invalid eventType",
        });
        return;
      }

      eventType = eventTypeValue as EventType;
    }

    const [events, total] = await Promise.all([
      getEventsByAggregateId(aggregateId, {
        limit: limitValue,
        offset: offsetValue,
        eventType,
      }),
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
        limit: limitValue,
        offset: offsetValue,
        hasMore:
          offsetValue + events.length < total,
      },
    });
  } catch (error) {
    console.error("Get events error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Reconstruct the current shipment state by replaying events
export const getShipmentState = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { aggregateId } = req.params;

    if (!aggregateId || Array.isArray(aggregateId)) {
      res.status(400).json({
        success: false,
        message: "Invalid aggregateId",
      });
      return;
    }

    const events = await getEventsByAggregateId(
      aggregateId,
      {
        limit: 100,
        offset: 0,
      }
    );

    if (events.length === 0) {
      res.status(404).json({
        success: false,
        message: "No events found for this aggregate",
      });
      return;
    }

    const state = replayShipmentEvents(events);

    res.status(200).json({
      success: true,
      message:
        "Shipment state reconstructed successfully",
      data: state,
    });
  } catch (error) {
    console.error("Get shipment state error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Rebuild CQRS shipment read model from historical events
export const rebuildShipmentProjectionController = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { aggregateId } = req.params;

    if (!aggregateId || Array.isArray(aggregateId)) {
      res.status(400).json({
        success: false,
        message: "Invalid aggregateId",
      });
      return;
    }

    const projection =
      await rebuildShipmentProjection(aggregateId);

    if (!projection) {
      res.status(404).json({
        success: false,
        message:
          "No events found for this aggregate",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message:
        "Shipment projection rebuilt successfully",
      data: projection,
    });
  } catch (error) {
    console.error(
      "Rebuild shipment projection error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};