import React, { useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { Button, Input, Text } from "@rneui/themed";
import { useAppDispatch } from "../store";
import { setUser } from "../store/userSlice";
import { RootStackScreenProps } from "../types/navigation";
import { customColors } from "../theme";
import { LinearGradient } from "expo-linear-gradient";
import * as api from "../api/client";

type Props = RootStackScreenProps<"Register">;

export default function RegisterScreen({ navigation }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const user = await api.register(email, password, name);
      dispatch(setUser(user));
    } catch (error) {
      console.error("Register error:", error);
      Alert.alert(
        "Error",
        error instanceof Error ? error.message : "Failed to register"
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
          <Text h2 style={styles.title}>
            Create Account
          </Text>
          <View style={styles.form}>
            <Input
              placeholder="Name"
              value={name}
              onChangeText={setName}
              inputStyle={styles.inputText}
              inputContainerStyle={styles.inputContainer}
              placeholderTextColor="rgba(255, 255, 255, 0.6)"
              leftIcon={{
                type: "material",
                name: "person",
                color: "white",
                size: 20,
              }}
            />
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
              title="Register"
              onPress={handleRegister}
              containerStyle={styles.buttonContainer}
              buttonStyle={styles.button}
              titleStyle={styles.buttonText}
              loading={loading}
              disabled={loading}
            />
            <Button
              title="Already have an account? Login"
              type="clear"
              onPress={() => navigation.navigate("Login")}
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
  title: {
    color: "white",
    textAlign: "center",
    marginBottom: 40,
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    fontFamily: "PublicSans-ExtraBoldItalic",
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
