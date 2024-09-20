import React, { useState } from "react";
import { FaHeart, FaPlus } from "react-icons/fa";
import Image from "next/image";
import ImageFullScreen from "../ImageFullScreen/ImageFullScreen";

const Photocard = ({ tall = false }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsModalOpen(true);
  };
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <div
        className="break-inside-avoid mb-4 relative group"
        onClick={openModal}
      >
        <Image
          src="/assets/sample-photo.avif"
          alt="Sample photo"
          width={300}
          height={tall ? 400 : 200}
          className="w-full rounded-lg"
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity duration-300 rounded-lg"></div>

        {/* Hover overlay */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 flex flex-col justify-between">
          {/* Top buttons */}
          <div className="flex justify-end space-x-2">
            <button className="bg-white rounded-full p-2 hover:bg-gray-200 transition-colors duration-200">
              <FaHeart className="text-gray-700" />
            </button>
            <button className="bg-white rounded-full p-2 hover:bg-gray-200 transition-colors duration-200">
              <FaPlus className="text-gray-700" />
            </button>
          </div>

          {/* Bottom info */}
          <div className="text-white">
            <h3 className="font-semibold text-lg">Photo Title</h3>
            <div className="flex items-center mt-2">
              <Image
                src="/assets/profile-placeholder.jpg"
                alt="Elias Kipfer"
                width={24}
                height={24}
                className="rounded-full mr-2"
              />
              <p className="text-sm">Elias Kipfer</p>
            </div>
          </div>
        </div>

        {/* Download button */}
        <button className="absolute bottom-4 right-4 bg-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-gray-200">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-4 h-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
        </button>
      </div>
      {/* {isModalOpen && <ImageFullScreen closeModal={closeModal} imageUrl={undefined} />} */}
    </>
  );
};

export default Photocard;
