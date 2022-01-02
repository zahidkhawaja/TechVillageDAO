import { ethers } from "ethers";
import sdk from "./1-initialize-sdk.js";

// Voting contract 
const voteModule = sdk.getVoteModule(
    "0x26015c100Ff2cf9b74f724a05f6D74b736520347",
);

// Our ERC-20 contract
const tokenModule = sdk.getTokenModule(
    "0xA444F3F5bFD3EE30Ad3bc6A16bb73626519aBC1D",
);

(async () => {
    try {
        const amount = 250_000;
        // Create a proposal to mint 250,000 new tokens to the treasury
        await voteModule.propose(
            "Should the DAO mint an additional " + amount + " tokens into the treasury?",
            [
                {
                    // Our nativeToken is ETH. nativeTokenValue is the value of ETH we want to send in this proposal
                    // In this case, we're sending 0 ETH
                    // We are just minting new tokens to the treasury, so nativeTokenValue will be 0.
                    nativeTokenValue: 0,
                    transactionData: tokenModule.contract.interface.encodeFunctionData(
                        // Minting new tokens to the votingModule, which is our treasury
                        "mint",
                        [
                            voteModule.address,
                            ethers.utils.parseUnits(amount.toString(), 18),
                        ]
                    ),
                    // Token module that actually executes the mint
                    toAddress: tokenModule.address,
                },
            ]
        );

        console.log("Successfully created proposal to mint tokens");
    } catch (error) {
        console.error("Failed to create first proposal", error);
        process.exit(1);
    }

    try {
        const amount = 50_000;
        // Create proposal to transfer ourselves 50,000 tokens
        await voteModule.propose(
            "Should the DAO transfer " +
            amount + " tokens from the treasury to " +
            process.env.WALLET_ADDRESS + " for redistribution?",
            [
                {
                    // We're not sending ETH, just tokens. Therefore, nativeTokenValue is 0
                    nativeTokenValue: 0,
                    transactionData: tokenModule.contract.interface.encodeFunctionData(
                        // Transfering from treasury to our wallet
                        "transfer",
                        [
                            process.env.WALLET_ADDRESS,
                            ethers.utils.parseUnits(amount.toString(), 18),
                        ]
                    ),
                    toAddress: tokenModule.address,
                },
            ]
        );

        console.log(
            "Successfully created proposal to send tokens from treasury."
        );
    } catch (error) {
        console.error("Failed to create second proposal", error);
    }
})();