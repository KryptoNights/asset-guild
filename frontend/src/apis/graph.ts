import axios from "axios";
import { JsonRpcSigner, Contract } from 'ethers';

import { GRAPH_URL } from "utils/consts";

export async function getAllImages() {
    try {
        const response = await axios.post(
            GRAPH_URL,
            {
                'query': 'query NewUploads($orderBy: NewUpload_orderBy, $orderDirection: OrderDirection) {\n  newUploads(orderBy: $orderBy, orderDirection: $orderDirection) {\n    id\n    contentHash\n    creator\n    timestamp\n    blockNumber\n    blockTimestamp\n    transactionHash\n    purchaseCount\n    price\n  }\n}',
                'variables': {
                    'orderBy': 'timestamp',
                    'orderDirection': 'desc'
                },
                'operationName': 'NewUploads'
            },
            {
                headers: {
                    'content-type': 'application/json'
                }
            }
        );


        let images = response.data.data.newUploads.map((image: any) => {
            return {
                id: image.id,
                contentHash: image.contentHash,
                creator: image.creator,
                timestamp: image.timestamp,
                blockNumber: image.blockNumber,
                blockTimestamp: image.blockTimestamp,
                transactionHash: image.transactionHash,
                purchaseCount: image.purchaseCount,
                price: image.price,
                imageUrl: `https://gateway.lighthouse.storage/ipfs/${image.contentHash}`
            };
        });

        return images;
    } catch (error) {
        console.error("Error fetching all images:", error);
        throw error; // Rethrow the error after logging
    }
}

export async function getPurchasedImages(Shutter: Contract) {
    try {
        const result = await Shutter.getAllOriginalImages();
        console.log(result);
        // Assuming each tuple contains: creatorAddress, originalImageHash, watermarkedImageHash, and purchaseCount
        const formattedResult = result.map((tuple: any) => {
            return {
                creatorAddress: tuple[0],           // First item in the tuple is the creator's address
                watermarkedImageHash: tuple[1],        // Second item is the original image hash (IPFS CID)
                // originalImageHash: tuple[2],     // WITHHOLDING TO DERIVE FROM HELIUM // Third item is the watermarked image hash (IPFS CID)
                attestationId: Number(tuple[3]),  // Fourth item is the purchase count (convert from BigNumber)
                image: `https://gateway.lighthouse.storage/ipfs/${tuple[2]}` // WITHHOLDING TO DERIVE FROM HELIUM
            };
        });

        return formattedResult;
    } catch (error: any) { // Assert error type as 'any'
        console.error("Error fetching purchased images:", error.message); // Log the error message
        throw error; // Rethrow the error after logging
    }
}