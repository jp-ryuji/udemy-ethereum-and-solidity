const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const { interface, bytecode } = require('./compile');

// NOTE: The followings are exactly what're used in the sample repo.
const provider = new HDWalletProvider(
  'call glow acoustic vintage front ring trade assist shuffle mimic volume reject',
  'https://rinkeby.infura.io/orDImgKRzwNrVCDrAk5Q'
);
const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log('Attempting to deploy from account', accounts[0]);

  // This is for truffle-hdwallet-provider version 0.0.3
  const result = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({ data: bytecode, arguments: ['Hi there!'] })
    .send({ gas: '1000000', from: accounts[0] });

  // This is for truffle-hdwallet-provider versions 0.0.4, 0.0.5 and 0.0.6
  // const result = await new web3.eth.Contract(JSON.parse(interface))
  //    .deploy({ data: '0x' + bytecode, arguments: ['Hi there!'] }) // add 0x bytecode
  //    .send({ from: accounts[0] }); // remove 'gas'

  console.log('Contract deployed to', result.options.address);
};
deploy();