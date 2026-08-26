import type { Response } from "express";
import { EventType } from "../generated/prisma/client.js";

import type { AuthenticatedRequest } from "../middleware/auth.middleware.js";

import {
  appendEvent,
  getEventsByAggregateId,
} from "../services/eventStore.service.js";

export const createEvent = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { aggregateId, eventType, payload } = req.body;

    if (!aggregateId || !eventType || payload === undefined) {
      res.status(400).json({
        success: false,
        message: "aggregateId, eventType and payload are required",
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
      createdById: req.user.userId,
    });

    res.status(201).json({
      success: true,
      message: "Event created successfully",
      data: event,
    });
  } catch (error) {
    console.error("Create event error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getEvents = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const aggregateId = req.params.aggregateId;

    if (typeof aggregateId !== "string" || !aggregateId) {
      res.status(400).json({
        success: false,
        message: "aggregateId is required",
      });
      return;
    }

    const events = await getEventsByAggregateId(aggregateId);

    res.status(200).json({
      success: true,
      message: "Events retrieved successfully",
      data: events,
    });
  } catch (error) {
    console.error("Get events error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};