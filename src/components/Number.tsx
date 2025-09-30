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

export default function Number({
  number = 0,
  length = 6,
  isTime = false,
}: NumberProps) {
  // 1. 【核心修改】新增一个状态，用于判断组件是否已在客户端挂载
  const [isClient, setIsClient] = useState(false);

  // 2. 这个 useEffect 只会在客户端运行一次
  useEffect(() => {
    // 当组件在客户端成功挂载后，将 isClient 设为 true
    setIsClient(true);
  }, []);

  // --- 时钟模式 ---
  if (isTime) {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
      const timer = setInterval(() => {
        setTime(new Date());
      }, 1000);
      return () => clearInterval(timer);
    }, []);

    // 3. 【核心修改】在客户端挂载完成前，不渲染任何东西（或一个占位符）
    // 这样可以保证服务器和客户端的初次渲染结果一致
    if (!isClient) {
      return null; // 或者返回一个骨架屏 <div className="w-[...px] h-[...px]" />
    }

    // 只有在 isClient 为 true 后，才执行下面的动态渲染逻辑
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
          />
        ))}
      </div>
    );
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
