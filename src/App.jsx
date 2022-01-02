import { useEffect, useMemo, useState } from "react";
import { ethers } from "ethers";
import { UnsupportedChainIdError } from "@web3-react/core";

// Import thirdweb hook
import { useWeb3 } from "@3rdweb/hooks";
import { ThirdwebSDK } from "@3rdweb/sdk";

// Instantiate the SDK on Rinkeby
const sdk = new ThirdwebSDK("rinkeby");

// Grab a reference to our ERC-1155 contract
const bundleDropModule = sdk.getBundleDropModule(
  "0x8Bcd3B7446f378c2a883fAAD99f1b708d8F21cB1",
);

// Reference to our ERC-20 token
const tokenModule = sdk.getTokenModule(
  "0xA444F3F5bFD3EE30Ad3bc6A16bb73626519aBC1D"
);

// Governance contract (treasury)
const voteModule = sdk.getVoteModule(
  "0x26015c100Ff2cf9b74f724a05f6D74b736520347",
);

const App = () => {
  // Use connectWallet hook (provided by thirdweb)
  const { connectWallet, address, error, provider } = useWeb3();
  console.log("👋 Address: ", address)

  // The signer is required to sign transactions on the blockchain
  // Without it, we can only read data, not write
  const signer = provider ? provider.getSigner() : undefined;

  // State variable to check if a user has our NFT
  const [hasClaimedNFT, setHasClaimedNFT] = useState(false);
  
  // Keep a loading state while the NFT is minting
  const [isClaiming, setIsClaiming] = useState(false);

  // State that holds the amount of token each member has
  const [memberTokenAmounts, setMemberTokenAmounts] = useState({});

  // State that holds all member addresses as an array
  const [memberAddresses, setMemberAddresses] = useState([]);

  const [proposals, setProposals] = useState([]);
  const [isVoting, setIsVoting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);

  // Retrieve all existing proposals from the contract
  useEffect(() => {
    if (!hasClaimedNFT) {
      return ;
    }

    // A simple call to voteModule.getAll() to grab the proposals
    voteModule
      .getAll()
      .then((proposals) => {
        // Set state
        setProposals(proposals);
        console.log("Proposals: ", proposals)
      })
      .catch((err) => {
        console.error("Failed to get proposals", err);
      });
  }, [hasClaimedNFT]);

    // Check if user has already voted
    useEffect(() => {
      if (!hasClaimedNFT) {
        return ;
      }

      // If we haven't finished retrieving the proposals from the useEffect, then we can't check if the user voted yet
      if (!proposals.length) {
        return;
      }
      // Check if user has already voted on the first proposal
    voteModule
    .hasVoted(proposals[0].proposalId, address)
    .then((hasVoted) => {
      setHasVoted(hasVoted);
      if (hasVoted) {
        console.log("User has already voted!")
      }
    })
    .catch((err) => {
      console.log("Failed to check if wallet has voted", err);
    });
    }, [hasClaimedNFT, proposals, address]);

  // Shorten the wallet addresses for better readability
  const shortenAddress = (str) => {
    return str.substring(0, 6) + "..." + str.substring(str.length - 4);
  }

  // Grab all addresses of NFT holders
  useEffect(() => {
    if (!hasClaimedNFT) {
      return;
    }

    // Grab users who hold our NFT (which has a token ID of 0)
    bundleDropModule
      .getAllClaimerAddresses("0")
      .then((addresses) => {
        console.log("Members addresses", addresses)
        setMemberAddresses(addresses);
      })
      .catch((err) => {
        console.error("Failed to get member list", err);
      });
  }, [hasClaimedNFT])

  // Grab the # of tokens each member holds
  useEffect(() => {
    if (!hasClaimedNFT) {
      return
    }
    // Grab all balances
    tokenModule
      .getAllHolderBalances()
      .then((amounts) => {
        console.log("Wallet amounts", amounts)
        setMemberTokenAmounts(amounts);
      })
      .catch((err) => {
        console.error("Failed to get token amounts", err);
      });
  }, [hasClaimedNFT]);

  // Combine the memberAddresses and memberTokenAmounts into a single array
  // It's important to note that it's possible to be a member (hold a NFT) and have 0 tokens. 
  // We want to make sure every member shows up on the dashboard, even if they don't have tokens
  const memberList = useMemo(() => {
    return memberAddresses.map((address) => {
      return {
        address,
        tokenAmount: ethers.utils.formatUnits(
          // If the address isn't in memberTokenAmounts, it means they don't hold any tokens
          memberTokenAmounts[address] || 0,
          18,
        ),
      };
    });
  }, [memberAddresses, memberTokenAmounts]);

  useEffect(() => {
    // Pass the signer to the sdk, which allows for interaction with the deployed contract
    sdk.setProviderOrSigner(signer);
  }, [signer]);

  useEffect(() => {
    // If they don't have a connected wallet, exit
    if (!address) {
      return;
    }

    // Check if the user has the NFT by using bundleDropModule.balanceOf
    return bundleDropModule
    .balanceOf(address, "0")
    .then((balance) => {
      // If balance is greater than 0, they have our NFT
      if (balance.gt(0)) {
        setHasClaimedNFT(true);
        console.log("This user has a membership NFT")
      } else {
        setHasClaimedNFT(false);
        console.log("This user does not have a membership NFT")
      }
    })
    .catch((error) => {
      setHasClaimedNFT(false);
      console.error("Failed to check NFT balance", error)
    });
  }, [address]);

  if (error instanceof UnsupportedChainIdError) {
    return (
      <div className = "unsupported-network">
        <h2>Please connect to Rinkeby</h2>
        <p>
          This dapp only works on the Rinkeby network. Please switch networks in your connected wallet.
        </p>
      </div>
    );
  }

  // First check if a wallet is connected
  // If not connected, then provide the option to connect

  if (!address) {
    return (
      <div className = "landing">
      <h1> 👋 Welcome to Tech Village DAO </h1>
      <button onClick = {() => connectWallet("injected")} className="btn-hero"> 
      Connect your wallet
      </button>
      </div>
    );
  }

  // Check if the user has the NFT
  if (hasClaimedNFT) {
    return (
      <div className= "member-page">
        <h1>🏘 DAO Member Page</h1>
        <p> 👋 Welcome to Tech Village DAO! </p>
        <div>
        <div>
          <h2> Member List</h2>
          <table className = "card">
            <thead>
              <tr>
                <th>Address</th>
                <th>Token Amount</th>
              </tr>
            </thead>
            <tbody>
              {memberList.map((member) => {
                return (
                  <tr key = {member.address}>
                    <td>{shortenAddress(member.address)}</td>
                    <td>{member.tokenAmount}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      <div>
      <h2> Active Proposals</h2>
      <form
      onSubmit= {async (e) => {
        e.preventDefault();
        e.stopPropagation();

        // Before we do anything async, we need to disable the button to prevent double clicks
        setIsVoting(true);

        // Get the votes from the form for the values
        const votes = proposals.map((proposal) => {
          let voteResult = {
            proposalId: proposal.proposalId,
            // By default, it is abstain
            vote: 2,
          };
          proposal.votes.forEach((vote) => {
            const elem = document.getElementById(
              proposal.proposalId + "-" + vote.type
            );

            if (elem.checked) {
              voteResult.vote = vote.type;
              return ;
            }
          });
          return voteResult;
        });

        // First make sure the user delegrates their token to vote
        try {
          // We'll check if the wallet still needs to delegate their tokens before they can vote
          const delegation = await tokenModule.getDelegationOf(address);
          // If the delegation is the 0x0 address, that means they have not delegated their governance tokens yet
          if (delegation === ethers.constants.AddressZero) {
            // If they haven't delegated their tokens yet, we'll have them delegate them before voting
            await tokenModule.delegateTo(address);
          }

          // Vote on the proposals
          try {
            await Promise.all(
              votes.map(async (vote) => {
                // Before voting we first need to check whether the proposal is open for voting
                // We first need to get the latest state of the proposal
                const proposal = await voteModule.get(vote.proposalId);
                // Then we check if the proposal is open for voting. 1 means open
                if (proposal.state === 1) {
                  // If it's open for voting, then we vote
                  return voteModule.vote(vote.proposalId, vote.vote);
                }
                // If the proposal is not open for voting, we just return nothing
                return;
              })
            );
            try {
              // If any proposals are ready to be executed, we need to do so
              // A proposal is ready if it is in the state '4'
              await Promise.all(
                votes.map(async (vote) => {
                  // Get the latest state of the proposal again, since we may have just voted before
                  const proposal = await voteModule.get(
                    vote.proposalId
                  );

                  // If the state is in state 4 (meaning that it is ready to be executed), then we do so
                  if (proposal.state === 4) {
                    return voteModule.execute(vote.proposalId);
                  }
                })
              );
              // If we get here that means we successfully voted, so let's set the hasVoted state to true
              setHasVoted(true);
              // And now we log a success message
              console.log("Successfully voted");
            } catch(err) {
                console.error("Failed to execute votes", err);
            }
          } catch (err) {
            console.error("Failed to vote", err);
          }
        } catch (err) {
          console.error("Failed to delegate tokens");
        } finally {
          // In either case, we need to set the isVoting state to false to enable the button again
          setIsVoting(false);
        }
      }}>
        {proposals.map((proposal, index) => (
          <div key = {proposal.proposalId} className = "card">
            <h5>{proposal.description}</h5>
            <div>
              {proposal.votes.map((vote) => (
                <div key = {vote.type}>
                  <input
                    type= "radio"
                    id = {proposal.proposalId + "-" + vote.type}
                    name = {proposal.proposalId}
                    value = {vote.type}
                    // Default the "abstain" vote to be checked
                    defaultChecked = {vote.type === 2}
                    />
                    <label htmlFor= {proposal.proposalId + "-" + vote.type}>
                      {vote.label}
                    </label>
                    </div>
              ))}
              </div>
              </div>
        ))}
        <button disabled = {isVoting || hasVoted} type = "submit">
          {isVoting 
            ? "Voting, please wait..."
          : hasVoted
            ? "You already voted"
          : "Submit votes"}
        </button>
        <small>
          This will trigger multiple transactions that you will need to sign
        </small>
        </form>
        </div>
        </div>
        </div>
    );
          };

  const mintNft = () => {
    setIsClaiming(true);
    // Call bundleDropModule.claim("0", 1) to mint NFT to user's wallet
    bundleDropModule
    .claim("0", 1)
    .then(() => {
      // Set claim state
      setHasClaimedNFT(true);
      // Show off their fancy new NFT
      console.log(
        `Successfully minted! Check it out on OpenSea: https://testnets.opensea.io/assets/${bundleDropModule.address}/0`
      );
    })
    .catch((err) => {
      console.error("Failed to claim", err);
    })
    .finally(() => {
      // Stop loading state
      setIsClaiming(false);
    })
  }

  // Render mint NFT screen
  return (
    <div className = "mint-nft">
      <h1>Mint your Tech Village NFT 🪄</h1>
      <button
        disabled = {isClaiming}
        onClick={() => mintNft()}
        >
          {isClaiming ? "Minting, please wait..." : "Mint your NFT (FREE)"}
      </button>
    </div>
  );
};

export default App;
