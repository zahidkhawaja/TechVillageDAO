import sdk from "./1-initialize-sdk.js";

const tokenModule = sdk.getTokenModule(
    "0xA444F3F5bFD3EE30Ad3bc6A16bb73626519aBC1D",
);

(async () => {
    try {
        // Log the current roles
        console.log(
            "Roles that exist right now:",
            await tokenModule.getAllRoleMembers()
        );

        // Revoke all power our wallet had over the ERC-20 contract
        await tokenModule.revokeAllRolesFromAddress(process.env.WALLET_ADDRESS);
        console.log(
            "Roles after revoking ourselves",
            await tokenModule.getAllRoleMembers()
            );

            console.log("Successfully revoked our power from the ERC-20 contract");
    } catch (error) {
        console.error("Failed to revoke ourselves from the DAO treasury", error)
    }
})();