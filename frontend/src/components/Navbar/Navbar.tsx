"use client";
import { useAccount, useEnsName, useEnsAvatar } from "wagmi";
import React from "react";
import Link from "next/link";
import { Search, Camera, Menu } from "lucide-react";
import { DynamicWidget, useDynamicContext } from "@dynamic-labs/sdk-react-core";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { user } = useDynamicContext();

  const { data: name } = useEnsName({
    address: (user?.verifiedCredentials[0]?.address as `0x${string}`) || "",
    chainId: 1,
  });

  const { data: avatar } = useEnsAvatar({ name: name ?? "" });

  return (
    <nav className="shadow-md">
      <div className="navbar container mx-auto">
        <div className="navbar-start">
          <Link href="/" className="btn btn-ghost normal-case text-xl">
            <Camera className="h-6 w-6 mr-2 text-primary" />
            <span className="hidden sm:inline text-primary font-bold">
              AssetGuild
            </span>
          </Link>
        </div>

        <div className="navbar-center hidden lg:flex">
          <div className="form-control">
            {/* <div className="input-group flex">
              <input
                type="text"
                placeholder="Search photos"
                className="input input-bordered w-64 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button className="btn btn-square btn-primary">
                <Search className="h-5 w-5" />
              </button>
            </div> */}
          </div>
        </div>

        <div className="navbar-end">
          <div className="hidden md:flex items-center space-x-4">
            <DynamicWidget />
            <Link href="/profile">
              <button className="btn btn-circle btn-primary">
                <img
                  src={avatar || "https://docs.ens.domains/fallback.svg"}
                  alt="Profile"
                  className="w-8 h-8 rounded-full"
                />
              </button>
            </Link>
          </div>

          <div className="dropdown dropdown-end md:hidden ">
            <label tabIndex={0} className="btn btn-ghost btn-circle">
              <Menu className="h-6 w-6" />
            </label>
            <ul
              tabIndex={0}
              className="menu menu-compact dropdown-content mt-3 p-2 shadow rounded-box w-52 bg-white z-10"
            >
              <li>
                <div className="form-control mb-2 flex">
                  <div className="flex input-group input-group-sm ">
                    <input
                      type="text"
                      placeholder="Search photos"
                      className="input input-bordered input-sm w-full"
                    />
                    <button className="btn btn-square btn-sm btn-primary">
                      <Search className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </li>
              <li>
                <DynamicWidget />
              </li>
              <li>
                <Link href="/profile" className="justify-between">
                  Profile
                  <img
                    src={avatar || "https://docs.ens.domains/fallback.svg"}
                    alt="Profile"
                    className="w-6 h-6 rounded-full"
                  />
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}
