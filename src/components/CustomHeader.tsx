import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Text, Icon } from "@rneui/themed";
import { useNavigation } from "@react-navigation/native";
import { customColors, commonStyles } from "../theme";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";

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
    <LinearGradient
      colors={["#842812", "#ae3e23", "#d14f30", "#e85a39"]}
      style={styles.gradient}
    >
      <SafeAreaView edges={["top"]} style={styles.safeArea}>
        <View style={styles.header}>
          {showBack && (
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Icon name="arrow-back-ios" size={24} color="white" />
              <Text style={styles.backText}>Back</Text>
            </TouchableOpacity>
          )}
          <Text style={styles.title}>{title}</Text>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    width: "100%",
  },
  safeArea: {
    backgroundColor: "transparent",
  },
  header: {
    height: 44,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    backgroundColor: "transparent",
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
    color: "white",
    fontSize: 17,
    marginLeft: -8,
  },
  title: {
    flex: 1,
    color: "white",
    fontSize: 17,
    fontWeight: "600",
    textAlign: "center",
  },
});
