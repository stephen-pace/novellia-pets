import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Alert, Pressable, StyleSheet, View } from "react-native";
import { useCallback, useEffect, useState } from "react";

import { useAppData } from "../../Context/AppDataContext";
import { AppText } from "../../Design-System/TextComponent";
import { Input } from "../../Design-System/Input";
import { Screen } from "../../Design-System/Screen";
import { SelectField } from "../../Design-System/Picker";
import { reactionOptions, severityOptions } from "./constants";
import { RootScreen, type RootStackParamList } from "../../Navigation/routes";
import type { AllergyRecord, Reaction } from "../../types";
import { FontAwesome5 } from "@expo/vector-icons";

type AllergyRecordFormProps = NativeStackScreenProps<
  RootStackParamList,
  typeof RootScreen.AllergyRecordForm
>;

export const AllergyRecordForm = ({
  route,
  navigation,
}: AllergyRecordFormProps) => {
  const { petId, recordId } = route.params;
  const { pets, updatePet } = useAppData();
  const pet = pets.find((existingPet) => existingPet.id === petId);
  const existingRecord = (pet?.medicalRecords ?? []).find(
    (record): record is AllergyRecord =>
      record.type === "allergy" && record.id === recordId,
  );
  const isEditing = Boolean(recordId);

  const [allergyName, setAllergyName] = useState(existingRecord?.name ?? "");
  const [allergySeverity, setAllergySeverity] = useState<
    AllergyRecord["severity"]
  >(existingRecord?.severity ?? "mild");
  const [allergyReactions, setAllergyReactions] = useState<Reaction[]>(
    existingRecord?.reactions ?? [],
  );
  const [error, setError] = useState("");

  const deleteAllergy = useCallback(() => {
    if (!pet || !existingRecord) {
      return;
    }

    Alert.alert(
      "Delete Allergy",
      "Are you sure you want to delete this allergy?",
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
                setError("Failed to delete allergy, please try again");
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
                accessibilityLabel="Delete allergy"
                onPress={deleteAllergy}
                style={({ pressed }) => [
                  styles.deleteButton,
                  pressed && styles.deleteButtonPressed,
                ]}
              >
                <FontAwesome5 name="minus-circle" color="red" size={20} />
              </Pressable>
            )
          : undefined,
    });

    return () => {
      navigation.setOptions({
        headerRight: undefined,
      });
    };
  }, [deleteAllergy, existingRecord, isEditing, navigation]);

  const toggleReaction = (reaction: Reaction) => {
    setAllergyReactions((selectedReactions) =>
      selectedReactions.includes(reaction)
        ? selectedReactions.filter(
            (selectedReaction) => selectedReaction !== reaction,
          )
        : [...selectedReactions, reaction],
    );
  };

  const saveAllergy = () => {
    if (!pet) {
      setError("Pet not found");
      return;
    }

    if (isEditing && !existingRecord) {
      setError("Allergy not found");
      return;
    }

    const trimmedName = allergyName.trim();

    if (trimmedName.length === 0) {
      setError("Please enter an allergy name");
      return;
    }

    const medicalRecords = pet.medicalRecords ?? [];
    const savedAllergy: AllergyRecord = {
      id: existingRecord?.id ?? Date.now().toString(),
      type: "allergy",
      name: trimmedName,
      severity: allergySeverity,
      reactions: allergyReactions,
    };
    const updatedRecords = existingRecord
      ? medicalRecords.map((record) =>
          record.id === existingRecord.id ? savedAllergy : record,
        )
      : [...medicalRecords, savedAllergy];

    updatePet({
      ...pet,
      medicalRecords: updatedRecords,
    })
      .then(() => navigation.goBack())
      .catch(() => {
        setError("Failed to save allergy, please try again");
      });
  };

  if (!pet) {
    return (
      <Screen title="Allergy" buttonTitle="Save" onButtonPress={saveAllergy}>
        <AppText style={styles.errorText}>Pet not found</AppText>
      </Screen>
    );
  }

  if (isEditing && !existingRecord) {
    return (
      <Screen title="Allergy" buttonTitle="Save" onButtonPress={saveAllergy}>
        <AppText style={styles.errorText}>Allergy not found</AppText>
      </Screen>
    );
  }

  return (
    <Screen
      title={isEditing ? "Edit Allergy" : "Add Allergy"}
      buttonTitle="Save"
      onButtonPress={saveAllergy}
    >
      <Input
        label="Allergy name"
        value={allergyName}
        onChangeText={(text) => {
          setError("");
          setAllergyName(text);
        }}
      />
      <SelectField
        label="Severity"
        value={allergySeverity}
        options={severityOptions}
        onChange={setAllergySeverity}
      />
      <View style={styles.reactionGroup}>
        <AppText style={styles.label}>Reactions</AppText>
        <View style={styles.reactionOptions}>
          {reactionOptions.map((reactionOption) => {
            const isSelected = allergyReactions.includes(reactionOption.value);

            return (
              <Pressable
                key={reactionOption.value}
                onPress={() => toggleReaction(reactionOption.value)}
                style={[
                  styles.reactionChip,
                  isSelected && styles.reactionChipSelected,
                ]}
              >
                <AppText
                  style={[
                    styles.reactionChipText,
                    isSelected && styles.reactionChipTextSelected,
                  ]}
                >
                  {reactionOption.label}
                </AppText>
              </Pressable>
            );
          })}
        </View>
      </View>
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
  label: {
    fontWeight: "600",
  },
  reactionGroup: {
    gap: 8,
  },
  reactionOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  reactionChip: {
    borderWidth: 1,
    borderColor: "#D0D5DD",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  reactionChipSelected: {
    backgroundColor: "#000",
    borderColor: "#000",
  },
  reactionChipText: {
    color: "#344054",
  },
  reactionChipTextSelected: {
    color: "#fff",
  },
  errorText: {
    color: "red",
  },
});
