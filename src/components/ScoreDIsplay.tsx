"use client";
import { observer } from "mobx-react-lite";
import { useStore } from "@/store";
import { useState, useEffect } from "react";
import Number from "./Number";
import { useTranslations } from "next-intl"; // 1. 导入 useTranslations

const ScoreDisplay = observer(() => {
  const { isGameStarted, points, maxScore, lastScore } = useStore();
  const t = useTranslations("Screen"); // 2. 初始化翻译函数，使用 "Screen" 命名空间

  // 用于控制在欢迎界面交替显示
  const [displayType, setDisplayType] = useState<"max" | "last">("max");

  useEffect(() => {
    if (isGameStarted) {
      return;
    }
    const timer = setInterval(() => {
      setDisplayType((prev) => (prev === "max" ? "last" : "max"));
    }, 3000);
    return () => clearInterval(timer);
  }, [isGameStarted]);

  // 3. --- 核心修改在这里 ---
  //    使用 t() 函数从 JSON 文件中获取文本
  let label = t("score");
  let score = points;

  if (!isGameStarted) {
    if (displayType === "max") {
      label = t("highScore");
      score = maxScore;
    } else {
      label = t("lastScore");
      score = lastScore;
    }
  }

  return (
    <div>
      <p
        className="text-[var(--block-size)]"
        style={{
          marginBottom: "calc(var(--block-size) * 0.5)",
        }}
      >
        {label}
      </p>
      <Number number={score}></Number>
    </div>
  );
});

export default ScoreDisplay;
