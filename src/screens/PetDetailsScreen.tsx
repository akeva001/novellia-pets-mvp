import React from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { Text, Card, Button } from "@rneui/themed";
import { useAppSelector, useAppDispatch } from "../store";
import { Pet, MedicalRecord } from "../types";
import { deleteRecord } from "../store/medicalRecordsSlice";
import { RootStackScreenProps } from "../types/navigation";

type Props = RootStackScreenProps<"PetDetails">;

export default function PetDetailsScreen({ route, navigation }: Props) {
  const { pet } = route.params;
  const records = useAppSelector((state) =>
    state.medicalRecords.records.filter((record) => record.petId === pet.id)
  );
  const dispatch = useAppDispatch();

  const handleDeleteRecord = (recordId: string) => {
    dispatch(deleteRecord(recordId));
  };

  const renderRecordCard = ({ item }: { item: MedicalRecord }) => (
    <Card containerStyle={styles.card}>
      <Card.Title>{item.name}</Card.Title>
      <Card.Divider />
      <View style={styles.cardContent}>
        {"dateAdministered" in item && (
          <Text>
            Date Administered:{" "}
            {new Date(item.dateAdministered).toLocaleDateString()}
          </Text>
        )}
        {"reactions" in item && (
          <>
            <Text>Reactions: {item.reactions.join(", ")}</Text>
            <Text>Severity: {item.severity}</Text>
          </>
        )}
        {"dosage" in item && (
          <>
            <Text>Dosage: {item.dosage}</Text>
            <Text>Instructions: {item.instructions}</Text>
          </>
        )}
      </View>
      <Button
        title="Delete Record"
        onPress={() => handleDeleteRecord(item.id)}
        type="outline"
        containerStyle={styles.buttonContainer}
      />
    </Card>
  );

  return (
    <View style={styles.container}>
      <Text h3 style={styles.title}>
        {pet.name}
      </Text>
      <Card containerStyle={styles.petInfoCard}>
        <Text>Type: {pet.animalType}</Text>
        <Text>Breed: {pet.breed}</Text>
        <Text>
          Date of Birth: {new Date(pet.dateOfBirth).toLocaleDateString()}
        </Text>
      </Card>
      <View style={styles.recordsContainer}>
        <Text h4 style={styles.sectionTitle}>
          Medical Records
        </Text>
        <Button
          title="Add New Record"
          onPress={() => navigation.navigate("AddRecord", { petId: pet.id })}
          containerStyle={styles.addButton}
        />
        {records.length === 0 ? (
          <Text style={styles.emptyText}>No medical records yet.</Text>
        ) : (
          <FlatList
            data={records}
            renderItem={renderRecordCard}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  title: {
    textAlign: "center",
    marginVertical: 20,
  },
  petInfoCard: {
    borderRadius: 10,
    marginBottom: 20,
  },
  recordsContainer: {
    flex: 1,
  },
  sectionTitle: {
    marginBottom: 10,
  },
  addButton: {
    marginBottom: 20,
  },
  list: {
    paddingBottom: 20,
  },
  card: {
    borderRadius: 10,
    marginBottom: 10,
  },
  cardContent: {
    marginBottom: 10,
  },
  buttonContainer: {
    marginTop: 10,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
  },
});
