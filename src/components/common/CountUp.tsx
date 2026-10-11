"use client";

import React, { useState, useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";

interface CountUpProps {
  end?: number;
  value?: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}

export default function CountUp({
  end,
  value,
  duration = 1200,
  prefix = "",
  suffix = "",
  decimals = 0,
}: CountUpProps) {
  const target = typeof value === "number" ? value : typeof end === "number" ? end : 0;
  const prefersReduced = useReducedMotion();
  const [count, setCount] = useState(0);
  const prevEndRef = useRef<number>(0);

  useEffect(() => {
    if (prefersReduced) {
      prevEndRef.current = target;
      return;
    }

    const startValue = prevEndRef.current;
    const targetValue = target;
    if (startValue === targetValue) {
      return;
    }

    const startTime = performance.now();
    let animationFrameId: number;

    const easeOutExpo = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

    const step = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutExpo(progress);
      const currentValue = startValue + (targetValue - startValue) * easedProgress;

      setCount(currentValue);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      } else {
        setCount(targetValue);
        prevEndRef.current = targetValue;
      }
    };

    animationFrameId = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [target, duration, prefersReduced]);

  const displayValue = prefersReduced ? target : count;

  return (
    <span className="font-mono-data">
      {prefix}
      {displayValue.toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </span>
  );
}
