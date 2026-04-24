export const RootScreen = {
  Welcome: "Welcome",
  CreateUsername: "CreateUsername",
  AddPet: "AddPet",
  Home: "Home",
  PetDetails: "PetDetails",
  MedicalRecords: "MedicalRecords",
  VaccineRecordForm: "VaccineRecordForm",
  MedicationRecordForm: "MedicationRecordForm",
  AllergyRecordForm: "AllergyRecordForm",
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
  MedicalRecords: {
    petId: string;
  };
  VaccineRecordForm: {
    petId: string;
    recordId?: string;
  };
  VaccinesTab: undefined;
  MedicationRecordForm: {
    petId: string;
    recordId?: string;
  };
  AllergyRecordForm: {
    petId: string;
    recordId?: string;
  };
};
