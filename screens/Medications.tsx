import { NavigationProp, useNavigation } from "@react-navigation/native";
import { FlatList, Pressable, StyleSheet, View } from "react-native";

import { useAppData } from "../context/AppDataContext";
import { AppText, Title } from "../design-system/TextComponent";
import { RootScreen, type RootStackParamList } from "../navigation/routes";
import type { MedicationRecord } from "../types";

export const MedicationsTab = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { currentPet } = useAppData();
  const medications =
    currentPet?.medicalRecords?.filter(
      (record) => record.type === "medication",
    ) ?? [];

  if (!currentPet) {
    return (
      <View style={styles.container}>
        <Title>Medications</Title>
        <AppText style={styles.helperText}>No pet selected.</AppText>
      </View>
    );
  }

  const renderMedication = ({ item }: { item: MedicationRecord }) => {
    return (
      <View style={styles.row}>
        <View style={styles.rowHeader}>
          <AppText style={styles.recordName}>{item.name}</AppText>
          <Pressable
            accessibilityRole="button"
            hitSlop={20}
            onPress={() =>
              navigation.navigate(RootScreen.MedicationRecordForm, {
                petId: currentPet.id,
                recordId: item.id,
              })
            }
          >
            <AppText style={styles.editText}>Edit</AppText>
          </Pressable>
        </View>
        {item.dosage ? (
          <AppText style={styles.recordDetail}>Dosage: {item.dosage}</AppText>
        ) : null}
        {item.instructions ? (
          <AppText style={styles.recordDetail}>
            Instructions: {item.instructions}
          </AppText>
        ) : null}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Title>Medications</Title>
        <AppText style={styles.petName}>{currentPet.name}</AppText>
      </View>

      <FlatList
        contentContainerStyle={styles.listContent}
        data={medications}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <AppText style={styles.helperText}>No medications yet.</AppText>
        }
        renderItem={renderMedication}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flex: 1,
    padding: 24,
  },
  header: {
    gap: 4,
    marginBottom: 16,
  },
  petName: {
    color: "#667085",
    fontWeight: "600",
  },
  listContent: {
    paddingBottom: 24,
  },
  row: {
    borderBottomColor: "#eaecf0",
    borderBottomWidth: 1,
    gap: 4,
    paddingVertical: 14,
  },
  rowHeader: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
    justifyContent: "space-between",
  },
  recordName: {
    flex: 1,
    fontWeight: "600",
  },
  recordDetail: {
    color: "#667085",
  },
  editText: {
    color: "#475467",
    fontWeight: "600",
  },
  helperText: {
    color: "#667085",
  },
});
