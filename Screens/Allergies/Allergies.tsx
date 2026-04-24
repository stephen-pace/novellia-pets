import { NavigationProp, useNavigation } from "@react-navigation/native";
import { FlatList, Pressable, StyleSheet, View } from "react-native";

import { useAppData } from "../../Context/AppDataContext";
import { AppText, Title } from "../../Design-System/TextComponent";
import { reactionLabels, severityLabels } from "./constants";
import { RootScreen, type RootStackParamList } from "../../Navigation/routes";
import type { AllergyRecord } from "../../types";

const formatReactions = (allergy: AllergyRecord) => {
  if (allergy.reactions.length === 0) {
    return "No reactions listed";
  }

  return allergy.reactions
    .map((reaction) => reactionLabels[reaction])
    .join(", ");
};

export const AllergiesTab = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { currentPet } = useAppData();
  const allergies =
    currentPet?.medicalRecords?.filter((record) => record.type === "allergy") ??
    [];

  if (!currentPet) {
    return (
      <View style={styles.container}>
        <Title>Allergies</Title>
        <AppText style={styles.helperText}>No pet selected.</AppText>
      </View>
    );
  }

  const renderAllergy = ({ item }: { item: AllergyRecord }) => {
    return (
      <View style={styles.row}>
        <View style={styles.rowHeader}>
          <AppText style={styles.recordName}>{item.name}</AppText>
          <Pressable
            accessibilityLabel={`Edit allergy ${item.name}`}
            accessibilityRole="button"
            hitSlop={20}
            onPress={() =>
              navigation.navigate(RootScreen.AllergyRecordForm, {
                petId: currentPet.id,
                recordId: item.id,
              })
            }
          >
            <AppText style={styles.editText}>Edit</AppText>
          </Pressable>
        </View>
        <AppText style={styles.recordDetail}>
          Severity: {severityLabels[item.severity]}
        </AppText>
        <AppText style={styles.recordDetail}>
          Reactions: {formatReactions(item)}
        </AppText>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Title>Allergies</Title>
        <AppText style={styles.petName}>{currentPet.name}</AppText>
      </View>

      <FlatList
        contentContainerStyle={styles.listContent}
        data={allergies}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <AppText style={styles.helperText}>No allergies yet</AppText>
        }
        renderItem={renderAllergy}
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
