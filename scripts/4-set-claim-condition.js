import sdk from "./1-initialize-sdk.js";

const bundleDrop = sdk.getBundleDropModule(
    "0x8Bcd3B7446f378c2a883fAAD99f1b708d8F21cB1",
);

(async () => {
    try {
        const claimConditionFactory = bundleDrop.getClaimConditionFactory();
        // Specify conditions
        claimConditionFactory.newClaimPhase({
            startTime: new Date(),
            maxQuantity: 50_000,
            maxQuantityPerTransaction: 1,
        });
        // Adjust the conditions of the deployed contract on-chain.
        await bundleDrop.setClaimCondition(0, claimConditionFactory);
        console.log("✅ Successfully set claim condition on bundle drop: ", bundleDrop.address);
    } catch (error) {
        console.error("Failed to set claim condition", error);
    }
})()