import React, { useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Text, Input, Button } from "@rneui/themed";
import { useAppDispatch, useAppSelector } from "../store";
import { addPet } from "../store/petsSlice";
import { CompositeScreenProps } from "@react-navigation/native";
import { TabScreenProps, RootStackScreenProps } from "../types/navigation";
import { AnimalType } from "../types";

type Props = CompositeScreenProps<
  TabScreenProps<"Add Pet">,
  RootStackScreenProps<"MainTabs">
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
    <ScrollView style={styles.container}>
      <Text h3 style={styles.title}>
        Add New Pet
      </Text>
      <View style={styles.form}>
        <Input
          label="Pet Name"
          value={name}
          onChangeText={setName}
          placeholder="Enter pet name"
        />
        <Input
          label="Animal Type"
          value={animalType}
          onChangeText={(value) => setAnimalType(value as AnimalType)}
          placeholder="e.g., Dog, Cat, Bird"
        />
        <Input
          label="Breed"
          value={breed}
          onChangeText={setBreed}
          placeholder="Enter breed"
        />
        <Input
          label="Date of Birth"
          value={dateOfBirth}
          onChangeText={setDateOfBirth}
          placeholder="YYYY-MM-DD"
        />
        <Button
          title="Add Pet"
          onPress={handleSubmit}
          containerStyle={styles.button}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    textAlign: "center",
    marginVertical: 20,
  },
  form: {
    // Add appropriate styles for the form
  },
  button: {
    marginVertical: 20,
  },
});
