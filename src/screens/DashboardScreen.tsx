import React from "react";
import { View, StyleSheet, FlatList, Animated } from "react-native";
import { Button, Text, FAB, Card } from "@rneui/themed";
import { useAppSelector, useAppDispatch } from "../store";
import { deletePet } from "../store/petsSlice";
import { Pet } from "../types";
import { RootStackScreenProps } from "../types/navigation";
import { commonStyles, customColors } from "../theme";
import { LinearGradient } from "expo-linear-gradient";

type Props = RootStackScreenProps<"Dashboard">;

export default function DashboardScreen({ navigation }: Props) {
  const pets = useAppSelector((state) => state.pets.pets);
  const dispatch = useAppDispatch();

  const handleDeletePet = (petId: string) => {
    dispatch(deletePet(petId));
  };

  const renderPet = ({ item: pet }: { item: Pet }) => (
    <Animated.View style={styles.cardContainer}>
      <LinearGradient
        colors={["#d14f30", "#e85a39"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.cardGradient}
      >
        <View style={styles.cardContent}>
          <Text style={styles.petName}>{pet.name}</Text>
          <View style={styles.petInfo}>
            <Text style={styles.infoText}>Type: {pet.animalType}</Text>
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

  return (
    <View style={[commonStyles.container, styles.container]}>
      <Text style={styles.screenTitle}>My Pets</Text>
      {pets.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No pets added yet</Text>
          <Text style={styles.emptySubtext}>
            Tap the + button to add your first pet
          </Text>
        </View>
      ) : (
        <FlatList
          data={pets}
          renderItem={renderPet}
          keyExtractor={(pet) => pet.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
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
        onPress={() => navigation.navigate("AddPet")}
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
  petName: {
    fontSize: 24,
    fontWeight: "600",
    color: "white",
    marginBottom: 12,
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  petInfo: {
    marginBottom: 16,
  },
  infoText: {
    fontSize: 16,
    color: "white",
    marginBottom: 4,
    opacity: 0.9,
  },
  cardActions: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 8,
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
  },
  emptySubtext: {
    fontSize: 16,
    color: customColors.secondaryText,
  },
  fab: {
    marginBottom: 25,
    right: 10,
    bottom: 0,
    position: "absolute",
  },
});
