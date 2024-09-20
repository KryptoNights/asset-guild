import ImageGrid from "@/components/ImageGrid/ImageGrid";
import Layout from "@/components/Layout/Layout";
import Link from "next/link";
import React, { useState } from "react";
import { ImageDataType } from "utils/Types";

export default function Page() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const data: ImageDataType[] = [
    {
      _id: "1",
      title: "Mountain Lake",
      ratio: "square",
      category: "Nature",
      imageUrl:
        "https://images.unsplash.com/photo-1499696010180-025ef6e1a8f9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
      alt: "Mountain lake surrounded by trees",
    },
    {
      _id: "2",
      title: "Vintage Clock",
      ratio: "square",
      category: "Objects",
      imageUrl:
        "https://images.unsplash.com/photo-1432462770865-65b70566d673?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
      alt: "Vintage clock on wooden surface",
    },
    {
      _id: "3",
      title: "Mountain Range",
      ratio: "landscape",
      category: "Nature",
      imageUrl:
        "https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2560&q=80",
      alt: "Mountain range with snow-capped peaks",
    },
    {
      _id: "4",
      title: "Forest Road",
      ratio: "square",
      category: "Nature",
      imageUrl:
        "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2940&q=80",
      alt: "Road through a dense forest",
    },
    {
      _id: "5",
      title: "Mountain Lake",
      ratio: "square",
      category: "Nature",
      imageUrl:
        "https://images.unsplash.com/photo-1499696010180-025ef6e1a8f9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
      alt: "Mountain lake surrounded by trees",
    },
    {
      _id: "6",
      title: "Vintage Clock",
      ratio: "square",
      category: "Objects",
      imageUrl:
        "https://images.unsplash.com/photo-1432462770865-65b70566d673?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
      alt: "Vintage clock on wooden surface",
    },
    {
      _id: "7",
      title: "Mountain Range",
      ratio: "landscape",
      category: "Nature",
      imageUrl:
        "https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2560&q=80",
      alt: "Mountain range with snow-capped peaks",
    },
    {
      _id: "8",
      title: "Forest Road",
      ratio: "square",
      category: "Nature",
      imageUrl:
        "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2940&q=80",
      alt: "Road through a dense forest",
    },
  ];

  const categories = Array.from(new Set(data.map((item) => item.category)));

  const filteredData = selectedCategory
    ? data.filter((item) => item.category === selectedCategory)
    : data;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 h-full">
        <h1 className="text-4xl font-bold mb-6">Web3 Stock Photos</h1>
        <p className="text-xl mb-4">
          Decentralized marketplace for unique stock photos
        </p>

        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() =>
                setSelectedCategory(
                  category === selectedCategory ? null : category
                )
              }
              className={`px-4 py-2 rounded-full text-sm font-semibold ${
                category === selectedCategory
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <ImageGrid data={filteredData} />

        <div className="mt-12 text-center bg-black">
          <Link
            href="/upload"
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600"
          >
            Upload Your Photo
          </Link>
        </div>
      </div>
    </Layout>
  );
}
