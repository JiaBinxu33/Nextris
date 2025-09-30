"use client";
import { observer } from "mobx-react-lite";
import { useStore } from "@/store";
import clsx from "clsx";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
const spriteUrl = `url(${basePath}/sprite.png)`;

const MusicIndicator = observer(() => {
  const { musicOn, toggleMusic } = useStore();

  return (
    <div
      onClick={toggleMusic}
      className={clsx(
        "music-sprite cursor-pointer",
        musicOn ? "music-on" : "music-off"
      )}
      style={{ backgroundImage: spriteUrl }}
    />
  );
});

export default MusicIndicator;
