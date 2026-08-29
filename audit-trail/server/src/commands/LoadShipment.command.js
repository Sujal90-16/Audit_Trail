// LoadShipment.command.js

function loadShipment(shipment) {
    return {
        ...shipment,
        status: "LOADED"
    };
}

module.exports = loadShipment;
