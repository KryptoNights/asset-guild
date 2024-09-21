import axios from "axios";
import { JsonRpcSigner, Contract } from 'ethers';

import { GRAPH_URL } from "utils/consts";

export async function getAllImages() {
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
}

export async function getPurchasedImages(Shutter: Contract) {
    const result = await Shutter.getAllOriginalImages();

    // Assuming each tuple contains: creatorAddress, originalImageHash, watermarkedImageHash, and purchaseCount
    const formattedResult = result.map((tuple: any) => {
        return {
            creatorAddress: tuple[0],           // First item in the tuple is the creator's address
            originalImageHash: tuple[1],        // Second item is the original image hash (IPFS CID)
            watermarkedImageHash: tuple[2],     // Third item is the watermarked image hash (IPFS CID)
            attestationId: Number(tuple[3])  // Fourth item is the purchase count (convert from BigNumber)
        };
    });

    return formattedResult;
    
}