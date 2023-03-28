const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require("web3");
const compiledFactory = require("./build/CampaignFactory.json");

require("dotenv").config();

const provider = new HDWalletProvider(
  process.env.MNEMONIC,
  process.env.GOERLI_ENDPOINT_WITH_API_KEY,
);
const web3 = new Web3(provider);
const gasForDeploy = 2000000;

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log("Attempting to deploy from account", accounts[0]);

  try {
    const result = await new web3.eth.Contract(compiledFactory.abi)
      .deploy({ data: compiledFactory.evm.bytecode.object })
      .send({ gas: gasForDeploy, from: accounts[0] });

    console.log("Contract deployed to", result.options.address);
  } catch (err) {
    console.log(`Failed to deploy contract: ${JSON.stringify(err)}`);
    return;
  } finally {
    provider.engine.stop();
  }
};

deploy();
