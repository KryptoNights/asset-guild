// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// import {ISP} from "sign-protocol/interfaces/ISP.sol";
// import {Attestation} from "sign-protocol/models/Attestation.sol";
// import {DataLocation} from "sign-protocol/models/DataLocation.sol";
interface IWorldID {
	/// @notice Reverts if the zero-knowledge proof is invalid.
	/// @param root The of the Merkle tree
    struct Creator {
        mapping(string => string) hashmap;
        string[] previews;
        uint8 verified;
    }
    mapping(address => Creator) creatorsStore;

        uint256 timestamp
    );

	event PaidForContent (
		address buyer,
		address creator,
		string contentHash,
		uint256 timestamp,
		uint256 price
	);
    struct Buyer {
        mapping(string => string) hashmap;
        string[] previews;
    }
	mapping(address => Buyer) buyersStore;

	mapping(string => bool) public globalHashBase;
	uint64 public schemaId;
	// ISP public immutable isp;
	// mapping(address => bytes32) public claims;
	// constructor(
		// IWorldID _worldId, 
		// string memory _appId, 
		// string memory _actionId,
		// address _sign_deployed_addr, // 0x4e4af2a21ebf62850fD99Eb6253E1eFBb56098cD
		// uint64 _schemaId // 239
	// ) {
		// worldId = _worldId;
		// externalNullifierHash = abi.encodePacked(abi.encodePacked(_appId).hashToField(), _actionId).hashToField();
		// isp = ISP(_sign_deployed_addr);
		// schemaId = _schemaId;
	// }
	function verifyOrbAndExecute(address signal, uint256 root, uint256 nullifierHash, uint256[8] calldata proof) public returns (bool) {
		// First, we make sure this person hasn't done this before
		if (nullifierHashes[nullifierHash]) revert DuplicateNullifier(nullifierHash);


		// Finally, execute your logic here, for example issue a token, NFT, etc...
		// Make sure to emit some kind of event afterwards!
        creatorsStore[signal].verified = 2;

		emit Verified(nullifierHash);
        return true;
	}

    function lightVerify(address creator) public returns(bool) {
        creatorsStore[creator].verified = 1;
        return true;
    }
    // function verificationCallback(
    //     address sender,
    //     bytes32 claimId,
    //     bytes32 postStateDigest,
    //     bytes calldata seal
    // ) public {
    //     if (sender == address(0))
    //         revert InvalidClaim("Invalid recipient address");
    //     if (claimId == bytes32(0)) revert InvalidClaim("Empty claimId");
    //     if (
    //         !verifier.verify(
    //             seal,
    //             imageId,
    //             postStateDigest,
    //             sha256(abi.encode(sender, claimId))
    //         )
    //     ) {
    //         revert InvalidClaim("Invalid proof");
    //     }
        
    // }
    function uploadContent(string memory _a, string memory _b) public {
        require(creatorsStore[msg.sender].verified > 0, "Creator not verified");
		require(!globalHashBase[_a], "Content already exists");
		globalHashBase[_a] = true;

        Creator storage creator = creatorsStore[msg.sender];

    function getHash(address _profile, string memory _a) public view returns (string memory) {
        return creatorsStore[_profile].hashmap[_a];
    }
    function verificationLevel(address _profile) public view returns(uint) {
        Creator storage creator = creatorsStore[_profile];
        return creator.verified;
    }

    // 0x0AF104C5A40C498576859dC4169A1e4b1b7Cd6b7

    // function getProfileDetails(address creator) public view {

    // }
    function buyContent(address creator, string memory previewHash) public payable returns (bool) {
		require(msg.value >= allContent[previewHash].price, "Provide enough funds");
		// assert not already bought
		require(keccak256(bytes(buyersStore[msg.sender].hashmap[previewHash])) == keccak256(bytes("")), "Already bought");
		allContent[previewHash].purchaseCount += 1;
		// Transfer the funds to the creator
		payable(creator).transfer(msg.value);
		emit PaidForContent(msg.sender, creator, previewHash, block.timestamp, msg.value);
		buyersStore[msg.sender].hashmap[previewHash] = previewHash;
		buyersStore[msg.sender].previews.push(previewHash);
		return true;
	}
}