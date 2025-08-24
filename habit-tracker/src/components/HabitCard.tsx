import React from "react";
import { View, Text } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

type HabitCardProps = {
  title: string;
  frequency?: string;
  streakDays?: number;
};

export default function HabitCard({ title, frequency = "Daily", streakDays = 0 }: HabitCardProps) {
  return (
    <View className="bg-white rounded-2xl p-4 flex-row items-center justify-between mb-3 shadow">
      <View className="flex-row items-center">
        <View className="w-10 h-10 rounded-full bg-lightBlue items-center justify-center mr-3">
          <Ionicons name="leaf" size={20} color="#3B6AFF" />
        </View>
        <View>
          <Text className="text-navy text-base font-semibold">{title}</Text>
          <Text className="text-slate-500 mt-0.5">{frequency}{streakDays ? ` • ${streakDays}d streak` : ""}</Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#94A3B8" />
    </View>
  );
}









