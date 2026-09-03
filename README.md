# Audit Trail

**Audit Trail** is an enterprise-grade inventory and logistics ledger designed to maintain a complete, immutable history of business operations.

The system uses **Event Sourcing** and **CQRS (Command Query Responsibility Segregation)** to record every important business operation as an event rather than simply storing the latest state.

This allows the system to reconstruct both **current and historical states** by replaying events, providing complete traceability and reliable historical information.

## 🎯 Problem Statement

Traditional inventory and logistics systems generally store only the current state of an entity.

For example:

```text
Shipment ID: S101
Status: Delivered
```

Although we know the current status, we may not know how the shipment reached that state.

Audit Trail solves this problem by maintaining the complete sequence of operations:

```text
Shipment Created
       ↓
Shipment Loaded
       ↓
Shipment Arrived at Port
       ↓
Shipment Delivered
```

Every operation is recorded as an individual event and becomes part of the permanent audit history.

## 🏗️ Core Architecture

Audit Trail is based on two important architectural patterns:

### 1. Event Sourcing

Instead of storing only the current state, the system stores every business operation as an event.

For example:

```text
ShipmentCreated
ShipmentLoaded
ShipmentArrivedAtPort
ShipmentDelivered
```

The current state can then be reconstructed by replaying these events in their original order.

```text
Events
  ↓
Event Replay
  ↓
Current State
```

The event history is treated as **immutable**, meaning previously recorded events are not modified or deleted.

### 2. CQRS

CQRS separates operations that **change the system** from operations that **read information**.

#### Commands

Commands represent operations that modify the system.

Examples:

```text
CreateShipment
LoadShipment
ArriveAtPort
DeliverShipment
MoveShipment
```

A command is processed by the business logic and produces one or more events.

```text
Command
   ↓
Command Handler
   ↓
Business Logic
   ↓
Event
   ↓
Event Store
```

#### Queries

Queries are used to retrieve information without modifying the system.

Examples:

```text
GetShipment
GetShipmentHistory
GetShipmentStatus
GetInventory
```

```text
Query
  ↓
Query Handler
  ↓
Read Model
  ↓
Result
```

## 🔄 Event Replay

One of the major features of Audit Trail is **event replay**.

Consider the following events:

```text
1. ShipmentCreated
2. ShipmentLoaded
3. ShipmentArrivedAtPort
4. ShipmentDelivered
```

The system can replay these events sequentially:

```text
Empty State
    ↓
ShipmentCreated
    ↓
Shipment Loaded
    ↓
Shipment Arrived at Port
    ↓
Shipment Delivered
```

The final state becomes:

```text
Status = Delivered
```

Because the state can be reconstructed from events, the system can also determine what the shipment looked like at an earlier point in time.

## 📜 Immutable Audit History

Every business operation is preserved as an event.

For example:

```text
10:00 AM → ShipmentCreated
11:30 AM → ShipmentLoaded
03:00 PM → ShipmentArrivedAtPort
06:00 PM → ShipmentDelivered
```

Instead of changing an existing record, new events are appended to the history.

This provides:

* Complete traceability
* Reliable audit history
* Historical state reconstruction
* Better debugging
* Dispute resolution
* Operational analysis

## 📦 Inventory & Logistics Operations

The system can represent different logistics operations through events and commands such as:

```text
Create Shipment
Load Shipment
Move Shipment
Arrive at Port
Deliver Shipment
```

Additional business events can also represent exceptional situations, such as:

```text
Temperature Spike Detected
Shipment Delayed
Shipment Cancelled
```

This makes the system suitable for tracking the complete lifecycle of inventory and shipments.

## 🔍 Example

Consider a shipment with ID `S101`.

### Initial operation

```text
CreateShipment
```

produces:

```text
ShipmentCreated
```

### Loading operation

```text
LoadShipment
```

produces:

```text
ShipmentLoaded
```

### Port arrival

```text
ArriveAtPort
```

produces:

```text
ShipmentArrivedAtPort
```

### Delivery

```text
DeliverShipment
```

produces:

```text
ShipmentDelivered
```

The complete history is therefore:

```text
ShipmentCreated
        ↓
ShipmentLoaded
        ↓
ShipmentArrivedAtPort
        ↓
ShipmentDelivered
```

The current shipment state is derived from this event history.

## ⭐ Key Benefits

### Complete Traceability

Every business operation is recorded, making it possible to understand exactly what happened and when.

### Historical Reconstruction

Previous states can be reconstructed by replaying events up to a specific point in time.

### Immutable History

Previously recorded events are preserved and are not overwritten by later operations.

### Auditability

The complete sequence of business operations provides a reliable audit trail.

### Dispute Resolution

Historical events can be used to investigate shipment and inventory-related disputes.

### Reliable Operational Analysis

The event history provides detailed information that can be used to analyze business operations and identify patterns or problems.

## 🧠 Architecture in Simple Terms

```text
                    USER
                     |
          ┌──────────┴──────────┐
          ↓                     ↓
       COMMAND                QUERY
          ↓                     ↓
   Command Handler        Query Handler
          ↓                     ↓
    Business Logic         Read Model
          ↓
         EVENT
          ↓
     Event Store
          ↓
     Event Replay
          ↓
    Current State
```

## 🚀 Why Event Sourcing + CQRS?

Combining Event Sourcing and CQRS provides a strong architecture for systems where **traceability, historical data, and reliable business records** are important.

Instead of asking only:

> "What is the current state?"

Audit Trail can also answer:

> "What happened?"

> "When did it happen?"

> "What was the state at that time?"

> "Which operations led to the current state?"

This makes the system particularly suitable for **inventory management, logistics, shipment tracking, auditing, and other business-critical applications**.
