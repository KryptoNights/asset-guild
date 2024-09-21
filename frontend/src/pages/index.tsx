"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Camera, Upload } from "lucide-react";
import ImageGrid from "@/components/ImageGrid/ImageGrid";
import Layout from "@/components/Layout/Layout";
import { ImageDataType } from "utils/Types";
import { getAllImages } from "@/apis/graph";
import { timeStamp } from "console";

export default function Page() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState<ImageDataType[]>([]); // Initialize images as an empty array

  // Fetch images from API
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await getAllImages();
        console.log("count", response);

        // Map the API response to match the expected format for images
        const formattedImages = response.map((image: any) => ({
          _id: image.id, // Use the image ID as key
          imageUrl: image.imageUrl, // URL to display image
          alt: `Image by ${image.creator}`, // Set alt text based on creator or other metadata
          ratio: 1, // Adjust the aspect ratio if necessary
          price: image.price,
          purchaseCount: image.purchaseCount,
          timeStamp: image.timeStamp,
        }));

        setImages(formattedImages);
      } catch (error) {
        console.error("Error fetching images:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  // Hardcoded data for fallback or testing
  const fallbackData: ImageDataType[] = [
    {
      _id: "1",
      title: "Mountain Lake",
      ratio: "square",
      category: "Nature",
      imageUrl:
        "https://images.unsplash.com/photo-1499696010180-025ef6e1a8f9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
      alt: "Mountain lake surrounded by trees",
      purchaseCount: 0,
    },
  ];
  console.log("images", images);

  const categories = Array.from(
    new Set(fallbackData.map((item) => item.category))
  );

  // Conditionally filter based on selected category and fetched images
  const filteredData = selectedCategory
    ? images.filter((item) => item.category === selectedCategory)
    : images.length > 0
    ? images // Use fetched images if available
    : fallbackData; // Otherwise use fallback data
  console.log("asdkn", filteredData);

  return (
    <Layout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-indigo-700">
              Web3 Stock Photos
            </h1>
            <p className="text-lg sm:text-xl text-gray-600">
              Decentralized marketplace for unique stock photos
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() =>
                  setSelectedCategory(
                    category === selectedCategory ? null : category
                  )
                }
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                  category === selectedCategory
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="text-center text-gray-600">Loading images...</div>
          ) : (
            <ImageGrid data={filteredData} />
          )}

          <div className="mt-16 text-center">
            <Link
              href="/upload"
              className="inline-flex items-center bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors duration-200 text-lg font-medium"
            >
              <Upload className="w-5 h-5 mr-2" />
              Upload Your Photo
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
