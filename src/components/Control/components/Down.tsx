"use client";
import { observer } from "mobx-react-lite";
import React, { useRef } from "react";
import ActionButton from "@/components/ActionButton";
import { useStore } from "@/store";
import { useTranslations } from "next-intl";

const Down = observer(() => {
  const { moveTetromino, isGameStarted, adjustStartLines } = useStore();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const t = useTranslations("Control");

  const handleMouseDown = () => {
    if (isGameStarted) {
      moveTetromino("down");
      intervalRef.current = setInterval(() => {
        moveTetromino("down");
      }, 50);
    } else {
      adjustStartLines("down");
    }
  };

  const handleMouseUp = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  return (
    <ActionButton
      label={t("down")}
      color="bg-blue-600"
      size={5}
      fontSize={1}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    />
  );
});

export default Down;
