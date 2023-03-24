const path = require("path")
const solc = require("solc")
const fs = require("fs-extra")

const buildPath = path.resolve(__dirname, "build")
fs.removeSync(buildPath)

const campaignPath = path.resolve(__dirname, "contracts", "Campaign.sol")
const source = fs.readFileSync(campaignPath, "utf8")
// CampaignFactory and Campaign are returned. They are processed using a for-loop in the following step.
const output = solc.compile(source, 1).contracts

fs.ensureDirSync(buildPath)

for (let contract in output) {
  fs.outputJsonSync(
    path.resolve(buildPath, contract.replace(":", "") + ".json"),
    output[contract],
  )
}
