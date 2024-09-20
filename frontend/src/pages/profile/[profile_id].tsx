import Layout from "@/components/Layout/Layout";
import React from "react";
import Image from "next/image";
import { FaUser } from "react-icons/fa"; // Add this import for the user icon
import { useRouter } from "next/router";

// Add this function to create a slug from the user name

const ProfilePage = () => {
  const router = useRouter();
  const { profile_id }: any = router.query;
  console.log(profile_id);
  // Dummy data
  const userName = "John Doe"; // Add this line for the user's name
  const userSlug = profile_id; // Create slug from user name
  const userAddress = "0x1234...5678";
  const userBalance = "1.23 ETH";
  const userCollections = [
    { id: 1, name: "Collection 1", image: "/assets/sample-photo.avif" },
    { id: 2, name: "Collection 2", image: "/assets/sample-photo.avif" },
    { id: 3, name: "Collection 3", image: "/assets/sample-photo.avif" },
  ];
  const userWatchlist = [
    { id: 1, name: "Item 1", image: "/assets/sample-photo.avif" },
    { id: 2, name: "Item 2", image: "/assets/sample-photo.avif" },
    { id: 3, name: "Item 3", image: "/assets/sample-photo.avif" },
  ];
  const userUploadedImages = [
    { id: 1, name: "Upload 1", image: "/assets/sample-photo.avif" },
    { id: 2, name: "Upload 2", image: "/assets/sample-photo.avif" },
    { id: 3, name: "Upload 3", image: "/assets/sample-photo.avif" },
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-black text-white p-8">
        <div className="max-w-full mx-auto">
          <div className="bg-gray-900 rounded-lg p-6 mb-8 flex items-center">
            <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center mr-6">
              <FaUser className="text-4xl text-gray-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold mb-2">{userName}</h1>
              <p className="mb-1">Address: {userAddress}</p>
              <p>Balance: {userBalance}</p>
              <p>Slug: {userSlug}</p> {/* Display the slug */}
            </div>
          </div>

          {/* New section for user uploaded images */}
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">User Collection </h2>
            <div className="grid grid-cols-3 gap-4">
              {userUploadedImages.map((upload) => (
                <div key={upload.id} className="bg-gray-800 rounded-lg p-4">
                  <Image
                    src={upload.image}
                    alt={upload.name}
                    width={300}
                    height={300}
                    className="rounded-lg mb-2 w-full h-auto"
                  />
                  <p className="text-center">{upload.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;
function useNavigation() {
  throw new Error("Function not implemented.");
}
