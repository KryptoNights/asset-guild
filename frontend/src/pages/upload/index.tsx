"use client";
import ImageFullScreen from "@/components/ImageFullScreen/ImageFullScreen";
import Layout from "@/components/Layout/Layout";
import { useDynamicContext, useUserWallets } from "@/lib/dynamic";
import { getSigner } from "@dynamic-labs/ethers-v6";
// import fs from 'fs';
import React, { useState, ChangeEvent, useEffect } from "react";
import { ABI, IMAGE_MAGIC_URL, SHUTTER_CONTRACT } from "utils/consts";
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

    // Set up axios request config
    const config = {
      method: "put", // PUT method for your Cloud Function
      url: IMAGE_MAGIC_URL,
      headers: {
        "Content-Type": "image/jpeg", // Adjust content type based on your file type
      },
      data: fileBuffer, // Pass the file buffer as the request body
    };

    // Make the HTTP request to the Cloud Function
    const response = await axios(config);

    // Log or process the response
    console.log("Response:", response.data);
  } catch (error: any) {
    console.error("Error calling Cloud Function:", error.message);
  }
}

const UploadPage = () => {
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

  const allSet = (): boolean => {
    if (!primaryWallet) {
      console.error("No primary wallet connected");
      return false;
    }
    if (userWallets.length === 0) {
      console.error("No wallets connected");
      return false;
    }
    return true;
  };

  const lightlyVerify = async (
    contract: string,
    wallet: string,
    proof: any
  ) => {
    if (!allSet()) return;

    const signer = await getSigner(primaryWallet!);

    const Shutter = new Contract(SHUTTER_CONTRACT, ABI, signer);
    const response = await Shutter.lightVerify(await signer.getAddress());
    await response.wait();
    console.log("Response from contract call: ", response);
  };

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
    console.log("Success");
  };

  const checkVerificationLevel = async () => {
    if (!allSet()) return;
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

  const handleImageUpload = async (filePath: string) => {
    if (!allSet()) return;
    const signer = await getSigner(primaryWallet!);
    const Shutter = new Contract(SHUTTER_CONTRACT, ABI, signer);
    const verification_level = await checkVerificationLevel();
    if (verification_level! < 1) {
      console.error("Verification level too low");
      return;
    }
  };

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
    handleImageUpload("test.jpg");
    setError(null);
  };

  return (
    <Layout>
      {" "}
      <>
        <div className="container mx-auto px-4 py-8 max-w-4xl h-screen  text-white overflow-hidden">
          {verificationLevel == 0 ? (
            <IDKitWidget
              app_id="key"
              action="verify-personhood"
              verification_level={VerificationLevel.Device}
              handleVerify={verifyProof}
              onSuccess={onSuccess}
            >
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
                  Submit Image
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
