import React from "react";
import clsx from "clsx";

interface NumberProps {
  number: number | string;
  length?: number;
}

export default function Number({ number = 0, length = 6 }: NumberProps) {
  const numberStr = String(number);
  const numberArr = numberStr.split("");
  const paddedArr = Array(length - numberArr.length)
    .fill("n")
    .concat(numberArr);

  return (
    // 容器只负责排列，尺寸由内部的 span 决定
    <div className="flex items-center justify-end">
      {paddedArr.map((digit, index) => (
        <span
          key={index}
          className={clsx(
            "digit-sprite", // 公共样式
            `digit-${digit}` // 具体数字的样式
          )}
        />
      ))}
    </div>
  );
}
