"use client";
import React, { useState, useEffect } from "react";
import clsx from "clsx";

// 【核心修复】从环境变量获取基础路径
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
const spriteUrl = `url(${basePath}/sprite.png)`;

interface NumberProps {
  number?: number | string;
  length?: number;
  isTime?: boolean;
}

function formatTime(num: number): string[] {
  return num < 10 ? [`0`, `${num}`] : `${num}`.split("");
}

const TimeDisplay = () => {
  const [time, setTime] = useState(new Date());
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!isClient) {
    const timeArr = ["n", "n", "d_c", "n", "n"];
    return (
      <div className="flex items-center justify-end">
        {timeArr.map((digit, index) => (
          <span
            key={index}
            className={clsx("digit-sprite", `digit-${digit}`)}
            style={{ backgroundImage: spriteUrl }} // 【核心修复】动态应用 style
          />
        ))}
      </div>
    );
  }

  const hours = formatTime(time.getHours());
  const minutes = formatTime(time.getMinutes());
  const seconds = time.getSeconds();
  const timeArr = [...hours, seconds % 2 ? "d" : "d_c", ...minutes];

  return (
    <div className="flex items-center justify-end">
      {timeArr.map((digit, index) => (
        <span
          key={index}
          className={clsx("digit-sprite", `digit-${digit}`)}
          style={{ backgroundImage: spriteUrl }} // 【核心修复】动态应用 style
        />
      ))}
    </div>
  );
};

export default function Number({
  number = 0,
  length = 6,
  isTime = false,
}: NumberProps) {
  if (isTime) {
    return <TimeDisplay />;
  }

  const numberStr = String(number);
  const numberArr = numberStr.split("");
  const paddingLength = Math.max(0, length - numberArr.length);
  const paddedArr = Array(paddingLength).fill("n").concat(numberArr);

  return (
    <div className="flex items-center justify-end">
      {paddedArr.map((digit, index) => (
        <span
          key={index}
          className={clsx("digit-sprite", `digit-${digit}`)}
          style={{ backgroundImage: spriteUrl }}
        />
      ))}
    </div>
  );
}
