import React, { useState } from "react";
import { View, StyleSheet, ScrollView, Alert } from "react-native";
import { Text, Input, Button } from "@rneui/themed";
import { useAppDispatch } from "../store";
import { updateRecord, deleteRecord } from "../store/medicalRecordsSlice";
import { RootStackScreenProps } from "../types/navigation";
import { commonStyles, customColors } from "../theme";
import { LinearGradient } from "expo-linear-gradient";
import { AllergyReaction, AllergySeverity } from "../types";

type Props = RootStackScreenProps<"EditRecord">;

export default function EditRecordScreen({ route, navigation }: Props) {
  const { record, petId } = route.params;
  const dispatch = useAppDispatch();

  const [name, setName] = useState(record.name);
  const [dateAdministered, setDateAdministered] = useState(
    "dateAdministered" in record
      ? new Date(record.dateAdministered).toISOString().split("T")[0]
      : ""
  );

  // Add additional fields based on record type
  const [dosage, setDosage] = useState("dosage" in record ? record.dosage : "");
  const [instructions, setInstructions] = useState(
    "instructions" in record ? record.instructions : ""
  );
  const [reactions, setReactions] = useState(
    "reactions" in record ? record.reactions.join(", ") : ""
  );
  const [severity, setSeverity] = useState<AllergySeverity>(
    "severity" in record ? record.severity : "mild"
  );

  const handleSeverityChange = (value: string) => {
    if (value === "mild" || value === "severe") {
      setSeverity(value);
    }
  };

  const handleSubmit = () => {
    if (!name) {
      Alert.alert("Missing Information", "Please fill in all required fields");
      return;
    }

    const baseRecord = {
      ...record,
      name,
    };

    let updatedRecord;
    if ("dateAdministered" in record) {
      if (!dateAdministered) {
        Alert.alert("Missing Information", "Please enter administration date");
        return;
      }
      updatedRecord = {
        ...baseRecord,
        dateAdministered: new Date(dateAdministered).toISOString(),
      };
    } else if ("reactions" in record) {
      if (!reactions || !severity) {
        Alert.alert(
          "Missing Information",
          "Please fill in all allergy details"
        );
        return;
      }
      updatedRecord = {
        ...baseRecord,
        reactions: reactions
          .split(",")
          .map((r) => r.trim()) as AllergyReaction[],
        severity,
      };
    } else {
      if (!dosage || !instructions) {
        Alert.alert("Missing Information", "Please fill in all lab details");
        return;
      }
      updatedRecord = {
        ...baseRecord,
        dosage,
        instructions,
      };
    }

    dispatch(updateRecord(updatedRecord));
    navigation.goBack();
  };

  const handleDelete = () => {
    Alert.alert(
      "Remove Record",
      "Are you sure you want to remove this medical record?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => {
            dispatch(deleteRecord(record.id));
            navigation.goBack();
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={[commonStyles.container, styles.container]}>
      <Text style={styles.screenTitle}>Edit Record</Text>

      <View style={styles.form}>
        <Input
          label="Record Name"
          value={name}
          onChangeText={setName}
          placeholder="Enter record name"
          inputStyle={styles.inputText}
          inputContainerStyle={styles.inputContainer}
          labelStyle={styles.label}
          placeholderTextColor={customColors.secondaryText}
        />

        {"dateAdministered" in record && (
          <Input
            label="Date Administered"
            value={dateAdministered}
            onChangeText={setDateAdministered}
            placeholder="YYYY-MM-DD"
            inputStyle={styles.inputText}
            inputContainerStyle={styles.inputContainer}
            labelStyle={styles.label}
            placeholderTextColor={customColors.secondaryText}
          />
        )}

        {"dosage" in record && (
          <Input
            label="Dosage"
            value={dosage}
            onChangeText={setDosage}
            placeholder="Enter dosage"
            inputStyle={styles.inputText}
            inputContainerStyle={styles.inputContainer}
            labelStyle={styles.label}
            placeholderTextColor={customColors.secondaryText}
          />
        )}

        {"instructions" in record && (
          <Input
            label="Instructions"
            value={instructions}
            onChangeText={setInstructions}
            placeholder="Enter instructions"
            inputStyle={styles.inputText}
            inputContainerStyle={styles.inputContainer}
            labelStyle={styles.label}
            placeholderTextColor={customColors.secondaryText}
            multiline
          />
        )}

        {"reactions" in record && (
          <Input
            label="Reactions"
            value={reactions}
            onChangeText={setReactions}
            placeholder="Enter reactions, separated by commas"
            inputStyle={styles.inputText}
            inputContainerStyle={styles.inputContainer}
            labelStyle={styles.label}
            placeholderTextColor={customColors.secondaryText}
          />
        )}

        {"severity" in record && (
          <Input
            label="Severity"
            value={severity}
            onChangeText={handleSeverityChange}
            placeholder="Enter severity level (mild/severe)"
            inputStyle={styles.inputText}
            inputContainerStyle={styles.inputContainer}
            labelStyle={styles.label}
            placeholderTextColor={customColors.secondaryText}
          />
        )}

        <View style={styles.buttonContainer}>
          <LinearGradient
            colors={["#d14f30", "#e85a39"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.saveButtonGradient}
          >
            <Button
              title="Save Changes"
              onPress={handleSubmit}
              buttonStyle={styles.saveButton}
              titleStyle={styles.saveButtonText}
            />
          </LinearGradient>

          <Button
            title="Remove Record"
            onPress={handleDelete}
            buttonStyle={styles.deleteButton}
            titleStyle={styles.deleteButtonText}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
  },
  screenTitle: {
    fontSize: 34,
    fontWeight: "bold",
    color: customColors.primary,
    marginTop: 20,
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  form: {
    paddingHorizontal: 16,
  },
  inputContainer: {
    borderBottomWidth: 0,
    backgroundColor: customColors.inputBackground,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 4,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
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
  buttonContainer: {
    gap: 12,
    marginTop: 24,
    marginBottom: 32,
  },
  saveButtonGradient: {
    borderRadius: 12,
    overflow: "hidden",
  },
  saveButton: {
    backgroundColor: "transparent",
    paddingVertical: 14,
  },
  saveButtonText: {
    fontSize: 17,
    fontWeight: "600",
    color: "white",
  },
  deleteButton: {
    backgroundColor: "rgba(220, 38, 38, 0.15)",
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(220, 38, 38, 0.2)",
  },
  deleteButtonText: {
    fontSize: 17,
    fontWeight: "600",
    color: customColors.error,
  },
});
