import React from "react";
import { View, Text, ScrollView, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { styled } from "nativewind";
import GradientButton from "../components/GradientButton";

const { width } = Dimensions.get("window");
const StyledGradient = styled(LinearGradient);

export default function WelcomeScreen({ navigation }: any) {
  return (
    <ScrollView className="flex-1 bg-white">
      <StyledGradient
        colors={["#F093FB", "#6FD6FF"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        className="h-72 w-full rounded-b-3xl items-center justify-center"
      >
        <Text className="text-white text-2xl font-bold">Build mindful habits</Text>
        <Text className="text-white/90 mt-2">Small steps, big changes</Text>
      </StyledGradient>

      <View className="px-6 mt-8">
        <Text className="text-navy text-xl font-semibold">Your wellness companion</Text>
        <Text className="text-slate-600 mt-2">
          Create gentle routines, track progress, and celebrate your growth with a friendly, minimal design.
        </Text>

        <GradientButton
          title="Get Started"
          iconName="sparkles"
          onPress={() => navigation.navigate("Home")}
          className="mt-6"
        />
      </View>
    </ScrollView>
  );
}









