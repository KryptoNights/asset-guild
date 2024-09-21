import { Contract, JsonRpcSigner, ethers } from "ethers";

export const purchaseContent = async (contract: Contract, creator: string, contentHash: string, amount: string) => {
    console.log("Purchasing content", creator, contentHash, amount);
    const response = await contract.buyContent(creator, contentHash, { value: ethers.parseUnits(amount, "wei") });
    await response.wait();
    return response;
}