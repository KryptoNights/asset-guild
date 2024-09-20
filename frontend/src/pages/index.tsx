import Layout from "@/components/Layout/Layout";
import Photocard from "@/components/Photocard/Photocard";
import Link from "next/link";

export default function Page() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-6">Web3 Stock Photos</h1>
        <p className="text-xl mb-8">
          Decentralized marketplace for unique stock photos
        </p>

        <div className="columns-1 sm:columns-2 md:columns-3 gap-4">
          <Photocard />
          <Photocard tall={true} />
          <Photocard />
          <Photocard tall={true} />
          <Photocard />
          <Photocard />
          {/* Add more PhotoCards as needed */}
        </div>

        <div className="mt-12 text-center">
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
