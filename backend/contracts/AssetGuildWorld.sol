// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ISP} from "@ethsign/sign-protocol-evm/src/interfaces/ISP.sol";
import {Attestation} from "@ethsign/sign-protocol-evm/src/models/Attestation.sol";
import {DataLocation} from "@ethsign/sign-protocol-evm/src/models/DataLocation.sol";

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
        address creator;
    }
    mapping(string => Content) public allContent; // preview => content

    struct Creator {
        mapping(string => string) hashmap;
        string[] previews;
        uint8 verified;
    }
    mapping(address => Creator) creatorsStore;

    event NewUpload (
        string contentHash,
        address creator,
        uint256 timestamp,
        uint256 price
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
        uint64[] attestations;
    }

	mapping(address => Buyer) buyersStore;

    struct Purchase {
        address creator;
        string previewHash;
    }
    mapping(uint64 => Purchase) allPurchases;

	mapping(string => bool) public globalHashBase;

	uint64 public schemaId;
	ISP public immutable isp;
	mapping(address => bytes32) public claims;

    event PurchaseAttestation (
        address creator,
        address buyer,
        string previewHash,
        uint64 attestationId
    );
	
	struct OriginalContentReturnType {
		address creator;
		string previewHash;
		string originalImage;
		uint64 attestationId;
	}

	constructor(
		IWorldID _worldId, 
		string memory _appId, 
		string memory _actionId,
		address _sign_deployed_addr, // 0x4e4af2a21ebf62850fD99Eb6253E1eFBb56098cD
		uint64 _schemaId // 239
	) {
		// worldId = _worldId;
		// externalNullifierHash = abi.encodePacked(abi.encodePacked(_appId).hashToField(), _actionId).hashToField();
		isp = ISP(_sign_deployed_addr);
		schemaId = _schemaId;
	}

	function verifyOrbAndExecute(address signal, uint256 root, uint256 nullifierHash, uint256[8] calldata proof) public returns (bool) {
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
        creatorsStore[signal].verified = 2;

		emit Verified(nullifierHash);

        return true;
	}

    function lightVerify() public returns(bool) {
        creatorsStore[msg.sender].verified = 1;
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

    function uploadContent(string memory _a, string memory _b, uint256 price) public {
        require(creatorsStore[msg.sender].verified > 0, "Creator not verified");
		require(!globalHashBase[_a], "Content already exists");
        // ensure not in allContent
        require(
            keccak256(abi.encodePacked(allContent[_a].creator)) == keccak256(abi.encodePacked(address(0))), 
            "Content already exists"
        );

		globalHashBase[_a] = true;

        Creator storage creator = creatorsStore[msg.sender];
        
        creator.hashmap[_a] = _b;
        creator.previews.push(_a);

        emit NewUpload(_a, msg.sender, block.timestamp, price);

        allContent[_a] = Content(price, 0, msg.sender);
    }

    // function getHash(address _profile, string memory _a) public view returns (string memory) {
    //     return creatorsStore[_profile].hashmap[_a];
    // }

    function verificationLevel(address _profile) public view returns(uint) {
        Creator storage creator = creatorsStore[_profile];
        return creator.verified;
    }
    
    // 0x0AF104C5A40C498576859dC4169A1e4b1b7Cd6b7

    // function getProfileDetails(address creator) public view {
        
    // }

    function encodeData(
        address creator,
        address buyer,
        string memory previewHash
    ) public pure returns (bytes memory) {
        return abi.encode(creator, buyer, previewHash);
    }

    function attestToPurchase (address creator, address buyer, string memory previewHash) private returns (uint64) {
        bytes[] memory recipients = new bytes[](2);
        recipients[0] = abi.encode(creator);
        recipients[1] = abi.encode(buyer);
        Attestation memory a = Attestation({
            schemaId: schemaId,
            linkedAttestationId: 0,
            attestTimestamp: 0,
            revokeTimestamp: 0,
            attester: address(this),
            validUntil: 0,
            dataLocation: DataLocation.ONCHAIN,
            revoked: false,
            recipients: recipients,
            data: encodeData(creator, buyer, previewHash)
        });
        uint64 attestationId = isp.attest(a, "", "", "");
        emit PurchaseAttestation(creator, buyer, previewHash, attestationId);

        allPurchases[attestationId] = Purchase(creator, previewHash);

        return attestationId;
    }

    function buyContent(address creator, string memory previewHash) public payable returns (bool) {
		require(msg.value >= allContent[previewHash].price, "Provide enough funds");
		// assert not already boughtaddress
		require(keccak256(bytes(buyersStore[msg.sender].hashmap[previewHash])) == keccak256(bytes("")), "Already bought");

		allContent[previewHash].purchaseCount += 1;
		// Transfer the funds to the creator
		payable(creator).transfer(msg.value);
		emit PaidForContent(msg.sender, creator, previewHash, block.timestamp, msg.value);

        uint64 attestationId = attestToPurchase(creator, msg.sender, previewHash);

		buyersStore[msg.sender].hashmap[previewHash] = previewHash;
		buyersStore[msg.sender].previews.push(previewHash);
        buyersStore[msg.sender].attestations.push(attestationId);

		return true;
	}

	function getAllOriginalImages() public view returns (OriginalContentReturnType[] memory) {
		address buyer = msg.sender;

		// return images ()
		OriginalContentReturnType[] memory images = new OriginalContentReturnType[](buyersStore[buyer].previews.length);

		for (uint i = 0; i < buyersStore[buyer].previews.length; i++) {
			string memory previewHash = buyersStore[buyer].previews[i];
			images[i] = OriginalContentReturnType(
				allContent[previewHash].creator,
				previewHash,
				creatorsStore[allContent[previewHash].creator].hashmap[previewHash],
				buyersStore[buyer].attestations[i]
			);
		}

		return images;
	}
}