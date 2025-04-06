import React from "react";
import { StyleSheet } from "react-native";
import { Input, InputProps } from "@rneui/themed";
import { customColors } from "../theme";

interface FormInputProps extends InputProps {
  isDark?: boolean;
}

export default function FormInput({
  isDark = false,
  ...props
}: FormInputProps) {
  return (
    <Input
      inputStyle={[
        styles.inputText,
        { color: isDark ? customColors.text : "white" },
      ]}
      inputContainerStyle={[
        styles.inputContainer,
        {
          backgroundColor: isDark
            ? customColors.inputBackground
            : "rgba(255, 255, 255, 0.15)",
        },
      ]}
      placeholderTextColor={
        isDark ? customColors.secondaryText : "rgba(255, 255, 255, 0.6)"
      }
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    borderBottomWidth: 0,
    borderRadius: 12,
    paddingHorizontal: 15,
    marginVertical: 8,
    height: 55,
    alignItems: "center",
    justifyContent: "center",
  },
  inputText: {
    fontSize: 16,
    marginLeft: 8,
    height: 55,
    paddingVertical: 0,
    textAlignVertical: "center",
  },
});
