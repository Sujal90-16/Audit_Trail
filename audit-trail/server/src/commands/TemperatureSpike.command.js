

// Temperature Spike command
// Used when a shipment's temperature crosses a critical level.

function temperatureSpike(shipment, temperature) {

    // Validate shipment data
    if (!shipment) {
        throw new Error("Shipment is required");
    }

    // Temperature must be provided
    if (temperature === undefined || temperature === null) {
        throw new Error("Temperature is required");
    }

    // Convert temperature into a number
    const currentTemperature = Number(temperature);

    if (Number.isNaN(currentTemperature)) {
        throw new Error("Temperature must be a valid number");
    }

    // Create command payload
    const command = {
        commandType: "TEMPERATURE_SPIKE",
        shipmentId: shipment.id,
        temperature: currentTemperature,
        timestamp: new Date().toISOString()
    };

    // Return updated shipment state
    return {
        ...shipment,
        temperature: currentTemperature,
        status: "TEMPERATURE_SPIKE",
        lastCommand: command
    };
}

// Create a temperature alert command
function createTemperatureCommand(shipmentId, temperature) {

    if (!shipmentId) {
        throw new Error("Shipment ID is required");
    }

    const value = Number(temperature);

    if (Number.isNaN(value)) {
        throw new Error("Temperature must be a valid number");
    }

    return {
        type: "TEMPERATURE_SPIKE",
        payload: {
            shipmentId: shipmentId,
            temperature: value
        },
        createdAt: new Date().toISOString()
    };
}

// Export command handlers
module.exports = {
    temperatureSpike,
    createTemperatureCommand
};
