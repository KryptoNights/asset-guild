import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaShare, FaFolder, FaDownload } from "react-icons/fa"; // Import share and folder icons
import Layout from "@/components/Layout/Layout";
import { getPurchasedImages } from "@/apis/graph";
import { useDynamicContext, useUserWallets } from "@/lib/dynamic";
import { getSigner, getWeb3Provider } from "@dynamic-labs/ethers-v6";
import { ABI, FHE_ABI, FHE_CONTRACT, SHUTTER_CONTRACT } from "utils/consts";
import { Contract } from "ethers";
import { FhenixClient, getPermit } from "fhenixjs";
import clsx from "clsx";

const DUAL_CHAIN_ENABLED = false;

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("Collections");
  const [purchasedImages, setPurchasedImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [attestationId, setAttestationId] = useState();

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
        if ((await primaryWallet?.getNetwork()) === 8008135) {
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

  const renderCollections = () => {
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
      2;
    }
    // function clsx(arg0: string, arg1: string): string | undefined {
    //   throw new Error("Function not implemented.");
    // }

    return (
      <div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        style={{ height: "100%" }}
      >
        {purchasedImages.map((item: any) => (
          <div key={item.id} className="flex-cols" style={{ height: "100%" }}>
            <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105 relative w-full h-[calc(100%*3/3)] ">
              <Image
                alt={item.name}
                src={item.image || "/assets/placeholder-image.jpg"}
                width={300}
                height={300}
                className="w-full h-[calc(100%*3/3)] object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            {/* Buttons outside the image */}
            <div className="flex justify-between pt-2 mt-2">
              {/* Added mt-2 for margin-top */}
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold py-1 px-2 rounded w-[100%] mr-2"
                onClick={() => window.open(item.attestation_url, "_blank")}
              >
                View Attestation
              </button>
              <button
                className="bg-gray-600 hover:bg-green-600 text-white text-sm font-semibold py-1 px-2 rounded"
                onClick={() => {
                  window.open(item.image, "_blank");
                }}
              >
                <FaDownload />
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Layout>
      <div
        className="min-h-screen bg-gray-100 text-gray-800"
        style={{ height: "100%" }}
      >
        <div className="container mx-auto px-4 py-8" style={{ height: "100%" }}>
          <div className="flex flex-col md:flex-row" style={{ height: "100%" }}>
            {/* Sidebar */}
            <div
              className="w-full md:w-64 mb-6 md:mb-0 md:mr-8"
              style={{ height: "100%" }}
            >
              <div className="bg-white rounded-lg shadow-md p-4">
                <button
                  className={`flex items-center w-full text-left py-3 px-4 rounded mb-2 transition-colors ${
                    activeTab === "Collections"
                      ? "bg-blue-500 text-white"
                      : "hover:bg-blue-100 text-gray-700"
                  }`}
                  onClick={() => setActiveTab("Collections")}
                >
                  <FaFolder className="mr-3" />
                  Collections
                </button>
              </div>
            </div>
            {/* Main Content */}
            <div className="flex-1 h-full" style={{ height: "100%" }}>
              <div
                // className="bg-white rounded-lg shadow-md p-6 "
                style={{ height: "100%" }}
              >
                <h2 className="text-xl font-bold mb-6">Your Collections</h2>
                {renderCollections()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;
