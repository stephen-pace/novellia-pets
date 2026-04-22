import type { Pet } from "../types";

export const RootScreen = {
  Welcome: "Welcome",
  CreateUsername: "CreateUsername",
  AddPet: "AddPet",
  Home: "Home",
  PetDetails: "PetDetails",
} as const;

export type RootStackParamList = {
  Welcome: undefined;
  CreateUsername: undefined;
  AddPet:
    | {
        source?: "home";
      }
    | undefined;
  Home: undefined;
  PetDetails: {
    petId: string;
  };
};
