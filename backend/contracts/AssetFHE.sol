// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@fhenixprotocol/contracts/FHE.sol";

contract AssetFHE {
    struct EncryptedContent {
        uint32[] encryptedOriginalContentArrayfied;
        euint32 symmetricKey1;
        euint32 symmetricKey2;
        euint32 symmetricKey3;
        euint32 symmetricKey4;
    }
    mapping(string => EncryptedContent) content;

    struct contentAuthorized {
        mapping(string => bool) authorizations;
    }
    mapping(address => contentAuthorized) addressPaidForContent;

    function addPermissionToView(string calldata _previewHash, address buyer, uint64 attestationId) public {
        require(attestationId > 0, "Wrong attestation");
        addressPaidForContent[buyer].authorizations[_previewHash] = true;
    }

    // Function to convert string to uint32 array
    function stringToUint32Array(string memory input) public pure returns (uint32[] memory) {
        bytes memory strBytes = bytes(input); // Convert string to bytes array
        uint32[] memory result = new uint32[](strBytes.length); // Create an array to store uint32 values

        // Iterate through the string and convert each character to uint32
        for (uint i = 0; i < strBytes.length; i++) {
            result[i] = uint32(uint8(strBytes[i])); // Convert each byte (ASCII) to uint32
        }

        return result;
    }

    // Function to convert uint32 array back to a string
    function uint32ArrayToString(uint32[] memory input) public pure returns (string memory) {
        bytes memory result = new bytes(input.length); // Create a bytes array to store the result

        // Iterate through the uint32 array and convert each value back to a byte
        for (uint i = 0; i < input.length; i++) {
            require(input[i] <= 255, "Invalid uint32 value"); // Ensure the value fits in a byte
            result[i] = bytes1(uint8(input[i])); // Convert uint32 to byte (uint8) and store in bytes array
        }

        return string(result); // Convert bytes array back to string
    }

    function addHashToProtect(string memory originalContent, string memory previewHash, inEuint32 memory ek1, inEuint32 memory ek2, inEuint32 memory ek3, inEuint32 memory ek4) public {
        uint32[] memory originalHash = stringToUint32Array(originalContent);
        uint64 length = originalHash.length;
        originalHash[length - 4] += FHE.decrypt(ek1);
        originalHash[length - 3] += FHE.decrypt(ek2);
        originalHash[length - 2] += FHE.decrypt(ek3);
        originalHash[length - 1] += FHE.decrypt(ek4);

        content[previewHash] = EncryptedContent(originalHash, FHE.asEuint32(ek1), FHE.asEuint32(ek2), FHE.asEuint32(ek3), FHE.asEuint32(ek4));
    }

    function getOriginalContent(string memory previewHash) public view returns (string memory) {
        require(addressPaidForContent[msg.sender].authorizations[previewHash], "Not authorized to view content");

        EncryptedContent memory encryptedContent = content[previewHash];
        uint32[] memory originalHash = encryptedContent.encryptedOriginalContentArrayfied;
        uint64 length = originalHash.length;
        originalHash[length - 4] -= FHE.decrypt(encryptedContent.symmetricKey1);
        originalHash[length - 3] -= FHE.decrypt(encryptedContent.symmetricKey2);
        originalHash[length - 2] -= FHE.decrypt(encryptedContent.symmetricKey3);
        originalHash[length - 1] -= FHE.decrypt(encryptedContent.symmetricKey4);

        return uint32ArrayToString(originalHash);
    }
}