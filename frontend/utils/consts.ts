export const SHUTTER_CONTRACT = "0x97107847b68185b317a0D14cBE60cCa0d2860685";
export const IMAGE_MAGIC_URL = "https://shutter-image-magic-876401151866.us-central1.run.app";
export const GRAPH_URL = 'https://api.studio.thegraph.com/query/80137/shutter-try/v0.0.8';

export const ORB_VERIFICATION = false;

export const FHE_CONTRACT = "0x0AF104C5A40C498576859dC4169A1e4b1b7Cd6b7";
export const FHE_ABI = [
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "originalContent",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "previewHash",
                "type": "string"
            },
            {
                "components": [
                    {
                        "internalType": "bytes",
                        "name": "data",
                        "type": "bytes"
                    }
                ],
                "internalType": "struct inEuint32",
                "name": "iek1",
                "type": "tuple"
            },
            {
                "components": [
                    {
                        "internalType": "bytes",
                        "name": "data",
                        "type": "bytes"
                    }
                ],
                "internalType": "struct inEuint32",
                "name": "iek2",
                "type": "tuple"
            },
            {
                "components": [
                    {
                        "internalType": "bytes",
                        "name": "data",
                        "type": "bytes"
                    }
                ],
                "internalType": "struct inEuint32",
                "name": "iek3",
                "type": "tuple"
            },
            {
                "components": [
                    {
                        "internalType": "bytes",
                        "name": "data",
                        "type": "bytes"
                    }
                ],
                "internalType": "struct inEuint32",
                "name": "iek4",
                "type": "tuple"
            }
        ],
        "name": "addHashToProtect",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_previewHash",
                "type": "string"
            },
            {
                "internalType": "address",
                "name": "buyer",
                "type": "address"
            },
            {
                "internalType": "uint64",
                "name": "attestationId",
                "type": "uint64"
            }
        ],
        "name": "addPermissionToView",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "input",
                "type": "string"
            }
        ],
        "name": "allButLastFour",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "pure",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "previewHash",
                "type": "string"
            },
            {
                "internalType": "bytes32",
                "name": "publicKey",
                "type": "bytes32"
            }
        ],
        "name": "getOriginalContent",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "input",
                "type": "string"
            }
        ],
        "name": "stringToUint32Array",
        "outputs": [
            {
                "internalType": "euint32[]",
                "name": "",
                "type": "uint256[]"
            }
        ],
        "stateMutability": "pure",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint32[]",
                "name": "input",
                "type": "uint32[]"
            }
        ],
        "name": "uint32ArrayToString",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "pure",
        "type": "function"
    }
];

export const ABI = [
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_sign_deployed_addr",
                "type": "address"
            },
            {
                "internalType": "uint64",
                "name": "_schemaId",
                "type": "uint64"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "nullifierHash",
                "type": "uint256"
            }
        ],
        "name": "DuplicateNullifier",
        "type": "error"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "string",
                "name": "contentHash",
                "type": "string"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "creator",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "timestamp",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "price",
                "type": "uint256"
            }
        ],
        "name": "NewUpload",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "address",
                "name": "buyer",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "creator",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "contentHash",
                "type": "string"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "timestamp",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "price",
                "type": "uint256"
            }
        ],
        "name": "PaidForContent",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "address",
                "name": "creator",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "buyer",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "previewHash",
                "type": "string"
            },
            {
                "indexed": false,
                "internalType": "uint64",
                "name": "attestationId",
                "type": "uint64"
            }
        ],
        "name": "PurchaseAttestation",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "nullifierHash",
                "type": "uint256"
            }
        ],
        "name": "Verified",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "name": "allContent",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "price",
                "type": "uint256"
            },
            {
                "internalType": "uint64",
                "name": "purchaseCount",
                "type": "uint64"
            },
            {
                "internalType": "address",
                "name": "creator",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "creator",
                "type": "address"
            },
            {
                "internalType": "string",
                "name": "previewHash",
                "type": "string"
            }
        ],
        "name": "buyContent",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "claims",
        "outputs": [
            {
                "internalType": "bytes32",
                "name": "",
                "type": "bytes32"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "creator",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "buyer",
                "type": "address"
            },
            {
                "internalType": "string",
                "name": "previewHash",
                "type": "string"
            }
        ],
        "name": "encodeData",
        "outputs": [
            {
                "internalType": "bytes",
                "name": "",
                "type": "bytes"
            }
        ],
        "stateMutability": "pure",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getAllOriginalImages",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "address",
                        "name": "creator",
                        "type": "address"
                    },
                    {
                        "internalType": "string",
                        "name": "previewHash",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "originalImage",
                        "type": "string"
                    },
                    {
                        "internalType": "uint64",
                        "name": "attestationId",
                        "type": "uint64"
                    }
                ],
                "internalType": "struct Shutter.OriginalContentReturnType[]",
                "name": "",
                "type": "tuple[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "name": "globalHashBase",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "isp",
        "outputs": [
            {
                "internalType": "contract ISP",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "lightVerify",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "schemaId",
        "outputs": [
            {
                "internalType": "uint64",
                "name": "",
                "type": "uint64"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_a",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "_b",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "price",
                "type": "uint256"
            }
        ],
        "name": "uploadContent",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_profile",
                "type": "address"
            }
        ],
        "name": "verificationLevel",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "signal",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "root",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "nullifierHash",
                "type": "uint256"
            },
            {
                "internalType": "uint256[8]",
                "name": "proof",
                "type": "uint256[8]"
            }
        ],
        "name": "verifyOrbAndExecute",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];