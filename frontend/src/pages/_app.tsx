"use client";
import type { AppProps } from "next/app";
import "@/styles/globals.css";
import Providers from "../lib/providers";
import { useState, startTransition, useEffect } from "react"; // Add startTransition and useEffect imports
import React from "react";

export default function App({ Component, pageProps }: AppProps) {
  const [isTransitioning, setIsTransitioning] = useState(false); // Add state

  const handleTransition = () => {
    startTransition(() => {
      // Wrap the state update in startTransition
      setIsTransitioning(true);
      setTimeout(() => setIsTransitioning(false), 1000); // Simulate a delay
    });
  };

  useEffect(() => {
    handleTransition(); // Call handleTransition inside useEffect
  }, []); // Empty dependency array to run once on mount

  return (
    <React.Suspense>
      <Providers>
        {isTransitioning ? null : <Component {...pageProps} />}
      </Providers>
    </React.Suspense>
  );
}
