import React, { useMemo, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Text, Button, Icon } from "@rneui/themed";
import { FontAwesome5 } from "@expo/vector-icons";
import { useAppSelector, useAppDispatch } from "../store";
import {
  Pet,
  MedicalRecord,
  AnimalTypeLabels,
  AnimalTypeIcons,
} from "../types";
import { setRecords, deleteRecord } from "../store/medicalRecordsSlice";
import { deletePet } from "../store/petsSlice";
import { RootStackScreenProps } from "../types/navigation";
import { commonStyles, customColors, typography } from "../theme";
import { LinearGradient } from "expo-linear-gradient";
import * as api from "../api/client";

type Props = RootStackScreenProps<"PetDetails">;

export default function PetDetailsScreen({ route, navigation }: Props) {
  const { pet } = route.params;
  const userId = useAppSelector((state) => state.user.user?.id);
  const allRecords = useAppSelector((state) => state.medicalRecords.records);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const dispatch = useAppDispatch();

  const records = useMemo(() => {
    return allRecords.filter((record) => record.petId === pet.id);
  }, [allRecords, pet.id]);

  const fetchRecords = async () => {
    if (!userId) return;

    try {
      console.log("Fetching records for pet:", pet.id);
      const fetchedRecords = await api.getRecords(userId, pet.id);
      console.log("Fetched records:", fetchedRecords);
      dispatch(setRecords(fetchedRecords));
    } catch (error) {
      console.error("Error fetching records:", error);
      Alert.alert(
        "Error",
        error instanceof Error ? error.message : "Failed to fetch records"
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    console.log("Pet details:", pet);
    fetchRecords();
  }, [userId, pet.id]);

  const handleDeleteRecord = async (recordId: string) => {
    if (!userId) return;

    Alert.alert(
      "Remove Record",
      "Are you sure you want to remove this medical record?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            try {
              await api.deleteRecord(userId, recordId);
              dispatch(deleteRecord(recordId));
            } catch (error) {
              Alert.alert(
                "Error",
                error instanceof Error
                  ? error.message
                  : "Failed to delete record"
              );
            }
          },
        },
      ]
    );
  };

  const handleRemovePet = () => {
    if (!userId) return;

    Alert.alert(
      "Remove from Records",
      `Are you sure you want to remove ${pet.name} from your records? This action cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            try {
              await api.deletePet(userId, pet.id);
              dispatch(deletePet(pet.id));
              navigation.goBack();
            } catch (error) {
              Alert.alert(
                "Error",
                error instanceof Error ? error.message : "Failed to delete pet"
              );
            }
          },
        },
      ]
    );
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchRecords();
  };

  const renderRecordCard = ({ item }: { item: MedicalRecord }) => (
    <TouchableOpacity
      style={styles.recordCard}
      onPress={() =>
        navigation.navigate("EditRecord", { record: item, petId: pet.id })
      }
    >
      <View style={styles.recordContent}>
        <View style={styles.recordHeader}>
          <Text style={styles.recordTitle}>{item.name}</Text>
          <Icon
            name="chevron-right"
            type="material"
            color={customColors.secondaryText}
            size={20}
          />
        </View>
        <View style={styles.recordDetails}>
          <Text style={styles.recordText}>Type: {item.type}</Text>
          {"dateAdministered" in item && (
            <Text style={styles.recordText}>
              Date: {new Date(item.dateAdministered).toLocaleDateString()}
            </Text>
          )}
          {"reactions" in item && (
            <>
              <Text style={styles.recordText}>
                Reactions: {item.reactions.join(", ")}
              </Text>
              <Text style={styles.recordText}>Severity: {item.severity}</Text>
            </>
          )}
          {"dosage" in item && (
            <>
              <Text style={styles.recordText}>Dosage: {item.dosage}</Text>
              <Text style={styles.recordText}>
                Instructions: {item.instructions}
              </Text>
            </>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderListHeader = () => (
    <>
      <Text style={styles.screenTitle}>{pet.name}</Text>

      <View style={styles.petInfoCard}>
        <View style={styles.petInfoContent}>
          <View style={styles.infoRow}>
            <FontAwesome5
              name={
                pet.type === "dog" ? "dog" : pet.type === "cat" ? "cat" : "dove"
              }
              size={20}
              color={customColors.primary}
            />
            <Text style={styles.infoText}>Type: {pet.type || "Unknown"}</Text>
          </View>
          <View style={styles.infoRow}>
            <Icon name="info" color={customColors.primary} size={20} />
            <Text style={styles.infoText}>Breed: {pet.breed}</Text>
          </View>
          <View style={styles.infoRow}>
            <Icon name="cake" color={customColors.primary} size={20} />
            <Text style={styles.infoText}>
              Born: {new Date(pet.dateOfBirth).toLocaleDateString()}
            </Text>
          </View>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Medical Records</Text>

      {records.length === 0 && (
        <View style={styles.emptyStateContainer}>
          <Icon
            name="medical-services"
            color={customColors.secondaryText}
            size={48}
          />
          <Text style={styles.emptyText}>No medical records yet</Text>
          <Text style={styles.emptySubtext}>
            Add your first medical record to track {pet.name}'s health history
          </Text>
        </View>
      )}
    </>
  );

  return (
    <View style={[commonStyles.container, styles.container]}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={customColors.primary} />
        </View>
      ) : (
        <FlatList
          data={records}
          renderItem={renderRecordCard}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={renderListHeader}
          contentContainerStyle={[
            styles.list,
            records.length === 0 && styles.emptyList,
          ]}
          showsVerticalScrollIndicator={false}
          refreshing={refreshing}
          onRefresh={handleRefresh}
        />
      )}

      <View style={styles.bottomActions}>
        <Button
          title="Delete Pet"
          icon={{
            name: "archive",
            type: "material",
            size: 20,
            color: customColors.error,
          }}
          onPress={handleRemovePet}
          buttonStyle={styles.archivePetButton}
          containerStyle={styles.archivePetContainer}
          titleStyle={styles.archiveButtonText}
        />

        <LinearGradient
          colors={["#d14f30", "#e85a39"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.addButtonGradient}
        >
          <Button
            title="Add Record"
            onPress={() => navigation.navigate("AddRecord", { petId: pet.id })}
            buttonStyle={{ backgroundColor: "transparent" }}
            titleStyle={styles.addButtonText}
          />
        </LinearGradient>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  screenTitle: {
    ...typography.title,
    color: customColors.primary,
    marginTop: 20,
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  list: {
    paddingBottom: 100,
  },
  emptyList: {
    flexGrow: 1,
  },
  petInfoCard: {
    backgroundColor: customColors.inputBackground,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    marginHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  petInfoContent: {
    gap: 12,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  infoText: {
    ...typography.body1,
    flex: 1,
  },
  sectionTitle: {
    ...typography.h2,
    color: customColors.primary,
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  recordCard: {
    backgroundColor: customColors.inputBackground,
    borderRadius: 16,
    marginBottom: 16,
    marginHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  recordContent: {
    padding: 16,
  },
  recordHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  recordTitle: {
    ...typography.h3,
    color: customColors.primary,
  },
  recordDetails: {
    gap: 8,
  },
  recordText: {
    ...typography.body1,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
    marginTop: 100,
  },
  emptyText: {
    ...typography.h3,
    color: customColors.text,
    marginTop: 16,
    textAlign: "center",
  },
  emptySubtext: {
    ...typography.body2,
    textAlign: "center",
    marginTop: 8,
  },
  bottomActions: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 16,
    paddingBottom: 32,
    paddingTop: 16,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "rgba(0, 0, 0, 0.05)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 5,
  },
  addButtonGradient: {
    flex: 1,
    borderRadius: 12,
    overflow: "hidden",
  },
  addButton: {
    backgroundColor: "transparent",
    paddingVertical: 14,
    flexDirection: "row",
    gap: 8,
  },
  addButtonText: {
    ...typography.button,
    color: "white",
  },
  archivePetButton: {
    backgroundColor: "rgba(220, 38, 38, 0.1)",
    paddingVertical: 14,
    flexDirection: "row",
    gap: 8,
  },
  archivePetContainer: {
    flex: 1,
    borderRadius: 12,
    overflow: "hidden",
  },
  archiveButtonText: {
    ...typography.button,
    color: customColors.error,
  },
  deleteButtonContainer: {
    borderRadius: 12,
    overflow: "hidden",
  },
  deleteRecordButton: {
    backgroundColor: "rgba(220, 38, 38, 0.15)",
    paddingVertical: 12,
    marginTop: 12,
    borderWidth: 1,
    borderColor: "rgba(220, 38, 38, 0.2)",
    borderRadius: 12,
  },
  deleteButtonText: {
    ...typography.button,
    color: customColors.error,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
