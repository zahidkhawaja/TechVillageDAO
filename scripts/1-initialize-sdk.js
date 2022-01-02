import { ThirdwebSDK } from "@3rdweb/sdk";
import ethers from "ethers";
import dotenv from "dotenv";
dotenv.config()

// Check to make sure secrets are loaded
if (!process.env.ALCHEMY_API_URL || process.env.ALCHEMY_API_URL == "") {
  console.log("Alchemy API URL not found.")
}

if (!process.env.WALLET_ADDRESS || process.env.WALLET_ADDRESS == "") {
  console.log("Wallet address not found.")
}

if (!process.env.PRIVATE_KEY || process.env.PRIVATE_KEY == "") {
  console.log("Private key not found.")
}

// Initialize Thirdweb and provide secrets
const sdk = new ThirdwebSDK(
  new ethers.Wallet(
    // Wallet private key (stored as secret)
    process.env.PRIVATE_KEY,
    // RPC URL (Alchemy API URL)
    ethers.getDefaultProvider(process.env.ALCHEMY_API_URL),
  ),
);

// Make sure we can retrieve the project from Thirdweb dashboard
(async () => {
  try {
    const apps = await sdk.getApps();
    console.log("Your app address is:", apps[0].address);
  } catch (err) {
    console.log("Failed to get apps from the sdk", err);
    process.exit(1);
  }
})()

// Export the initialized sdk for other scripts
export default sdk;




