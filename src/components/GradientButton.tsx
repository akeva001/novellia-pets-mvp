import React from "react";
import { StyleSheet } from "react-native";
import { Button, ButtonProps } from "@rneui/themed";
import { LinearGradient } from "expo-linear-gradient";
import { customColors } from "../theme";

interface GradientButtonProps extends ButtonProps {
  variant?: "primary" | "white";
}

export default function GradientButton({
  variant = "primary",
  containerStyle,
  buttonStyle,
  titleStyle,
  ...props
}: GradientButtonProps) {
  if (variant === "white") {
    return (
      <Button
        containerStyle={[styles.buttonContainer, containerStyle]}
        buttonStyle={[styles.whiteButton, buttonStyle]}
        titleStyle={[styles.whiteButtonText, titleStyle]}
        {...props}
      />
    );
  }

  return (
    <LinearGradient
      colors={["#d14f30", "#e85a39"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.buttonContainer, containerStyle]}
    >
      <Button
        buttonStyle={[styles.gradientButton, buttonStyle]}
        titleStyle={[styles.gradientButtonText, titleStyle]}
        {...props}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    borderRadius: 12,
    overflow: "hidden",
  },
  gradientButton: {
    backgroundColor: "transparent",
    paddingVertical: 14,
  },
  gradientButtonText: {
    color: "white",
    fontSize: 17,
    fontWeight: "600",
  },
  whiteButton: {
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    paddingVertical: 14,
  },
  whiteButtonText: {
    color: customColors.text,
    fontSize: 17,
    fontWeight: "600",
  },
});
