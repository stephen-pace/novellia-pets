import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import { type ReactNode, useEffect, useState } from "react";
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

import { useAppData } from "../../Context/AppDataContext";
import { Button } from "../../Design-System/Button";
import { Input } from "../../Design-System/Input";
import { SelectField, type SelectOption } from "../../Design-System/Picker";
import { AppText, Title } from "../../Design-System/TextComponent";
import type { AnimalType, Pet } from "../../types";

type ProfileDraft = {
  name: string;
  breed: string;
  dateOfBirth: Date;
  animalType: AnimalType;
};

type EditableField = keyof ProfileDraft | null;

type EditableProfileRowProps = {
  label: string;
  isEditing: boolean;
  onEditPress: () => void;
  renderEdit: () => ReactNode;
  children: ReactNode;
  editLabel?: string;
};

const animalOptions = [
  { label: "Dog", value: "dog" },
  { label: "Cat", value: "cat" },
  { label: "Bird", value: "bird" },
  { label: "Rabbit", value: "rabbit" },
] satisfies SelectOption<AnimalType>[];

const getAnimalLabel = (animalType: AnimalType) => {
  return (
    animalOptions.find((option) => option.value === animalType)?.label ??
    animalType
  );
};

const formatDate = (dateOfBirth?: string) => {
  if (!dateOfBirth) {
    return "Not set";
  }

  return new Date(dateOfBirth).toLocaleDateString();
};

const getDateValue = (dateOfBirth?: string) => {
  return dateOfBirth ? new Date(dateOfBirth) : new Date();
};

const buildDraft = (
  pet?: Pick<Pet, "name" | "breed" | "dateOfBirth" | "animalType"> | null,
): ProfileDraft => {
  return {
    name: pet?.name ?? "",
    breed: pet?.breed ?? "",
    dateOfBirth: getDateValue(pet?.dateOfBirth),
    animalType: pet?.animalType ?? "dog",
  };
};

const EditableProfileRow = ({
  label,
  isEditing,
  onEditPress,
  renderEdit,
  children,
  editLabel,
}: EditableProfileRowProps) => {
  return (
    <View style={styles.row}>
      <View style={styles.rowHeader}>
        <AppText style={styles.label}>{label}</AppText>
        {!isEditing ? (
          <Pressable
            accessibilityLabel={editLabel ?? `Edit ${label.toLowerCase()}`}
            accessibilityRole="button"
            hitSlop={20}
            onPress={onEditPress}
          >
            <AppText style={styles.editText}>Edit</AppText>
          </Pressable>
        ) : null}
      </View>

      {isEditing ? renderEdit() : children}
    </View>
  );
};

export const ProfileTab = () => {
  const { currentPet, updatePet } = useAppData();
  const [editingField, setEditingField] = useState<EditableField>(null);
  const [draft, setDraft] = useState<ProfileDraft>(() =>
    buildDraft(currentPet),
  );
  const [error, setError] = useState("");

  useEffect(() => {
    setEditingField(null);
    setDraft(buildDraft(currentPet));
    setError("");
  }, [currentPet]);

  if (!currentPet) {
    return (
      <View style={styles.container}>
        <Title>Profile</Title>
        <AppText style={styles.helperText}>No pet selected.</AppText>
      </View>
    );
  }

  const resetDraft = () => {
    setDraft(buildDraft(currentPet));
  };

  const updateDraft = <K extends keyof ProfileDraft>(
    key: K,
    value: ProfileDraft[K],
  ) => {
    setDraft((currentDraft) => ({
      ...currentDraft,
      [key]: value,
    }));
    setError("");
  };

  const startEditing = (field: Exclude<EditableField, null>) => {
    setEditingField(field);
    resetDraft();
    setError("");
  };

  const cancelEditing = () => {
    setEditingField(null);
    resetDraft();
    setError("");
  };

  const savePet = (
    updates: Partial<
      Pick<Pet, "name" | "breed" | "dateOfBirth" | "animalType">
    >,
    errorMessage: string,
  ) => {
    updatePet({
      ...currentPet,
      ...updates,
    })
      .then(() => {
        setEditingField(null);
        setError("");
      })
      .catch(() => {
        setError(errorMessage);
      });
  };

  const saveField = (field: Exclude<EditableField, null>) => {
    if (field === "name") {
      const trimmedName = draft.name.trim();

      if (trimmedName.length === 0) {
        setError("Please enter a name");
        return;
      }

      savePet(
        {
          name: trimmedName,
        },
        "Failed to update name, please try again",
      );
      return;
    }

    if (field === "breed") {
      savePet(
        {
          breed: draft.breed.trim() || undefined,
        },
        "Failed to update breed, please try again",
      );
      return;
    }

    if (field === "dateOfBirth") {
      savePet(
        {
          dateOfBirth: draft.dateOfBirth.toISOString(),
        },
        "Failed to update birthdate, please try again",
      );
      return;
    }

    savePet(
      {
        animalType: draft.animalType,
      },
      "Failed to update animal type, please try again",
    );
  };

  const changePhoto = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert("Permission needed", "Please allow photo library access.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (result.canceled) {
      return;
    }

    updatePet({
      ...currentPet,
      photoUri: result.assets[0].uri,
    }).catch(() => {
      setError("Failed to update photo, please try again");
    });
  };

  const renderEditActions = (field: Exclude<EditableField, null>) => {
    return (
      <View style={styles.actions}>
        <Button
          title="Cancel"
          onPress={cancelEditing}
          style={styles.secondaryButton}
          textStyle={styles.secondaryButtonText}
        />
        <Button
          title="Save"
          onPress={() => saveField(field)}
          style={styles.actionButton}
        />
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.hero}>
        <View style={styles.avatarWrapper}>
          <View style={styles.avatar}>
            {currentPet.photoUri ? (
              <Image
                accessibilityLabel={`${currentPet.name} profile photo`}
                accessible
                source={{ uri: currentPet.photoUri }}
                style={styles.avatarImage}
              />
            ) : (
              <AppText style={styles.avatarText}>
                {currentPet.name.charAt(0).toUpperCase()}
              </AppText>
            )}
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Edit profile photo"
            onPress={changePhoto}
            style={({ pressed }) => [
              styles.photoEditButton,
              pressed && styles.photoEditButtonPressed,
            ]}
          >
            <AppText style={styles.photoEditText}>✎</AppText>
          </Pressable>
        </View>
        <Title>{currentPet.name}</Title>
        <AppText style={styles.helperText}>
          {getAnimalLabel(currentPet.animalType)}
        </AppText>
      </View>

      <View style={styles.section}>
        <EditableProfileRow
          label="Name"
          editLabel="Edit pet name"
          isEditing={editingField === "name"}
          onEditPress={() => startEditing("name")}
          renderEdit={() => (
            <View style={styles.editGroup}>
              <Input
                value={draft.name}
                onChangeText={(text) => updateDraft("name", text)}
              />
              {renderEditActions("name")}
            </View>
          )}
        >
          <AppText>{currentPet.name}</AppText>
        </EditableProfileRow>

        <EditableProfileRow
          label="Breed"
          editLabel="Edit pet breed"
          isEditing={editingField === "breed"}
          onEditPress={() => startEditing("breed")}
          renderEdit={() => (
            <View style={styles.editGroup}>
              <Input
                value={draft.breed}
                onChangeText={(text) => updateDraft("breed", text)}
              />
              {renderEditActions("breed")}
            </View>
          )}
        >
          <AppText>{currentPet.breed || "Not set"}</AppText>
        </EditableProfileRow>

        <EditableProfileRow
          label="Birthdate"
          editLabel="Edit pet birthdate"
          isEditing={editingField === "dateOfBirth"}
          onEditPress={() => startEditing("dateOfBirth")}
          renderEdit={() => (
            <View style={styles.editGroup}>
              <DateTimePicker
                value={draft.dateOfBirth}
                mode="date"
                display="spinner"
                onChange={(_event, selectedDate) => {
                  if (selectedDate) {
                    updateDraft("dateOfBirth", selectedDate);
                  }
                }}
              />
              {renderEditActions("dateOfBirth")}
            </View>
          )}
        >
          <AppText>{formatDate(currentPet.dateOfBirth)}</AppText>
        </EditableProfileRow>

        <EditableProfileRow
          label="Animal type"
          editLabel="Edit pet animal type"
          isEditing={editingField === "animalType"}
          onEditPress={() => startEditing("animalType")}
          renderEdit={() => (
            <View style={styles.editGroup}>
              <SelectField
                value={draft.animalType}
                options={animalOptions}
                onChange={(value) => updateDraft("animalType", value)}
              />
              {renderEditActions("animalType")}
            </View>
          )}
        >
          <AppText>{getAnimalLabel(currentPet.animalType)}</AppText>
        </EditableProfileRow>
      </View>

      {error ? <AppText style={styles.errorText}>{error}</AppText> : null}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flex: 1,
    padding: 24,
  },
  hero: {
    alignItems: "center",
    gap: 6,
    marginBottom: 24,
  },
  avatarWrapper: {
    marginBottom: 6,
    position: "relative",
  },
  avatar: {
    alignItems: "center",
    backgroundColor: "#f2f4f7",
    borderRadius: 40,
    height: 80,
    justifyContent: "center",
    overflow: "hidden",
    width: 80,
  },
  avatarImage: {
    height: 80,
    width: 80,
  },
  avatarText: {
    fontSize: 32,
    lineHeight: 40,
    fontWeight: "600",
  },
  photoEditButton: {
    alignItems: "center",
    backgroundColor: "#fff",
    borderColor: "#d0d5dd",
    borderRadius: 14,
    borderWidth: 1,
    bottom: -2,
    height: 28,
    justifyContent: "center",
    position: "absolute",
    right: -4,
    width: 28,
  },
  photoEditButtonPressed: {
    opacity: 0.7,
  },
  photoEditText: {
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 18,
  },
  section: {
    borderTopColor: "#eaecf0",
    borderTopWidth: 1,
  },
  row: {
    borderBottomColor: "#eaecf0",
    borderBottomWidth: 1,
    gap: 8,
    paddingVertical: 16,
  },
  rowHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  label: {
    color: "#667085",
    fontWeight: "600",
  },
  editGroup: {
    gap: 12,
  },
  actions: {
    flexDirection: "row",
    gap: 8,
  },
  actionButton: {
    flex: 1,
  },
  secondaryButton: {
    backgroundColor: "#fff",
    borderColor: "#d0d5dd",
    borderWidth: 1,
    flex: 1,
  },
  secondaryButtonText: {
    color: "#344054",
  },
  editText: {
    color: "#475467",
    fontWeight: "600",
  },
  helperText: {
    color: "#667085",
  },
  errorText: {
    color: "red",
    marginTop: 12,
  },
});
