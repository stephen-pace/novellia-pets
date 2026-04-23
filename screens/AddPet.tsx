import { useCallback, useLayoutEffect, useState } from "react";
import { Alert, Pressable, StyleSheet } from "react-native";

import {
  useNavigation,
  useRoute,
  type RouteProp,
} from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useAppData } from "../context/AppDataContext";
import { Input } from "../design-system/Input";
import { Screen } from "../design-system/Screen";
import { AppText } from "../design-system/TextComponent";
import { RootScreen, type RootStackParamList } from "../navigation/routes";
import { SelectField, type SelectOption } from "../design-system/Picker";
import type { AnimalType } from "../types";
import { PhotoPicker } from "../design-system/PhotoPicker";

type AddPetNavigation = NativeStackNavigationProp<RootStackParamList>;
type AddPetRoute = RouteProp<RootStackParamList, typeof RootScreen.AddPet>;

const animalOptions = [
  { label: "Dog", value: "dog" },
  { label: "Cat", value: "cat" },
  { label: "Bird", value: "bird" },
  { label: "Rabbit", value: "rabbit" },
] satisfies SelectOption<AnimalType>[];

export const AddPet = () => {
  const navigation = useNavigation<AddPetNavigation>();
  const route = useRoute<AddPetRoute>();
  const { addPet, setSelectedPetId } = useAppData();
  const isFromHome = route.params?.source === "home";
  const title = isFromHome ? "Add a pet" : "Add your first pet!";

  const [petName, setPetName] = useState("");
  const [animalType, setAnimalType] = useState<AnimalType>("dog");
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [error, setError] = useState("");

  const handleNext = useCallback(() => {
    if (petName.trim().length === 0) {
      setError("Please enter your pet's name");
      return;
    }

    setError("");

    const id = Date.now().toString();
    addPet({
      id,
      name: petName,
      animalType,
      photoUri,
    })
      .then(() => {
        setSelectedPetId(id);
        navigation.navigate(RootScreen.Home);
      })
      .catch(() => Alert.alert("Failed to save pet", "Please try again"));
  }, [addPet, animalType, navigation, petName, photoUri]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: isFromHome
        ? () => (
            <Pressable onPress={handleNext} hitSlop={8}>
              <AppText style={styles.headerSubmit}>Submit</AppText>
            </Pressable>
          )
        : undefined,
    });
  }, [handleNext, isFromHome, navigation]);

  return (
    <Screen
      title={title}
      buttonTitle={isFromHome ? undefined : "Next"}
      onButtonPress={isFromHome ? undefined : handleNext}
    >
      <Input
        label="Pet name"
        value={petName}
        onChangeText={(text) => {
          setError("");
          setPetName(text);
        }}
      />
      {error ? <AppText style={styles.error}>{error}</AppText> : null}

      <SelectField
        label="Animal type"
        value={animalType}
        onChange={setAnimalType}
        options={animalOptions}
      />
      <PhotoPicker
        label="Pet photo (optional)"
        value={photoUri}
        onChange={setPhotoUri}
      />
    </Screen>
  );
};

const styles = StyleSheet.create({
  error: {
    color: "red",
  },
  headerSubmit: {
    color: "#2563EB",
    fontWeight: "600",
  },
});
