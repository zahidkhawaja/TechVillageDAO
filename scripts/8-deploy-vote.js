import sdk from "./1-initialize-sdk.js";

// Grab the app module address
const appModule = sdk.getAppModule(
    "0x3b8b09D1DbACEf792194845147d78A665a2e5A8c",
);

(async () => {
    try {
        const voteModule = await appModule.deployVoteModule({
            // Governance contract name
            name: "Tech Village DAO Proposals",

            // Location of governance token (ERC-20)
            votingTokenAddress: "0xA444F3F5bFD3EE30Ad3bc6A16bb73626519aBC1D",

            // When members can start voting (in this case, immediately)
            proposalStartWaitTimeInSeconds: 0,

            // How long do members have to vote? In this case, 24 hours (86400 seconds)
            proposalVotingTimeInSeconds: 24 * 60 * 60,

            // % of token used on the vote doesn't matter
            votingQuorumFraction: 0,

            // Minimum # of tokens needed to create a proposal. We want everyone to get a fair shot, so we set this to 0
            minimumNumberOfTokensNeededToPropose: "0",
        });

        console.log(
            "Successfully deployed vote module, address:",
            voteModule.address,
        );
    } catch (err) {
        console.error("Failed to deploy vote module", err);
    }
})();