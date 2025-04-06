import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Platform,
  Pressable,
  Alert,
} from "react-native";
import { Text, Input, Button, ButtonGroup } from "@rneui/themed";
import { useAppDispatch, useAppSelector } from "../store";
import { addRecord } from "../store/medicalRecordsSlice";
import { RootStackScreenProps } from "../types/navigation";
import {
  Vaccine,
  Allergy,
  Lab,
  AllergyReaction,
  AllergySeverity,
  RecordType,
  Attachment,
} from "../types";
import { commonStyles, customColors, typography } from "../theme";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as api from "../api/client";
import AttachmentSection from "../components/AttachmentSection";
import FormInput from "../components/FormInput";
import GradientButton from "../components/GradientButton";

type Props = RootStackScreenProps<"AddRecord">;

export default function AddRecordScreen({ route, navigation }: Props) {
  const dispatch = useAppDispatch();
  const userId = useAppSelector((state) => state.user.user?.id);
  const { petId } = route.params;

  const [recordType, setRecordType] = useState<RecordType>("vaccine");
  const [loading, setLoading] = useState(false);

  const [vaccineName, setVaccineName] = useState<string>("");
  const [vaccineDate, setVaccineDate] = useState(new Date());
  const [showVaccineDatePicker, setShowVaccineDatePicker] = useState(false);

  const [allergyName, setAllergyName] = useState<string>("");
  const [reactions, setReactions] = useState<AllergyReaction[]>(["rash"]);
  const [severity, setSeverity] = useState<AllergySeverity>("mild");

  const [labName, setLabName] = useState<string>("");
  const [dosage, setDosage] = useState<string>("");
  const [instructions, setInstructions] = useState<string>("");

  const [attachments, setAttachments] = useState<Attachment[]>([]);

  const onVaccineDateChange = (event: any, selectedDate?: Date) => {
    setShowVaccineDatePicker(Platform.OS === "ios");
    if (selectedDate) {
      setVaccineDate(selectedDate);
    }
  };

  const handleDosageChange = (value: string) => {
    // Only allow numbers and one decimal point
    const regex = /^\d*\.?\d*$/;
    if (value === "" || regex.test(value)) {
      setDosage(value);
    }
  };

  const handleSubmit = async () => {
    if (!userId) {
      Alert.alert("Error", "User not found");
      return;
    }

    try {
      setLoading(true);
      let record: Vaccine | Allergy | Lab;

      switch (recordType) {
        case "vaccine":
          if (!vaccineName) {
            Alert.alert("Error", "Please enter the vaccine name");
            return;
          }
          record = {
            id: Date.now().toString(),
            petId,
            type: "vaccine",
            name: vaccineName,
            dateAdministered: vaccineDate.toISOString(),
            attachments,
          };
          break;

        case "allergy":
          if (!allergyName) {
            Alert.alert("Error", "Please enter the allergy name");
            return;
          }
          if (reactions.length === 0) {
            Alert.alert("Error", "Please select at least one reaction");
            return;
          }
          record = {
            id: Date.now().toString(),
            petId,
            type: "allergy",
            name: allergyName,
            reactions,
            severity,
            attachments,
          };
          break;

        case "lab":
          if (!labName) {
            Alert.alert("Error", "Please enter the lab name");
            return;
          }
          if (!dosage) {
            Alert.alert("Error", "Please enter the dosage");
            return;
          }
          if (!instructions) {
            Alert.alert("Error", "Please enter the instructions");
            return;
          }
          record = {
            id: Date.now().toString(),
            petId,
            type: "lab",
            name: labName,
            dosage: parseFloat(dosage) || 0,
            instructions,
            attachments,
          };
          break;
      }

      console.log("Creating record:", record);
      const response = await api.createRecord(userId, petId, record);
      console.log("Created record:", response);
      dispatch(addRecord(response));
      navigation.goBack();
    } catch (error) {
      console.error("Error creating record:", error);
      Alert.alert(
        "Error",
        error instanceof Error ? error.message : "Failed to create record"
      );
    } finally {
      setLoading(false);
    }
  };

  const toggleReaction = (reaction: AllergyReaction) => {
    setReactions((prev) =>
      prev.includes(reaction)
        ? prev.filter((r) => r !== reaction)
        : [...prev, reaction]
    );
  };

  const renderVaccineDatePicker = () => (
    <>
      <Text style={[styles.label, { marginLeft: 10, marginBottom: 8 }]}>
        Date Administered
      </Text>
      <Pressable
        onPress={() => setShowVaccineDatePicker(true)}
        style={styles.dateInputContainer}
      >
        <Text style={styles.dateText}>{vaccineDate.toLocaleDateString()}</Text>
      </Pressable>
      {showVaccineDatePicker && (
        <DateTimePicker
          value={vaccineDate}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={onVaccineDateChange}
          maximumDate={new Date()}
        />
      )}
    </>
  );

  const getCurrentName = () => {
    switch (recordType) {
      case "vaccine":
        return vaccineName;
      case "allergy":
        return allergyName;
      case "lab":
        return labName;
      default:
        return "";
    }
  };

  const handleNameChange = (value: string) => {
    switch (recordType) {
      case "vaccine":
        setVaccineName(value);
        break;
      case "allergy":
        setAllergyName(value);
        break;
      case "lab":
        setLabName(value);
        break;
    }
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
        <FormInput
          label="Name"
          value={getCurrentName()}
          onChangeText={handleNameChange}
          placeholder={`Enter ${recordType} name`}
          isDark={true}
        />

        {recordType === "vaccine" && renderVaccineDatePicker()}

        {recordType === "allergy" && (
          <>
            <Text style={[styles.label, { marginLeft: 10 }]}>Reactions</Text>
            <View style={styles.reactionsContainer}>
              {["rash", "swelling", "breathing", "other"].map((reaction) => (
                <GradientButton
                  key={reaction}
                  title={reaction}
                  variant={
                    reactions.includes(reaction as AllergyReaction)
                      ? "primary"
                      : "white"
                  }
                  onPress={() => toggleReaction(reaction as AllergyReaction)}
                  containerStyle={styles.reactionButton}
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

        {recordType === "lab" && (
          <>
            <FormInput
              label="Dosage"
              value={dosage}
              onChangeText={handleDosageChange}
              placeholder="Enter dosage (e.g. 3.35)"
              keyboardType="decimal-pad"
              isDark={true}
            />
            <FormInput
              label="Instructions"
              value={instructions}
              onChangeText={setInstructions}
              placeholder="Enter instructions (e.g. Take twice a day for a week with food)"
              multiline
              numberOfLines={3}
              isDark={true}
              inputStyle={styles.multilineInput}
              inputContainerStyle={styles.multilineContainer}
            />
          </>
        )}

        <AttachmentSection
          attachments={attachments}
          onAttachmentsChange={setAttachments}
        />

        <GradientButton
          title="Add Record"
          onPress={handleSubmit}
          loading={loading}
          disabled={loading}
          containerStyle={styles.submitButtonContainer}
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
    fontSize: 16,
    textAlign: "center",
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
  },
  severityGroup: {
    marginBottom: 20,
    borderRadius: 8,
    borderColor: customColors.border,
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
  submitButtonContainer: {
    marginTop: 20,
    marginHorizontal: 10,
  },
});
