import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAppSelector } from "../store";
import { RootStackParamList } from "../types/navigation";
import CustomHeader from "../components/CustomHeader";

// Import screens
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import DashboardScreen from "../screens/DashboardScreen";
import AddPetScreen from "../screens/AddPetScreen";
import PetDetailsScreen from "../screens/PetDetailsScreen";
import AddRecordScreen from "../screens/AddRecordScreen";

const Stack = createNativeStackNavigator<RootStackParamList>();

const screenOptions = {
  headerShown: true,
  header: ({ route, back }: any) => {
    let title = route.name;

    // Custom titles for specific routes
    switch (route.name) {
      case "Dashboard":
        title = "My Pets";
        break;
      case "AddPet":
        title = "Add Pet";
        break;
      case "AddRecord":
        title = "Add Record";
        break;
      case "PetDetails":
        title = route.params?.pet.name || "Pet Details";
        break;
    }

    return <CustomHeader title={title} showBack={back !== undefined} />;
  },
};

export const Navigation = () => {
  const currentUser = useAppSelector((state) => state.user.currentUser);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={screenOptions}>
        {!currentUser ? (
          // Auth Stack
          <>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Register"
              component={RegisterScreen}
              options={{ headerShown: false }}
            />
          </>
        ) : (
          // Main App Stack
          <>
            <Stack.Screen name="Dashboard" component={DashboardScreen} />
            <Stack.Screen name="AddPet" component={AddPetScreen} />
            <Stack.Screen name="PetDetails" component={PetDetailsScreen} />
            <Stack.Screen name="AddRecord" component={AddRecordScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
