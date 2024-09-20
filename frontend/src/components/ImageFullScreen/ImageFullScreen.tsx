import React from "react";
import { FaTimes, FaHeart, FaDownload } from "react-icons/fa";
import Image from "next/image";
import { Modal } from "@mui/material";
import { truncate } from "fs/promises";
import clsx from "clsx";
const ImageFullScreen = ({
  isOpen,
  setIsModalOpen,
  imageUrl,
}: {
  isOpen: boolean;
  setIsModalOpen: any;
  imageUrl: string;
}) => {
  const [loading, setIsLoading] = React.useState(true);

  return (
    <Modal open={isOpen} onClose={() => setIsModalOpen(false)}>
      <div className="fixed inset-0 bg-black z-10 flex flex-col">
        {/* Close button */}
        <button
          className="absolute top-4 right-4 text-white text-2xl z-999 cursor-pointer"
          onClick={() => setIsModalOpen(false)}
        >
          <FaTimes />
        </button>

        {/* Image info */}
        <div className="text-white p-4 z-10 mt-8">
          <h2 className="text-2xl font-bold mb-2">Photo Title</h2>
          <div className="flex items-center">
            <Image
              src={imageUrl}
              alt="Elias Kipfer"
              width={40}
              height={40}
              className="rounded-full mr-2"
            />
            <p className="text-lg">Elias Kipfer</p>
          </div>
        </div>

        {/* Image container */}
        <div className="flex-grow relative">
          <Image
            fill={true}
            loading={"eager"}
            priority={true}
            sizes="(min-width: 66em) 33vw, (min-width: 44em) 50vw, 100vw"
            alt={"Image"}
            src={imageUrl}
            className={clsx(
              "object-cover duration-700 ease-in-out group-hover:cursor-pointer group-hover:opacity-90",
              loading
                ? "scale-120 blur-2xl grayscale"
                : "scale-100 blur-0 grayscale-0"
            )}
            onLoadingComplete={() => setIsLoading(false)}
          />
          {/* Overlay buttons */}
          <div className="absolute bottom-4 right-4 flex space-x-4">
            <button className="bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-colors duration-200">
              <FaDownload size={24} />
            </button>
            <button className="bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-colors duration-200">
              <FaHeart size={24} />
            </button>
          </div>
        </div>

        {/* Image description */}
        <div className="text-white p-4">
          <p className="text-gray-300">
            Photo description goes here. This can be a longer text describing
            the image.
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default ImageFullScreen;
