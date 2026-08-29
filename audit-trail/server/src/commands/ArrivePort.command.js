// ArrivePort.command.js

function arrivePort(shipment) {
    return {
        ...shipment,
        status: "ARRIVED_AT_PORT"
    };
}

module.exports = arrivePort;
