import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Platform,
  Pressable,
} from "react-native";
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
import DateTimePicker from "@react-native-community/datetimepicker";

type Props = RootStackScreenProps<"AddRecord">;

export default function AddRecordScreen({ route, navigation }: Props) {
  const { petId } = route.params;
  const [recordType, setRecordType] = useState<RecordType>("vaccine");
  const [name, setName] = useState("");
  const [dateAdministered, setDateAdministered] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [reactions, setReactions] = useState<AllergyReaction[]>([]);
  const [severity, setSeverity] = useState<AllergySeverity>("mild");
  const [dosage, setDosage] = useState("");
  const [instructions, setInstructions] = useState("");
  const dispatch = useAppDispatch();

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === "ios");
    if (selectedDate) {
      setDateAdministered(selectedDate);
    }
  };

  const handleAddRecord = () => {
    if (!name) {
      alert("Please enter a name");
      return;
    }

    let newRecord: Vaccine | Allergy | Lab = {} as any;

    switch (recordType) {
      case "vaccine":
        newRecord = {
          id: Date.now().toString(),
          petId,
          name,
          dateAdministered: dateAdministered.toISOString(),
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
        if (!dosage || !instructions) {
          alert("Please enter dosage and instructions");
          return;
        }
        newRecord = {
          id: Date.now().toString(),
          petId,
          name,
          dateAdministered: dateAdministered.toISOString(),
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

  const renderDatePicker = () => (
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
  );

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

        {recordType === "vaccine" && renderDatePicker()}

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
            {renderDatePicker()}
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

        <Button
          title="Add Record"
          onPress={handleAddRecord}
          containerStyle={styles.submitButtonContainer}
          buttonStyle={styles.submitButton}
          titleStyle={styles.buttonText}
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
    marginBottom: 24,
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
  multilineContainer: {
    height: 100,
    alignItems: "flex-start",
    justifyContent: "flex-start",
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
  multilineInput: {
    height: 100,
    textAlignVertical: "top",
    paddingTop: 12,
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
    borderRadius: 12,
    overflow: "hidden",
  },
  submitButton: {
    backgroundColor: customColors.buttonPrimary,
    paddingVertical: 12,
  },
});
