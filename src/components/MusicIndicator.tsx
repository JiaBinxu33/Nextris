"use client";
import { observer } from "mobx-react-lite";
import { useStore } from "@/store";
import clsx from "clsx";

const MusicIndicator = observer(() => {
  const { musicOn, toggleMusic } = useStore();

  return (
    <div
      onClick={toggleMusic} // 点击图标可以切换音效状态
      className={clsx(
        "music-sprite cursor-pointer", // 添加 cursor-pointer 让它看起来可以点击
        musicOn ? "music-on" : "music-off"
      )}
    />
  );
});

export default MusicIndicator;
