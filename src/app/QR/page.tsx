"use client";

import React from "react";
import { useQRCode } from "next-qrcode";

function Qrcode() {
  const { Canvas } = useQRCode();

  return (
    <Canvas
    // 여기에 원하는 주소 입력
      text={"https://naver.com"}
      options={{
        errorCorrectionLevel: "M",
        margin: 3,
        scale: 4,
        width: 200,
        color: {
          dark: "#010599FF",
          light: "#FFBF60FF",
        },
      }}
    />
  );
}

export default Qrcode;
