// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
interface IWorldID {
	/// @notice Reverts if the zero-knowledge proof is invalid.
	/// @param root The of the Merkle tree
	/// @param groupId The id of the Semaphore group
	/// @param signalHash A keccak256 hash of the Semaphore signal
	/// @param nullifierHash The nullifier hash
	/// @param externalNullifierHash A keccak256 hash of the external nullifier
	/// @param proof The zero-knowledge proof
	/// @dev  Note that a double-signaling check is not included here, and should be carried by the caller.
	function verifyProof(
		uint256 root,
		uint256 groupId,
		uint256 signalHash,
		uint256 nullifierHash,
		uint256 externalNullifierHash,
		uint256[8] calldata proof
	) external view;
}
library ByteHasher {
	/// @dev Creates a keccak256 hash of a bytestring.
	/// @param value The bytestring to hash
	/// @return The hash of the specified value
	/// @dev `>> 8` makes sure that the result is included in our field
	function hashToField(bytes memory value) internal pure returns (uint256) {
		return uint256(keccak256(abi.encodePacked(value))) >> 8;
	}
}
contract Shutter {
    using ByteHasher for bytes;
    IWorldID internal immutable worldId;
    mapping(uint256 => bool) internal nullifierHashes;
    error DuplicateNullifier(uint256 nullifierHash);
    uint256 internal immutable groupId = 1;
    uint256 internal immutable externalNullifierHash;
    event Verified(uint256 nullifierHash);
    struct Content {
        uint256 price;
        uint64 purchaseCount;
    }
    mapping(string => Content) public allContent;
    struct Creator {
        mapping(string => string) hashmap;
        string[] previews;
        bool verified;
    }
    mapping(address => Creator) creatorsStore;
    event NewUpload (
        string contentHash,
        address creator,
        uint256 timestamp
    );
	constructor(IWorldID _worldId, string memory _appId, string memory _actionId) {
		worldId = _worldId;
		externalNullifierHash = abi.encodePacked(abi.encodePacked(_appId).hashToField(), _actionId).hashToField();
	}
	function verifyAndExecute(address signal, uint256 root, uint256 nullifierHash, uint256[8] calldata proof) public {
		// First, we make sure this person hasn't done this before
		if (nullifierHashes[nullifierHash]) revert DuplicateNullifier(nullifierHash);
		// We now verify the provided proof is valid and the user is verified by World ID
		worldId.verifyProof(
			root,
			groupId,
			abi.encodePacked(signal).hashToField(),
			nullifierHash,
			externalNullifierHash,
			proof
		);
		// We now record the user has done this, so they can't do it again (proof of uniqueness)
		nullifierHashes[nullifierHash] = true;
		// Finally, execute your logic here, for example issue a token, NFT, etc...
		// Make sure to emit some kind of event afterwards!
        creatorsStore[signal].verified = true;
		emit Verified(nullifierHash);
	}
    function addHash(string memory _a, string memory _b) public {
        require(creatorsStore[msg.sender].verified, "Creator not verified");
        Creator storage creator = creatorsStore[msg.sender];
        
        creator.hashmap[_a] = _b;
        creator.previews.push(_a);
        emit NewUpload(_a, msg.sender, block.timestamp);
    }
    function getHash(address _profile, string memory _a) public view returns (string memory) {
        return creatorsStore[_profile].hashmap[_a];
    }
    
    // 0x0AF104C5A40C498576859dC4169A1e4b1b7Cd6b7
    // function getProfileDetails(address creator) public view {
        
    // }
}