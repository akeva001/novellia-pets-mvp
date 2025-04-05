import React, { useState } from "react";
import { View, StyleSheet, ScrollView, Alert } from "react-native";
import { Text, Input, Button, Icon } from "@rneui/themed";
import RNPickerSelect from "react-native-picker-select";
import { FontAwesome5 } from "@expo/vector-icons";
import { useAppDispatch, useAppSelector } from "../store";
import { addPet, deletePet } from "../store/petsSlice";
import { RootStackScreenProps } from "../types/navigation";
import { AnimalType, AnimalTypeLabels } from "../types";
import { commonStyles, customColors } from "../theme";
import { LinearGradient } from "expo-linear-gradient";

type Props = RootStackScreenProps<"AddPet">;

export default function AddPetScreen({ navigation, route }: Props) {
  const dispatch = useAppDispatch();
  const userId = useAppSelector((state) => state.user.currentUser?.id);
  const existingPet = route.params?.pet;

  const [name, setName] = useState(existingPet?.name || "");
  const [animalType, setAnimalType] = useState<AnimalType>(
    existingPet?.animalType || "dog"
  );
  const [breed, setBreed] = useState(existingPet?.breed || "");
  const [dateOfBirth, setDateOfBirth] = useState(
    existingPet?.dateOfBirth
      ? new Date(existingPet.dateOfBirth).toISOString().split("T")[0]
      : ""
  );

  const animalTypeOptions = Object.entries(AnimalTypeLabels).map(
    ([value, label]) => ({
      label,
      value,
    })
  );

  const handleSubmit = () => {
    if (!name || !animalType || !breed || !dateOfBirth || !userId) {
      Alert.alert("Missing Information", "Please fill in all fields");
      return;
    }

    dispatch(
      addPet({
        id: existingPet?.id || Date.now().toString(),
        userId,
        name,
        animalType,
        breed,
        dateOfBirth: new Date(dateOfBirth).toISOString(),
      })
    );

    navigation.goBack();
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete Pet",
      `Are you sure you want to delete ${name}? This action cannot be undone.`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            if (existingPet?.id) {
              dispatch(deletePet(existingPet.id));
              navigation.goBack();
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={[commonStyles.container, styles.container]}>
      <Text style={styles.screenTitle}>
        {existingPet ? "Edit Pet" : "Add New Pet"}
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
          placeholderTextColor={customColors.secondaryText}
        />

        <Text style={[styles.label, { marginLeft: 10 }]}>Animal Type</Text>
        <View style={styles.pickerContainer}>
          <RNPickerSelect
            onValueChange={(value) => {
              if (value) setAnimalType(value as AnimalType);
            }}
            items={[
              { label: "Dog", value: "dog" },
              { label: "Cat", value: "cat" },
              { label: "Bird", value: "bird" },
            ]}
            value={animalType}
            useNativeAndroidPickerStyle={false}
            placeholder={{
              label: "Select an animal type",
              value: undefined,
              color: customColors.secondaryText,
            }}
            style={{
              ...pickerSelectStyles,
            }}
            Icon={() => (
              <Icon
                name="arrow-drop-down"
                type="material"
                size={24}
                color={customColors.text}
              />
            )}
          />
        </View>

        {/* <View style={styles.selectedAnimalContainer}>
          <FontAwesome5
            name={
              animalType === "dog"
                ? "dog"
                : animalType === "cat"
                ? "cat"
                : "dove"
            }
            size={24}
            color={customColors.primary}
          />
          <Text style={styles.selectedAnimalText}>
            Selected: {AnimalTypeLabels[animalType]}
          </Text>
        </View> */}

        <Input
          label="Breed"
          value={breed}
          onChangeText={setBreed}
          placeholder="Enter breed"
          inputStyle={styles.inputText}
          inputContainerStyle={styles.inputContainer}
          labelStyle={styles.label}
          placeholderTextColor={customColors.secondaryText}
        />
        <Input
          label="Date of Birth"
          value={dateOfBirth}
          onChangeText={setDateOfBirth}
          placeholder="YYYY-MM-DD"
          inputStyle={styles.inputText}
          inputContainerStyle={styles.inputContainer}
          labelStyle={styles.label}
          placeholderTextColor={customColors.secondaryText}
        />

        <LinearGradient
          colors={["#d14f30", "#e85a39"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.submitButtonGradient}
        >
          <Button
            title={existingPet ? "Save Changes" : "Add Pet"}
            onPress={handleSubmit}
            containerStyle={styles.buttonContainer}
            buttonStyle={styles.submitButton}
            titleStyle={styles.buttonText}
          />
        </LinearGradient>

        {existingPet && (
          <Button
            title="Delete Pet"
            onPress={handleDelete}
            containerStyle={[
              styles.buttonContainer,
              styles.deleteButtonContainer,
            ]}
            buttonStyle={styles.deleteButton}
            titleStyle={styles.deleteButtonText}
          />
        )}
      </View>
    </ScrollView>
  );
}

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: customColors.inputBackground,
    borderRadius: 12,
    color: customColors.text,
    backgroundColor: customColors.inputBackground,
    paddingRight: 30,
    height: 48,
  },
  inputAndroid: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: customColors.inputBackground,
    borderRadius: 12,
    color: customColors.text,
    backgroundColor: customColors.inputBackground,
    paddingRight: 30,
    height: 48,
  },
  placeholder: {
    color: customColors.secondaryText,
  },
  iconContainer: {
    top: 12,
    right: 12,
    height: 24,
    width: 24,
  },
  viewContainer: {
    marginBottom: 16,
    backgroundColor: customColors.inputBackground,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
});

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    backgroundColor: "#fff",
  },
  pickerContainer: {
    marginHorizontal: 10,
  },
  screenTitle: {
    fontSize: 34,
    fontWeight: "bold",
    color: customColors.primary,
    marginTop: 20,
    marginBottom: 24,
  },
  form: {
    marginTop: 8,
  },
  inputContainer: {
    borderBottomWidth: 0,
    backgroundColor: customColors.inputBackground,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 4,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  inputText: {
    color: customColors.text,
    fontSize: 17,
    paddingVertical: 8,
  },
  label: {
    color: customColors.primary,
    marginBottom: 8,
    fontSize: 17,
    fontWeight: "600",
  },
  selectedAnimalContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    paddingHorizontal: 8,
    marginLeft: 5,
  },
  selectedAnimalText: {
    marginLeft: 8,
    fontSize: 16,
    color: customColors.text,
  },
  submitButtonGradient: {
    borderRadius: 12,
    marginTop: 24,
    marginBottom: 16,
    overflow: "hidden",
  },
  buttonContainer: {
    borderRadius: 12,
    overflow: "hidden",
  },
  submitButton: {
    backgroundColor: "transparent",
    paddingVertical: 14,
  },
  deleteButtonContainer: {
    marginTop: 8,
  },
  deleteButton: {
    backgroundColor: "rgba(220, 38, 38, 0.1)",
    paddingVertical: 14,
  },
  buttonText: {
    fontSize: 17,
    fontWeight: "600",
    color: "white",
  },
  deleteButtonText: {
    fontSize: 17,
    fontWeight: "600",
    color: customColors.error,
  },
});
