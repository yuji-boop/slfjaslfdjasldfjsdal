import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from "react-native";
import GradientButton from "../components/GradientButton";

const frequencies = ["Daily", "Weekdays", "3x / week"];

export default function AddHabitScreen({ navigation }: any) {
  const [title, setTitle] = useState("");
  const [frequency, setFrequency] = useState(frequencies[0]);

  const onSave = () => {
    if (!title.trim()) {
      Alert.alert("Add a title", "Please enter a habit name");
      return;
    }
    Alert.alert("Saved!", `Habit: ${title} (${frequency})`);
    setTitle("");
    setFrequency(frequencies[0]);
    navigation.navigate("Home");
  };

  return (
    <ScrollView className="flex-1 bg-white" contentContainerStyle={{ paddingBottom: 24 }}>
      <View className="px-6 pt-6">
        <Text className="text-navy text-2xl font-bold">Add habit</Text>

        <View className="mt-6">
          <Text className="text-slate-600 mb-2">Title</Text>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="e.g. Meditate 10 min"
            className="bg-white rounded-2xl px-4 py-3 shadow"
          />
        </View>

        <View className="mt-6">
          <Text className="text-slate-600 mb-2">Goal</Text>
          <View className="flex-row">
            {frequencies.map((f) => {
              const active = f === frequency;
              return (
                <TouchableOpacity
                  key={f}
                  activeOpacity={0.9}
                  onPress={() => setFrequency(f)}
                  className={`px-4 py-2 rounded-2xl mr-2 ${active ? "bg-lightBlue" : "bg-white"} shadow`}
                >
                  <Text className={active ? "text-primaryBlue font-semibold" : "text-navy"}>{f}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <GradientButton title="Save habit" iconName="checkmark" onPress={onSave} className="mt-8" />
      </View>
    </ScrollView>
  );
}









