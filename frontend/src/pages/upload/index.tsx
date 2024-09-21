"use client";
import ImageFullScreen from "@/components/ImageFullScreen/ImageFullScreen";
import Layout from "@/components/Layout/Layout";
import { useDynamicContext, useUserWallets } from "@/lib/dynamic";
import { getSigner } from "@dynamic-labs/ethers-v6";
// import fs from 'fs';
import React, { useState, ChangeEvent, useEffect } from "react";
import { ABI, IMAGE_MAGIC_URL, ORB_VERIFICATION, SHUTTER_CONTRACT } from "utils/consts";
import { Contract } from "ethers";
import { IDKitWidget, VerificationLevel } from "@worldcoin/idkit";
import axios from "axios";

// function readFileAsBuffer(filePath: any) {
//   return new Promise((resolve, reject) => {
//       fs.readFile(filePath, (err: any, data: any) => {
//           if (err) {
//               reject(err);
//           } else {
//               resolve(data);
//           }
//       });
//   });
// }

async function performImageMagic(image: File) {
  try {
    // Read the file as a buffer
    const reader = new FileReader();
    const fileBuffer = await new Promise((resolve, reject) => {
      reader.onload = () => resolve(Buffer.from(reader.result as ArrayBuffer));
      reader.onerror = (error) => reject(error);
      reader.readAsArrayBuffer(image);
    });

    const type = image.type;
    console.log("Type: ", type);

    // Set up axios request config
    const config = {
      method: "put", // PUT method for your Cloud Function
      url: IMAGE_MAGIC_URL,
      headers: {
        "Content-Type": type,
      },
      data: fileBuffer, // Pass the file buffer as the request body
    };

    // Make the HTTP request to the Cloud Function
    const response = await axios(config);

    // Log or process the response
    console.log("Response:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Error calling Cloud Function:", error.message);
  }
}

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
    // setIsVerified(true);
    
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

  useEffect(() => {
    checkVerificationLevel();
  }, [primaryWallet]);

  const handleImageUpload = async (file: File) => {
    if (!(await allSet())) return;
    
    setSubmitting("Checking verification level");
    const signer = await getSigner(primaryWallet!);
    const Shutter = new Contract(SHUTTER_CONTRACT, ABI, signer);
    const verification_level = await checkVerificationLevel();
    if (verification_level! < 1) {
      console.error("Verification level too low");
      return;
    }

    setSubmitting("Performing Image Magic");
    const res: any = await performImageMagic(file);
    console.log("Image magic response: ", res);

    setSubmitting("Storing on-chain");
    const uploadRes = await Shutter.uploadContent(res.watermarkedImageHash, res.originalImageHash, price);
    await uploadRes.wait();

    setSubmitting("Upload Content");
  }

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

  const handleSubmit = async () => {
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
    await handleImageUpload(image);
    setError(null);
  };
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl min-h-screen bg-gray-100 text-gray-800">
        <h1 className="text-4xl font-bold text-center mb-8">Upload Your Photo</h1>
        
        <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Step 1: Verification</h2>
          {verificationLevel == 0 ? (
            <div className="flex flex-col items-center">
              <p className="mb-4 text-center text-lg">Please verify with World ID to unlock upload functionality.</p>
              <IDKitWidget
                app_id={process.env.NEXT_PUBLIC_UPLOAD_ID as any}
                action="verify-personhood"
                verification_level={VerificationLevel.Device}
                handleVerify={verifyProof}
                onSuccess={onSuccess}>
                {({ open }) => (
                  <button
                    onClick={open}
                    className="bg-blue-600 text-white px-8 py-3 rounded-full hover:bg-blue-700 transition duration-300 text-lg font-semibold"
                  >
                    Verify with World ID
                  </button>
                )}
              </IDKitWidget>
            </div>
          ) : (
            <div className="flex items-center justify-center bg-green-100 text-green-800 px-6 py-3 rounded-full text-lg">
              <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Verified with World ID - You can now upload your photo
            </div>
          )}
        </div>

        <div className={`bg-white shadow-lg rounded-lg p-6 ${verificationLevel == 0 ? 'opacity-50 pointer-events-none' : ''}`}>
          <h2 className="text-2xl font-semibold mb-4">Step 2: Upload Your Photo</h2>
          {verificationLevel == 0 && (
            <div className="absolute inset-0 bg-gray-200 bg-opacity-50 flex items-center justify-center z-10 rounded-lg">
              {/* <p className="text-xl font-semibold text-gray-600">Please complete verification to unlock</p> */}
            </div>
          )}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="flex flex-col items-center justify-center w-full">
              <label
                htmlFor="image-upload"
                className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors duration-300"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg
                    className="w-10 h-10 mb-3 text-gray-800"
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
                  <p className="mb-2 text-sm text-gray-800">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-600">
                    PNG, JPG, or GIF (Max. 5MB)
                  </p>
                </div>
                <input
                  id="image-upload"
                  type="file"
                  className="hidden"
                  onChange={handleImageChange}
                  accept="image/*"
                  disabled={verificationLevel == 0}
                />
              </label>
              {preview && (
                <div className="mt-4 overflow-hidden">
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
                <label className="label">
                  <span className="label-text font-semibold">Price (USDC)</span>
                  <span className="label-text-alt">Max $100.00</span>
                </label>
                <label className="input-group">
                  <span className="bg-gray-200">$</span>
                  <input
                    type="text"
                    placeholder="Enter price (e.g., 99.99)"
                    className="input input-bordered w-full bg-white"
                    value={price}
                    onChange={handlePriceChange}
                    disabled={verificationLevel == 0}
                  />
                </label>
                {error && error.includes("price") && (
                  <label className="label">
                    <span className="label-text-alt text-red-500">{error}</span>
                  </label>
                )}
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Tags</span>
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Add a tag"
                    className="input input-bordered flex-grow bg-white"
                    value={currentTag}
                    onChange={handleTagChange}
                    onKeyDown={(e) => e.key === "Enter" && handleAddTag()}
                    disabled={verificationLevel == 0}
                  />
                  <button
                    className="btn bg-blue-600 text-white hover:bg-blue-700"
                    onClick={handleAddTag}
                    disabled={verificationLevel == 0}
                  >
                    Add
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag) => (
                  <div
                    key={tag}
                    className="badge gap-2 p-3 bg-blue-100 text-blue-800"
                  >
                    {tag}
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="btn btn-xs btn-circle btn-ghost text-blue-800"
                      disabled={verificationLevel == 0}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {error && !error.includes("price") && (
            <div className="alert alert-error mt-6 bg-red-100 text-red-800 rounded-lg p-4">
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

          <div className="mt-8">
            <button
              className={`btn btn-primary btn-block py-3 text-lg font-semibold ${
                verificationLevel > 0
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-gray-400 cursor-not-allowed"
              } transition-all duration-300`}
              onClick={handleSubmit}
              disabled={verificationLevel == 0}
            >
              {submitting}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UploadPage;
