import React, { useState, useRef } from "react";
import Image from "next/image";
import {
  HeartIcon,
  DownloadIcon,
  ShareIcon,
  XIcon,
  ClipboardCopyIcon,
} from "@heroicons/react/outline";
import { CheckIcon } from "@heroicons/react/solid";

const ImageFullScreen = ({
  isOpen,
  setIsModalOpen,
  imageUrl,
  title,
  photographer,
  description,
  purchaseCount,
}: {
  isOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
  imageUrl: string;
  title: string;
  photographer: string;
  description: string;
  purchaseCount: number;
}) => {
  const [liked, setLiked] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const linkInputRef = useRef<HTMLInputElement>(null);

  const handleDownload = () => {
    // Implement download logic here
    console.log("Downloading image...");
  };

  const handleCopyLink = () => {
    if (linkInputRef.current) {
      linkInputRef.current.select();
      document.execCommand('copy');
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box w-11/12 max-w-5xl h-5/6 p-0 relative">
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
            <h2 className="text-2xl font-bold text-base-content mb-2">{title}</h2>
            <p className="text-sm text-base-content/70 mb-4">by {photographer}</p>
            
            <div className="flex-grow mb-4 overflow-y-auto">
              <p className="text-base-content/80">{description}</p>
            </div>
            
            <div className="flex justify-between items-center mb-4">
              <div className="flex space-x-2">
                <button
                  onClick={() => setLiked(!liked)}
                  className={`btn btn-circle btn-sm ${liked ? 'btn-primary' : 'btn-ghost'}`}
                >
                  <HeartIcon className="h-5 w-5" />
                </button>
                <button 
                  onClick={handleDownload}
                  className="btn btn-circle btn-sm btn-ghost"
                >
                  <DownloadIcon className="h-5 w-5" />
                </button>
                <button 
                  className="btn btn-circle btn-sm btn-ghost"
                  onClick={() => setIsShareOpen(!isShareOpen)}
                >
                  <ShareIcon className="h-5 w-5" />
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

            <button
              className="btn btn-primary w-full"
              onClick={() => {
                // Implement buy logic
                console.log("Buying image...");
              }}
            >
              Buy now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageFullScreen;
