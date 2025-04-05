import React, { useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Text, Input, Button, ButtonGroup } from "@rneui/themed";
import { useAppDispatch } from "../store";
import { addRecord } from "../store/medicalRecordsSlice";
import { RootStackScreenProps } from "../types/navigation";
import {
  Vaccine,
  Allergy,
  Lab,
  AllergyReaction,
  AllergySeverity,
  RecordType,
} from "../types";
import { commonStyles, customColors, typography } from "../theme";

type Props = RootStackScreenProps<"AddRecord">;

export default function AddRecordScreen({ route, navigation }: Props) {
  const { petId } = route.params;
  const [recordType, setRecordType] = useState<RecordType>("vaccine");
  const [name, setName] = useState("");
  const [dateAdministered, setDateAdministered] = useState("");
  const [reactions, setReactions] = useState<AllergyReaction[]>([]);
  const [severity, setSeverity] = useState<AllergySeverity>("mild");
  const [dosage, setDosage] = useState("");
  const [instructions, setInstructions] = useState("");
  const dispatch = useAppDispatch();

  const handleAddRecord = () => {
    if (!name) {
      alert("Please enter a name");
      return;
    }

    let newRecord: Vaccine | Allergy | Lab = {} as any;

    switch (recordType) {
      case "vaccine":
        if (!dateAdministered) {
          alert("Please enter the administration date");
          return;
        }
        newRecord = {
          id: Date.now().toString(),
          petId,
          name,
          dateAdministered,
        };
        break;

      case "allergy":
        if (reactions.length === 0) {
          alert("Please select at least one reaction");
          return;
        }
        newRecord = {
          id: Date.now().toString(),
          petId,
          name,
          reactions,
          severity,
        };
        break;

      case "lab":
        if (!dosage || !instructions || !dateAdministered) {
          alert("Please enter dosage, instructions, and administration date");
          return;
        }
        newRecord = {
          id: Date.now().toString(),
          petId,
          name,
          dateAdministered,
          dosage,
          instructions,
        };
        break;
    }

    dispatch(addRecord(newRecord));
    navigation.goBack();
  };

  const toggleReaction = (reaction: AllergyReaction) => {
    setReactions((prev) =>
      prev.includes(reaction)
        ? prev.filter((r) => r !== reaction)
        : [...prev, reaction]
    );
  };

  return (
    <ScrollView style={[commonStyles.container, styles.container]}>
      <Text h3 style={styles.title}>
        Add Medical Record
      </Text>
      <ButtonGroup
        buttons={["Vaccine", "Allergy", "Lab"]}
        selectedIndex={["vaccine", "allergy", "lab"].indexOf(recordType)}
        onPress={(index) =>
          setRecordType(["vaccine", "allergy", "lab"][index] as RecordType)
        }
        containerStyle={styles.buttonGroup}
        selectedButtonStyle={styles.selectedButton}
        textStyle={styles.buttonText}
        selectedTextStyle={styles.selectedButtonText}
      />
      <View style={styles.form}>
        <Input
          label="Name"
          value={name}
          onChangeText={setName}
          placeholder={`Enter ${recordType} name`}
          inputStyle={styles.inputText}
          inputContainerStyle={styles.inputContainer}
          labelStyle={styles.label}
          placeholderTextColor={customColors.secondaryText}
        />

        {recordType === "vaccine" && (
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

        {recordType === "allergy" && (
          <>
            <Text style={[styles.label, { marginLeft: 10 }]}>Reactions</Text>
            <View style={styles.reactionsContainer}>
              {["rash", "swelling", "breathing", "other"].map((reaction) => (
                <Button
                  key={reaction}
                  title={reaction}
                  type={
                    reactions.includes(reaction as AllergyReaction)
                      ? "solid"
                      : "outline"
                  }
                  onPress={() => toggleReaction(reaction as AllergyReaction)}
                  containerStyle={styles.reactionButton}
                  buttonStyle={
                    reactions.includes(reaction as AllergyReaction)
                      ? styles.selectedReactionButton
                      : styles.outlineButton
                  }
                  titleStyle={
                    reactions.includes(reaction as AllergyReaction)
                      ? styles.selectedButtonText
                      : styles.outlineButtonText
                  }
                />
              ))}
            </View>
            <ButtonGroup
              buttons={["Mild", "Moderate", "Severe"]}
              selectedIndex={["mild", "moderate", "severe"].indexOf(severity)}
              onPress={(index) =>
                setSeverity(
                  ["mild", "moderate", "severe"][index] as AllergySeverity
                )
              }
              containerStyle={styles.severityGroup}
              selectedButtonStyle={styles.selectedButton}
              textStyle={styles.buttonText}
              selectedTextStyle={styles.selectedButtonText}
            />
          </>
        )}

        {recordType === "lab" && (
          <>
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
            <Input
              label="Instructions"
              value={instructions}
              onChangeText={setInstructions}
              placeholder="Enter instructions"
              multiline
              numberOfLines={3}
              inputStyle={styles.inputText}
              inputContainerStyle={styles.inputContainer}
              labelStyle={styles.label}
              placeholderTextColor={customColors.secondaryText}
            />
          </>
        )}

        <Button
          title="Add Record"
          onPress={handleAddRecord}
          containerStyle={styles.submitButtonContainer}
          buttonStyle={styles.submitButton}
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
    ...typography.h2,
    color: customColors.primary,
    textAlign: "center",
    marginVertical: 20,
  },
  form: {
    paddingHorizontal: 20,
  },
  buttonGroup: {
    marginBottom: 20,
    borderRadius: 8,
    borderColor: customColors.border,
    marginHorizontal: 30,
  },
  selectedButton: {
    backgroundColor: customColors.buttonPrimary,
  },
  buttonText: {
    ...typography.button,
    color: customColors.text,
  },
  selectedButtonText: {
    ...typography.button,
    color: "white",
  },
  inputContainer: {
    borderBottomWidth: 0,
    backgroundColor: customColors.inputBackground,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginVertical: 5,
  },
  inputText: {
    ...typography.body1,
    color: customColors.text,
  },
  label: {
    ...typography.h3,
    color: customColors.primary,
    marginBottom: 5,
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
    marginBottom: 10,
    borderRadius: 12,
  },
  selectedReactionButton: {
    backgroundColor: customColors.buttonPrimary,
    paddingVertical: 12,
    height: 45,
    borderRadius: 12,
  },
  outlineButton: {
    backgroundColor: "white",
    borderColor: customColors.border,
    borderWidth: 1,
    paddingVertical: 12,
    height: 45,
    borderRadius: 12,
  },
  outlineButtonText: {
    ...typography.button,
    color: customColors.text,
  },
  severityGroup: {
    marginBottom: 20,
    borderRadius: 8,
    borderColor: customColors.border,
  },
  submitButtonContainer: {
    marginVertical: 20,
    borderRadius: 8,
    overflow: "hidden",
  },
  submitButton: {
    backgroundColor: customColors.buttonPrimary,
    paddingVertical: 12,
  },
});
