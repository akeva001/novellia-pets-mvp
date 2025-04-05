import React from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { Text, Card, Button } from "@rneui/themed";
import { useAppSelector, useAppDispatch } from "../store";
import { Pet } from "../types";
import { deletePet } from "../store/petsSlice";
import { CompositeScreenProps } from "@react-navigation/native";
import {
  TabScreenProps,
  RootStackScreenProps,
  RootStackParamList,
} from "../types/navigation";

type Props = CompositeScreenProps<
  TabScreenProps<"Dashboard">,
  RootStackScreenProps<"MainTabs">
>;

export default function DashboardScreen({ navigation }: Props) {
  const pets = useAppSelector((state) => state.pets.pets);
  const dispatch = useAppDispatch();

  const handleDeletePet = (petId: string) => {
    dispatch(deletePet(petId));
  };

  const renderPetCard = ({ item }: { item: Pet }) => (
    <Card containerStyle={styles.card}>
      <Card.Title>{item.name}</Card.Title>
      <Card.Divider />
      <View style={styles.cardContent}>
        <Text>Type: {item.animalType}</Text>
        <Text>Breed: {item.breed}</Text>
        <Text>
          Date of Birth: {new Date(item.dateOfBirth).toLocaleDateString()}
        </Text>
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title="View Details"
          onPress={() => navigation.navigate("PetDetails", { pet: item })}
          containerStyle={styles.button}
        />
        <Button
          title="Delete"
          onPress={() => handleDeletePet(item.id)}
          type="outline"
          containerStyle={styles.button}
        />
      </View>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Text h3 style={styles.title}>
        My Pets
      </Text>
      {pets.length === 0 ? (
        <Text style={styles.emptyText}>
          No pets added yet. Add your first pet!
        </Text>
      ) : (
        <FlatList
          data={pets}
          renderItem={renderPetCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
        />
      )}
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
    flexDirection: "row",
    justifyContent: "space-around",
  },
  button: {
    width: "45%",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
  },
});
