// (If using Next.js - IDKitWidget must be run on client)
'use client'
import { useUserWallets, useDynamicContext } from '@/lib/dynamic';
import { IDKitWidget, VerificationLevel } from '@worldcoin/idkit';
import { getWeb3Provider, getSigner } from '@dynamic-labs/ethers-v6'
import { useState } from 'react';
import { ABI, SHUTTER_CONTRACT } from 'utils/consts';
import { useWriteContract, useSimulateContract, useWaitForTransactionReceipt } from 'wagmi';
import { Contract } from "ethers";

const Personhood = () => {
  const { primaryWallet } = useDynamicContext();
  const userWallets = useUserWallets();

  const lightlyVerify = async (contract: string, wallet: string, proof: any) => {
    if (!primaryWallet) {
      console.error("No primary wallet connected");
      return null;
    };
    if (userWallets.length === 0) {
      console.error("No wallets connected");
      return null;
    };

    const signer = await getSigner(primaryWallet);

    // const { data } = useSimulateContract({
    //   address: `0x${contract.split('0x')[1]}`,
    //   abi: ABI,
    //   functionName: 'lightVerify',
    //   args: [`0x${wallet.split('0x')[1]}`]
    //   // args: [`0x${wallet.split('0x')[1]}`, proof.merkle_root, proof.nullifier_hash, proof.proof]
    // });

    const Shutter = new Contract(SHUTTER_CONTRACT, ABI, signer);
    const response = await Shutter.lightVerify(await signer.getAddress());
    await response.wait();
    console.log("Response from contract call: ", response);

    // const { data: writedata, write } = writeContract(data!.request);
    // const { isLoading, isSuccess } = useWaitForTransactionReceipt({
    //   hash: data,
    // });

  }

  // TODO: Calls your implemented server route
  const verifyProof = async (proof: any) => {
    console.log(proof);
    for (const wallet of userWallets) {
      console.log(wallet.address);
      await lightlyVerify(SHUTTER_CONTRACT, wallet.address, proof);
    }
    //   throw new Error("TODO: verify proof server route")
  };

  // TODO: Functionality after verifying
  const onSuccess = () => {
    console.log("Success")
  };

  return (
    <IDKitWidget
      app_id="app_staging_2fea25caed39f49f896fe7563b5f764e"
      action="verify-personhood"
      // On-chain only accepts Orb verifications
      verification_level={VerificationLevel.Device}
      handleVerify={verifyProof}
      onSuccess={onSuccess}>
      {({ open }) => (
        <button
          onClick={open}
          className="bg-blue-800 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition duration-300"
        >
          Verify with World ID
        </button>
      )}
    </IDKitWidget>
  );
}

export default Personhood;