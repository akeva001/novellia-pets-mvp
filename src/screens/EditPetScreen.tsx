import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from "react-native";
import { Text, Button, Input } from "@rneui/themed";
import { LinearGradient } from "expo-linear-gradient";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useAppSelector, useAppDispatch } from "../store";
import { updatePet } from "../store/petsSlice";
import { RootStackScreenProps } from "../types/navigation";
import { commonStyles, customColors, typography } from "../theme";
import * as api from "../api/client";

type Props = RootStackScreenProps<"EditPet">;

export default function EditPetScreen({ route, navigation }: Props) {
  const { pet } = route.params;
  const userId = useAppSelector((state) => state.user.user?.id);
  const dispatch = useAppDispatch();

  const [name, setName] = useState(pet.name);
  const [breed, setBreed] = useState(pet.breed);
  const [dateOfBirth, setDateOfBirth] = useState(new Date(pet.dateOfBirth));
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleSave = async () => {
    if (!userId) return;

    try {
      const updatedPet = {
        ...pet,
        name,
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
        <Input
          label="Name"
          value={name}
          onChangeText={setName}
          placeholder="Enter pet name"
          inputStyle={styles.inputText}
          inputContainerStyle={styles.inputContainer}
          labelStyle={styles.label}
          placeholderTextColor={customColors.secondaryText}
        />

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
          <Button
            title="Cancel"
            onPress={() => navigation.goBack()}
            buttonStyle={styles.cancelButton}
            titleStyle={styles.cancelButtonText}
            containerStyle={styles.actionButtonContainer}
          />

          <LinearGradient
            colors={["#d14f30", "#e85a39"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.saveButtonGradient}
          >
            <Button
              title="Save Changes"
              onPress={handleSave}
              buttonStyle={styles.submitButton}
              titleStyle={styles.submitButtonText}
            />
          </LinearGradient>
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
  inputContainer: {
    borderBottomWidth: 0,
    backgroundColor: customColors.inputBackground,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 48,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  inputText: {
    ...typography.body1,
    color: customColors.text,
    textAlignVertical: "center",
    height: 48,
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
  cancelButton: {
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    paddingVertical: 14,
    borderRadius: 12,
  },
  cancelButtonText: {
    ...typography.button,
    color: customColors.text,
  },
  saveButtonGradient: {
    flex: 1,
    borderRadius: 12,
    overflow: "hidden",
  },
  submitButton: {
    backgroundColor: "transparent",
    paddingVertical: 14,
  },
  submitButtonText: {
    ...typography.button,
    color: "white",
    fontSize: 17,
  },
});
