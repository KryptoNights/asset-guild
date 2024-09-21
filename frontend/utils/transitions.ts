import { Contract, JsonRpcSigner, ethers } from "ethers";

export const purchaseContent = async (contract: Contract, creator: string, contentHash: string, amount: string) => {
    const response = await contract.buyContent(creator, contentHash, { value: ethers.parseEther(amount) });
    await response.wait();
    return response;
}