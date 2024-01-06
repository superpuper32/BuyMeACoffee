import { ethers } from "hardhat";

async function main() {
  // We get the contract to deploy.
  const buyMeACoffee = await ethers.deployContract("BuyMeACoffee");

  await buyMeACoffee.waitForDeployment();

  console.log("BuyMeACoffee deployed to:", buyMeACoffee.target);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });