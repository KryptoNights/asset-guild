"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Camera, Upload, Loader } from "lucide-react";
import ImageGrid from "@/components/ImageGrid/ImageGrid";
import Layout from "@/components/Layout/Layout";
import { ImageDataType } from "utils/Types";
import { getAllImages } from "@/apis/graph";
import UPLOAD from "public/icons/User Interface Icons/Sharp/BLACK/PNG/upload-sharp.png";
import Image from "next/image";
export default function Page() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState<ImageDataType[]>([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await getAllImages();
        console.log("allimages", response);

        const formattedImages = response.map((image: any) => ({
          _id: image.id,
          imageUrl: image.imageUrl,
          alt: `Image by ${image.creator}`,
          ratio: 1,
          price: image.price,
          contentHash: image.contentHash,
          purchaseCount: image.purchaseCount,
          buyPrice: image.price,
          timeStamp: image.timeStamp,
          creator: image.creator,
          category: image.category || "Uncategorized", // Ensure each image has a category
        }));
        // console.log(response);
        setImages(formattedImages);
      } catch (error) {
        console.error("Error fetching images:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  const categories = Array.from(new Set(images.map((item) => item.category)));

  const filteredData = selectedCategory
    ? images.filter((item) => item.category === selectedCategory)
    : images;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 min-h-screen ">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary">
            ⌐◑-◑ Web3 Stock Gaming Assets
          </h1>
          <p className="text-lg md:text-xl text-base-content opacity-75">
            Decentralized marketplace for unique assests
          </p>
        </div>
        <div className="mt-16 text-center">
          <Link href="/upload" className="btn btn-primary btn-lg gap-2">
            <Image src={UPLOAD} alt={""} width={20} height={20} /> Upload Your
            Assets
          </Link>
        </div>
        {/* 
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`btn btn-sm ${
              !selectedCategory ? "btn-primary" : "btn-outline"
            }`}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`btn btn-sm ${
                category === selectedCategory ? "btn-primary" : "btn-outline"
              }`}
            >
              {category}
            </button>
          ))}
        </div> */}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader className="animate-spin h-8 w-8 text-primary" />
          </div>
        ) : filteredData.length > 0 ? (
          <ImageGrid data={filteredData} />
        ) : (
          <div className="text-center text-base-content opacity-75">
            No images found. Be the first to upload!
          </div>
        )}
      </div>
    </Layout>
  );
}
