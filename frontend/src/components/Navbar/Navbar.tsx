"use client";
import { useAccount, useEnsName, useEnsAvatar } from "wagmi";
import React from "react";
import Link from "next/link";
import { Search, User, Camera, Menu } from "lucide-react";
import { DynamicWidget, useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { IDKitWidget, VerificationLevel } from "@worldcoin/idkit";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const { user } = useDynamicContext();
  const verifyProof = async (proof: any) => {
    console.log(proof);
    // Handle proof verification here
  };

  const onSuccess = () => {
    console.log("Success");
    // Handle successful verification here
  };
  //user address
  // console.log(user?.verifiedCredentials[0]?.address);
  const { data: name } = useEnsName({
    address: "0xd2135CfB216b74109775236E36d4b433F1DF507B",
    blockTag: "latest",
  });
  console.log("check", name);
  const { data: avatar } = useEnsAvatar({ name: name ?? "" });
  console.log(avatar);

  return (
    <nav className=" border-[#000000] bg-[#EFF2FA]">
      <div className="max-w-full mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link
              href="/"
              className="flex items-center text-2xl font-bold text-white hover:text-blue-400 transition duration-300"
            >
              <Camera className="h-8 w-8 mr-2 invert" />
              <span className="hidden sm:inline" style={{ color: "#4B65F7" }}>
                ShutterVerse
              </span>
            </Link>
          </div>
          <div className="hidden md:block flex-1 max-w-lg mx-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search photos"
                className="w-full pl-10 pr-4 py-2 blinker text-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <DynamicWidget />
            {/* <IDKitWidget
              app_id="key"
              action="verify-personhood"
              verification_level={VerificationLevel.Device}
              handleVerify={verifyProof}
              onSuccess={onSuccess}
            >
              {({ open }) => (
                <button
                  onClick={open}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-300"
                >
                  Verify with World ID
                </button>
              )}
            </IDKitWidget> */}
            <Link href="/profile">
              <button className="p-2 text-white bg-gray-800 hover:bg-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-300">
                <img
                  src={avatar || "https://docs.ens.domains/fallback.svg"}
                  className="w-8 h-8 rounded-full"
                />
                {/* <span className="sr-only">Profile</span> */}
              </button>
            </Link>
          </div>
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-white hover:bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search photos"
                className="w-full pl-10 pr-4 py-2 bg-gray-800 text-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex items-center justify-evenly">
              <DynamicWidget />
              {/* <IDKitWidget
              app_id="key"
              action="verify-personhood"
              verification_level={VerificationLevel.Device}
              handleVerify={verifyProof}
              onSuccess={onSuccess}
            >
              {({ open }) => (
                <button
                  onClick={open}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-300"
                >
                  Verify with World ID
                </button>
              )}
            </IDKitWidget> */}
              <Link href="/profile">
                <button className="w-full px-4 py-2 text-white bg-gray-800 hover:bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-300">
                  Profile
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
