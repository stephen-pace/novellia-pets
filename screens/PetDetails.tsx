import DateTimePicker, {
  type DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAppData } from "../context/AppDataContext";
import { Button } from "../design-system/Button";
import { Input } from "../design-system/Input";
import { PhotoPicker } from "../design-system/PhotoPicker";
import { SelectField, type SelectOption } from "../design-system/Picker";
import { AppText } from "../design-system/TextComponent";
import { RootScreen, type RootStackParamList } from "../navigation/routes";
import type { AnimalType, Pet } from "../types";

type PetDetailsProps = NativeStackScreenProps<
  RootStackParamList,
  typeof RootScreen.PetDetails
>;

type EditableField =
  | "name"
  | "animalType"
  | "breed"
  | "dateOfBirth"
  | "photoUri";

const animalOptions = [
  { label: "Dog", value: "dog" },
  { label: "Cat", value: "cat" },
  { label: "Bird", value: "bird" },
  { label: "Rabbit", value: "rabbit" },
] satisfies SelectOption<AnimalType>[];

const getAnimalLabel = (animalType: AnimalType) => {
  return (
    animalOptions.find((option) => option.value === animalType)?.label ??
    "Unknown"
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

export const PetDetails = ({ route, navigation }: PetDetailsProps) => {
  const { petId: routePetId } = route.params;
  const { pets, removePet, updatePet } = useAppData();
  const pet = pets.find((existingPet) => existingPet.id === routePetId);

  const [editingField, setEditingField] = useState<EditableField | null>(null);
  const [draftText, setDraftText] = useState("");
  const [draftAnimalType, setDraftAnimalType] = useState<AnimalType>("dog");
  const [draftPhotoUri, setDraftPhotoUri] = useState<string | null>(null);
  const [draftDate, setDraftDate] = useState(new Date());

  useEffect(() => {
    if (pet) {
      navigation.setOptions({ title: pet.name });
    }
  }, [navigation, pet]);

  if (!pet) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
        <View style={styles.container}>
          <AppText>Pet not found.</AppText>
        </View>
      </SafeAreaView>
    );
  }

  const startEditing = (field: EditableField) => {
    setEditingField(field);

    if (field === "name") {
      setDraftText(pet.name);
    }

    if (field === "breed") {
      setDraftText(pet.breed ?? "");
    }

    if (field === "animalType") {
      setDraftAnimalType(pet.animalType);
    }

    if (field === "photoUri") {
      setDraftPhotoUri(pet.photoUri ?? null);
    }

    if (field === "dateOfBirth") {
      setDraftDate(getDateValue(pet.dateOfBirth));
    }
  };

  const savePet = (updatedPet: Pet) => {
    updatePet(updatedPet)
      .then(() => {
        setEditingField(null);
      })
      .catch(() => {
        Alert.alert("Failed to save changes", "Please try again.");
      });
  };

  const saveTextField = (field: "name" | "breed") => {
    const trimmedValue = draftText.trim();

    if (field === "name" && trimmedValue.length === 0) {
      Alert.alert("Name required", "Please enter a pet name.");
      return;
    }

    savePet({
      ...pet,
      [field]: trimmedValue.length > 0 ? trimmedValue : undefined,
    });
  };

  const saveAnimalType = () => {
    savePet({
      ...pet,
      animalType: draftAnimalType,
    });
  };

  const savePhotoUri = () => {
    savePet({
      ...pet,
      photoUri: draftPhotoUri,
    });
  };

  const saveDateOfBirth = () => {
    savePet({
      ...pet,
      dateOfBirth: draftDate.toISOString(),
    });
  };

  const handleDateChange = (
    _event: DateTimePickerEvent,
    selectedDate?: Date,
  ) => {
    if (!selectedDate) {
      return;
    }

    setDraftDate(selectedDate);
  };

  const renderEditActions = (onSave: () => void) => {
    return (
      <View style={styles.editActions}>
        <Pressable
          onPress={() => setEditingField(null)}
          style={styles.secondaryAction}
        >
          <AppText>Cancel</AppText>
        </Pressable>
        <Pressable onPress={onSave} style={styles.primaryAction}>
          <AppText style={styles.primaryActionText}>Save</AppText>
        </Pressable>
      </View>
    );
  };

  const renderTextRow = (
    field: "name" | "breed",
    label: string,
    value?: string,
  ) => {
    const isEditing = editingField === field;

    return (
      <View style={styles.card}>
        <View style={styles.rowHeader}>
          <AppText style={styles.label}>{label}</AppText>
          {!isEditing ? (
            <Pressable onPress={() => startEditing(field)}>
              <AppText style={styles.editText}>Edit</AppText>
            </Pressable>
          ) : null}
        </View>

        {isEditing ? (
          <>
            <Input value={draftText} onChangeText={setDraftText} />
            {renderEditActions(() => saveTextField(field))}
          </>
        ) : (
          <AppText>{value || "Not set"}</AppText>
        )}
      </View>
    );
  };

  const renderAnimalTypeRow = () => {
    const isEditing = editingField === "animalType";

    return (
      <View style={styles.card}>
        <View style={styles.rowHeader}>
          <AppText style={styles.label}>Animal type</AppText>
          {!isEditing ? (
            <Pressable onPress={() => startEditing("animalType")}>
              <AppText style={styles.editText}>Edit</AppText>
            </Pressable>
          ) : null}
        </View>

        {isEditing ? (
          <>
            <SelectField
              value={draftAnimalType}
              options={animalOptions}
              onChange={setDraftAnimalType}
            />
            {renderEditActions(saveAnimalType)}
          </>
        ) : (
          <AppText>{getAnimalLabel(pet.animalType)}</AppText>
        )}
      </View>
    );
  };

  const renderDateOfBirthRow = () => {
    const isEditing = editingField === "dateOfBirth";

    return (
      <View style={styles.card}>
        <View style={styles.rowHeader}>
          <AppText style={styles.label}>Date of birth</AppText>
          {!isEditing ? (
            <Pressable onPress={() => startEditing("dateOfBirth")}>
              <AppText style={styles.editText}>Edit</AppText>
            </Pressable>
          ) : null}
        </View>

        {isEditing ? (
          <>
            <DateTimePicker
              value={draftDate}
              mode="date"
              display="spinner"
              onChange={handleDateChange}
            />
            {renderEditActions(saveDateOfBirth)}
          </>
        ) : (
          <AppText>{formatDate(pet.dateOfBirth)}</AppText>
        )}
      </View>
    );
  };

  const renderPhotoUriRow = () => {
    const isEditing = editingField === "photoUri";

    return (
      <View style={styles.card}>
        <View style={styles.rowHeader}>
          <AppText style={styles.label}>Photo</AppText>
          {!isEditing ? (
            <Pressable onPress={() => startEditing("photoUri")}>
              <AppText style={styles.editText}>Edit</AppText>
            </Pressable>
          ) : null}
        </View>

        {isEditing ? (
          <>
            <PhotoPicker value={draftPhotoUri} onChange={setDraftPhotoUri} />
            {renderEditActions(savePhotoUri)}
          </>
        ) : (
          <AppText>{pet.photoUri ? "Photo added" : "Not set"}</AppText>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
      <ScrollView contentContainerStyle={styles.container}>
        {pet.photoUri ? (
          <Image source={{ uri: pet.photoUri }} style={styles.heroImage} />
        ) : (
          <View style={styles.heroPlaceholder}>
            <AppText style={styles.heroPlaceholderText}>🐾</AppText>
          </View>
        )}

        {renderTextRow("name", "Name", pet.name)}
        {renderAnimalTypeRow()}
        {renderTextRow("breed", "Breed", pet.breed)}
        {renderDateOfBirthRow()}
        {renderPhotoUriRow()}

        <View style={styles.card}>
          <AppText style={styles.label}>Medical records</AppText>
          <AppText>{pet.medicalRecords?.length ?? 0} records</AppText>
          <AppText style={styles.helperText}>
            Editing medical records is coming later.
          </AppText>
        </View>

        <Button
          title="Delete pet"
          onPress={() => {
            removePet(pet.id)
              .then(() => {
                navigation.goBack();
              })
              .catch(() => {
                Alert.alert("Failed to remove pet", "Please try again.");
              });
          }}
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
  heroImage: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 16,
  },
  heroPlaceholder: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F2F4F7",
  },
  heroPlaceholderText: {
    fontSize: 64,
    lineHeight: 76,
  },
  card: {
    borderWidth: 1,
    borderColor: "#E4E7EC",
    borderRadius: 12,
    padding: 12,
    gap: 10,
    backgroundColor: "#fff",
  },
  rowHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
  label: {
    fontWeight: "600",
  },
  editText: {
    color: "#2563EB",
    fontWeight: "600",
  },
  editActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
  },
  secondaryAction: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  primaryAction: {
    backgroundColor: "#000",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  primaryActionText: {
    color: "#fff",
    fontWeight: "600",
  },
  helperText: {
    color: "#667085",
    fontSize: 14,
  },
});
