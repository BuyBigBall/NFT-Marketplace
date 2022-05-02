// scripts/deploy.js

async function main() {
    const [deployer] = await ethers.getSigners();
  
    console.log("Deploying contracts with the account:", deployer.address);
  
    // console.log("Account balance:", (await deployer.getBalance()).toString());
  
    const Token1 = await ethers.getContractFactory("ArtToken");
    const artToken = await Token1.deploy();
    await artToken.deployed();
    console.log("Art Token address:", artToken.address);

    const Token2 = await ethers.getContractFactory("ArtMarketplace");
    const marketplaceToken = await Token2.deploy(artToken.address);
    await marketplaceToken.deployed();
    console.log("MarketPlace Token address:", marketplaceToken.address);

    const fs = require("fs");
    const contractsDir = __dirname + "/../client/src/contracts";
    if (!fs.existsSync(contractsDir)) {
      fs.mkdirSync(contractsDir);
    }

    fs.writeFileSync(
      contractsDir + "/contract-address.json",
      JSON.stringify({ 
        ArtToken : artToken.address,
        MarketplaceToken : marketplaceToken.address
      }, undefined, 2)
    );

    const artTokenArtifact = artifacts.readArtifactSync("ArtToken");
    fs.writeFileSync(
        contractsDir + "/ArtToken.json",
        JSON.stringify(artTokenArtifact, null, 2)
    );
    const marketplaceTokenArtifact = artifacts.readArtifactSync("ArtMarketplace");
    fs.writeFileSync(
        contractsDir + "/ArtMarketplace.json",
        JSON.stringify(marketplaceToken, null, 2)
    );
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });