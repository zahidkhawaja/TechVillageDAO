import { ethers } from "ethers";
import sdk from "./1-initialize-sdk.js";

// Address to the ERC-1155 membership NFT contract
const bundleDropModule = sdk.getBundleDropModule(
    "0x8Bcd3B7446f378c2a883fAAD99f1b708d8F21cB1",
);

// Address to ERC-20 token contract
const tokenModule = sdk.getTokenModule(
    "0xA444F3F5bFD3EE30Ad3bc6A16bb73626519aBC1D",
);

(async () => {
    try {
        // Get all the addresses of membership NFT holders (the NFT has a tokenId of 0)
        const walletAddresses = await bundleDropModule.getAllClaimerAddresses("0");

        if (walletAddresses.length === 0) {
            console.log("No NFTs have been claimed yet!",);
            process.exit(0);
        }

        // Loop through the array of addresses
        const airdropTargets = walletAddresses.map((address) => {
            // Pick a random # between 1,000 and 10,000
            const randomAmount = Math.floor(Math.random() * (10000 - 1000 + 1) + 100);
            console.log("Going to airdrop", randomAmount, "tokens to", address);

            // Setup the target
            const airdropTarget = {
                address,
                // 18 decimal places ('ethers' library comes in clutch here)
                amount: ethers.utils.parseUnits(randomAmount.toString(), 18),
            };

            return airdropTarget;
        });s

        // Call transferBatch on all our airdrop targets
        console.log("Starting airdrop...")
        await tokenModule.transferBatch(airdropTargets);
        console.log("Successfully airdropped tokens to all NFT holders");
    } catch (err) {
        console.error("Failed to airdrop tokens", err);
    }
})();