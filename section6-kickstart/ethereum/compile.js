const path = require("path")
const solc = require("solc")
const fs = require("fs-extra")

const srcFileName = "Campaign.sol"

const buildPath = path.resolve(__dirname, "build")
fs.removeSync(buildPath)

const campaignPath = path.resolve(__dirname, "contracts", srcFileName)
const source = fs.readFileSync(campaignPath, "utf8")
// CampaignFactory and Campaign are returned. They are processed using a for-loop in the following step.
// const output = solc.compile(source, 1).contracts

// fs.ensureDirSync(buildPath)

// for (let contract in output) {
//   fs.outputJsonSync(
//     path.resolve(buildPath, contract.replace(":", "") + ".json"),
//     output[contract],
//   )
// }

// revised version for solc 0.8.19
// ref: https://ethereum.stackexchange.com/questions/125616/how-to-complie-smart-contract-in-node-js-solc-version-0-8-13
const input = {
  language: "Solidity",
  sources: {
    "Campaign.sol": {
      content: source,
    },
  },
  settings: {
    outputSelection: {
      "*": {
        "*": ["*"],
      },
    },
  },
}

// compile contract
const output = JSON.parse(solc.compile(JSON.stringify(input)))

fs.ensureDirSync(buildPath)

for (let contract in output.contracts[srcFileName]) {
  fs.outputJsonSync(
    path.resolve(buildPath, contract + ".json"),
    output.contracts[srcFileName][contract].evm,
  )
}
