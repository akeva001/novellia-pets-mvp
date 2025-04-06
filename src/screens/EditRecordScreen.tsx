import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  Platform,
  Pressable,
} from "react-native";
import { Text, Input, Button, ButtonGroup } from "@rneui/themed";
import { useAppDispatch, useAppSelector } from "../store";
import { updateRecord, deleteRecord } from "../store/medicalRecordsSlice";
import { RootStackScreenProps } from "../types/navigation";
import { commonStyles, customColors, typography } from "../theme";
import { LinearGradient } from "expo-linear-gradient";
import {
  AllergyReaction,
  AllergySeverity,
  Vaccine,
  Allergy,
  Lab,
} from "../types";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as api from "../api/client";

type Props = RootStackScreenProps<"EditRecord">;

export default function EditRecordScreen({ navigation, route }: Props) {
  const dispatch = useAppDispatch();
  const userId = useAppSelector((state) => state.user.user?.id);
  const { record, petId } = route.params;
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState(record.name);
  const [dateAdministered, setDateAdministered] = useState(
    "dateAdministered" in record
      ? new Date(record.dateAdministered)
      : new Date()
  );
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [dosage, setDosage] = useState(
    "dosage" in record ? record.dosage.toString() : ""
  );
  const [instructions, setInstructions] = useState(
    "instructions" in record ? record.instructions : ""
  );
  const [reactions, setReactions] = useState(
    "reactions" in record ? record.reactions.join(", ") : ""
  );
  const [severity, setSeverity] = useState<AllergySeverity>(
    "severity" in record ? record.severity : "mild"
  );

  const handleDosageChange = (value: string) => {
    // Only allow numbers and one decimal point
    const regex = /^\d*\.?\d*$/;
    if (value === "" || regex.test(value)) {
      setDosage(value);
    }
  };

  const handleSeverityChange = (value: string) => {
    if (value === "mild" || value === "severe") {
      setSeverity(value);
    }
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === "ios");
    if (selectedDate) {
      setDateAdministered(selectedDate);
    }
  };

  const handleSubmit = async () => {
    if (!name || !userId) {
      Alert.alert("Error", "Please enter a name for the record");
      return;
    }

    try {
      setLoading(true);
      let updates: Partial<Vaccine | Allergy | Lab> = { name };

      switch (record.type) {
        case "vaccine":
          if (!dateAdministered) {
            Alert.alert("Error", "Please select the date administered");
            return;
          }
          updates = {
            ...updates,
            dateAdministered: dateAdministered.toISOString(),
          };
          break;

        case "allergy":
          const allergyReactions = reactions
            .split(",")
            .map((r) => r.trim())
            .filter((r) =>
              ["rash", "swelling", "breathing", "other"].includes(r)
            ) as AllergyReaction[];

          if (allergyReactions.length === 0) {
            Alert.alert("Error", "Please select at least one valid reaction");
            return;
          }
          if (severity !== "mild" && severity !== "severe") {
            Alert.alert("Error", "Severity must be either mild or severe");
            return;
          }
          updates = {
            ...updates,
            reactions: allergyReactions,
            severity,
          };
          break;

        case "lab":
          if (!dosage) {
            Alert.alert("Error", "Please enter the dosage");
            return;
          }
          if (!instructions) {
            Alert.alert("Error", "Please enter the instructions");
            return;
          }
          updates = {
            ...updates,
            dosage: parseFloat(dosage) || 0,
            instructions,
          };
          break;
      }

      console.log("Updating record:", updates);
      const updatedRecord = await api.updateRecord(userId, record.id, updates);
      console.log("Updated record:", updatedRecord);
      dispatch(updateRecord(updatedRecord));
      navigation.goBack();
    } catch (error) {
      console.error("Error updating record:", error);
      Alert.alert(
        "Error",
        error instanceof Error ? error.message : "Failed to update record"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!userId) return;

    Alert.alert(
      "Delete Record",
      "Are you sure you want to delete this record?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              setLoading(true);
              await api.deleteRecord(userId, record.id);
              dispatch(deleteRecord(record.id));
              navigation.goBack();
            } catch (error) {
              Alert.alert(
                "Error",
                error instanceof Error
                  ? error.message
                  : "Failed to delete record"
              );
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const toggleReaction = (reaction: AllergyReaction) => {
    const currentReactions = reactions
      .split(",")
      .map((r) => r.trim())
      .filter(Boolean);
    const updatedReactions = currentReactions.includes(reaction)
      ? currentReactions.filter((r) => r !== reaction)
      : [...currentReactions, reaction];
    setReactions(updatedReactions.join(", "));
  };

  return (
    <ScrollView style={[commonStyles.container, styles.container]}>
      <Text h3 style={styles.title}>
        Edit {record.type.charAt(0).toUpperCase() + record.type.slice(1)}
      </Text>

      <View style={styles.form}>
        <Input
          label="Name"
          value={name}
          onChangeText={setName}
          placeholder={`Enter ${record.type} name`}
          inputStyle={styles.inputText}
          inputContainerStyle={styles.inputContainer}
          labelStyle={styles.label}
          placeholderTextColor={customColors.secondaryText}
        />

        {record.type === "vaccine" && (
          <>
            <Text style={[styles.label, { marginLeft: 10, marginBottom: 8 }]}>
              Date Administered
            </Text>
            <Pressable
              onPress={() => setShowDatePicker(true)}
              style={styles.dateInputContainer}
            >
              <Text style={styles.dateText}>
                {dateAdministered.toLocaleDateString()}
              </Text>
            </Pressable>
            {showDatePicker && (
              <DateTimePicker
                value={dateAdministered}
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={onDateChange}
                maximumDate={new Date()}
              />
            )}
          </>
        )}

        {record.type === "allergy" && (
          <>
            <Text style={[styles.label, { marginLeft: 10 }]}>Reactions</Text>
            <View style={styles.reactionsContainer}>
              {["rash", "swelling", "breathing", "other"].map((reaction) => (
                <Button
                  key={reaction}
                  title={reaction}
                  type={reactions.includes(reaction) ? "solid" : "outline"}
                  onPress={() => toggleReaction(reaction as AllergyReaction)}
                  containerStyle={styles.reactionButton}
                  buttonStyle={
                    reactions.includes(reaction)
                      ? styles.selectedReactionButton
                      : styles.outlineButton
                  }
                  titleStyle={
                    reactions.includes(reaction)
                      ? styles.selectedButtonText
                      : styles.outlineButtonText
                  }
                />
              ))}
            </View>
            <ButtonGroup
              buttons={["Mild", "Severe"]}
              selectedIndex={["mild", "severe"].indexOf(severity)}
              onPress={(index) =>
                setSeverity(["mild", "severe"][index] as AllergySeverity)
              }
              containerStyle={styles.severityGroup}
              selectedButtonStyle={styles.selectedButton}
              textStyle={styles.buttonText}
              selectedTextStyle={styles.selectedButtonText}
            />
          </>
        )}

        {record.type === "lab" && (
          <>
            <Input
              label="Dosage"
              value={dosage}
              onChangeText={handleDosageChange}
              placeholder="Enter dosage (e.g. 3.35)"
              keyboardType="decimal-pad"
              inputStyle={styles.inputText}
              inputContainerStyle={styles.inputContainer}
              labelStyle={styles.label}
              placeholderTextColor={customColors.secondaryText}
            />
            <Input
              label="Instructions"
              value={instructions}
              onChangeText={setInstructions}
              placeholder="Enter instructions (e.g. Take twice a day for a week with food)"
              multiline
              numberOfLines={3}
              inputStyle={[styles.inputText, styles.multilineInput]}
              inputContainerStyle={[
                styles.inputContainer,
                styles.multilineContainer,
              ]}
              labelStyle={styles.label}
              placeholderTextColor={customColors.secondaryText}
            />
          </>
        )}

        <View style={styles.bottomActions}>
          <Button
            title="Delete Record"
            onPress={handleDelete}
            buttonStyle={styles.deleteButton}
            titleStyle={styles.deleteButtonText}
            disabled={loading}
          />

          <LinearGradient
            colors={["#d14f30", "#e85a39"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.saveButtonGradient}
          >
            <Button
              title="Save Changes"
              onPress={handleSubmit}
              buttonStyle={styles.submitButton}
              titleStyle={styles.submitButtonText}
              loading={loading}
              disabled={loading}
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
  reactionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
    marginHorizontal: 10,
  },
  reactionButton: {
    width: "48%",
    marginBottom: 12,
    borderRadius: 12,
  },
  selectedReactionButton: {
    backgroundColor: customColors.buttonPrimary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    height: 48,
    borderRadius: 12,
  },
  outlineButton: {
    backgroundColor: "white",
    borderColor: customColors.border,
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 24,
    height: 48,
    borderRadius: 12,
  },
  outlineButtonText: {
    ...typography.button,
    color: customColors.text,
    fontSize: 16,
    textAlign: "center",
  },
  severityGroup: {
    marginBottom: 20,
    borderRadius: 8,
    borderColor: customColors.border,
  },
  selectedButton: {
    backgroundColor: customColors.buttonPrimary,
  },
  buttonText: {
    ...typography.body1,
    color: customColors.text,
  },
  selectedButtonText: {
    ...typography.button,
    color: "white",
    fontSize: 16,
    textAlign: "center",
  },
  multilineInput: {
    height: 100,
    textAlignVertical: "top",
    paddingTop: 12,
  },
  multilineContainer: {
    height: 100,
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  bottomActions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 32,
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
  deleteButton: {
    backgroundColor: "rgba(220, 38, 38, 0.1)",
    paddingVertical: 14,
    flex: 1,
    borderRadius: 12,
  },
  deleteButtonText: {
    ...typography.button,
    color: customColors.error,
  },
});
