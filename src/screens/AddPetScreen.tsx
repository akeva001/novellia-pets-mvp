import React, { useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Text, Input, Button } from "@rneui/themed";
import { useAppDispatch, useAppSelector } from "../store";
import { addPet } from "../store/petsSlice";
import { CompositeScreenProps } from "@react-navigation/native";
import {
  TabScreenProps,
  RootStackScreenProps,
  RootStackParamList,
} from "../types/navigation";
import { AnimalType } from "../types";
import { commonStyles, customColors } from "../theme";

type Props = CompositeScreenProps<
  TabScreenProps<"Add Pet">,
  RootStackScreenProps<keyof RootStackParamList>
>;

export default function AddPetScreen({ navigation }: Props) {
  const dispatch = useAppDispatch();
  const userId = useAppSelector((state) => state.user.currentUser?.id);
  const [name, setName] = useState("");
  const [animalType, setAnimalType] = useState<AnimalType>("dog");
  const [breed, setBreed] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");

  const handleSubmit = () => {
    if (!name || !animalType || !breed || !dateOfBirth || !userId) {
      // TODO: Add proper form validation
      return;
    }

    dispatch(
      addPet({
        id: Date.now().toString(),
        userId,
        name,
        animalType,
        breed,
        dateOfBirth: new Date(dateOfBirth).toISOString(),
      })
    );

    navigation.navigate("Dashboard");
  };

  return (
    <ScrollView style={[commonStyles.container, styles.container]}>
      <Text h3 style={styles.title}>
        Add New Pet
      </Text>
      <View style={styles.form}>
        <Input
          label="Pet Name"
          value={name}
          onChangeText={setName}
          placeholder="Enter pet name"
          inputStyle={styles.inputText}
          inputContainerStyle={styles.inputContainer}
          labelStyle={styles.label}
        />
        <Input
          label="Animal Type"
          value={animalType}
          onChangeText={(value) => setAnimalType(value as AnimalType)}
          placeholder="e.g., Dog, Cat, Bird"
          inputStyle={styles.inputText}
          inputContainerStyle={styles.inputContainer}
          labelStyle={styles.label}
        />
        <Input
          label="Breed"
          value={breed}
          onChangeText={setBreed}
          placeholder="Enter breed"
          inputStyle={styles.inputText}
          inputContainerStyle={styles.inputContainer}
          labelStyle={styles.label}
        />
        <Input
          label="Date of Birth"
          value={dateOfBirth}
          onChangeText={setDateOfBirth}
          placeholder="YYYY-MM-DD"
          inputStyle={styles.inputText}
          inputContainerStyle={styles.inputContainer}
          labelStyle={styles.label}
        />
        <Button
          title="Add Pet"
          onPress={handleSubmit}
          containerStyle={styles.buttonContainer}
          buttonStyle={styles.button}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 0,
  },
  title: {
    color: customColors.primary,
    textAlign: "center",
    marginVertical: 20,
  },
  form: {
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
  label: {
    color: customColors.primary,
    marginBottom: 5,
  },
  buttonContainer: {
    marginVertical: 20,
    borderRadius: 8,
    overflow: "hidden",
  },
  button: {
    backgroundColor: customColors.buttonPrimary,
    paddingVertical: 12,
  },
});
