import sdk from "./1-initialize-sdk.js";
import { readFile, readFileSync } from "fs";

const bundleDrop = sdk.getBundleDropModule(
    "0x8Bcd3B7446f378c2a883fAAD99f1b708d8F21cB1",
);

(async () => {
    try {
        await bundleDrop.createBatch([
            {
                name: "Glass Orb",
                description: "This NFT gives you access to Tech Village DAO.",
                image: readFileSync("scripts/assets/glassorb.jpg"),
            },
        ]);
        console.log("✅ Successfully created a new NFT in the drop!");
    } catch(error) {
        console.log("Failed to create a new NFT", error);
    }
})()