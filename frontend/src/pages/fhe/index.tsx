// "use client";
import ImageFullScreen from "@/components/ImageFullScreen/ImageFullScreen";
import Layout from "@/components/Layout/Layout";
import { useDynamicContext, useUserWallets } from "@/lib/dynamic";
import { getSigner, getWeb3Provider } from "@dynamic-labs/ethers-v6";
// import fs from 'fs';
import React, { useState, ChangeEvent, useEffect } from "react";
import { ABI, FHE_ABI, FHE_CONTRACT, IMAGE_MAGIC_URL, ORB_VERIFICATION, SHUTTER_CONTRACT } from "utils/consts";
import { Contract } from "ethers";
import { IDKitWidget, VerificationLevel } from "@worldcoin/idkit";
import axios from "axios";
import { JsonRpcProvider } from 'ethers';
import { EncryptionTypes, FhenixClient, getPermit } from "fhenixjs";

const UploadPage = () => {
  const [submitting, setSubmitting] = useState<string>("Upload Content");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [price, setPrice] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [verificationLevel, setVerificationLevel] = useState<number>(0);

  const { primaryWallet } = useDynamicContext();
  const userWallets = useUserWallets();

  const MAX_PRICE = 100;

  const allSet = async (): Promise<boolean> => {
    if (!primaryWallet) {
      console.error("No primary wallet connected");
      return false;
    }
    if (userWallets.length === 0) {
      console.error("No wallets connected");
      return false;
    }
    await primaryWallet.switchNetwork(421614);
    return true;
  };

  const sendDataToProtect2 = async () => {
    if (!(await allSet())) return;

    const signer = await getSigner(primaryWallet!);
    const AssetFHE = new Contract(FHE_CONTRACT, FHE_ABI, signer);

    // await primaryWallet?.switchNetwork(8008135);

    const provider = new JsonRpcProvider('https://api.helium.fhenix.zone');
    const client = new FhenixClient({ provider });

    let iek1 = await client.encrypt(1, EncryptionTypes.uint32);
    let iek2 = await client.encrypt(2, EncryptionTypes.uint32);
    let iek3 = await client.encrypt(3, EncryptionTypes.uint32);
    let iek4 = await client.encrypt(4, EncryptionTypes.uint32);
    
    let originalHash = "bafkreihgxdntssf73p2aj4qn47yysdmm2lbowne3yqn3b557sqqi32pnau";

    // let ShutterFHE = new Contract(SHUTTER_CONTRACT, ABI, await getSigner(primaryWallet!));

    // helperValues();
    console.log("IEK1: ", iek1);
    console.log("IEK2: ", iek2);
    console.log("IEK3: ", iek3);
    console.log("IEK4: ", iek4);
    console.log("Original Hash: ", originalHash);
  }

  const sendDataToProtect = async () => {
    if (!(await allSet())) return;

    const signer = await getSigner(primaryWallet!);
    const AssetFHE = new Contract(FHE_CONTRACT, FHE_ABI, signer);

    // await primaryWallet?.switchNetwork(8008135);
    console.log("Sending data to protect 1");

    // const provider = new JsonRpcProvider('https://api.helium.fhenix.zone');
    const provider = await getWeb3Provider(primaryWallet!);
    const client = new FhenixClient({ provider });

    let iek1 = await client.encrypt(1, EncryptionTypes.uint32);
    let iek2 = await client.encrypt(2, EncryptionTypes.uint32);
    let iek3 = await client.encrypt(3, EncryptionTypes.uint32);
    let iek4 = await client.encrypt(4, EncryptionTypes.uint32);
    console.log("Sending data to protect 2");
    
    let originalHash = "bafkreihgxdntssf73p2aj4qn47yysdmm2lbowne3yqn3b557sqqi32pnau";

    // let ShutterFHE = new Contract(SHUTTER_CONTRACT, ABI, await getSigner(primaryWallet!));

    // helperValues();
    console.log("IEK1: ", iek1);
    console.log("IEK2: ", iek2);
    console.log("IEK3: ", iek3);
    console.log("IEK4: ", iek4);
    console.log("Original Hash: ", originalHash);
    console.log("Sending data to protect 3");

    // await primaryWallet?.switchNetwork(8008135);

    const permit = await getPermit(FHE_CONTRACT, provider);
    if (!permit) {
      console.error("Permit not found");
      return;
    }
    console.log("Sending data to protect 4");
    const permission = client.extractPermitPermission(permit);
    client.storePermit(permit);

    let res = await AssetFHE.addHashToProtect(
        originalHash,
        originalHash,
        iek1,
        iek2,
        iek3,
        iek4,
    );
    await res.wait();
    console.log("Sending data to protect 5");

    let getval = await AssetFHE.getOriginalContent(
        originalHash,
        permission.publicKey
    );
    console.log("Sending data to protect 6");
    console.log("Original Content: ", getval);

    console.log("Sending data to protect 7");

    const k1 = await client.unseal(FHE_CONTRACT, getval[1]);
    const kc1 = String.fromCharCode(Number(k1));
    console.log("k1: ", k1, kc1);
    const k2 = await client.unseal(FHE_CONTRACT, getval[2]);
    const kc2 = String.fromCharCode(Number(k2));
    console.log("k2: ", k2, kc2);
    const k3 = await client.unseal(FHE_CONTRACT, getval[3]);
    const kc3 = String.fromCharCode(Number(k3));
    console.log("k3: ", k3, kc3);
    const k4 = await client.unseal(FHE_CONTRACT, getval[4]);
    const kc4 = String.fromCharCode(Number(k4));
    console.log("k4: ", k4, kc4);

    console.log(`ORIGINAL: ${originalHash}`);
    console.log(`OBTAINED: ${getval[0]}${kc1}${kc2}${kc3}${kc4}`);
  }

//   useEffect(() => {
//     sendDataToProtect2();
//   }, [primaryWallet]);

  const lightlyVerify = async (
    contract: string,
    wallet: string,
    proof: any
  ) => {
    if (!(await allSet())) return;

    const signer = await getSigner(primaryWallet!);

    const Shutter = new Contract(SHUTTER_CONTRACT, ABI, signer);
    const response = await Shutter.lightVerify(await signer.getAddress());
    await response.wait();
    console.log("Response from contract call: ", response);
  };

  // TODO: Calls your implemented server route
  const verifyProof = async (proof: any) => {
    console.log(proof);
    if (!(await allSet())) return;

    const signer = await getSigner(primaryWallet!);
    const Shutter = new Contract(SHUTTER_CONTRACT, ABI, signer);
    
    if (ORB_VERIFICATION) {
      Shutter.verifyOrbAndExecute(await signer.getAddress(), proof.merkle_root, proof.nullifier_hash, proof.proof);
    }
    // for (const wallet of userWallets) {
    //   console.log(wallet.address);
    //   await lightlyVerify(SHUTTER_CONTRACT, wallet.address, proof);
    // }
    //   throw new Error("TODO: verify proof server route")
  };

  // TODO: Functionality after verifying
  const onSuccess = async () => {
    console.log("Success");
    
    if (!(await allSet())) return;
    const signer = await getSigner(primaryWallet!);
    const Shutter = new Contract(SHUTTER_CONTRACT, ABI, signer);

    const verification = await Shutter.lightVerify();
    await verification.wait();
  };

  const checkVerificationLevel = async () => {
    if (!(await allSet())) return;
    const signer = await getSigner(primaryWallet!);
    const Shutter = new Contract(SHUTTER_CONTRACT, ABI, signer);
    const verification_level = Number(
      await Shutter.verificationLevel(await signer.getAddress())
    );
    console.log(
      "Verification level: ",
      verification_level,
      typeof verification_level
    );
    setVerificationLevel(verification_level);
    return verification_level;
  };

//   const handleImageUpload = async (file: File) => {
//     if (!(await allSet())) return;
//     setSubmitting("Checking verification level");
//     const signer = await getSigner(primaryWallet!);
//     const Shutter = new Contract(SHUTTER_CONTRACT, ABI, signer);
//     const verification_level = await checkVerificationLevel();
//     if (verification_level! < 1) {
//       console.error("Verification level too low");
//       return;
//     }

//     setSubmitting("Performing Image Magic");
//     const res: any = performImageMagic(file);
//     console.log("Image magic response: ", res);

//     setSubmitting("Storing on-chain");
//     const uploadRes = await Shutter.uploadContent(res.watermarkedImageHash, res.originalImageHash, price);
//     await uploadRes.wait();

//     setSubmitting("Upload Content");
//   }

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        setError("File size should not exceed 5MB");
        return;
      }
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setError(null);
    }
  };

  const handlePriceChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Allow empty input for better UX
    if (value === "") {
      setPrice("");
      setError(null);
      return;
    }

    // Use regex to validate input format
    const regex = /^\d{1,3}(\.\d{0,2})?$/;
    if (regex.test(value) && parseFloat(value) <= MAX_PRICE) {
      setPrice(value);
      setError(null);
    } else if (parseFloat(value) > MAX_PRICE) {
      setError(`Maximum price is $${MAX_PRICE}`);
    } else {
      setError("Invalid price format");
    }
  };

  const handleTagChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCurrentTag(e.target.value);
  };

  const handleAddTag = () => {
    if (currentTag && !tags.includes(currentTag)) {
      setTags([...tags, currentTag]);
      setCurrentTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleSubmit = () => {
    sendDataToProtect();
    return;
    if (!image) {
      setError("Please upload an image");
      return;
    }
    if (!price) {
      setError("Please set a price");
      return;
    }
    if (parseFloat(price) > MAX_PRICE) {
      setError(`Maximum price is $${MAX_PRICE}`);
      return;
    }
    // Implement submission logic here
    console.log("Submitting:", { image, price, tags });
    // handleImageUpload(image);
    setError(null);
  };
  
  return (
    <Layout>
      {" "}
      <>
        <div className="container mx-auto px-4 py-8 max-w-4xl h-screen  text-white overflow-hidden">
          {verificationLevel == 0 ? (
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
                  className="bg-blue-700 text-white px-4 py-2 rounded-full hover:bg-blue-500 transition duration-300 w-full max-w-xs mx-auto"
                >
                  Verify with World ID
                </button>
              )}
            </IDKitWidget>
          ) : (
            <div className="bg-green-900 text-white px-4 py-2 rounded-full hover:bg-green-600 transition duration-300 text-center w-full max-w-xs mx-auto">
              Verified with World ID
            </div>
          )}
          <div className="card bg-gray-800 shadow-xl text-white mt-8 max-h-[80vh] overflow-y-auto">
            <div className="card-body">
              <h2 className="card-title text-4xl font-bold text-center mb-8">
                Upload Your Photo
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="flex flex-col items-center justify-center w-full">
                  <label
                    htmlFor="image-upload"
                    className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-neutral-700 hover:bg-neutral-600 transition-colors duration-300"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <svg
                        className="w-10 h-10 mb-3 text-neutral-200"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        ></path>
                      </svg>
                      <p className="mb-2 text-sm text-neutral-300">
                        <span className="font-semibold">Click to upload</span>{" "}
                        or drag and drop
                      </p>
                      <p className="text-xs text-neutral-500">
                        PNG, JPG, or GIF (Max. 5MB)
                      </p>
                    </div>
                    <input
                      id="image-upload"
                      type="file"
                      className="hidden"
                      onChange={handleImageChange}
                      accept="image/*"
                    />
                  </label>
                  {preview && (
                    <div className="mt-4  overflow-hidden">
                      <img
                        src={preview}
                        alt="Preview"
                        className="max-w-full h-auto rounded-lg shadow-md"
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-6">
                  <div className="form-control">
                    <label className="label text-neutral-300">
                      <span className="label-text font-semibold">
                        Price (USDC)
                      </span>
                      <span className="label-text-alt">Max $100.00</span>
                    </label>
                    <label className="input-group">
                      <span>$</span>
                      <input
                        type="text"
                        placeholder="Enter price (e.g., 99.99)"
                        className="input input-bordered w-full bg-neutral-800 text-white"
                        value={price}
                        onChange={handlePriceChange}
                      />
                    </label>
                    <label className="label">
                      <span className="label-text-alt text-error">
                        {error && error.includes("price") ? error : ""}
                      </span>
                    </label>
                  </div>

                  <div className="form-control">
                    <label className="label text-neutral-300">
                      <span className="label-text font-semibold">Tags</span>
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        placeholder="Add a tag"
                        className="input input-bordered flex-grow bg-neutral-800 text-white"
                        value={currentTag}
                        onChange={handleTagChange}
                        onKeyDown={(e) => e.key === "Enter" && handleAddTag()}
                      />
                      <button
                        className="btn btn-primary bg-blue-700 hover:bg-blue-500"
                        onClick={handleAddTag}
                      >
                        Add
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-2">
                    {tags.map((tag) => (
                      <div
                        key={tag}
                        className="badge badge-primary gap-2 p-3 bg-blue-700"
                      >
                        {tag}
                        <button
                          onClick={() => handleRemoveTag(tag)}
                          className="btn btn-xs btn-circle btn-ghost text-white"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {error && !error.includes("price") && (
                <div className="alert alert-error mt-6">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="stroke-current shrink-0 h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              <div className="card-actions justify-end mt-8">
                <button
                  className="btn btn-primary btn-block py-3 text-lg font-semibold bg-blue-700 hover:bg-blue-500 transition-all duration-300"
                  onClick={handleSubmit}
                >
                  {submitting}
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    </Layout>
  );
};

export default UploadPage;
