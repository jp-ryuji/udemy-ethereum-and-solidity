// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract CampaignFactory {
  address[] public deployedCampaigns;

  function createCampaign(uint256 minimum) public {
    Campaign newCampaign = new Campaign(minimum, msg.sender);
    deployedCampaigns.push(address(newCampaign));
  }

  function getDeployedCampaigns() public view returns (address[] memory) {
    return deployedCampaigns;
  }
}

contract Campaign {
  struct Request {
    string description;
    uint256 value;
    address payable recipient;
    bool complete;
    uint256 approvalCount;
    mapping(address => bool) approvals;
  }

  Request[] public requests;
  address public manager;
  uint public minimumContribution;
  mapping(address => bool) public approvers;
  uint public approversCount;

  modifier restricted() {
    require(msg.sender == manager);
    _;
  }

  constructor(uint256 minimum, address creator) {
    manager = creator;
    minimumContribution = minimum;
  }

  function contribute() public payable {
    require(msg.value > minimumContribution, "The amount sent is less than the minimum contribution");

    approvers[msg.sender] = true;
    approversCount++;
  }

  function createRequest(
    string calldata description,
    uint256 value,
    address payable recipient
  ) public restricted
  {
    Request storage newRequest = requests.push();
    newRequest.description = description;
    newRequest.value = value;
    newRequest.recipient = recipient;
    newRequest.complete = false;
    newRequest.approvalCount = 0;

    // This error is thrown with the succeeding code:
    //   from solidity: TypeError: Struct containing a (nested) mapping cannot be constructed.
    //
    // Revised as above by referencing: https://stackoverflow.com/questions/63170366/solidity-solc-error-struct-containing-a-nested-mapping-cannot-be-constructed
    //
    // Request storage newRequest = Request({
    //   description: description,
    //   value: value,
    //   recipient: recipient,
    //   complete: false,
    //   approvalCount: 0
    // });
    //
    // requests.push(newRequest);
  }

  function approveRequest(uint256 index) public {
    Request storage request = requests[index]; // `storage` is used to reference `requests[index]` instead of copying the value

    require(approvers[msg.sender], "Only contributors can approve requests");
    require(!request.approvals[msg.sender], "The contributor has already approved this request");

    request.approvals[msg.sender] = true;
    request.approvalCount++;
  }

  function finalizeRequest(uint256 index) public restricted {
    Request storage request = requests[index];

    require(!request.complete);
    require(request.approvalCount > (approversCount / 2));

    (bool sent, ) = request.recipient.call{value: request.value}("");
    require(sent, "Failed to send Ether");

    request.complete = true;
  }
}
