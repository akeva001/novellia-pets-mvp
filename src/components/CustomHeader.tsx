import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Text, Icon } from "@rneui/themed";
import { useNavigation } from "@react-navigation/native";
import { customColors, commonStyles } from "../theme";
import { SafeAreaView } from "react-native-safe-area-context";

interface CustomHeaderProps {
  title: string;
  showBack?: boolean;
}

export default function CustomHeader({
  title,
  showBack = true,
}: CustomHeaderProps) {
  const navigation = useNavigation();

  return (
    <SafeAreaView
      edges={["top"]}
      style={[commonStyles.header, styles.safeArea]}
    >
      <View style={styles.header}>
        {showBack && (
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Icon
              name="arrow-back-ios"
              size={24}
              color={customColors.primary}
            />
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
        )}
        <Text style={styles.title}>{title}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "white",
  },
  header: {
    height: 44,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    backgroundColor: "white",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    position: "absolute",
    left: 16,
    zIndex: 1,
    height: 44,
    justifyContent: "center",
  },
  backText: {
    color: customColors.primary,
    fontSize: 17,
    marginLeft: -8,
  },
  title: {
    flex: 1,
    color: customColors.text,
    fontSize: 17,
    fontWeight: "600",
    textAlign: "center",
  },
});
