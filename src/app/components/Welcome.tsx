"use client";

import React, { useState, useEffect } from "react";
import clsx from "clsx";

// 这是一个独立的组件，负责欢迎动画
export default function Welcome() {
  const [isShowing, setIsShowing] = useState(false);
  const [spriteClass, setSpriteClass] = useState("r1");

  useEffect(() => {
    let animationTimeout: NodeJS.Timeout;
    let sequenceTimeout: NodeJS.Timeout;

    const animate = () => {
      let direction = "r"; // 'r' for right, 'l' for left
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

    // 动画序列：闪烁三次后开始正式动画
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
              animate(); // 开始龙的动画
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
      {/* 小恐龙的容器和样式，移植自原作者的 logo.less */}
      <div
        className={clsx("dragon-sprite", spriteClass)}
        style={{
          width: `calc(var(--block-size) * 4)`,
          height: `calc(var(--block-size) * 4.3)`,
        }}
      />
      {/* 文字部分 */}
      <p
        className="text-black text-center"
        style={{
          fontSize: `calc(var(--block-size) * 1.5)`,
          letterSpacing: `calc(var(--block-size) * 0.3)`,
        }}
      >
        俄罗斯方块
        <br />
        TETRIS
      </p>
    </div>
  );
}
