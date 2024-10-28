"use client";

import React, { useState, useEffect } from "react";
import { useQRCode } from "next-qrcode";
import { Loader2 } from "lucide-react";

function Qrcode() {
  const { Canvas } = useQRCode();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time
    setIsLoading(false);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-[#1c1c23] text-white">
      <main className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md bg-[#2c2c35] rounded-lg shadow-lg p-6 flex flex-col items-center">
          <h1 className="text-3xl font-extrabold mb-6 text-[#7a7bff]">
            Lyf Circle
          </h1>
          <h2 className="text-xl font-semibold mb-6 text-[#7a7bff]">
            Join your circle on lyf
          </h2>
          <div className="p-4 rounded-lg bg-white w-[232px] h-[232px] flex items-center justify-center">
            {isLoading ? (
              <Loader2 className="w-8 h-8 text-[#010599] animate-spin" />
            ) : (
              <Canvas
                text={"https://www.discoverasr.com/en/lyf"}
                options={{
                  errorCorrectionLevel: "M",
                  margin: 3,
                  scale: 4,
                  width: 200,
                  color: {
                    dark: "#010599FF",
                    light: "#FFF",
                  },
                }}
              />
            )}
          </div>
          <p className="mt-6 text-center text-sm">
            Scan this QR code with your mobile device to access.
          </p>
        </div>
      </main>
    </div>
  );
}

export default Qrcode;
