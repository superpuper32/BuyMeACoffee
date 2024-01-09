import { ethers } from "hardhat";

const abi = require("../artifacts/contracts/BuyMeACoffee.sol/BuyMeACoffee.json");

type Provider = {
    apiKey: string;
}

async function getBalance(provider: any, address: any) {
  const balanceBigInt = await provider.getBalance(address);
  return ethers.formatEther(balanceBigInt);
}

async function main() {
  // Get the contract that has been deployed to Sepolia.
  const contractAddress="0xF5C1F1d17CF3d8C5ea6372890A7905D110Cd8bC9";
  const contractABI = abi.abi;

  // Get the node connection and wallet connection.
  const provider = new ethers.AlchemyProvider("sepolia", process.env.SEPOLIA_API_KEY);

  console.log('provider', provider);

  // Ensure that signer is the SAME address as the original contract deployer,
  // or else this script will fail with an error.
  const signer = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);

  console.log('signer', signer);

  // Instantiate connected contract.
  const buyMeACoffee = new ethers.Contract(contractAddress, contractABI, signer);

  console.log('buyMeACoffee', buyMeACoffee); 

  // Check starting balances.
  console.log("current balance of owner: ", await getBalance(provider, signer.address), "ETH");
  const contractBalance = await getBalance(provider, buyMeACoffee.target);
  console.log("current balance of contract: ", await getBalance(provider, buyMeACoffee.target), "ETH");

  // Withdraw funds if there are funds to withdraw.
  if (contractBalance !== "0.0") {
    console.log("withdrawing funds..")
    const withdrawTxn = await buyMeACoffee.withdrawTips();
    await withdrawTxn.wait();
  } else {
    console.log("no funds to withdraw!");
  }

  // Check ending balance.
  console.log("current balance of owner: ", await getBalance(provider, signer.address), "ETH");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });