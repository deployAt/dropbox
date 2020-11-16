// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

contract DStorage {
    string public name = "DStorage";
    mapping(uint256 => File) public files;

    struct File {
        string fileName;
    }

    constructor() public {}
}
