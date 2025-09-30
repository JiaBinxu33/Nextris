"use client";
import { observer } from "mobx-react-lite";
import { useStore } from "@/store";
import clsx from "clsx";
import { useEffect, useState } from "react";

const PauseIndicator = observer(() => {
  const { isPaused, togglePause } = useStore();
  const [show, setShow] = useState(true);

  useEffect(() => {
    // 如果没有暂停，确保图标一直显示（静态）
    if (!isPaused) {
      setShow(true);
      return;
    }

    // 如果暂停了，则启动一个定时器来控制闪烁
    const blinker = setInterval(() => {
      setShow((prev) => !prev);
    }, 250); // 每 250 毫秒切换一次可见性

    // 组件卸载或暂停状态改变时，清除定时器
    return () => clearInterval(blinker);
  }, [isPaused]);

  const handleClick = () => {
    togglePause();
  };

  return (
    <div
      onClick={handleClick}
      className={clsx(
        "pause-sprite",
        isPaused ? "pause-on" : "pause-off",
        // 当 show 为 false 且游戏暂停时，图标透明，实现闪烁效果
        !show && isPaused && "opacity-0"
      )}
    />
  );
});

export default PauseIndicator;
