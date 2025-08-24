import React from "react";
import { Text, TouchableOpacity, ViewStyle } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { styled } from "nativewind";
import Ionicons from "@expo/vector-icons/Ionicons";

type GradientButtonProps = {
  title: string;
  onPress: () => void;
  iconName?: string;
  style?: ViewStyle;
  className?: string;
};

const StyledGradient = styled(LinearGradient);

export default function GradientButton({ title, onPress, iconName, style, className }: GradientButtonProps) {
  return (
    <TouchableOpacity activeOpacity={0.9} onPress={onPress} style={style}>
      <StyledGradient
        colors={["#3B6AFF", "#6FD6FF"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        className={`rounded-3xl py-4 px-6 flex-row items-center justify-center shadow ${className || ""}`}
      >
        {iconName ? (
          <Ionicons name={iconName as any} size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
        ) : null}
        <Text className="text-white text-base font-semibold">{title}</Text>
      </StyledGradient>
    </TouchableOpacity>
  );
}









