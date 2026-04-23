import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAppData } from "../context/AppDataContext";
import { AllergySection } from "../features/medical-records/components/AllergySection";
import { MedicationSection } from "../features/medical-records/components/MedicationSection";
import { VaccineSection } from "../features/medical-records/components/VaccineSection";
import { AppText, Title } from "../design-system/TextComponent";
import { RootScreen, type RootStackParamList } from "../navigation/routes";
import type { AllergyRecord, MedicationRecord, VaccineRecord } from "../types";

type MedicalRecordsProps = NativeStackScreenProps<
  RootStackParamList,
  typeof RootScreen.MedicalRecords
>;

export const MedicalRecords = ({ route, navigation }: MedicalRecordsProps) => {
  const { pets, updatePet } = useAppData();
  const pet = pets.find((existingPet) => existingPet.id === route.params.petId);

  if (!pet) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
        <View style={styles.container}>
          <Title style={styles.title}>Medical Records</Title>
          <AppText style={styles.emptyText}>Pet not found</AppText>
        </View>
      </SafeAreaView>
    );
  }

  const medicalRecords = pet.medicalRecords ?? [];
  const vaccines = medicalRecords.filter(
    (record): record is VaccineRecord => record.type === "vaccine",
  );
  const allergies = medicalRecords.filter(
    (record): record is AllergyRecord => record.type === "allergy",
  );
  const medications = medicalRecords.filter(
    (record): record is MedicationRecord => record.type === "medication",
  );

  const deleteMedicalRecord = (recordId: string) => {
    updatePet({
      ...pet,
      medicalRecords: medicalRecords.filter((record) => record.id !== recordId),
    }).catch(() => {
      Alert.alert("Failed to delete record", "Please try again.");
    });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
      <ScrollView contentContainerStyle={styles.container}>
        <Title style={styles.title}>Medical Records</Title>
        <AppText style={styles.petName}>{pet.name}</AppText>

        <VaccineSection
          records={vaccines}
          onAddPress={() =>
            navigation.navigate(RootScreen.VaccineRecordForm, { petId: pet.id })
          }
          onEdit={(record) =>
            navigation.navigate(RootScreen.VaccineRecordForm, {
              petId: pet.id,
              recordId: record.id,
            })
          }
          onDelete={deleteMedicalRecord}
        />

        <AllergySection
          records={allergies}
          onAddPress={() =>
            navigation.navigate(RootScreen.AllergyRecordForm, { petId: pet.id })
          }
          onEdit={(record) =>
            navigation.navigate(RootScreen.AllergyRecordForm, {
              petId: pet.id,
              recordId: record.id,
            })
          }
          onDelete={deleteMedicalRecord}
        />

        <MedicationSection
          records={medications}
          onAddPress={() =>
            navigation.navigate(RootScreen.MedicationRecordForm, {
              petId: pet.id,
            })
          }
          onEdit={(record) =>
            navigation.navigate(RootScreen.MedicationRecordForm, {
              petId: pet.id,
              recordId: record.id,
            })
          }
          onDelete={deleteMedicalRecord}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    padding: 16,
    gap: 16,
  },
  title: {
    fontSize: 28,
    textAlign: "left",
  },
  petName: {
    fontWeight: "600",
  },
  emptyText: {
    color: "#667085",
  },
});
