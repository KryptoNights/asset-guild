import React from "react";

const Navbar = () => {
  const handleConnect = () => {
    console.log("Connect wallet");
  };

  return (
    <div className="navbar bg-blue-600 px-4 py-2 ">
      <div className="flex-1">
        <a href="/" className="text-xl font-bold">
          <img src="/logo.png" alt="Logo" className="h-10 w-10" />{" "}
        </a>
      </div>
      <div className="flex-none">
        <button className="btn btn-primary" onClick={handleConnect}>
          Connect
        </button>
      </div>
    </div>
  );
};

export default Navbar;
