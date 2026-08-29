// TemperatureSpike.command.js

function temperatureSpike(shipment, temperature) {
    return {
        ...shipment,
        temperature: temperature,
        status: "TEMPERATURE_SPIKE"
    };
}

module.exports = temperatureSpike;
