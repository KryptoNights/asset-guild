import ImageFullScreen from "@/components/ImageFullScreen/ImageFullScreen";
import Layout from "@/components/Layout/Layout";
import React, { useState, ChangeEvent } from "react";

const UploadPage = () => {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [price, setPrice] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const MAX_PRICE = 100;

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        setError("File size should not exceed 5MB");
        return;
      }
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setError(null);
    }
  };

  const handlePriceChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Allow empty input for better UX
    if (value === "") {
      setPrice("");
      setError(null);
      return;
    }

    // Use regex to validate input format
    const regex = /^\d{1,3}(\.\d{0,2})?$/;
    if (regex.test(value) && parseFloat(value) <= MAX_PRICE) {
      setPrice(value);
      setError(null);
    } else if (parseFloat(value) > MAX_PRICE) {
      setError(`Maximum price is $${MAX_PRICE}`);
    } else {
      setError("Invalid price format");
    }
  };

  const handleTagChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCurrentTag(e.target.value);
  };

  const handleAddTag = () => {
    if (currentTag && !tags.includes(currentTag)) {
      setTags([...tags, currentTag]);
      setCurrentTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleSubmit = () => {
    if (!image) {
      setError("Please upload an image");
      return;
    }
    if (!price) {
      setError("Please set a price");
      return;
    }
    if (parseFloat(price) > MAX_PRICE) {
      setError(`Maximum price is $${MAX_PRICE}`);
      return;
    }
    // Implement submission logic here
    console.log("Submitting:", { image, price, tags });
    setError(null);
  };

  return (
    <Layout>
      {" "}
      <>
        <div className="container mx-auto px-4 py-8 max-w-4xl h-screen">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-3xl font-bold text-center mb-8">
                Upload Your Photo
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="flex flex-col items-center justify-center w-full">
                    <label
                      htmlFor="image-upload"
                      className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-base-200 hover:bg-base-300 transition-colors duration-300"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg
                          className="w-10 h-10 mb-3 text-base-content"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                          ></path>
                        </svg>
                        <p className="mb-2 text-sm">
                          <span className="font-semibold">Click to upload</span>{" "}
                          or drag and drop
                        </p>
                        <p className="text-xs">PNG, JPG or GIF (MAX. 5MB)</p>
                      </div>
                      <input
                        id="image-upload"
                        type="file"
                        className="hidden"
                        onChange={handleImageChange}
                        accept="image/*"
                      />
                    </label>
                  </div>
                  {preview && (
                    <div className="mt-4">
                      <img
                        src={preview}
                        alt="Preview"
                        className="max-w-full h-auto rounded-lg shadow-md"
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-6">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold">
                        Price (USDC)
                      </span>
                      <span className="label-text-alt">Max $100.00</span>
                    </label>
                    <label className="input-group">
                      <span>$</span>
                      <input
                        type="text"
                        placeholder="Enter price (e.g., 99.99)"
                        className="input input-bordered w-full"
                        value={price}
                        onChange={handlePriceChange}
                      />
                    </label>
                    <label className="label">
                      <span className="label-text-alt text-error">
                        {error && error.includes("price") ? error : ""}
                      </span>
                    </label>
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold">Tags</span>
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        placeholder="Add a tag"
                        className="input input-bordered flex-grow"
                        value={currentTag}
                        onChange={handleTagChange}
                        onKeyDown={(e) => e.key === "Enter" && handleAddTag()}
                      />
                      <button
                        className="btn btn-primary"
                        onClick={handleAddTag}
                      >
                        Add
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-2">
                    {tags.map((tag) => (
                      <div key={tag} className="badge badge-primary gap-2 p-3">
                        {tag}
                        <button
                          onClick={() => handleRemoveTag(tag)}
                          className="btn btn-xs btn-circle btn-ghost"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {error && !error.includes("price") && (
                <div className="alert alert-error mt-6">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="stroke-current shrink-0 h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              <div className="card-actions justify-end mt-8">
                <button
                  className="btn btn-primary btn-block py-3 text-lg font-semibold"
                  onClick={handleSubmit}
                >
                  Submit Image
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    </Layout>
  );
};

export default UploadPage;
