// DeliverShipment.command.js

function deliverShipment(shipment) {
    return {
        ...shipment,
        status: "DELIVERED",
        deliveredAt: new Date()
    };
}

module.exports = deliverShipment;
