import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAppSelector } from "../store";
import { RootStackParamList } from "../types/navigation";
import CustomHeader from "../components/CustomHeader";

import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import DashboardScreen from "../screens/DashboardScreen";
import AddPetScreen from "../screens/AddPetScreen";
import PetDetailsScreen from "../screens/PetDetailsScreen";
import EditPetScreen from "../screens/EditPetScreen";
import AddRecordScreen from "../screens/AddRecordScreen";
import EditRecordScreen from "../screens/EditRecordScreen";

const Stack = createNativeStackNavigator<RootStackParamList>();

const screenOptions = {
  headerShown: true,
  header: ({ route, back }: any) => {
    let title = route.name;
    let showSignOut = false;

    switch (route.name) {
      case "Dashboard":
        title = "Dashboard";
        showSignOut = true;
        break;
      case "AddPet":
        title = "Add Pet";
        break;
      case "AddRecord":
        title = "Add Record";
        break;
      case "EditRecord":
        title = "Edit Record";
        break;
      case "PetDetails":
        title = `${route.params?.pet.name}'s Profile`;
        break;
      case "EditPet":
        title = `Edit ${route.params?.pet.name}'s Profile`;
        break;
    }

    return (
      <CustomHeader
        title={title}
        showBack={back !== undefined}
        showSignOut={showSignOut}
      />
    );
  },
};

export const Navigation = () => {
  const user = useAppSelector((state) => state.user.user);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={screenOptions}>
        {!user ? (
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
            <Stack.Screen name="EditPet" component={EditPetScreen} />
            <Stack.Screen name="AddRecord" component={AddRecordScreen} />
            <Stack.Screen name="EditRecord" component={EditRecordScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
