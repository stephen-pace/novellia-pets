import DateTimePicker from "@react-native-community/datetimepicker";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Alert, Pressable, StyleSheet } from "react-native";
import { useCallback, useEffect, useState } from "react";

import { useAppData } from "../context/AppDataContext";
import { AppText } from "../design-system/TextComponent";
import { Input } from "../design-system/Input";
import { Screen } from "../design-system/Screen";
import { RootScreen, type RootStackParamList } from "../navigation/routes";
import type { VaccineRecord } from "../types";

type VaccineRecordFormProps = NativeStackScreenProps<
  RootStackParamList,
  typeof RootScreen.VaccineRecordForm
>;

export const VaccineRecordForm = ({
  route,
  navigation,
}: VaccineRecordFormProps) => {
  const { petId, recordId } = route.params;
  const { pets, updatePet } = useAppData();
  const pet = pets.find((existingPet) => existingPet.id === petId);
  const existingRecord = (pet?.medicalRecords ?? []).find(
    (record): record is VaccineRecord =>
      record.type === "vaccine" && record.id === recordId,
  );
  const isEditing = Boolean(recordId);

  const [vaccineName, setVaccineName] = useState(existingRecord?.name ?? "");
  const [vaccineDate, setVaccineDate] = useState(
    existingRecord ? new Date(existingRecord.dateAdministered) : new Date(),
  );
  const [error, setError] = useState("");

  const deleteVaccine = useCallback(() => {
    if (!pet || !existingRecord) {
      return;
    }

    Alert.alert(
      "Delete Vaccine",
      "Are you sure you want to delete this vaccine?",
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
                setError("Failed to delete vaccine, please try again");
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
                accessibilityLabel="Delete vaccine"
                onPress={deleteVaccine}
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
  }, [deleteVaccine, existingRecord, isEditing, navigation]);

  const saveVaccine = () => {
    if (!pet) {
      setError("Pet not found");
      return;
    }

    if (isEditing && !existingRecord) {
      setError("Vaccine not found");
      return;
    }

    const trimmedName = vaccineName.trim();

    if (trimmedName.length === 0) {
      setError("Please enter a vaccine name");
      return;
    }

    const medicalRecords = pet.medicalRecords ?? [];
    const savedVaccine: VaccineRecord = {
      id: existingRecord?.id ?? Date.now().toString(),
      type: "vaccine",
      name: trimmedName,
      dateAdministered: vaccineDate.toISOString(),
    };
    const updatedRecords = existingRecord
      ? medicalRecords.map((record) =>
          record.id === existingRecord.id ? savedVaccine : record,
        )
      : [...medicalRecords, savedVaccine];

    updatePet({
      ...pet,
      medicalRecords: updatedRecords,
    })
      .then(() => navigation.goBack())
      .catch(() => {
        setError("Failed to save vaccine, please try again");
      });
  };

  if (!pet) {
    return (
      <Screen title="Vaccine" buttonTitle="Save" onButtonPress={saveVaccine}>
        <AppText style={styles.errorText}>Pet not found</AppText>
      </Screen>
    );
  }

  if (isEditing && !existingRecord) {
    return (
      <Screen title="Vaccine" buttonTitle="Save" onButtonPress={saveVaccine}>
        <AppText style={styles.errorText}>Vaccine not found</AppText>
      </Screen>
    );
  }

  return (
    <Screen
      title={isEditing ? "Edit Vaccine" : "Add Vaccine"}
      buttonTitle="Save"
      onButtonPress={saveVaccine}
    >
      <Input
        label="Vaccine name"
        value={vaccineName}
        onChangeText={(text) => {
          setError("");
          setVaccineName(text);
        }}
      />
      <AppText style={styles.label}>Administered date</AppText>
      <DateTimePicker
        value={vaccineDate}
        mode="date"
        display="spinner"
        onChange={(_event, selectedDate) => {
          if (selectedDate) {
            setVaccineDate(selectedDate);
          }
        }}
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
  label: {
    fontWeight: "600",
  },
  errorText: {
    color: "red",
  },
});
