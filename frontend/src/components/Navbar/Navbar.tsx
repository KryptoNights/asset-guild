import React from "react";
import Link from "next/link";
import { FaSearch, FaUser } from "react-icons/fa";

const Navbar = () => {
  const handleConnect = () => {
    console.log("Connect wallet");
  };

  return (
    <nav className="bg-gray-800 shadow-md">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center flex-1">
            <Link
              href="/"
              className="text-white text-2xl font-bold hover:text-blue-500 transition duration-300"
            >
              ShutterVerse
            </Link>
            <div className="ml-6 flex-1 max-w-lg">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search photos"
                  className="w-full bg-gray-700 text-white rounded-full py-2 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                />
                <button className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <FaSearch className="text-gray-400" />
                </button>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition duration-300"
              onClick={handleConnect}
            >
              Connect Wallet
            </button>
            <Link
              href="/profile"
              className="text-white hover:text-blue-500 transition duration-300"
            >
              <FaUser size={24} />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
