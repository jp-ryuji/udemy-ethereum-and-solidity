pragma solidity ^0.4.17;

contract Inbox {
  string public message; // this is like an instance variable. The data is stored in the storage.

  function Inbox(string initialMessage) public {  // constructor function
    message = initialMessage;
  }

  // NOTE: constructor を使うパターン（Solidity v0.4.23〜）
  // constructor(string initialMessage) public {
  //   message = initialMessage;
  // }

  function setMessage(string newMessage) public {
    message = newMessage;
  }
}