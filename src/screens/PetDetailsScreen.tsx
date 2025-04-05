import React from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { Text, Card, Button } from "@rneui/themed";
import { useAppSelector, useAppDispatch } from "../store";
import { Pet, MedicalRecord } from "../types";
import { deleteRecord } from "../store/medicalRecordsSlice";
import { RootStackScreenProps } from "../types/navigation";
import { commonStyles, customColors } from "../theme";

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
      <Card.Title style={styles.cardTitle}>{item.name}</Card.Title>
      <Card.Divider />
      <View style={styles.cardContent}>
        {"dateAdministered" in item && (
          <Text style={styles.cardText}>
            Date Administered:{" "}
            {new Date(item.dateAdministered).toLocaleDateString()}
          </Text>
        )}
        {"reactions" in item && (
          <>
            <Text style={styles.cardText}>
              Reactions: {item.reactions.join(", ")}
            </Text>
            <Text style={styles.cardText}>Severity: {item.severity}</Text>
          </>
        )}
        {"dosage" in item && (
          <>
            <Text style={styles.cardText}>Dosage: {item.dosage}</Text>
            <Text style={styles.cardText}>
              Instructions: {item.instructions}
            </Text>
          </>
        )}
      </View>
      <Button
        title="Delete Record"
        onPress={() => handleDeleteRecord(item.id)}
        buttonStyle={styles.deleteButton}
        containerStyle={styles.buttonContainer}
      />
    </Card>
  );

  return (
    <View style={[commonStyles.container, styles.container]}>
      <Text h3 style={styles.title}>
        {pet.name}
      </Text>
      <Card containerStyle={styles.petInfoCard}>
        <Text style={styles.cardText}>Type: {pet.animalType}</Text>
        <Text style={styles.cardText}>Breed: {pet.breed}</Text>
        <Text style={styles.cardText}>
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
          containerStyle={styles.addButtonContainer}
          buttonStyle={styles.addButton}
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
    paddingHorizontal: 0,
  },
  title: {
    color: customColors.primary,
    textAlign: "center",
    marginVertical: 20,
  },
  petInfoCard: {
    ...commonStyles.card,
    marginHorizontal: 10,
  },
  recordsContainer: {
    flex: 1,
    paddingHorizontal: 10,
  },
  sectionTitle: {
    color: customColors.primary,
    marginBottom: 10,
  },
  addButtonContainer: {
    marginBottom: 20,
    borderRadius: 8,
    overflow: "hidden",
  },
  addButton: {
    backgroundColor: customColors.buttonPrimary,
    paddingVertical: 12,
  },
  list: {
    paddingBottom: 20,
  },
  card: {
    ...commonStyles.card,
    marginBottom: 10,
  },
  cardTitle: {
    color: customColors.primary,
    fontSize: 16,
  },
  cardContent: {
    marginBottom: 10,
  },
  cardText: {
    color: customColors.text,
    marginBottom: 5,
  },
  buttonContainer: {
    marginTop: 10,
    borderRadius: 8,
    overflow: "hidden",
  },
  deleteButton: {
    backgroundColor: customColors.error,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: customColors.secondaryText,
  },
});
