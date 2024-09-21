"use client";

import clsx from "clsx";
import Image from "next/image";
import { useState } from "react";
import ImageFullScreen from "../ImageFullScreen/ImageFullScreen";
import React from "react";
import { ShoppingCart } from "lucide-react";

type Image = {
  image: string;
  alt: string;
  ar: string;
  purchaseCount: number;
};

export default function NextImage({ image, alt, ar, purchaseCount: initialPurchases }: Image) {
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [purchaseCount, setPurchaseCount] = useState(initialPurchases);

  const openModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <figure
        className={clsx(
          "group relative mb-4 overflow-hidden rounded bg-neutral-two dark:bg-neutral-nine hover:cursor-pointer",
          "md:mb-4",
          "lg:mb-8",
          ar === "square"
            ? "aspect-square"
            : ar === "landscape"
            ? "aspect-video"
            : "aspect-portrait"
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={openModal}
      >
        <Image
          loading={ar === "portrait" ? "eager" : "lazy"}
          priority={ar === "portrait" ? true : false}
          sizes="(min-width: 66em) 33vw, (min-width: 44em) 50vw, 100vw"
          alt={alt}
          src={image}
          width={2000}
          height={2000}
          className={clsx(
            "object-cover duration-700 ease-in-out group-hover:cursor-pointer group-hover:opacity-90",
            isLoading
              ? "scale-120 blur-2xl grayscale"
              : "scale-100 blur-0 grayscale-0"
          )}
          onLoad={() => setIsLoading(false)}
        />
        {/* Always visible purchase count */}
        <div className="absolute bottom-2 left-2 bg-white bg-opacity-75 px-2 py-1 rounded-full text-xs font-medium flex items-center shadow-md">
          <ShoppingCart className="w-3 h-3 mr-1 text-gray-600" />
          <span className="text-gray-800">{purchaseCount} purchased</span>
        </div>
        {/* Hover effect (optional, you can remove this if not needed) */}
        {isHovered && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            {/* You can add additional hover content here if needed */}
          </div>
        )}
      </figure>

      {isModalOpen && (
        <ImageFullScreen
          setIsModalOpen={setIsModalOpen}
          imageUrl={image}
          isOpen={isModalOpen}
        />
      )}
    </>
  );
}