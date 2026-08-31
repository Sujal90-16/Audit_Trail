module.exports = {
    name: "GetInventory",
    description: "Get current inventory details",

    execute: async (context) => {
        return {
            totalItems: 500,
            availableItems: 350,
            reservedItems: 100,
            outOfStock: 50
        };
    }
};
