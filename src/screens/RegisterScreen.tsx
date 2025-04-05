import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Button, Input, Text } from "@rneui/themed";
import { useAppDispatch } from "../store";
import { setUser } from "../store/userSlice";
import { User } from "../types";
import { RootStackScreenProps } from "../types/navigation";

type Props = RootStackScreenProps<"Register">;

export default function RegisterScreen({ navigation }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
    <View style={styles.container}>
      <Text h3 style={styles.title}>
        Create Account
      </Text>
      <Input
        placeholder="Name"
        value={name}
        onChangeText={setName}
        autoCapitalize="words"
      />
      <Input
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <Input
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button
        title="Register"
        onPress={handleRegister}
        containerStyle={styles.buttonContainer}
      />
      <Button
        title="Already have an account? Login"
        type="clear"
        onPress={() => navigation.navigate("Login")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  title: {
    textAlign: "center",
    marginBottom: 30,
  },
  buttonContainer: {
    marginVertical: 10,
  },
});
