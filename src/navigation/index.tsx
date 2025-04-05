import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAppSelector } from "../store";
import { RootStackParamList } from "../types/navigation";

// Import screens
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import DashboardScreen from "../screens/DashboardScreen";
import AddPetScreen from "../screens/AddPetScreen";
import PetDetailsScreen from "../screens/PetDetailsScreen";
import AddRecordScreen from "../screens/AddRecordScreen";

const Stack = createNativeStackNavigator<RootStackParamList>();

export const Navigation = () => {
  const currentUser = useAppSelector((state) => state.user.currentUser);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {!currentUser ? (
          // Auth Stack
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
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
