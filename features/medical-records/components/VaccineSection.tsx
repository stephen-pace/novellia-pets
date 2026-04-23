import { Pressable, StyleSheet, View } from "react-native";

import { Button } from "../../../design-system/Button";
import { AppText } from "../../../design-system/TextComponent";
import type { VaccineRecord } from "../../../types";
import { formatDate } from "../utils";

type VaccineSectionProps = {
  records: VaccineRecord[];
  onAddPress: () => void;
  onEdit: (record: VaccineRecord) => void;
  onDelete: (recordId: string) => void;
};

export const VaccineSection = ({
  records,
  onAddPress,
  onEdit,
  onDelete,
}: VaccineSectionProps) => {
  return (
    <View style={styles.section}>
      <AppText style={styles.sectionTitle}>Vaccines</AppText>
      <Button title="Add Vaccine" onPress={onAddPress} />

      {records.length > 0 ? (
        records.map((record) => (
          <View key={record.id} style={styles.card}>
            <View style={styles.recordHeader}>
              <AppText style={styles.recordName}>{record.name}</AppText>
              <View style={styles.recordActions}>
                <Pressable onPress={() => onEdit(record)}>
                  <AppText style={styles.editText}>Edit</AppText>
                </Pressable>
                <Pressable onPress={() => onDelete(record.id)}>
                  <AppText style={styles.deleteText}>Delete</AppText>
                </Pressable>
              </View>
            </View>
            <AppText style={styles.recordDetail}>
              Administered {formatDate(record.dateAdministered)}
            </AppText>
          </View>
        ))
      ) : (
        <AppText style={styles.emptyText}>No vaccines yet</AppText>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    gap: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  card: {
    borderWidth: 1,
    borderColor: "#E4E7EC",
    borderRadius: 12,
    padding: 12,
    gap: 6,
    backgroundColor: "#fff",
  },
  recordHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
  recordActions: {
    flexDirection: "row",
    gap: 12,
  },
  recordName: {
    fontWeight: "600",
    flex: 1,
  },
  recordDetail: {
    color: "#475467",
  },
  editText: {
    color: "#2563EB",
    fontWeight: "600",
  },
  deleteText: {
    color: "#B42318",
    fontWeight: "600",
  },
  emptyText: {
    color: "#667085",
  },
});
