import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  Platform,
  Pressable,
} from "react-native";
import { Text } from "@rneui/themed";
import { useAppDispatch, useAppSelector } from "../store";
import { addPet, deletePet } from "../store/petsSlice";
import { RootStackScreenProps } from "../types/navigation";
import { AnimalType, AnimalTypeLabels } from "../types";
import { commonStyles, customColors, typography } from "../theme";
import DateTimePicker from "@react-native-community/datetimepicker";
import AnimatedDropdown from "../components/AnimatedDropdown";
import FormInput from "../components/FormInput";
import GradientButton from "../components/GradientButton";
import * as api from "../api/client";

type Props = RootStackScreenProps<"AddPet">;

export default function AddPetScreen({ navigation, route }: Props) {
  const dispatch = useAppDispatch();
  const userId = useAppSelector((state) => state.user.user?.id);
  const existingPet = route.params?.pet;
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState(existingPet?.name || "");
  const [type, setType] = useState<AnimalType>(existingPet?.type || "dog");
  const [breed, setBreed] = useState(existingPet?.breed || "");
  const [dateOfBirth, setDateOfBirth] = useState(
    existingPet?.dateOfBirth ? new Date(existingPet.dateOfBirth) : new Date()
  );
  const [showDatePicker, setShowDatePicker] = useState(false);

  const animalTypeOptions = Object.entries(AnimalTypeLabels).map(
    ([value, label]) => ({
      label,
      value,
    })
  );

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === "ios");
    if (selectedDate) {
      setDateOfBirth(selectedDate);
    }
  };

  const handleSubmit = async () => {
    if (!name || !type || !breed || !userId) {
      Alert.alert("Missing Information", "Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      const petData = {
        name,
        type,
        breed,
        dateOfBirth: dateOfBirth.toISOString(),
      };

      if (existingPet?.id) {
        const updatedPet = await api.updatePet(userId, existingPet.id, petData);
        dispatch(addPet(updatedPet));
      } else {
        const newPet = await api.createPet(userId, petData);
        dispatch(addPet(newPet));
      }

      navigation.goBack();
    } catch (error) {
      Alert.alert(
        "Error",
        error instanceof Error ? error.message : "Failed to save pet"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!userId || !existingPet?.id) return;

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
          onPress: async () => {
            try {
              setLoading(true);
              await api.deletePet(userId, existingPet.id);
              dispatch(deletePet(existingPet.id));
              navigation.goBack();
            } catch (error) {
              Alert.alert(
                "Error",
                error instanceof Error ? error.message : "Failed to delete pet"
              );
            } finally {
              setLoading(false);
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
        <FormInput
          label="Pet Name"
          value={name}
          onChangeText={setName}
          placeholder="Enter pet name"
          isDark={true}
        />

        <Text style={[styles.label, { marginLeft: 10 }]}>Animal Type</Text>
        <AnimatedDropdown
          options={animalTypeOptions}
          value={type}
          onSelect={(value) => setType(value as AnimalType)}
          placeholder="Select an animal type"
        />

        <FormInput
          label="Breed"
          value={breed}
          onChangeText={setBreed}
          placeholder="Enter breed"
          isDark={true}
        />

        <Text style={[styles.label, { marginLeft: 10, marginBottom: 8 }]}>
          Date of Birth
        </Text>
        <Pressable
          onPress={() => setShowDatePicker(true)}
          style={styles.dateInputContainer}
        >
          <Text style={styles.dateText}>
            {dateOfBirth.toLocaleDateString()}
          </Text>
        </Pressable>
        {showDatePicker && (
          <DateTimePicker
            value={dateOfBirth}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={onDateChange}
            maximumDate={new Date()}
          />
        )}

        <GradientButton
          title={existingPet ? "Save Changes" : "Add Pet"}
          onPress={handleSubmit}
          loading={loading}
          disabled={loading}
          containerStyle={styles.submitButtonContainer}
        />

        {existingPet && (
          <GradientButton
            title="Delete Pet"
            onPress={handleDelete}
            variant="white"
            containerStyle={styles.deleteButtonContainer}
            titleStyle={styles.deleteButtonText}
          />
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    backgroundColor: "#fff",
  },
  pickerContainer: {
    marginHorizontal: 10,
  },
  screenTitle: {
    ...typography.title,
    color: customColors.primary,
    marginTop: 20,
    marginBottom: 24,
  },
  form: {
    marginTop: 8,
    marginBottom: 24,
  },
  dateInputContainer: {
    backgroundColor: customColors.inputBackground,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 48,
    marginHorizontal: 10,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    justifyContent: "center",
  },
  dateText: {
    ...typography.body1,
    color: customColors.text,
  },
  label: {
    ...typography.h3,
    color: customColors.primary,
    marginBottom: 8,
  },
  submitButtonContainer: {
    marginTop: 24,
    marginBottom: 16,
  },
  deleteButtonContainer: {
    marginTop: 8,
  },
  deleteButtonText: {
    color: customColors.error,
  },
});
