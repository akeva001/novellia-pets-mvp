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
import DateTimePicker from "@react-native-community/datetimepicker";
import { useAppSelector, useAppDispatch } from "../store";
import { updatePet } from "../store/petsSlice";
import { RootStackScreenProps } from "../types/navigation";
import { commonStyles, customColors, typography } from "../theme";
import { AnimalType, AnimalTypeLabels } from "../types";
import AnimatedDropdown from "../components/AnimatedDropdown";
import FormInput from "../components/FormInput";
import GradientButton from "../components/GradientButton";
import * as api from "../api/client";

type Props = RootStackScreenProps<"EditPet">;

export default function EditPetScreen({ route, navigation }: Props) {
  const { pet } = route.params;
  const userId = useAppSelector((state) => state.user.user?.id);
  const dispatch = useAppDispatch();

  const [name, setName] = useState(pet.name);
  const [type, setType] = useState<AnimalType>(pet.type);
  const [breed, setBreed] = useState(pet.breed);
  const [dateOfBirth, setDateOfBirth] = useState(new Date(pet.dateOfBirth));
  const [showDatePicker, setShowDatePicker] = useState(false);

  const animalTypeOptions = Object.entries(AnimalTypeLabels).map(
    ([value, label]) => ({
      label,
      value,
    })
  );

  const handleSave = async () => {
    if (!userId) return;

    try {
      const updatedPet = {
        ...pet,
        name,
        type,
        breed,
        dateOfBirth: dateOfBirth.toISOString(),
      };

      const result = await api.updatePet(userId, pet.id, updatedPet);
      dispatch(updatePet(result));
      navigation.goBack();
    } catch (error) {
      Alert.alert(
        "Error",
        error instanceof Error ? error.message : "Failed to update pet"
      );
    }
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === "ios");
    if (selectedDate) {
      setDateOfBirth(selectedDate);
    }
  };

  return (
    <ScrollView style={[commonStyles.container, styles.container]}>
      <Text h3 style={styles.title}>
        Edit Pet Profile
      </Text>

      <View style={styles.form}>
        <FormInput
          label="Name"
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
          />
        )}

        <View style={styles.bottomActions}>
          <GradientButton
            title="Cancel"
            onPress={() => navigation.goBack()}
            variant="white"
            containerStyle={styles.actionButtonContainer}
          />

          <GradientButton
            title="Save Changes"
            onPress={handleSave}
            containerStyle={styles.actionButtonContainer}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 0,
  },
  title: {
    ...typography.h2,
    color: customColors.primary,
    textAlign: "center",
    marginVertical: 20,
  },
  form: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  label: {
    ...typography.h3,
    color: customColors.primary,
    marginBottom: 8,
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
  bottomActions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 32,
  },
  actionButtonContainer: {
    flex: 1,
  },
});
