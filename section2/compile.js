const path = require('path');
const fs = require('fs');
const solc = require('solc');

const inboxPath = path.resolve(__dirname, 'contracts', 'Inbox.sol');
const source = fs.readFileSync(inboxPath, 'utf8');

// NOTE: 1 is the number of the contracts to be compiled.
module.exports = solc.compile(source, 1).contracts[':Inbox'];