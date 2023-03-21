// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract Lottery {
  address public manager;
  address payable[] public players;

  constructor() {
    manager = msg.sender;
  }

  function enter() public payable {
    require(msg.value > .01 ether);
    players.push(payable(msg.sender));
  }

  function random() private view returns (uint) {
    return uint(keccak256(abi.encodePacked(block.difficulty, block.timestamp, players)));
  }

  function pickWinner() public restricted {
    uint index = random() % players.length;
    // - the unit wei (the syntax is no longer recommended)
    // players[index].transfer(this.balance);
    // - data is declared, but not used, so that "Warning: Unused local variable" is displayed
    // (bool sent, bytes memory data) = players[index].call{value: address(this).balance}("");
    (bool sent,) = players[index].call{value: address(this).balance}("");

    require(sent, "Failed to send Ether");
    players = new address payable[](0); // create dynamic array with initially size 0
  }

  modifier restricted() {
    require(msg.sender == manager);
    _;
  }

  function getPlayers() public view returns (address payable[] memory) {
    return players;
  }
}
