const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');  // NOTE: Web3 は constructor function
const web3 = new Web3(ganache.provider());
