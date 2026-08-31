module.exports = {
    name: "GetShipment",
    description: "Get shipment details",

    execute: async (context) => {
        return {
            shipmentId: context.shipmentId || "SHIP001",
            status: "In Transit",
            origin: "Mumbai",
            destination: "Pune"
        };
    }
};
