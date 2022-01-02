import { ethers } from "ethers";
import sdk from "./1-initialize-sdk.js";

// Governance contract 
const voteModule = sdk.getVoteModule(
    "0x26015c100Ff2cf9b74f724a05f6D74b736520347",
);

// ERC-20 token contract
const tokenModule = sdk.getTokenModule(
    "0xA444F3F5bFD3EE30Ad3bc6A16bb73626519aBC1D",
);

(async () => {
    try {
        // Give treasury the power to mint additional token if needed
        await tokenModule.grantRole("minter", voteModule.address);

        console.log(
            "Successfully gave vote module permissions to act on token module"
        );
    } catch (error) {
        console.error(
            "Failed to grant vote module permissions on token module",
            error
        );
        process.exit(1);
    }

    try {
        // Grab our wallet's token balance (which holds all the tokens currently)
        const ownedTokenBalance = await tokenModule.balanceOf(
            process.env.WALLET_ADDRESS
        );

        // Grab 90% of the supply that we hold
        const ownedAmount = ethers.BigNumber.from(ownedTokenBalance.value);
        const percent90 = ownedAmount.div(100).mul(90);

        // Transfer 90% of the supply to our voting contract.
        await tokenModule.transfer(
            voteModule.address,
            percent90
        );

        console.log("Successfully transferred tokens to vote module");
    } catch (err) {
        console.error("Failed to transfer tokens to vote module", err);
    }
})();