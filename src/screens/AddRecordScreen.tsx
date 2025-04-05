import React, { useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Button, Input, Text } from "@rneui/themed";
import { useAppDispatch } from "../store";
import { addRecord } from "../store/medicalRecordsSlice";
import {
  Vaccine,
  Allergy,
  Lab,
  AllergySeverity,
  AllergyReaction,
} from "../types";
import { Picker } from "@react-native-picker/picker";
import { RootStackScreenProps } from "../types/navigation";

type RecordType = "vaccine" | "allergy" | "lab";
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

    let newRecord: Vaccine | Allergy | Lab;

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
        if (!dosage || !instructions) {
          alert("Please enter both dosage and instructions");
          return;
        }
        newRecord = {
          id: Date.now().toString(),
          petId,
          name,
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
    <ScrollView style={styles.container}>
      <Text h3 style={styles.title}>
        Add Medical Record
      </Text>

      <View style={styles.pickerContainer}>
        <Text style={styles.label}>Record Type</Text>
        <Picker
          selectedValue={recordType}
          onValueChange={(value) => setRecordType(value as RecordType)}
          style={styles.picker}
        >
          <Picker.Item label="Vaccine" value="vaccine" />
          <Picker.Item label="Allergy" value="allergy" />
          <Picker.Item label="Lab" value="lab" />
        </Picker>
      </View>

      <Input
        placeholder="Name"
        value={name}
        onChangeText={setName}
        autoCapitalize="words"
      />

      {recordType === "vaccine" && (
        <Input
          placeholder="Date Administered (YYYY-MM-DD)"
          value={dateAdministered}
          onChangeText={setDateAdministered}
          keyboardType="numbers-and-punctuation"
        />
      )}

      {recordType === "allergy" && (
        <>
          <View style={styles.reactionsContainer}>
            <Text style={styles.label}>Reactions</Text>
            {(
              [
                "hives",
                "rash",
                "swelling",
                "vomiting",
                "diarrhea",
              ] as AllergyReaction[]
            ).map((reaction) => (
              <Button
                key={reaction}
                title={reaction}
                type={reactions.includes(reaction) ? "solid" : "outline"}
                onPress={() => toggleReaction(reaction)}
                containerStyle={styles.reactionButton}
              />
            ))}
          </View>
          <View style={styles.pickerContainer}>
            <Text style={styles.label}>Severity</Text>
            <Picker
              selectedValue={severity}
              onValueChange={(value) => setSeverity(value as AllergySeverity)}
              style={styles.picker}
            >
              <Picker.Item label="Mild" value="mild" />
              <Picker.Item label="Severe" value="severe" />
            </Picker>
          </View>
        </>
      )}

      {recordType === "lab" && (
        <>
          <Input
            placeholder="Dosage (e.g., 3.35 mg)"
            value={dosage}
            onChangeText={setDosage}
          />
          <Input
            placeholder="Instructions"
            value={instructions}
            onChangeText={setInstructions}
            multiline
            numberOfLines={4}
          />
        </>
      )}

      <Button
        title="Add Record"
        onPress={handleAddRecord}
        containerStyle={styles.buttonContainer}
      />
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
  pickerContainer: {
    marginHorizontal: 10,
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: "#86939e",
    marginBottom: 5,
  },
  picker: {
    backgroundColor: "#f2f2f2",
    borderRadius: 5,
  },
  reactionsContainer: {
    marginHorizontal: 10,
    marginBottom: 20,
  },
  reactionButton: {
    marginVertical: 5,
  },
  buttonContainer: {
    marginVertical: 20,
  },
});
