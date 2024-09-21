import React, { useState } from "react";
import { X, Heart, Download, Share2 } from "lucide-react";
import Image from "next/image";
import { Button, Modal } from "@mui/material";
import clsx from "clsx";
import { useRouter } from "next/router";

const ImageFullScreen = ({
  isOpen,
  setIsModalOpen,
  imageUrl,
}: {
  isOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
  imageUrl: string;
}) => {
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const router = useRouter();

  return (
    <Modal open={isOpen} onClose={() => setIsModalOpen(false)}>
      <div className="fixed inset-0 bg-black/95 z-50 flex flex-col md:flex-row m-10">
        {/* Close button */}
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10"
          onClick={() => setIsModalOpen(false)}
        >
          <X className="h-6 w-6" />
        </button>

        {/* Image container */}
        <div className="relative flex-grow md:w-3/4 h-[60vh] md:h-full">
          <Image
            src={imageUrl}
            alt="Full screen image"
            layout="fill"
            objectFit="contain"
            className={clsx(
              "duration-300 ease-in-out",
              loading ? "scale-95 blur-lg" : "scale-100 blur-0"
            )}
            onLoad={() => setLoading(false)}
          />
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </div>

        {/* Info sidebar */}
        <div className="w-full md:w-1/4 bg-gray-900 p-6 overflow-y-auto">
          <h2 className="text-2xl font-bold text-white mb-4">Image Title</h2>

          <div className="flex items-center mb-6">
            <Image
              src={imageUrl} // Replace with actual avatar URL when available
              alt="Photographer"
              width={40}
              height={40}
              className="rounded-full mr-3"
            />
            <p className="text-lg text-white">Photographer Name</p>
          </div>

          <p className="text-gray-300 mb-6 leading-relaxed">
            This is a placeholder for the image description. It can be a longer
            text describing the image and its context.
          </p>

          <div className="flex space-x-4 mb-6">
            <button
              onClick={() => setLiked(!liked)}
              className={clsx(
                "p-2 rounded-full transition-colors",
                liked
                  ? "bg-red-500 text-white"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              )}
            >
              <Heart className="h-6 w-6" />
            </button>
            <button className="p-2 rounded-full bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors">
              <Download className="h-6 w-6" />
            </button>
            <button className="p-2 rounded-full bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors">
              <Share2 className="h-6 w-6" />
            </button>
          </div>

          <div className="text-sm text-gray-400 space-y-2">
            <p>Uploaded on: {new Date().toLocaleDateString()}</p>
            <p>Resolution: 3000 x 2000</p>
            <p>Category: Nature</p>
          </div>

          <button
            className="text-sm text-gray-400 space-y-2 bg-primary"
            onClick={() => {
              router.push("/buy");
            }}
          >
            Buy now
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ImageFullScreen;
