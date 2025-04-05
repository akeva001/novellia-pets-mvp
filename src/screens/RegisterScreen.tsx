import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Button, Input, Text } from "@rneui/themed";
import { useAppDispatch } from "../store";
import { setUser } from "../store/userSlice";
import { User } from "../types";
import { RootStackScreenProps } from "../types/navigation";
import { commonStyles, customColors } from "../theme";

type Props = RootStackScreenProps<"Register">;

export default function RegisterScreen({ navigation }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const dispatch = useAppDispatch();

  const handleRegister = () => {
    // TODO: Implement actual registration logic
    const mockUser: User = {
      id: "1",
      email,
      name,
    };
    dispatch(setUser(mockUser));
  };

  return (
    <View style={[commonStyles.container, styles.container]}>
      <Text h3 style={styles.title}>
        Create Account
      </Text>
      <View style={styles.form}>
        <Input
          placeholder="Name"
          value={name}
          onChangeText={setName}
          inputStyle={styles.inputText}
          inputContainerStyle={styles.inputContainer}
        />
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
          title="Register"
          onPress={handleRegister}
          containerStyle={styles.buttonContainer}
          buttonStyle={styles.button}
        />
        <Button
          title="Already have an account? Login"
          type="clear"
          onPress={() => navigation.navigate("Login")}
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
