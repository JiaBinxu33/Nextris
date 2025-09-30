"use client";
import { observer } from "mobx-react-lite";
import React, { useRef } from "react"; // 1. 导入 useRef
import ActionButton from "@/components/ActionButton";
import { useStore } from "@/store";
import { useTranslations } from "next-intl";

const Right = observer(() => {
  const { moveTetromino, isGameStarted, adjustStartLevel } = useStore();
  const intervalRef = useRef<NodeJS.Timeout | null>(null); // 2. 创建一个 ref 来存储定时器
  const t = useTranslations("Control");

  // 3. 定义鼠标按下的处理函数
  const handleMouseDown = () => {
    if (isGameStarted) {
      moveTetromino("right"); // 立即移动一次
      // 启动一个定时器，每 100 毫秒移动一次
      intervalRef.current = setInterval(() => {
        moveTetromino("right");
      }, 100);
    } else {
      adjustStartLevel("right");
    }
  };

  // 4. 定义鼠标松开的处理函数
  const handleMouseUp = () => {
    // 清除定时器，停止连续移动
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  return (
    <ActionButton
      label={t("right")}
      color="bg-blue-600"
      size={5}
      fontSize={1}
      // 5. 绑定新的事件处理器，移除 onClick
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp} // 鼠标移出按钮也应停止移动
    />
  );
});

export default Right;
