"use client";

import clsx from "clsx";

import { Suspense } from "react";
import { ImageDataType } from "utils/Types";
import Loading from "./Loading";
import NextImage from "./NextImage";
import React from "react";

export default function ImageGrid({ data }: { data: Array<ImageDataType> }) {
  return (
    <Suspense fallback={<Loading />}>
      <main
        className={clsx(
          "h-screen",
          "mt-4 columns-1 gap-x-4 gap-y-4",
          "md:columns-2",
          "lg:columns-3 lg:gap-x-8"
        )}
      >
        {data.map(({ _id, imageUrl, alt, ratio }) => (
          <NextImage key={_id} image={imageUrl} alt={alt} ar={ratio} />
        ))}
      </main>
    </Suspense>
  );
}
