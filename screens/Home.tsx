import { FlatList, Image, Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { Button } from "../design-system/Button";
import { AppText, Title } from "../design-system/TextComponent";
import { useAppData } from "../context/AppDataContext";
import { RootScreen, type RootStackParamList } from "../navigation/routes";
import type { Pet } from "../types";

type HomeNavigation = NativeStackNavigationProp<RootStackParamList>;

export const Home = () => {
  const navigation = useNavigation<HomeNavigation>();
  const { pets, username } = useAppData();

  const renderPetCard = ({ item }: { item: Pet }) => {
    return (
      <Pressable
        style={styles.card}
        onPress={() =>
          navigation.navigate(RootScreen.PetDetails, { petId: item.id })
        }
      >
        {item.photoUri ? (
          <Image source={{ uri: item.photoUri }} style={styles.photo} />
        ) : (
          <View style={styles.photoPlaceholder}>
            <AppText style={styles.photoPlaceholderText}>🐾</AppText>
          </View>
        )}

        <AppText style={styles.petName}>{item.name}</AppText>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <View style={styles.container}>
        <Title style={styles.title}>
          {username ? `Welcome ${username}` : "Welcome"}
        </Title>
        <AppText>Your pets:</AppText>
        <FlatList
          data={pets}
          keyExtractor={(pet) => pet.id}
          renderItem={renderPetCard}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <AppText style={styles.emptyText}>No pets added yet.</AppText>
          }
          ListFooterComponent={
            <Button
              title="Add pet"
              onPress={() =>
                navigation.navigate(RootScreen.AddPet, { source: "home" })
              }
            />
          }
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    width: "100%",
  },
  container: {
    gap: 16,
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  title: {
    fontSize: 28,
    textAlign: "left",
    marginBottom: 16,
  },
  listContent: {
    gap: 12,
    paddingBottom: 24,
  },
  card: {
    borderWidth: 1,
    borderColor: "#E4E7EC",
    borderRadius: 12,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#fff",
  },
  photo: {
    width: 56,
    height: 56,
    borderRadius: 12,
  },
  photoPlaceholder: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: "#F2F4F7",
    alignItems: "center",
    justifyContent: "center",
  },
  photoPlaceholderText: {
    fontSize: 24,
  },
  petName: {
    fontWeight: "600",
  },
  emptyText: {
    color: "#667085",
  },
});
