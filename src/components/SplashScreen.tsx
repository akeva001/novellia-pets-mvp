import React from "react";
import { View, ActivityIndicator, StyleSheet, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export function SplashScreen() {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#e85a39", "#d14f30", "#ae3e23", "#842812"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <Image
          source={require("../../assets/splash-icon.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <ActivityIndicator size="large" color="#fff" style={styles.spinner} />
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 200,
    height: 200,
  },
  spinner: {
    marginTop: 20,
  },
});
