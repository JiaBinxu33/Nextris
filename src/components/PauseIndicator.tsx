"use client";
import { observer } from "mobx-react-lite";
import { useStore } from "@/store";
import clsx from "clsx";
import { useEffect, useState } from "react";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
const spriteUrl = `url(${basePath}/sprite.png)`;

const PauseIndicator = observer(() => {
  const { isPaused, togglePause } = useStore();
  const [show, setShow] = useState(true);

  useEffect(() => {
    if (!isPaused) {
      setShow(true);
      return;
    }

    const blinker = setInterval(() => {
      setShow((prev) => !prev);
    }, 250);

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
        !show && isPaused && "opacity-0"
      )}
      style={{ backgroundImage: spriteUrl }}
    />
  );
});

export default PauseIndicator;
