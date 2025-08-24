import React from "react";
import Svg, { Circle } from "react-native-svg";
import { View } from "react-native";

type ProgressRingProps = {
  size?: number;
  strokeWidth?: number;
  progress: number; // 0..1
  trackColor?: string;
  progressColor?: string;
  className?: string;
};

export default function ProgressRing({
  size = 140,
  strokeWidth = 12,
  progress,
  trackColor = "#D6ECFF",
  progressColor = "#3B6AFF",
  className,
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(1, progress));
  const strokeDashoffset = circumference * (1 - clamped);

  return (
    <View className={className}>
      <Svg width={size} height={size}>
        <Circle
          stroke={trackColor}
          fill="transparent"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />
        <Circle
          stroke={progressColor}
          fill="transparent"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={circumference - strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
    </View>
  );
}









