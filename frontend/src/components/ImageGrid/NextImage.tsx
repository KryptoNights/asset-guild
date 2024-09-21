"use client";

import clsx from "clsx";
import Image from "next/image";
import { useState } from "react";
import ImageFullScreen from "../ImageFullScreen/ImageFullScreen";
import React from "react";
import { useAccount, useEnsName, useEnsAvatar } from "wagmi";
import { ShoppingCart } from "lucide-react";

type Image = {
  image: string;
  alt: string;
  ar: string;
  purchaseCount: number;
  creator: string;
};

export default function NextImage({
  image,
  alt,
  ar,
  creator,
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

  // console.log("hh", ar);
  const closeModal = () => setIsModalOpen(false);
  const { data: name } = useEnsName({
    address: (creator as `0x${string}`) || "",
    chainId: 1,
  });
  // const { data: name } = useEnsName({
  //   address:
  //     ("0xb8c2c29ee19d8307cb7255e1cd9cbde883a267d5" as `0x${string}`) || "",
  //   chainId: 1,
  // });

  // console.log(creator);
  const { data: avatar } = useEnsAvatar({ name: name ?? "" });

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
        {/* User Info Section */}
        <div className="absolute bottom-0 left-0 right-0 p-2 bg-black bg-opacity-50 text-white text-sm flex gap-2">
          <div>
            <img
              src={avatar || "https://docs.ens.domains/fallback.svg"}
              alt="Avatar"
              className="w-6 h-6 rounded-full inline-block"
            />
          </div>
          <div>{name || `${creator.slice(0, 6)}..${creator.slice(-4)}`}</div>
        </div>
      </figure>

      {isModalOpen && (
        <ImageFullScreen
          setIsModalOpen={setIsModalOpen}
          imageUrl={image}
          creator={creator}
          isOpen={isModalOpen}
          title="Building"
          photographer="sample"
          description="lorem ipsum dolor sit amet"
          purchaseCount={purchaseCount}
        />
      )}
    </>
  );
}
