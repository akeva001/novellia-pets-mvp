import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Animated,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Button, Text, FAB } from "@rneui/themed";
import { FontAwesome5 } from "@expo/vector-icons";
import { useAppSelector, useAppDispatch } from "../store";
import { setPets, deletePet } from "../store/petsSlice";
import { Pet } from "../types";
import { RootStackScreenProps } from "../types/navigation";
import { commonStyles, customColors } from "../theme";
import { LinearGradient } from "expo-linear-gradient";
import * as api from "../api/client";

type Props = RootStackScreenProps<"Dashboard">;

export default function DashboardScreen({ navigation }: Props) {
  const dispatch = useAppDispatch();
  const userId = useAppSelector((state) => state.user.user?.id);
  const pets = useAppSelector((state) => state.pets.pets);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPets = async () => {
    if (!userId) return;

    try {
      console.log("Fetching pets for user:", userId);
      const fetchedPets = await api.getPets(userId);
      console.log("Fetched pets:", fetchedPets);
      dispatch(setPets(fetchedPets));
    } catch (error) {
      console.error("Error fetching pets:", error);
      Alert.alert(
        "Error",
        error instanceof Error ? error.message : "Failed to fetch pets"
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    console.log("Dashboard pets:", pets);
    fetchPets();
  }, [userId]);

  const handleDeletePet = async (petId: string) => {
    if (!userId) return;

    try {
      await api.deletePet(userId, petId);
      dispatch(deletePet(petId));
    } catch (error) {
      Alert.alert(
        "Error",
        error instanceof Error ? error.message : "Failed to delete pet"
      );
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchPets();
  };

  const renderListHeader = () => (
    <Text style={styles.screenTitle}>My Pets</Text>
  );

  const renderPet = ({ item: pet }: { item: Pet }) => {
    console.log("Rendering pet item:", pet);
    return (
      <Animated.View style={styles.cardContainer}>
        <LinearGradient
          colors={["#e85a39", "#d14f30", "#ae3e23", "#842812"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.cardGradient}
        >
          <View style={styles.cardContent}>
            <View style={styles.nameRow}>
              <FontAwesome5
                name={
                  pet.type === "dog"
                    ? "dog"
                    : pet.type === "cat"
                    ? "cat"
                    : "dove"
                }
                size={30}
                color="white"
                style={styles.nameIcon}
              />
              <Text style={styles.petName}>{pet.name}</Text>
            </View>
            <View style={styles.infoRow}>
              <FontAwesome5
                name="birthday-cake"
                size={14}
                color="white"
                style={styles.infoIcon}
              />
              <Text style={styles.infoText}>
                Born: {new Date(pet.dateOfBirth).toLocaleDateString()}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <FontAwesome5
                name="id-card"
                size={14}
                color="white"
                style={styles.infoIcon}
              />
              <Text style={styles.infoText}>Breed: {pet.breed}</Text>
            </View>
            <View style={styles.cardActions}>
              <Button
                title="View Details"
                onPress={() => navigation.navigate("PetDetails", { pet })}
                buttonStyle={styles.viewButton}
                containerStyle={styles.buttonContainer}
                titleStyle={styles.buttonText}
              />
            </View>
          </View>
        </LinearGradient>
      </Animated.View>
    );
  };

  return (
    <View style={[commonStyles.container, styles.container]}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={customColors.primary} />
        </View>
      ) : pets.length === 0 ? (
        <View style={styles.emptyState}>
          <FontAwesome5
            name="paw"
            size={48}
            color={customColors.secondaryText}
            style={{ marginBottom: 16 }}
          />
          <Text style={styles.emptyText}>No pets added yet</Text>
          <Text style={styles.emptySubtext}>
            Tap the + button to add your first pet
          </Text>
        </View>
      ) : (
        <FlatList
          data={pets}
          renderItem={renderPet}
          ListHeaderComponent={renderListHeader}
          keyExtractor={(pet) => pet.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          refreshing={refreshing}
          onRefresh={handleRefresh}
        />
      )}
      <FAB
        icon={{
          name: "add",
          color: "white",
          size: 24,
          type: "material",
        }}
        placement="right"
        color={customColors.buttonPrimary}
        onPress={() =>
          navigation.navigate({
            name: "AddPet",
            params: {},
          })
        }
        style={styles.fab}
        size="large"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
  },
  screenTitle: {
    fontSize: 34,
    fontWeight: "bold",
    color: customColors.primary,
    marginTop: 20,
    marginBottom: 24,
    fontFamily: "PublicSans-ExtraBoldItalic",
  },
  cardContainer: {
    marginBottom: 16,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  cardGradient: {
    borderRadius: 16,
    overflow: "hidden",
  },
  cardContent: {
    padding: 20,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    justifyContent: "flex-start",
  },
  petName: {
    fontSize: 24,
    fontWeight: "600",
    color: "white",
    marginRight: 12,
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    fontFamily: "PublicSans-Bold",
  },
  nameIcon: {
    opacity: 0.9,
    marginTop: 2,
    marginRight: 12,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  infoIcon: {
    width: 24,
    marginRight: 8,
    opacity: 0.9,
  },
  infoText: {
    fontSize: 16,
    color: "white",
    opacity: 0.9,
    fontFamily: "PublicSans-Regular",
  },
  cardActions: {
    flexDirection: "row",
    justifyContent: "center",
  },
  buttonContainer: {
    flex: 1,
    borderRadius: 12,
    overflow: "hidden",
    maxWidth: "100%",
  },
  viewButton: {
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    paddingVertical: 14,
  },
  buttonText: {
    fontSize: 17,
    fontWeight: "600",
    color: "white",
    fontFamily: "PublicSans-Bold",
  },
  list: {
    paddingTop: 8,
    paddingBottom: 100,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 100,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: "600",
    color: customColors.text,
    marginBottom: 8,
    fontFamily: "PublicSans-Bold",
  },
  emptySubtext: {
    fontSize: 16,
    color: customColors.secondaryText,
    fontFamily: "PublicSans-Regular",
  },
  fab: {
    marginBottom: 25,
    right: 16,
    bottom: 0,
    position: "absolute",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
    borderColor: "#fff",
    borderWidth: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
