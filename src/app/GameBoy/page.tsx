"use client";
import Screen from "@/app/components/Screen/page";
import Tetrimino from "@/app/components/Tetrimino/page";
import { useState } from "react";
import OTermoino from "../components/Tetrimino/components/OTermoino";
export default function GameBoy() {
  const [blockSize, setBlockSize] = useState(20);
  const handleGetBlockSize = (blockSize: number) => {
    setBlockSize(blockSize);
  };
  return (
    <div
      className="h-full bg-amber-500 rounded-xl aspect-[2/3] relative"
      style={
        {
          "--block-size": `${blockSize}px`,
        } as React.CSSProperties
      }
    >
      <Screen onBlockSizeChange={handleGetBlockSize}></Screen>
      <Tetrimino></Tetrimino>
      <OTermoino></OTermoino>
    </div>
  );
}
