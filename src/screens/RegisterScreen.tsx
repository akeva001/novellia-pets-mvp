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

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 6;
const MIN_NAME_LENGTH = 2;

export default function RegisterScreen({ navigation }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [nameError, setNameError] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();

  const validateName = (name: string) => {
    if (!name) {
      setNameError("Name is required");
      return false;
    }
    if (name.length < MIN_NAME_LENGTH) {
      setNameError(`Name must be at least ${MIN_NAME_LENGTH} characters`);
      return false;
    }
    setNameError("");
    return true;
  };

  const validateEmail = (email: string) => {
    if (!email) {
      setEmailError("Email is required");
      return false;
    }
    if (!EMAIL_REGEX.test(email)) {
      setEmailError("Please enter a valid email address");
      return false;
    }
    setEmailError("");
    return true;
  };

  const validatePassword = (password: string) => {
    if (!password) {
      setPasswordError("Password is required");
      return false;
    }
    if (password.length < MIN_PASSWORD_LENGTH) {
      setPasswordError(
        `Password must be at least ${MIN_PASSWORD_LENGTH} characters`
      );
      return false;
    }
    setPasswordError("");
    return true;
  };

  const validateConfirmPassword = (confirmPass: string) => {
    if (!confirmPass) {
      setConfirmPasswordError("Please confirm your password");
      return false;
    }
    if (confirmPass !== password) {
      setConfirmPasswordError("Passwords do not match");
      return false;
    }
    setConfirmPasswordError("");
    return true;
  };

  const handleRegister = async () => {
    const isNameValid = validateName(name);
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    const isConfirmPasswordValid = validateConfirmPassword(confirmPassword);

    if (
      !isNameValid ||
      !isEmailValid ||
      !isPasswordValid ||
      !isConfirmPasswordValid
    ) {
      return;
    }

    setLoading(true);
    try {
      const user = await api.register(email, password, name);
      dispatch(setUser(user));
      navigation.navigate("Dashboard");
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
              onChangeText={(text) => {
                setName(text);
                validateName(text);
              }}
              inputStyle={styles.inputText}
              inputContainerStyle={[
                styles.inputContainer,
                nameError ? styles.inputError : null,
              ]}
              errorMessage={nameError}
              errorStyle={styles.errorText}
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
              onChangeText={(text) => {
                setEmail(text);
                validateEmail(text);
              }}
              autoCapitalize="none"
              keyboardType="email-address"
              inputStyle={styles.inputText}
              inputContainerStyle={[
                styles.inputContainer,
                emailError ? styles.inputError : null,
              ]}
              errorMessage={emailError}
              errorStyle={styles.errorText}
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
              onChangeText={(text) => {
                setPassword(text);
                validatePassword(text);
              }}
              secureTextEntry
              inputStyle={styles.inputText}
              inputContainerStyle={[
                styles.inputContainer,
                passwordError ? styles.inputError : null,
              ]}
              errorMessage={passwordError}
              errorStyle={styles.errorText}
              placeholderTextColor="rgba(255, 255, 255, 0.6)"
              leftIcon={{
                type: "material",
                name: "lock",
                color: "white",
                size: 20,
              }}
            />
            <Input
              placeholder="Confirm Password"
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text);
                validateConfirmPassword(text);
              }}
              secureTextEntry
              inputStyle={styles.inputText}
              inputContainerStyle={[
                styles.inputContainer,
                confirmPasswordError ? styles.inputError : null,
              ]}
              errorMessage={confirmPasswordError}
              errorStyle={styles.errorText}
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
  inputError: {
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.8)",
  },
  errorText: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 12,
    marginTop: 4,
    textShadowColor: "rgba(0, 0, 0, 0.1)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});
