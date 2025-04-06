import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Pressable,
  Text,
} from "react-native";
import { Icon } from "@rneui/themed";
import { customColors, typography } from "../theme";

interface Option {
  label: string;
  value: string;
}

interface AnimatedDropdownProps {
  options: Option[];
  value: string;
  onSelect: (value: string) => void;
  placeholder?: string;
}

export default function AnimatedDropdown({
  options,
  value,
  onSelect,
  placeholder = "Select an option",
}: AnimatedDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [animation] = useState(new Animated.Value(0));

  const toggleDropdown = () => {
    const toValue = isOpen ? 0 : 1;
    setIsOpen(!isOpen);
    Animated.spring(animation, {
      toValue,
      useNativeDriver: false,
      friction: 8,
      tension: 40,
    }).start();
  };

  const selectedOption = options.find((option) => option.value === value);

  const dropdownHeight = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, Math.min(options.length * 48, 192)],
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.header}
        onPress={toggleDropdown}
        activeOpacity={0.7}
      >
        <Text
          style={[styles.headerText, !selectedOption && styles.placeholder]}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </Text>
        <Icon
          name={isOpen ? "arrow-drop-up" : "arrow-drop-down"}
          type="material"
          size={24}
          color={customColors.text}
        />
      </TouchableOpacity>

      <Animated.View style={[styles.dropdown, { maxHeight: dropdownHeight }]}>
        {options.map((option, index) => (
          <Pressable
            key={option.value}
            style={[
              styles.option,
              option.value === value && styles.selectedOption,
              index === options.length - 1 && styles.lastOption,
            ]}
            onPress={() => {
              onSelect(option.value);
              toggleDropdown();
            }}
          >
            <Text
              style={[
                styles.optionText,
                option.value === value && styles.selectedOptionText,
              ]}
            >
              {option.label}
            </Text>
          </Pressable>
        ))}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 10,
    marginBottom: 16,
    zIndex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: customColors.inputBackground,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 48,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  headerText: {
    ...typography.body1,
    color: customColors.text,
    flex: 1,
    marginRight: 8,
  },
  placeholder: {
    color: customColors.secondaryText,
  },
  dropdown: {
    backgroundColor: customColors.inputBackground,
    borderRadius: 12,
    marginTop: 8,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  option: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.05)",
    minHeight: 48,
    justifyContent: "center",
  },
  lastOption: {
    borderBottomWidth: 0,
  },
  selectedOption: {
    backgroundColor: "rgba(209, 79, 48, 0.1)",
  },
  optionText: {
    ...typography.body1,
    color: customColors.text,
    flex: 1,
  },
  selectedOptionText: {
    color: customColors.primary,
    fontWeight: "600",
  },
});
