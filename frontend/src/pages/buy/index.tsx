import React, { useState } from "react";
import { ShoppingCart, Info, Check, X } from "lucide-react";
import { purchaseContent } from "utils/transitions";
import { useDynamicContext, useUserWallets } from "@/lib/dynamic";
import { getSigner } from "@dynamic-labs/ethers-v6";
import { ABI, IMAGE_MAGIC_URL, ORB_VERIFICATION, SHUTTER_CONTRACT } from "utils/consts";
import { Contract } from "ethers";


const CustomAlert = ({ title, children }: any) => (
  <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4 rounded-r-lg">
    <div className="flex">
      <div className="flex-shrink-0">
        <Info className="h-5 w-5 text-blue-400" aria-hidden="true" />
      </div>
      <div className="ml-3">
        <h3 className="text-sm font-medium text-blue-800">{title}</h3>
        <div className="mt-2 text-sm text-blue-700">{children}</div>
      </div>
    </div>
  </div>
);

const Card = ({ children, className = "" }: any) => (
  <div className={`bg-white shadow-md rounded-lg overflow-hidden ${className}`}>
    {children}
  </div>
);

const Button = ({ children, className = "", onClick }: any) => (
  <button
    className={`px-4 py-2 rounded-md font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${className}`}
    onClick={onClick}
  >
    {children}
  </button>
);

const BuyPage = () => {
  const [showLicenseInfo, setShowLicenseInfo] = useState(false);
  const { primaryWallet } = useDynamicContext();
  const userWallets = useUserWallets();

  const allSet = (): boolean => {
    if (!primaryWallet) {
      console.error("No primary wallet connected");
      return false;
    }
    if (userWallets.length === 0) {
      console.error("No wallets connected");
      return false;
    }
    return true;
  };
  
  const purcharseContent = async () => {
    if (!allSet()) return;

    const signer = await getSigner(primaryWallet!);
    const Shutter = new Contract(SHUTTER_CONTRACT, ABI, signer);
  
    const response = await purchaseContent(Shutter, creator, ch, 100);
  };

  const licenses = {
    standard: { price: 99.99, duration: "1 year" },
    extended: { price: 199.99, duration: "Perpetual" },
  };

  return (
    <div className="container mx-auto p-4 bg-gradient-to-br from-gray-100 to-gray-200 min-h-screen">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">
        License Premium Content
      </h1>

      <div className="flex flex-col lg:flex-row gap-8">
        <Card className="lg:w-1/2">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-2">Image Preview</h2>
            <p className="text-gray-600 mb-4">
              Watermarked sample of the licensed content
            </p>
            <img
              src="/api/placeholder/600/400"
              alt="Watermarked preview"
              className="w-full h-auto rounded-lg shadow-lg"
            />
            <p className="text-sm text-gray-500 mt-4">
              Actual content will be provided without watermark upon purchase
            </p>
          </div>
        </Card>

        <div className="lg:w-1/2 space-y-6">
          <Card>
            <div className="p-6">
              <h2 className="text-2xl font-semibold mb-2">
                Premium Stock Image
              </h2>
              <p className="text-gray-600 mb-4">
                High-quality visuals for your next project
              </p>
              <p className="mb-4">
                This stunning image captures [description of the image]. Perfect
                for websites, marketing materials, and more.
              </p>

              <div className="flex items-center mb-4">
                <h3 className="text-xl font-semibold mr-2">License Options</h3>
                <Button
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800"
                  onClick={() => setShowLicenseInfo(!showLicenseInfo)}
                >
                  <Info className="h-4 w-4" />
                </Button>
              </div>

              {showLicenseInfo && (
                <CustomAlert title="License Information">
                  <ul className="list-disc list-inside mt-2">
                    <li>Use in unlimited projects</li>
                    <li>No attribution required</li>
                    <li>Cannot be resold or redistributed</li>
                  </ul>
                </CustomAlert>
              )}

              <div className="flex gap-4 mt-6">
                {Object.entries(licenses).map(([type, details]) => (
                  <Button
                    key={type}
                    className={`flex-1 ${
                      selectedLicense === type
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-800"
                    }`}
                    onClick={() => setSelectedLicense(type)}
                  >
                    <div className="text-left">
                      <div className="font-semibold capitalize">{type}</div>
                      <div className="text-sm">${details.price}</div>
                      <div className="text-xs">{details.duration}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          </Card>

          <Card>
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">License Features</h2>
              <ul className="space-y-2">
                {[
                  "Commercial use",
                  "Print rights",
                  "Digital use",
                  "Worldwide",
                ].map((feature) => (
                  <li key={feature} className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    <span>{feature}</span>
                  </li>
                ))}
                {["Resale of unaltered files", "Use in logo design"].map(
                  (feature) => (
                    <li
                      key={feature}
                      className="flex items-center text-gray-500"
                    >
                      <X className="h-5 w-5 text-red-500 mr-2" />
                      <span>{feature}</span>
                    </li>
                  )
                )}
              </ul>
            </div>
          </Card>

          <Card>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <span className="text-lg font-semibold">Total:</span>
                <div>
                  <span className="text-3xl font-bold">
                    ${licenses[selectedLicense].price}
                  </span>
                  <span className="ml-2 px-2 py-1 bg-gray-200 text-gray-800 text-sm rounded-full">
                    {selectedLicense}
                  </span>
                </div>
              </div>

              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg h-12">
                <ShoppingCart className="mr-2 h-5 w-5" />
                Purchase License
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BuyPage;
