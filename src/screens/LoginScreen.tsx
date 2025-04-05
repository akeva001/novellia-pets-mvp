import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Button, Input, Text } from "@rneui/themed";
import { useAppDispatch } from "../store";
import { setUser } from "../store/userSlice";
import { User } from "../types";
import { RootStackScreenProps } from "../types/navigation";
import { commonStyles, customColors } from "../theme";

type Props = RootStackScreenProps<"Login">;

export default function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useAppDispatch();

  const handleLogin = () => {
    // TODO: Implement actual login logic
    const mockUser: User = {
      id: "1",
      email,
      name: "Test User",
    };
    dispatch(setUser(mockUser));
  };

  return (
    <View style={[commonStyles.container, styles.container]}>
      <Text h3 style={styles.title}>
        Welcome to Novellia Pets
      </Text>
      <View style={styles.form}>
        <Input
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          inputStyle={styles.inputText}
          inputContainerStyle={styles.inputContainer}
        />
        <Input
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          inputStyle={styles.inputText}
          inputContainerStyle={styles.inputContainer}
        />
        <Button
          title="Login"
          onPress={handleLogin}
          containerStyle={styles.buttonContainer}
          buttonStyle={styles.button}
        />
        <Button
          title="Create Account"
          type="clear"
          onPress={() => navigation.navigate("Register")}
          titleStyle={styles.linkText}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
  },
  title: {
    color: customColors.primary,
    textAlign: "center",
    marginBottom: 30,
  },
  form: {
    width: "100%",
    paddingHorizontal: 20,
  },
  inputContainer: {
    borderBottomWidth: 0,
    backgroundColor: customColors.surface,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginVertical: 5,
  },
  inputText: {
    color: customColors.text,
  },
  buttonContainer: {
    marginVertical: 10,
    borderRadius: 8,
    overflow: "hidden",
  },
  button: {
    backgroundColor: customColors.buttonPrimary,
    paddingVertical: 12,
  },
  linkText: {
    color: customColors.primary,
  },
});
