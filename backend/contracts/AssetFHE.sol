// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@fhenixprotocol/contracts/FHE.sol";

contract ShutterFHE {
    struct EncryptedContent {
        string initial;
        euint32[4] encryptedOriginalContentArrayfied;
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

    // Function to return all but the last 4 characters of a string
    function allButLastFour(string memory input) public pure returns (string memory) {
        bytes memory strBytes = bytes(input); // Convert string to bytes array
        require(strBytes.length >= 4, "String length must be at least 4 characters");

        // Create a new bytes array with a length that excludes the last 4 characters
        bytes memory result = new bytes(strBytes.length - 4);

        // Copy the first (length - 4) characters into the result array
        for (uint i = 0; i < strBytes.length - 4; i++) {
            result[i] = strBytes[i];
        }

        return string(result); // Convert bytes array back to string
    }

    // Function to convert string to uint32 array
    function stringToUint32Array(string memory input) public pure returns (euint32[] memory) {
        bytes memory strBytes = bytes(input); // Convert string to bytes array
        euint32[] memory result = new euint32[](strBytes.length); // Create an array to store uint32 values

        // Iterate through the string and convert each character to uint32
        for (uint i = 0; i < strBytes.length; i++) {
            uint32 val = uint32(uint8(strBytes[i])); // Convert each byte (ASCII) to uint32
            result[i] = FHE.asEuint32(val);
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

    function addHashToProtect(string memory originalContent, string memory previewHash, inEuint32 memory iek1, inEuint32 memory iek2, inEuint32 memory iek3, inEuint32 memory iek4) public {
        euint32[] memory originalHash = stringToUint32Array(originalContent);
        uint256 length = originalHash.length;
        euint32 ek1 = FHE.asEuint32(iek1);
        euint32 ek2 = FHE.asEuint32(iek2);
        euint32 ek3 = FHE.asEuint32(iek3);
        euint32 ek4 = FHE.asEuint32(iek4);
        originalHash[length - 4] = originalHash[length - 4].add(ek1);
        originalHash[length - 3] = originalHash[length - 3].add(ek2);
        originalHash[length - 2] = originalHash[length - 2].add(ek3);
        originalHash[length - 1] = originalHash[length - 1].add(ek4);

        euint32[4] memory encr = [
            originalHash[length - 4], 
            originalHash[length - 3], 
            originalHash[length - 2], 
            originalHash[length - 1]
        ] ;

        content[previewHash] = EncryptedContent(allButLastFour(originalContent), encr, ek1, ek2, ek3, ek4);
    }

    function getOriginalContent(string memory previewHash, bytes32 publicKey) public view returns (string memory, string memory, string memory, string memory, string memory) {
        require(addressPaidForContent[msg.sender].authorizations[previewHash], "Not authorized to view content");

        EncryptedContent memory encryptedContent = content[previewHash];
        euint32[4] memory originalHash = encryptedContent.encryptedOriginalContentArrayfied;
        uint256 length = originalHash.length;
        originalHash[length - 4] = originalHash[length - 4].sub(encryptedContent.symmetricKey1);
        originalHash[length - 3] = originalHash[length - 3].sub(encryptedContent.symmetricKey2);
        originalHash[length - 2] = originalHash[length - 2].sub(encryptedContent.symmetricKey3);
        originalHash[length - 1] = originalHash[length - 1].sub(encryptedContent.symmetricKey4);

        // return uint32ArrayToString(originalHash);
        return (
            encryptedContent.initial,
            FHE.sealoutput(originalHash[length - 4], publicKey),
            FHE.sealoutput(originalHash[length - 3], publicKey),
            FHE.sealoutput(originalHash[length - 2], publicKey),
            FHE.sealoutput(originalHash[length - 1], publicKey)
        );
    }
}



// 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 // original
//                                                    24 43 22 13 // password
//                                                    51 71 51 43 // encrypted
// 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26             // rest of the string

// open(10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26) + encrypted(27 28 29 30)