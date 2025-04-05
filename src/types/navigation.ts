import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Pet } from "./index";
import { NavigatorScreenParams } from "@react-navigation/native";

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Dashboard: undefined;
  AddPet: { pet?: Pet };
  PetDetails: { pet: Pet };
  AddRecord: { petId: string };
  MainTabs: NavigatorScreenParams<TabParamList>;
};

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

export type TabParamList = {
  Dashboard: undefined;
  Profile: undefined;
};

export type TabScreenProps<T extends keyof TabParamList> = {
  navigation: any;
  route: {
    params: TabParamList[T];
  };
};
