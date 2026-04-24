import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { Pressable, StyleSheet } from "react-native";

type AddMedicalRecordButtonProps = {
  navigateToAddMedicalRecord: () => void;
};

export const AddMedicalRecordButton = ({
  navigateToAddMedicalRecord,
}: AddMedicalRecordButtonProps) => {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Add medical record"
      onPress={navigateToAddMedicalRecord}
      style={({ pressed }) => [
        styles.headerAddButton,
        pressed && styles.headerAddButtonPressed,
      ]}
    >
      <FontAwesome5 name="plus" size={16} color="#00A36C" />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  headerAddButton: {
    height: 36,
    justifyContent: "center",
    width: 36,
  },
  headerAddButtonPressed: {
    opacity: 0.7,
  },
});
