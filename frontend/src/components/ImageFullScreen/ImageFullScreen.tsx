import React, { useState, useRef } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import {
  HeartIcon,
  DownloadIcon,
  ShareIcon,
  XIcon,
  ClipboardCopyIcon,
} from "@heroicons/react/outline";
import { CheckIcon } from "@heroicons/react/solid";
import { useEnsAvatar, useEnsName } from "wagmi";
import THUMBSUP from "public/icons/User Interface Icons/Sharp/WHITE/PNG/thumbs-up-sharp.png";
import SHARE from "public/icons/User Interface Icons/Sharp/WHITE/PNG/share-sharp.png";
import DOWNLOAD from "public/icons/User Interface Icons/Sharp/WHITE/PNG/download-cloud-sharp.png";
import {
  useDynamicContext,
  useUserWallets,
} from "@dynamic-labs/sdk-react-core";
import { getSigner } from "@dynamic-labs/ethers-v6";
import { Contract } from "ethers";
import { purchaseContent } from "utils/transitions";
import {
  ABI,
  IMAGE_MAGIC_URL,
  ORB_VERIFICATION,
  SHUTTER_CONTRACT,
} from "utils/consts";

const ImageFullScreen = ({
  isOpen,
  setIsModalOpen,
  imageUrl,
  title,
  photographer,
  description,
  contentHash,
  purchaseCount,
  buyPrice,
  creator,
}: {
  isOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
  imageUrl: string;
  title: string;
  photographer: string;
  description: string;
  contentHash: any;
  purchaseCount: number;
  buyPrice: string | number;
  creator: any;
}) => {
  const [liked, setLiked] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const linkInputRef = useRef<HTMLInputElement>(null);

  const { primaryWallet } = useDynamicContext();
  const userWallets = useUserWallets();

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
  const handleBuy = async () => {
    if (!allSet()) return;

    const signer = await getSigner(primaryWallet!);
    const Shutter = new Contract(SHUTTER_CONTRACT, ABI, signer);

    try {
      const response = await purchaseContent(
        Shutter,
        creator,
        contentHash,
        "100"
      );
      console.log("response", response);

      // Wait for the transaction to be mined
      await response.wait();

      // Show success toast
      toast.success("Image purchased successfully!", {
        duration: 3000,
        position: "top-right",
      });
    } catch (error) {
      console.error("Purchase failed:", error);

      // Show error toast
      toast.error("Image purchase failed. Please try again.", {
        duration: 3000,
        position: "top-right",
      });
    }
  };

  const handleDownload = () => {
    // Implement download logic here
    console.log("Downloading image...");
  };
  const handleCopyLink = () => {
    if (linkInputRef.current) {
      linkInputRef.current.select();
      document.execCommand("copy");
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  if (!isOpen) return null;
  const { data: name } = useEnsName({
    address: (creator as `0x${string}`) || "",
    chainId: 1,
  });
  // const { data: name } = useEnsName({
  //   address:
  //     ("0xb8c2c29ee19d8307cb7255e1cd9cbde883a267d5" as `0x${string}`) || "",
  //   chainId: 1,
  // });

  const { data: avatar } = useEnsAvatar({ name: name ?? "" });

  // Convert buyPrice to string if it's not already
  const formattedPrice = typeof buyPrice === 'number' ? buyPrice.toString() : buyPrice;

  return (
    <div className="modal modal-open" onClick={() => setIsModalOpen(false)}>
      <div
        className="modal-box w-11/12 max-w-5xl h-5/6 p-0 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="btn btn-sm btn-circle absolute right-2 top-2 z-10"
          onClick={() => setIsModalOpen(false)}
        >
          <XIcon className="h-5 w-5" />
        </button>

        <div className="flex flex-col md:flex-row h-full">
          {/* Image container */}
          <div className="relative w-full md:w-2/3 h-1/2 md:h-full bg-gray-100">
            <div className="absolute inset-0 flex items-center justify-center">
              <Image
                src={imageUrl}
                alt={title}
                layout="fill"
                objectFit="contain"
                className="rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none"
              />
            </div>
          </div>

          {/* Info section */}
          <div className="w-full md:w-1/3 p-6 flex flex-col h-1/2 md:h-full">
            <h2 className="text-2xl font-bold text-base-content mb-2">
              {title}
            </h2>
            <p className="text-sm text-base-content/70 mb-4 flex center">
              <div className=" bottom-0 left-0 right-0 p-2  bg-opacity-50 text-white text-sm flex gap-2">
                <div>
                  <img
                    src={avatar || "https://docs.ens.domains/fallback.svg"}
                    alt="Avatar"
                    className="w-6 h-6 rounded-full inline-block"
                  />
                </div>
                <div>
                  {name || `${creator.slice(0, 6)}..${creator.slice(-4)}`}
                </div>
              </div>
            </p>

            {/* <div className="flex-grow mb-4 overflow-y-auto">
              <p className="text-base-content/80">{description}</p>
            </div> */}

            <div className="flex justify-between items-center mb-4">
              <div className="flex space-x-2">
                <button
                  onClick={() => setLiked(!liked)}
                  className={`btn btn-circle btn-sm ${
                    liked ? "btn-primary" : "btn-ghost"
                  }`}
                >
                  <Image src={THUMBSUP} width={20} height={20} alt={""} />
                </button>
                <button
                  onClick={handleDownload}
                  className="btn btn-circle btn-sm btn-ghost"
                >
                  <Image src={DOWNLOAD} width={20} height={20} alt={""} />
                </button>
                <button
                  className="btn btn-circle btn-sm btn-ghost"
                  onClick={() => setIsShareOpen(!isShareOpen)}
                >
                  <Image src={SHARE} width={20} height={20} alt={""} />
                </button>
              </div>
              <div className="text-sm text-base-content/70">
                <span className="font-semibold">{purchaseCount}</span> purchased
              </div>
            </div>

            {isShareOpen && (
              <div className="bg-base-200 p-3 rounded-lg mb-4">
                <h3 className="text-sm font-semibold mb-2">Share this image</h3>
                <div className="flex">
                  <input
                    ref={linkInputRef}
                    type="text"
                    value={imageUrl}
                    readOnly
                    className="input input-bordered input-sm flex-grow mr-2"
                  />
                  <button
                    onClick={handleCopyLink}
                    className="btn btn-sm btn-primary"
                  >
                    {isCopied ? (
                      <CheckIcon className="h-4 w-4" />
                    ) : (
                      <ClipboardCopyIcon className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            )}

            <div className="mt-auto">
              <p className="text-lg font-semibold text-center mb-2">
                Price: {formattedPrice} WEI
              </p>
              <button
                className="btn btn-primary w-full"
                onClick={() => {
                  handleBuy();
                }}
              >
                Buy now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageFullScreen;
