import { ethers } from "ethers";
import sdk from "./1-initialize-sdk.js";

// Address of our ERC-20 token contract
const tokenModule = sdk.getTokenModule(
    "0xA444F3F5bFD3EE30Ad3bc6A16bb73626519aBC1D"
);

(async () => {
    try {
        // Max supply of token
        const amount = 1_000_000;
        // 'Util' function from 'ethers' allows us to convert the amount to have 18 decimals (ERC20 standard)
        const amountWith18Decimals = ethers.utils.parseUnits(amount.toString(), 18);
        // Interact with deployed ERC-20 contract and mint the tokens
        await tokenModule.mint(amountWith18Decimals);
        const totalSupply = await tokenModule.totalSupply();

        // Print out tokens in circulation 
        console.log(
            "There are now",
            ethers.utils.formatUnits(totalSupply, 18),
            "$VILLAGE in circulation",
        );

    } catch (error) {
        console.error("Failed to create tokens", error);
    }
})();