import { Modal, Pressable, StyleSheet, View } from "react-native";
import { useState } from "react";

import { useAppData } from "../../context/AppDataContext";
import { AppText } from "../../design-system/TextComponent";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { RootScreen, RootStackParamList } from "../../navigation/routes";
import { NavigationProp, useNavigation } from "@react-navigation/native";

export const PetSelectorHeaderButton = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { currentPet, pets, selectedPetId, setSelectedPetId } = useAppData();
  const [isOpen, setIsOpen] = useState(false);

  const closeSheet = () => {
    setIsOpen(false);
  };

  return (
    <>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Select current pet"
        disabled={pets.length === 0}
        onPress={() => setIsOpen(true)}
        style={({ pressed }) => [
          styles.headerButton,
          pressed && styles.headerButtonPressed,
          pets.length === 0 && styles.headerButtonDisabled,
        ]}
      >
        <AppText style={styles.headerButtonText} numberOfLines={1}>
          {currentPet?.name ?? "No pet"}
        </AppText>
        <AppText style={styles.chevron}>⛛</AppText>
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
            accessibilityLabel="Close pet selector"
            onPress={closeSheet}
            style={StyleSheet.absoluteFillObject}
          />
          <View style={styles.sheet}>
            <View style={styles.sheetTitle}>
              <AppText style={styles.sheetTitleText}>Change Pet</AppText>
              <Pressable
                hitSlop={20}
                onPress={() => {
                  navigation.navigate(RootScreen.AddPet, { source: "home" });
                  closeSheet();
                }}
              >
                <FontAwesome5 name="plus-circle" size={16} color="#00A36C" />
              </Pressable>
            </View>

            {pets.length === 0 ? (
              <AppText style={styles.emptyText}>No pets yet</AppText>
            ) : (
              pets.map((pet) => {
                const isSelected = pet.id === selectedPetId;

                return (
                  <Pressable
                    accessibilityRole="button"
                    accessibilityState={{ selected: isSelected }}
                    key={pet.id}
                    onPress={() => {
                      setSelectedPetId(pet.id);
                      closeSheet();
                    }}
                    style={({ pressed }) => [
                      styles.petRow,
                      isSelected && styles.petRowSelected,
                      pressed && styles.petRowPressed,
                    ]}
                  >
                    <AppText style={styles.petName}>{pet.name}</AppText>
                    {isSelected ? (
                      <AppText style={styles.selectedText}>Selected</AppText>
                    ) : null}
                  </Pressable>
                );
              })
            )}
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
  headerButtonDisabled: {
    opacity: 0.5,
  },
  headerButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
  chevron: {
    color: "#667085",
    fontSize: 12,
    lineHeight: 16,
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
    gap: 8,
    paddingBottom: 32,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  sheetTitleText: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  sheetTitle: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 4,
  },
  emptyText: {
    color: "#667085",
  },
  petRow: {
    alignItems: "center",
    borderColor: "#eaecf0",
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 14,
  },
  petRowSelected: {
    backgroundColor: "#f2f4f7",
    borderColor: "#98a2b3",
  },
  petRowPressed: {
    opacity: 0.7,
  },
  petName: {
    fontWeight: "600",
  },
  selectedText: {
    color: "#667085",
    fontSize: 14,
  },
});
