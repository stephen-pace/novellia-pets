import * as ImagePicker from "expo-image-picker";
import { Alert, Image, Pressable, StyleSheet, View } from "react-native";
import { AppText } from "./TextComponent";

type PhotoPickerProps = {
  label?: string;
  value: string | null;
  onChange: (uri: string | null) => void;
};

export function PhotoPicker({
  label = "Photo",
  value,
  onChange,
}: PhotoPickerProps) {
  const handlePickImage = async () => {
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

    if (!result.canceled) {
      onChange(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      <AppText style={styles.label}>{label}</AppText>

      <Pressable
        accessibilityLabel={value ? `Change ${label.toLowerCase()}` : `Choose ${label.toLowerCase()}`}
        accessibilityRole="button"
        style={styles.button}
        onPress={handlePickImage}
      >
        <AppText>{value ? "Change photo" : "Choose photo"}</AppText>
      </Pressable>

      {value ? (
        <View style={styles.previewWrapper}>
          <Image
            accessibilityLabel={`${label} preview`}
            accessible
            source={{ uri: value }}
            style={styles.preview}
          />
          <Pressable
            onPress={() => onChange(null)}
            style={styles.removeButton}
            accessibilityRole="button"
            accessibilityLabel="Remove photo"
          >
            <AppText style={styles.removeButtonText}>-</AppText>
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
  },
  button: {
    borderWidth: 1,
    borderColor: "#D0D5DD",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: "#fff",
  },
  previewWrapper: {
    position: "relative",
    alignSelf: "flex-start",
    marginTop: 4,
  },
  preview: {
    width: 120,
    height: 120,
    borderRadius: 12,
  },
  removeButton: {
    position: "absolute",
    top: -8,
    right: -8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#111",
    alignItems: "center",
    justifyContent: "center",
  },
  removeButtonText: {
    color: "#fff",
    fontSize: 18,
    lineHeight: 18,
    fontWeight: "600",
  },
});
