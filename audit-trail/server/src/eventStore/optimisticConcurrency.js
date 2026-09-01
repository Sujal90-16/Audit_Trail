// optimisticConcurrency.js

let currentVersion = 1;

function updateData(expectedVersion, newData) {
    if (expectedVersion !== currentVersion) {
        throw new Error("Concurrency conflict: Version mismatch");
    }

    console.log("Data updated successfully:", newData);

    currentVersion++;
    console.log("New Version:", currentVersion);
}

// Demo
try {
    updateData(1, { status: "Shipped" });
    updateData(2, { status: "Delivered" });
} catch (error) {
    console.log(error.message);
}
