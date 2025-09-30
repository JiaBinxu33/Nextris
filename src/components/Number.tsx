"use client";
import React, { useState, useEffect } from "react";
import clsx from "clsx";

interface NumberProps {
  number?: number | string;
  length?: number;
  isTime?: boolean;
}

function formatTime(num: number): string[] {
  return num < 10 ? [`0`, `${num}`] : `${num}`.split("");
}

// 创建一个新的内部组件来处理时间逻辑
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
    // 在服务器或客户端首次渲染时返回占位符
    const timeArr = ["n", "n", "d_c", "n", "n"];
    return (
      <div className="flex items-center justify-end">
        {timeArr.map((digit, index) => (
          <span
            key={index}
            className={clsx("digit-sprite", `digit-${digit}`)}
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
        <span key={index} className={clsx("digit-sprite", `digit-${digit}`)} />
      ))}
    </div>
  );
};

export default function Number({
  number = 0,
  length = 6,
  isTime = false,
}: NumberProps) {
  // --- 时钟模式 ---
  if (isTime) {
    return <TimeDisplay />;
  }

  // --- 原始的数字显示逻辑 (保持不变) ---
  const numberStr = String(number);
  const numberArr = numberStr.split("");
  const paddingLength = Math.max(0, length - numberArr.length);
  const paddedArr = Array(paddingLength).fill("n").concat(numberArr);

  return (
    <div className="flex items-center justify-end">
      {paddedArr.map((digit, index) => (
        <span key={index} className={clsx("digit-sprite", `digit-${digit}`)} />
      ))}
    </div>
  );
}
