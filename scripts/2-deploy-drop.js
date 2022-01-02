import { ethers } from "ethers";
import sdk from "./1-initialize-sdk.js";
import { readFileSync } from "fs";

// App public address
const app = sdk.getAppModule("0x3b8b09D1DbACEf792194845147d78A665a2e5A8c");

(async () => {
    try {
        const bundleDropModule = await app.deployBundleDropModule({
            // Collection name
            name: "Tech Village DAO Membership",
            description: "A DAO for developers and tech entrepreneurs.",
            image: readFileSync("scripts/assets/techvillage.jpeg"),
            // Address of the entity that will receive the proceeds from sales of NFTs
            // We're not charging for the drop, so we'll passs in the 0x0 address
            // However, we can set this to our own wallet address to charge for the drop
            primarySaleRecipientAddress: ethers.constants.AddressZero,
        });

        console.log(
            "✅ Successfully deployed bundleDrop module, address: ",
            bundleDropModule.address,
        );

        console.log(
            "✅ bundleDrop metadata: ",
            await bundleDropModule.getMetadata(),
        );
    } catch (error) {
        console.log("Failed to deploy bundleDrop module", error);
    }
})()