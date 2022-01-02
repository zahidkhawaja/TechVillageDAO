import sdk from "./1-initialize-sdk.js";

// To deploy the new contract, we need the app module again
const app = sdk.getAppModule("0x3b8b09D1DbACEf792194845147d78A665a2e5A8c");

(async () => {
    try {
        // Deploy a standard ERC-20 contract
        const tokenModule = await app.deployTokenModule({
            // Token name
            name: "Tech Village DAO Governance Token",
            // Token symbol
            symbol: "VILLAGE"
        });
        console.log(
            "Successfully deployed token module. Address: ",
            tokenModule.address,
        );
    } catch (error) {
        console.error("Failed to deploy token module", error);
    }
})();