"use client";

import React, { useState, useEffect } from "react";
import clsx from "clsx";
import { useTranslations } from "next-intl";

// 【核心修复】从环境变量获取基础路径
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
const spriteUrl = `url(${basePath}/sprite.png)`;

export default function Welcome() {
  const [isShowing, setIsShowing] = useState(false);
  const [spriteClass, setSpriteClass] = useState("r1");
  const t = useTranslations("Welcome");

  useEffect(() => {
    let animationTimeout: NodeJS.Timeout;
    let sequenceTimeout: NodeJS.Timeout;

    const animate = () => {
      let direction = "r";
      let runCount = 0;

      const set = (callback: () => void, delay: number) => {
        return setTimeout(callback, delay);
      };

      const eyes = (onComplete: () => void, delay1: number, delay2: number) => {
        sequenceTimeout = set(() => {
          setSpriteClass(direction + "2");
          sequenceTimeout = set(() => {
            setSpriteClass(direction + "1");
            onComplete();
          }, delay2);
        }, delay1);
      };

      const run = (onComplete: () => void) => {
        sequenceTimeout = set(() => {
          setSpriteClass(direction + "4");
          sequenceTimeout = set(() => {
            setSpriteClass(direction + "3");
            runCount++;
            if (runCount % 10 === 0) {
              direction = direction === "r" ? "l" : "r";
            }
            if (runCount < 40) {
              run(onComplete);
            } else {
              setSpriteClass(direction + "1");
              sequenceTimeout = set(onComplete, 4000);
            }
          }, 100);
        }, 100);
      };

      const startDragonAnimation = () => {
        runCount = 0;
        eyes(
          () =>
            eyes(
              () =>
                eyes(
                  () => {
                    setSpriteClass(direction + "2");
                    run(startDragonAnimation);
                  },
                  150,
                  150
                ),
              150,
              150
            ),
          1000,
          1500
        );
      };

      startDragonAnimation();
    };

    const startSequence = () => {
      setIsShowing(true);
      animationTimeout = setTimeout(() => {
        setIsShowing(false);
        animationTimeout = setTimeout(() => {
          setIsShowing(true);
          animationTimeout = setTimeout(() => {
            setIsShowing(false);
            animationTimeout = setTimeout(() => {
              setIsShowing(true);
              animate();
            }, 150);
          }, 150);
        }, 150);
      }, 150);
    };

    startSequence();

    return () => {
      clearTimeout(animationTimeout);
      clearTimeout(sequenceTimeout);
    };
  }, []);

  return (
    <div
      className={clsx(
        "absolute inset-0 flex flex-col justify-center items-center pointer-events-none transition-opacity duration-150",
        isShowing ? "opacity-100" : "opacity-0"
      )}
    >
      <div
        className={clsx("dragon-sprite", spriteClass)}
        style={{
          width: `calc(var(--block-size) * 4)`,
          height: `calc(var(--block-size) * 4.3)`,
          backgroundImage: spriteUrl,
        }}
      />
      <p
        className="text-black text-center"
        style={{
          fontSize: `calc(var(--block-size) * 1.5)`,
          letterSpacing: `calc(var(--block-size) * 0.3)`,
        }}
      >
        {t("title")}
      </p>
    </div>
  );
}
