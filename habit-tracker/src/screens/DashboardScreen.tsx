import React from "react";
import { View, Text, ScrollView } from "react-native";
import ProgressRing from "../components/ProgressRing";
import HabitCard from "../components/HabitCard";

export default function DashboardScreen() {
  const habits = [
    { id: 1, title: "Morning stretch", frequency: "Daily", streak: 12 },
    { id: 2, title: "Drink water", frequency: "Every 2 hrs", streak: 5 },
    { id: 3, title: "Read 15 mins", frequency: "Daily", streak: 8 },
  ];

  return (
    <ScrollView className="flex-1 bg-white" contentContainerStyle={{ paddingBottom: 24 }}>
      <View className="px-6 pt-6">
        <Text className="text-navy text-2xl font-bold">Good to see you</Text>
        <Text className="text-slate-600 mt-1">Here’s your progress today</Text>

        <View className="bg-white rounded-3xl p-6 mt-6 shadow items-center">
          <View>
            <ProgressRing progress={0.78} />
            <View className="absolute inset-0 items-center justify-center">
              <Text className="text-navy text-2xl font-bold">78%</Text>
              <Text className="text-slate-500">Today</Text>
            </View>
          </View>
        </View>

        <Text className="text-navy text-xl font-semibold mt-8 mb-3">Today’s habits</Text>
        {habits.map((h) => (
          <HabitCard key={h.id} title={h.title} frequency={h.frequency} streakDays={h.streak} />
        ))}
      </View>
    </ScrollView>
  );
}









