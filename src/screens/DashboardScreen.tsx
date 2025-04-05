import React from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { Button, Text, FAB, Card } from "@rneui/themed";
import { useAppSelector, useAppDispatch } from "../store";
import { deletePet } from "../store/petsSlice";
import { Pet } from "../types";
import { CompositeScreenProps } from "@react-navigation/native";
import {
  TabScreenProps,
  RootStackScreenProps,
  RootStackParamList,
} from "../types/navigation";
import { commonStyles, customColors } from "../theme";

type Props = CompositeScreenProps<
  TabScreenProps<"Dashboard">,
  RootStackScreenProps<keyof RootStackParamList>
>;

export default function DashboardScreen({ navigation }: Props) {
  const pets = useAppSelector((state) => state.pets.pets);
  const dispatch = useAppDispatch();

  const handleDeletePet = (petId: string) => {
    dispatch(deletePet(petId));
  };

  const renderPet = ({ item: pet }: { item: Pet }) => (
    <Card containerStyle={styles.card}>
      <Card.Title style={styles.cardTitle}>{pet.name}</Card.Title>
      <Text style={styles.cardText}>Type: {pet.animalType}</Text>
      <Text style={styles.cardText}>Breed: {pet.breed}</Text>
      <View style={styles.cardActions}>
        <Button
          title="View Details"
          onPress={() => navigation.navigate("PetDetails", { pet })}
          buttonStyle={styles.viewButton}
          containerStyle={styles.buttonContainer}
        />
        <Button
          title="Delete"
          onPress={() => handleDeletePet(pet.id)}
          buttonStyle={styles.deleteButton}
          containerStyle={styles.buttonContainer}
        />
      </View>
    </Card>
  );

  return (
    <View style={commonStyles.container}>
      <Text h3 style={styles.title}>
        My Pets
      </Text>
      {pets.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No pets added yet</Text>
        </View>
      ) : (
        <FlatList
          data={pets}
          renderItem={renderPet}
          keyExtractor={(pet) => pet.id}
          contentContainerStyle={styles.list}
        />
      )}
      <FAB
        icon={{ name: "add", color: "white" }}
        placement="right"
        color={customColors.buttonPrimary}
        onPress={() => navigation.navigate("Add Pet")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    color: customColors.primary,
    marginBottom: 20,
  },
  card: {
    ...commonStyles.card,
    marginBottom: 15,
  },
  cardTitle: {
    color: customColors.primary,
    fontSize: 18,
  },
  cardText: {
    color: customColors.text,
    marginBottom: 5,
  },
  cardActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  buttonContainer: {
    flex: 1,
    marginHorizontal: 5,
  },
  viewButton: {
    backgroundColor: customColors.buttonPrimary,
  },
  deleteButton: {
    backgroundColor: customColors.error,
  },
  list: {
    padding: 10,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    color: customColors.secondaryText,
    fontSize: 16,
  },
});
