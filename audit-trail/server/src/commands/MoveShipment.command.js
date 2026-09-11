
// Move Shipment command
// Used when a shipment needs to be moved to a new location.

function moveShipment(shipment, location) {

    // Validate shipment data
    if (!shipment) {
        throw new Error("Shipment is required");
    }

    // Validate destination location
    if (!location || location.trim() === "") {
        throw new Error("Location is required");
    }

    // Create a new command payload
    const command = {
        commandType: "MOVE_SHIPMENT",
        shipmentId: shipment.id,
        currentLocation: shipment.location || null,
        newLocation: location.trim(),
        timestamp: new Date().toISOString()
    };

    // Return updated shipment state
    return {
        ...shipment,
        location: location.trim(),
        status: "IN_TRANSIT",
        lastCommand: command
    };
}

// Create a command without directly modifying the shipment
function createMoveCommand(shipmentId, location) {

    if (!shipmentId) {
        throw new Error("Shipment ID is required");
    }

    if (!location || location.trim() === "") {
        throw new Error("Destination location is required");
    }

    return {
        type: "MOVE_SHIPMENT",
        payload: {
            shipmentId: shipmentId,
            location: location.trim()
        },
        createdAt: new Date().toISOString()
    };
}

// Export command handler
module.exports = {
    moveShipment,
    createMoveCommand
};
