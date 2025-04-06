import React, { useState } from "react";
import { View, StyleSheet, Image, Alert } from "react-native";
import { Button, Input, Text } from "@rneui/themed";
import { useAppDispatch } from "../store";
import { setUser } from "../store/userSlice";
import { User } from "../types";
import { RootStackScreenProps } from "../types/navigation";
import { commonStyles, customColors } from "../theme";
import { LinearGradient } from "expo-linear-gradient";
import * as api from "../api/client";
import { setPets, setLoading, setError } from "../store/petsSlice";

type Props = RootStackScreenProps<"Login">;

export default function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const user = await api.login(email, password);

      await dispatch(setUser(user));

      try {
        const pets = await api.getPets(user.id);
        dispatch(setPets(pets));
      } catch (error) {
        console.error("Error fetching pets:", error);
        dispatch(
          setError(
            error instanceof Error ? error.message : "Failed to fetch pets"
          )
        );
      }

      navigation.navigate("Dashboard");
    } catch (error) {
      console.error("Login error:", error);
      Alert.alert(
        "Error",
        error instanceof Error ? error.message : "Failed to login"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={["#842812", "#ae3e23", "#d14f30", "#e85a39"]}
      style={styles.gradient}
    >
      <View style={styles.container}>
        <View style={styles.contentContainer}>
          <View style={styles.logoContainer}>
            <Image
              source={require("../../assets/novellia-pets-logo.png")}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text h2 style={styles.title}>
              pets
            </Text>
          </View>
          <View style={styles.form}>
            <Input
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              inputStyle={styles.inputText}
              inputContainerStyle={styles.inputContainer}
              placeholderTextColor="rgba(255, 255, 255, 0.6)"
              leftIcon={{
                type: "material",
                name: "email",
                color: "white",
                size: 20,
              }}
            />
            <Input
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              inputStyle={styles.inputText}
              inputContainerStyle={styles.inputContainer}
              placeholderTextColor="rgba(255, 255, 255, 0.6)"
              leftIcon={{
                type: "material",
                name: "lock",
                color: "white",
                size: 20,
              }}
            />
            <Button
              title="Login"
              onPress={handleLogin}
              containerStyle={styles.buttonContainer}
              buttonStyle={styles.button}
              titleStyle={styles.buttonText}
              loading={loading}
              disabled={loading}
            />
            <Button
              title="Create Account"
              type="clear"
              onPress={() => navigation.navigate("Register")}
              titleStyle={styles.linkText}
              containerStyle={styles.linkContainer}
            />
          </View>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: "center",
  },
  contentContainer: {
    paddingHorizontal: 30,
    paddingBottom: 40,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  logo: {
    width: 250,
    height: 90,
    marginBottom: 8,
  },
  title: {
    color: "white",
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    fontFamily: "PublicSans-ExtraBoldItalic",
    position: "absolute",
    bottom: 0,
    right: 55,
  },
  form: {
    width: "100%",
  },
  inputContainer: {
    borderBottomWidth: 0,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 12,
    paddingHorizontal: 15,
    marginVertical: 8,
    height: 55,
    alignItems: "center",
    justifyContent: "center",
  },
  inputText: {
    color: "white",
    fontSize: 16,
    marginLeft: 8,
    height: 55,
    paddingVertical: 0,
    textAlignVertical: "center",
  },
  buttonContainer: {
    marginTop: 16,
    marginBottom: 12,
    borderRadius: 12,
    overflow: "hidden",
  },
  button: {
    backgroundColor: "white",
    paddingVertical: 15,
  },
  buttonText: {
    color: customColors.primary,
    fontSize: 17,
    fontWeight: "600",
  },
  linkContainer: {
    marginTop: 8,
  },
  linkText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
});
