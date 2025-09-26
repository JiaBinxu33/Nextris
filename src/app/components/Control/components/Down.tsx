import React, { useRef } from "react"; // 1. 导入 useRef
import ActionButton from "@/app/components/ActionButton";
import { useStore } from "@/app/store";

export default function Down() {
  const { moveTetromino } = useStore();

  // 2. 使用 useRef 来存储定时器的 ID
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseDown = () => {
    // 3. 按下时，立即触发一次下移
    moveTetromino("down");

    // 4. 启动一个定时器，以很快的频率（例如每 50 毫秒）重复触发下移
    intervalRef.current = setInterval(() => {
      moveTetromino("down");
    }, 50); // 这里的 50ms 可以调整，数值越小下移越快
  };

  const handleMouseUp = () => {
    // 5. 当鼠标松开时，清除定时器，停止快速下移
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  return (
    <ActionButton
      label="下移"
      color="bg-blue-600"
      size={5}
      fontSize={1}
      // 6. 将事件处理函数传递给 ActionButton
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp} // 鼠标移出按钮也应该停止下移
    />
  );
}
