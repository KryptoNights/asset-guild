"use client";

import clsx from "clsx";

import { Suspense } from "react";
import { ImageDataType } from "utils/Types";
import Loading from "./Loading";
import NextImage from "./NextImage";
import React from "react";

export default function ImageGrid({ data }: { data: Array<ImageDataType> }) {
  return (
    <main className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-max">
      {data.map(({ _id, imageUrl, alt, ratio, purchaseCount, creator }) => (
        <NextImage
          key={_id}
          image={imageUrl}
          creator={creator}
          alt={alt}
          ar={ratio}
          purchaseCount={purchaseCount}
        />
      ))}
    </main>
  );
}
