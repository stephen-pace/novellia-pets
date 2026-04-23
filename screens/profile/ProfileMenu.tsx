import { Modal, Pressable, StyleSheet, View } from "react-native";
import { useState } from "react";

import { useAppData } from "../../context/AppDataContext";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { RootScreen, RootStackParamList } from "../../navigation/routes";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { Button } from "../../design-system/Button";

export const ProfileMenu = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { resetAppData } = useAppData();
  const [isOpen, setIsOpen] = useState(false);

  const closeSheet = () => {
    setIsOpen(false);
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
              title="Reset app"
              onPress={() => {
                resetAppData()
                  .then(() => navigation.navigate(RootScreen.Welcome))
                  .catch((err) =>
                    console.error("Unable to reset app data", err),
                  );
              }}
            />
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
    gap: 8,
    minHeight: 220,
    paddingBottom: 32,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
});
