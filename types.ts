export type AnimalType = "dog" | "cat" | "bird" | "rabbit";

type Reaction = "hives" | "rash" | "swelling" | "vomiting";

type VaccineRecord = {
  id: string;
  type: "vaccine";
  name: string;
  dateAdministered: string; // ISO string
};

type AllergyRecord = {
  id: string;
  type: "allergy";
  name: string;
  reactions: Reaction[];
  severity: "mild" | "severe";
};

type MedicationRecord = {
  id: string;
  type: "medication";
  name: string;
  dosage: string;
  instructions: string;
};

type MedicalRecord = VaccineRecord | AllergyRecord | MedicationRecord;

export type Pet = {
  id: string;
  name: string;
  animalType: AnimalType;
  breed?: string;
  dateOfBirth?: string; // ISO string
  photoUri?: string | null;
  medicalRecords?: MedicalRecord[];
};

export type AppData = {
  username: string | null;
  pets: Pet[];
};
