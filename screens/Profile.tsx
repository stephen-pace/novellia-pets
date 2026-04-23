import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import { useEffect, useState } from "react";
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

import { useAppData } from "../context/AppDataContext";
import { Button } from "../design-system/Button";
import { Input } from "../design-system/Input";
import { SelectField, type SelectOption } from "../design-system/Picker";
import { AppText, Title } from "../design-system/TextComponent";
import type { AnimalType } from "../types";

type EditableField = "name" | "breed" | "dateOfBirth" | "animalType" | null;

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

export const ProfileTab = () => {
  const { currentPet, updatePet } = useAppData();
  const [editingField, setEditingField] = useState<EditableField>(null);
  const [nameDraft, setNameDraft] = useState(currentPet?.name ?? "");
  const [breedDraft, setBreedDraft] = useState(currentPet?.breed ?? "");
  const [dateOfBirthDraft, setDateOfBirthDraft] = useState(
    getDateValue(currentPet?.dateOfBirth),
  );
  const [animalTypeDraft, setAnimalTypeDraft] = useState<AnimalType>(
    currentPet?.animalType ?? "dog",
  );
  const [error, setError] = useState("");

  useEffect(() => {
    setEditingField(null);
    setNameDraft(currentPet?.name ?? "");
    setBreedDraft(currentPet?.breed ?? "");
    setDateOfBirthDraft(getDateValue(currentPet?.dateOfBirth));
    setAnimalTypeDraft(currentPet?.animalType ?? "dog");
    setError("");
  }, [
    currentPet?.id,
    currentPet?.name,
    currentPet?.breed,
    currentPet?.dateOfBirth,
    currentPet?.animalType,
  ]);

  if (!currentPet) {
    return (
      <View style={styles.container}>
        <Title>Profile</Title>
        <AppText style={styles.helperText}>No pet selected.</AppText>
      </View>
    );
  }

  const cancelEditing = () => {
    setEditingField(null);
    setNameDraft(currentPet.name);
    setBreedDraft(currentPet.breed ?? "");
    setDateOfBirthDraft(getDateValue(currentPet.dateOfBirth));
    setAnimalTypeDraft(currentPet.animalType);
    setError("");
  };

  const saveName = () => {
    const trimmedName = nameDraft.trim();

    if (trimmedName.length === 0) {
      setError("Please enter a name");
      return;
    }

    updatePet({
      ...currentPet,
      name: trimmedName,
    })
      .then(() => {
        setEditingField(null);
        setError("");
      })
      .catch(() => {
        setError("Failed to update name, please try again");
      });
  };

  const saveBreed = () => {
    updatePet({
      ...currentPet,
      breed: breedDraft.trim() || undefined,
    })
      .then(() => {
        setEditingField(null);
        setError("");
      })
      .catch(() => {
        setError("Failed to update breed, please try again");
      });
  };

  const saveDateOfBirth = () => {
    updatePet({
      ...currentPet,
      dateOfBirth: dateOfBirthDraft.toISOString(),
    })
      .then(() => {
        setEditingField(null);
        setError("");
      })
      .catch(() => {
        setError("Failed to update birthdate, please try again");
      });
  };

  const saveAnimalType = () => {
    updatePet({
      ...currentPet,
      animalType: animalTypeDraft,
    })
      .then(() => {
        setEditingField(null);
        setError("");
      })
      .catch(() => {
        setError("Failed to update animal type, please try again");
      });
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

  return (
    <ScrollView style={styles.container}>
      <View style={styles.hero}>
        <View style={styles.avatarWrapper}>
          <View style={styles.avatar}>
            {currentPet.photoUri ? (
              <Image
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
        <View style={styles.row}>
          <View style={styles.rowHeader}>
            <AppText style={styles.label}>Name</AppText>
            {editingField !== "name" ? (
              <Pressable
                accessibilityRole="button"
                hitSlop={20}
                onPress={() => {
                  setEditingField("name");
                  setError("");
                }}
              >
                <AppText style={styles.editText}>Edit</AppText>
              </Pressable>
            ) : null}
          </View>

          {editingField === "name" ? (
            <View style={styles.editGroup}>
              <Input
                value={nameDraft}
                onChangeText={(text) => {
                  setNameDraft(text);
                  setError("");
                }}
              />
              <View style={styles.actions}>
                <Button
                  title="Cancel"
                  onPress={cancelEditing}
                  style={styles.secondaryButton}
                  textStyle={styles.secondaryButtonText}
                />
                <Button
                  title="Save"
                  onPress={saveName}
                  style={styles.actionButton}
                />
              </View>
            </View>
          ) : (
            <AppText>{currentPet.name}</AppText>
          )}
        </View>

        <View style={styles.row}>
          <View style={styles.rowHeader}>
            <AppText style={styles.label}>Breed</AppText>
            {editingField !== "breed" ? (
              <Pressable
                accessibilityRole="button"
                hitSlop={20}
                onPress={() => {
                  setEditingField("breed");
                  setError("");
                }}
              >
                <AppText style={styles.editText}>Edit</AppText>
              </Pressable>
            ) : null}
          </View>

          {editingField === "breed" ? (
            <View style={styles.editGroup}>
              <Input value={breedDraft} onChangeText={setBreedDraft} />
              <View style={styles.actions}>
                <Button
                  title="Cancel"
                  onPress={cancelEditing}
                  style={styles.secondaryButton}
                  textStyle={styles.secondaryButtonText}
                />
                <Button
                  title="Save"
                  onPress={saveBreed}
                  style={styles.actionButton}
                />
              </View>
            </View>
          ) : (
            <AppText>{currentPet.breed || "Not set"}</AppText>
          )}
        </View>

        <View style={styles.row}>
          <View style={styles.rowHeader}>
            <AppText style={styles.label}>Birthdate</AppText>
            {editingField !== "dateOfBirth" ? (
              <Pressable
                accessibilityRole="button"
                hitSlop={20}
                onPress={() => {
                  setEditingField("dateOfBirth");
                  setError("");
                }}
              >
                <AppText style={styles.editText}>Edit</AppText>
              </Pressable>
            ) : null}
          </View>

          {editingField === "dateOfBirth" ? (
            <View style={styles.editGroup}>
              <DateTimePicker
                value={dateOfBirthDraft}
                mode="date"
                display="spinner"
                onChange={(_event, selectedDate) => {
                  if (selectedDate) {
                    setDateOfBirthDraft(selectedDate);
                  }
                }}
              />
              <View style={styles.actions}>
                <Button
                  title="Cancel"
                  onPress={cancelEditing}
                  style={styles.secondaryButton}
                  textStyle={styles.secondaryButtonText}
                />
                <Button
                  title="Save"
                  onPress={saveDateOfBirth}
                  style={styles.actionButton}
                />
              </View>
            </View>
          ) : (
            <AppText>{formatDate(currentPet.dateOfBirth)}</AppText>
          )}
        </View>

        <View style={styles.row}>
          <View style={styles.rowHeader}>
            <AppText style={styles.label}>Animal type</AppText>
            {editingField !== "animalType" ? (
              <Pressable
                accessibilityRole="button"
                hitSlop={20}
                onPress={() => {
                  setEditingField("animalType");
                  setError("");
                }}
              >
                <AppText style={styles.editText}>Edit</AppText>
              </Pressable>
            ) : null}
          </View>

          {editingField === "animalType" ? (
            <View style={styles.editGroup}>
              <SelectField
                value={animalTypeDraft}
                options={animalOptions}
                onChange={setAnimalTypeDraft}
              />
              <View style={styles.actions}>
                <Button
                  title="Cancel"
                  onPress={cancelEditing}
                  style={styles.secondaryButton}
                  textStyle={styles.secondaryButtonText}
                />
                <Button
                  title="Save"
                  onPress={saveAnimalType}
                  style={styles.actionButton}
                />
              </View>
            </View>
          ) : (
            <AppText>{getAnimalLabel(currentPet.animalType)}</AppText>
          )}
        </View>
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
