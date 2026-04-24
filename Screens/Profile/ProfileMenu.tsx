import { Alert, Modal, Pressable, Share, StyleSheet, View } from "react-native";
import { useState } from "react";

import { useAppData } from "../../Context/AppDataContext";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { RootScreen, RootStackParamList } from "../../Navigation/routes";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { Button } from "../../Design-System/Button";
import { reactionLabels, severityLabels } from "../Allergies/constants";
import type { AnimalType, Pet } from "../../types";
import { Title } from "../../Design-System/TextComponent";

const animalLabels: Record<AnimalType, string> = {
  dog: "Dog",
  cat: "Cat",
  bird: "Bird",
  rabbit: "Rabbit",
};

const formatDate = (date?: string) => {
  if (!date) {
    return "Not set";
  }

  return new Date(date).toLocaleDateString();
};

const buildMedicalHistoryText = (pet: Pet) => {
  const medicalRecords = pet.medicalRecords ?? [];
  const vaccines = medicalRecords.filter((record) => record.type === "vaccine");
  const allergies = medicalRecords.filter(
    (record) => record.type === "allergy",
  );
  const medications = medicalRecords.filter(
    (record) => record.type === "medication",
  );

  const vaccineLines =
    vaccines.length > 0
      ? vaccines.map(
          (record) =>
            `- ${record.name} (${formatDate(record.dateAdministered)})`,
        )
      : ["- None"];

  const allergyLines =
    allergies.length > 0
      ? allergies.map((record) => {
          const reactions =
            record.reactions.length > 0
              ? record.reactions
                  .map((reaction) => reactionLabels[reaction])
                  .join(", ")
              : "None";

          return `- ${record.name} | Severity: ${severityLabels[record.severity]} | Reactions: ${reactions}`;
        })
      : ["- None"];

  const medicationLines =
    medications.length > 0
      ? medications.map((record) => {
          const details = [
            record.dosage ? `Dosage: ${record.dosage}` : null,
            record.instructions ? `Instructions: ${record.instructions}` : null,
          ]
            .filter(Boolean)
            .join(" | ");

          return details ? `- ${record.name} | ${details}` : `- ${record.name}`;
        })
      : ["- None"];

  return [
    `${pet.name} Medical History`,
    "",
    `Name: ${pet.name}`,
    `Animal type: ${animalLabels[pet.animalType]}`,
    `Breed: ${pet.breed || "Not set"}`,
    `Birthdate: ${formatDate(pet.dateOfBirth)}`,
    "",
    "Vaccines",
    ...vaccineLines,
    "",
    "Allergies",
    ...allergyLines,
    "",
    "Medications",
    ...medicationLines,
  ].join("\n");
};

export const ProfileMenu = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { currentPet, pets, removePet, resetAppData, setSelectedPetId } =
    useAppData();
  const [isOpen, setIsOpen] = useState(false);

  const closeSheet = () => {
    setIsOpen(false);
  };

  const handleDeletePet = () => {
    if (!currentPet) {
      return;
    }

    const currentPetIndex = pets.findIndex((pet) => pet.id === currentPet.id);
    const nextSelectedPet =
      pets[currentPetIndex + 1] ?? pets[currentPetIndex - 1] ?? null;

    Alert.alert("Delete pet", `Delete ${currentPet.name}?`, [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          removePet(currentPet.id)
            .then(() => {
              if (nextSelectedPet) {
                setSelectedPetId(nextSelectedPet.id);
              }

              closeSheet();
            })
            .catch((err) => {
              console.error("Unable to delete pet", err);
            });
        },
      },
    ]);
  };

  const handleResetApp = () => {
    Alert.alert(
      "Reset app",
      "Are you sure you want to reset the app? All stored data will be erased",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Reset",
          style: "destructive",
          onPress: () => {
            resetAppData()
              .then(() => {
                closeSheet();
                navigation.navigate(RootScreen.Welcome);
              })
              .catch((err) => console.error("Unable to reset app data", err));
          },
        },
      ],
    );
  };

  const handleShareMedicalHistory = async () => {
    if (!currentPet) {
      return;
    }

    try {
      await Share.share({
        message: buildMedicalHistoryText(currentPet),
        title: `${currentPet.name} Medical History`,
      });
    } catch (err) {
      console.error("Unable to share pet medical history", err);
    }
  };

  return (
    <>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Profile menu"
        onPress={() => setIsOpen(true)}
        style={({ pressed }) => [
          styles.headerButton,
          pressed && styles.headerButtonPressed,
        ]}
      >
        <FontAwesome5 name="align-justify" size={16} />
      </Pressable>

      <Modal
        animationType="fade"
        onRequestClose={closeSheet}
        transparent
        visible={isOpen}
      >
        <View style={styles.modalRoot}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Close profile menu"
            onPress={closeSheet}
            style={StyleSheet.absoluteFillObject}
          />
          <View style={styles.sheet}>
            <Button
              title="Share medical history"
              onPress={handleShareMedicalHistory}
            />
            <Button
              title="Delete pet"
              onPress={handleDeletePet}
              style={styles.deleteButton}
            />
            <Button title="Reset app" onPress={handleResetApp} />
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  headerButton: {
    alignItems: "center",
    borderColor: "#d0d5dd",
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: "row",
    gap: 6,
    marginRight: 8,
    maxWidth: 160,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  headerButtonPressed: {
    opacity: 0.7,
  },
  modalRoot: {
    backgroundColor: "rgba(0, 0, 0, 0.25)",
    flex: 1,
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    gap: 16,
    minHeight: 220,
    paddingBottom: 32,
    paddingHorizontal: 20,
    paddingTop: 32,
  },
  deleteButton: {
    backgroundColor: "#b42318",
  },
});
