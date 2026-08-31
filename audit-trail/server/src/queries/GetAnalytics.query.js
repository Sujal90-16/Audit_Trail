module.exports = {
    name: "GetAnalytics",
    description: "Get shipment analytics",

    execute: async (context) => {
        return {
            totalShipments: 100,
            delivered: 70,
            inTransit: 20,
            pending: 10
        };
    }
};
