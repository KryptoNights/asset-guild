import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaUser, FaFolder, FaStar, FaUpload } from "react-icons/fa";
import Layout from "@/components/Layout/Layout";
import { getPurchasedImages } from "@/apis/graph";
import { useDynamicContext, useUserWallets } from "@/lib/dynamic";
import { getSigner, getWeb3Provider } from "@dynamic-labs/ethers-v6";
import { ABI, FHE_ABI, FHE_CONTRACT, SHUTTER_CONTRACT } from "utils/consts";
import { Contract } from "ethers";
import { FhenixClient, getPermit } from "fhenixjs";

const DUAL_CHAIN_ENABLED = false;

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("Collections");
  const [purchasedImages, setPurchasedImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const { primaryWallet } = useDynamicContext();
  const userWallets = useUserWallets();

  const allSet = async (): Promise<boolean> => {
    if (!primaryWallet) {
      console.error("No primary wallet connected");
      return false;
    }
    if (userWallets.length === 0) {
      console.error("No wallets connected");
      return false;
    }
    await primaryWallet.switchNetwork(421614);
    return true;
  };

  useEffect(() => {
    fetchPurchased();
  }, []);

  const fetchPurchased = async () => {
    setLoading(true);
    if (!(await allSet())) {
      setLoading(false);
      return;
    }

    const signer = await getSigner(primaryWallet!);
    const Shutter = new Contract(SHUTTER_CONTRACT, ABI, signer);

    const images_ = await getPurchasedImages(Shutter);
    console.log(images_);

    let images: any = [];

    if (DUAL_CHAIN_ENABLED) {
      await primaryWallet?.switchNetwork(8008135);
      while (true) {
        if (await primaryWallet?.getNetwork() === 8008135) {
          break;
        }
      }
      const provider = await getWeb3Provider(primaryWallet!);
      const client = new FhenixClient({ provider });
      const AssetGuildFHE = new Contract(FHE_CONTRACT, FHE_ABI, signer);
      
      const permit = await getPermit(FHE_CONTRACT, provider);
      if (!permit) {
        console.error("Permit not found");
        return;
      }
      const permission = client.extractPermitPermission(permit);
      
      for (let i = 0; i < images_.length; i++) {

        let getval = await AssetGuildFHE.getOriginalContent(
          images_[i].watermarkedImageHash,
          permission.publicKey
        );

        const k1 = client.unseal(FHE_CONTRACT, getval[1]);
        const kc1 = String.fromCharCode(Number(k1));

        const k2 = client.unseal(FHE_CONTRACT, getval[2]);
        const kc2 = String.fromCharCode(Number(k2));

        const k3 = client.unseal(FHE_CONTRACT, getval[3]);
        const kc3 = String.fromCharCode(Number(k3));

        const k4 = client.unseal(FHE_CONTRACT, getval[4]);
        const kc4 = String.fromCharCode(Number(k4));


        const original_hash = String(getval[0]) + kc1 + kc2 + kc3 + kc4;

        images.push({
          creatorAddress: images_[i].creatorAddress,
          watermarkedImageHash: images_[i].watermarkedImageHash,
          originalImageHash: original_hash,
          attestationId: images_[i].attestationId,
          image: `https://gateway.lighthouse.storage/ipfs/${original_hash}`,
        });
      }
    }

    if (images.length === 0) {
      images = images_;

      if (images) {
        setPurchasedImages(images);
      }
      setLoading(false);
    }
  };

  // Dummy data for other sections
  const userAddress = "0x1234...5678";
  const userBalance = "1.23 ETH";
  const userName = "John Doe";
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

  const tabs = [
    { name: "Collections", icon: FaFolder },
    { name: "Watchlist", icon: FaStar },
    { name: "Uploads", icon: FaUpload },
  ];

  const renderTabContent = () => {
    const renderGrid = (items: any[]) => (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item: any) => (
          <div
            key={item.id}
            className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105"
          >
            <Image
              src={item.image || "/assets/placeholder-image.jpg"}
              alt={item.name}
              width={300}
              height={300}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-800">
                {item.name}
              </h3>
            </div>
          </div>
        ))}
      </div>
    );

    switch (activeTab) {
      case "Collections":
        if (loading) {
          return <p className="text-center text-gray-600">Loading...</p>;
        }
        if (purchasedImages.length === 0) {
          return (
            <div className="text-center">
              <p className="text-gray-600 mb-4">No images purchased yet.</p>
              <Link
                href="/"
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
              >
                Go to Marketplace
              </Link>
            </div>
          );
        }
        return renderGrid(purchasedImages);
      case "Watchlist":
        return renderGrid(userWatchlist);
      case "Uploads":
        return renderGrid(userUploadedImages);
      default:
        return null;
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-100 text-gray-800">
        <div className="container mx-auto px-4 py-8">
          {/* <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex flex-col sm:flex-row items-center">
              <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-4 sm:mb-0 sm:mr-6">
                <FaUser className="text-4xl text-blue-500" />
              </div>
              <div className="text-center sm:text-left">
                <h1 className="text-2xl font-bold mb-2">{userName}</h1>
                <p className="mb-1 text-gray-600">Address: {userAddress}</p>
                <p className="text-gray-600">Balance: {userBalance}</p>
              </div>
            </div>
          </div> */}

          <div className="flex flex-col md:flex-row">
            {/* Sidebar */}
            <div className="w-full md:w-64 mb-6 md:mb-0 md:mr-8">
              <div className="bg-white rounded-lg shadow-md p-4">
                {tabs.map((tab) => (
                  <button
                    key={tab.name}
                    className={`flex items-center w-full text-left py-3 px-4 rounded mb-2 transition-colors ${
                      activeTab === tab.name
                        ? "bg-blue-500 text-white"
                        : "hover:bg-blue-100 text-gray-700"
                    }`}
                    onClick={() => setActiveTab(tab.name)}
                  >
                    <tab.icon className="mr-3" />
                    {tab.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Main content */}
            <div className="flex-1">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-6">Your {activeTab}</h2>
                {renderTabContent()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;
