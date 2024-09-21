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

export default function NextImage({
  image,
  alt,
  ar,
  purchaseCount: initialPurchases,
}: Image) {
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [purchaseCount, setPurchaseCount] = useState(initialPurchases);

  const openModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsModalOpen(true);
  };

  console.log("hh", ar);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <figure
        className={clsx(
          "group relative mb-4 overflow-hidden rounded bg-neutral-two dark:bg-neutral-nine hover:cursor-pointer",
          "md:mb-4",
          "lg:mb-8",
          "aspect-[3/4]" // Set aspect ratio to 3:4
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={openModal}
      >
        <Image
          loading="lazy" // Set loading to lazy for all images
          priority={false} // Set priority to false for all images
          sizes="(min-width: 66em) 33vw, (min-width: 44em) 50vw, 100vw"
          alt={alt}
          src={image}
          layout="fill" // Make the image fill the parent div
          className={clsx(
            "object-cover duration-700 ease-in-out group-hover:cursor-pointer group-hover:opacity-90",
            isLoading
              ? "scale-120 blur-2xl grayscale"
              : "scale-100 blur-0 grayscale-0"
          )}
          onLoad={() => setIsLoading(false)}
        />
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
