import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Pet } from "./index";

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Dashboard: undefined;
  AddPet: undefined;
  PetDetails: { pet: Pet };
  AddRecord: { petId: string };
};

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;
