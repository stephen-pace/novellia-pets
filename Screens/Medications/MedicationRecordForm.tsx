import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Alert, FlatList, Pressable, StyleSheet, View } from "react-native";
import { useCallback, useEffect, useState } from "react";

import { useAppData } from "../../Context/AppDataContext";
import { AppText } from "../../Design-System/TextComponent";
import { Input } from "../../Design-System/Input";
import { Screen } from "../../Design-System/Screen";
import { RootScreen, type RootStackParamList } from "../../Navigation/routes";
import type { MedicalRecord, MedicationRecord } from "../../types";

type MedicationRecordFormProps = NativeStackScreenProps<
  RootStackParamList,
  typeof RootScreen.MedicationRecordForm
>;

export const MedicationRecordForm = ({
  route,
  navigation,
}: MedicationRecordFormProps) => {
  const { petId, recordId } = route.params;
  const { pets, updatePet } = useAppData();
  const pet = pets.find((existingPet) => existingPet.id === petId);
  const existingRecord = (pet?.medicalRecords ?? []).find(
    (record): record is MedicationRecord =>
      record.type === "medication" && record.id === recordId,
  );

  const [medMatches, setMedMatches] = useState<MedicalRecord[]>([]);

  const isEditing = Boolean(recordId);

  const [medicationName, setMedicationName] = useState(
    existingRecord?.name ?? "",
  );
  const [medicationDosage, setMedicationDosage] = useState(
    existingRecord?.dosage ?? "",
  );
  const [medicationInstructions, setMedicationInstructions] = useState(
    existingRecord?.instructions ?? "",
  );
  const [error, setError] = useState("");

  const searchForAutocomplete = (text: string) => {
    if (text.length === 0) {
      setMedMatches([]);
      return;
    }

    const matches = pet?.medicalRecords?.filter((record) => {
      return record.name.includes(text);
    });

    if (matches) setMedMatches(matches);
  };
  const deleteMedication = useCallback(() => {
    if (!pet || !existingRecord) {
      return;
    }

    Alert.alert(
      "Delete Medication",
      "Are you sure you want to delete this medication?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            updatePet({
              ...pet,
              medicalRecords: (pet.medicalRecords ?? []).filter(
                (record) => record.id !== existingRecord.id,
              ),
            })
              .then(() => navigation.goBack())
              .catch(() => {
                setError("Failed to delete medication, please try again");
              });
          },
        },
      ],
    );
  }, [existingRecord, navigation, pet, updatePet]);

  useEffect(() => {
    navigation.setOptions({
      headerRight:
        isEditing && existingRecord
          ? () => (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Delete medication"
                onPress={deleteMedication}
                style={({ pressed }) => [
                  styles.deleteButton,
                  pressed && styles.deleteButtonPressed,
                ]}
              >
                <AppText style={styles.deleteButtonText}>⛔</AppText>
              </Pressable>
            )
          : undefined,
    });

    return () => {
      navigation.setOptions({
        headerRight: undefined,
      });
    };
  }, [deleteMedication, existingRecord, isEditing, navigation]);

  const saveMedication = () => {
    if (!pet) {
      setError("Pet not found");
      return;
    }

    if (isEditing && !existingRecord) {
      setError("Medication not found");
      return;
    }

    const trimmedName = medicationName.trim();

    if (trimmedName.length === 0) {
      setError("Please enter a medication name");
      return;
    }

    const medicalRecords = pet.medicalRecords ?? [];
    const savedMedication: MedicationRecord = {
      id: existingRecord?.id ?? Date.now().toString(),
      type: "medication",
      name: trimmedName,
      dosage: medicationDosage.trim(),
      instructions: medicationInstructions.trim(),
    };
    const updatedRecords = existingRecord
      ? medicalRecords.map((record) =>
          record.id === existingRecord.id ? savedMedication : record,
        )
      : [...medicalRecords, savedMedication];

    updatePet({
      ...pet,
      medicalRecords: updatedRecords,
    })
      .then(() => navigation.goBack())
      .catch(() => {
        setError("Failed to save medication, please try again");
      });
  };

  if (!pet) {
    return (
      <Screen
        title="Medication"
        buttonTitle="Save"
        onButtonPress={saveMedication}
      >
        <AppText style={styles.errorText}>Pet not found</AppText>
      </Screen>
    );
  }

  if (isEditing && !existingRecord) {
    return (
      <Screen
        title="Medication"
        buttonTitle="Save"
        onButtonPress={saveMedication}
      >
        <AppText style={styles.errorText}>Medication not found</AppText>
      </Screen>
    );
  }

  return (
    <Screen
      title={isEditing ? "Edit Medication" : "Add Medication"}
      buttonTitle="Save"
      onButtonPress={saveMedication}
    >
      <Input
        label="Medication name"
        value={medicationName}
        onChangeText={(text) => {
          setError("");
          setMedicationName(text);
          searchForAutocomplete(text);
        }}
      />
      <FlatList
        data={medMatches}
        renderItem={({ item }) => {
          return (
            <Pressable
              onPress={() => {
                setMedicationName(item.name);
                setMedMatches([]);
              }}
            >
              <AppText>{item.name}</AppText>
            </Pressable>
          );
        }}
      />
      <Input
        label="Dosage"
        value={medicationDosage}
        onChangeText={setMedicationDosage}
      />
      <Input
        label="Instructions"
        value={medicationInstructions}
        onChangeText={setMedicationInstructions}
        multiline
        style={styles.instructionsInput}
        textAlignVertical="top"
      />
      {error ? <AppText style={styles.errorText}>{error}</AppText> : null}
    </Screen>
  );
};

const styles = StyleSheet.create({
  deleteButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  deleteButtonPressed: {
    opacity: 0.7,
  },
  deleteButtonText: {
    fontSize: 20,
  },
  instructionsInput: {
    minHeight: 96,
  },
  errorText: {
    color: "red",
  },
});
