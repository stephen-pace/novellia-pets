import { NavigationProp, useNavigation } from "@react-navigation/native";
import { FlatList, Pressable, StyleSheet, View } from "react-native";

import { useAppData } from "../context/AppDataContext";
import { AppText, Title } from "../design-system/TextComponent";
import { RootScreen, type RootStackParamList } from "../navigation/routes";
import type { VaccineRecord } from "../types";

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString();
};

export const VaccinesTab = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { currentPet } = useAppData();
  const vaccines = (
    currentPet?.medicalRecords?.filter((record) => record.type === "vaccine") ??
    []
  ).sort(
    (first, second) =>
      new Date(second.dateAdministered).getTime() -
      new Date(first.dateAdministered).getTime(),
  );

  if (!currentPet) {
    return (
      <View style={styles.container}>
        <Title>Vaccines</Title>
        <AppText style={styles.helperText}>No pet selected.</AppText>
      </View>
    );
  }

  const renderVaccine = ({ item }: { item: VaccineRecord }) => {
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <AppText style={styles.vaccineName}>{item.name}</AppText>
          <Pressable
            hitSlop={20}
            accessibilityRole="button"
            onPress={() =>
              navigation.navigate(RootScreen.VaccineRecordForm, {
                petId: currentPet.id,
                recordId: item.id,
              })
            }
          >
            <AppText style={styles.editText}>Edit</AppText>
          </Pressable>
        </View>
        <AppText style={styles.vaccineDate}>
          Administered {formatDate(item.dateAdministered)}
        </AppText>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Title>Vaccines</Title>
          <AppText style={styles.petName}>{currentPet.name}</AppText>
        </View>
      </View>

      <FlatList
        data={vaccines}
        keyExtractor={(item) => item.id}
        renderItem={renderVaccine}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <AppText style={styles.helperText}>No vaccines yet.</AppText>
        }
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
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  headerText: {
    gap: 4,
  },
  petName: {
    color: "#667085",
    fontWeight: "600",
  },
  listContent: {
    paddingBottom: 24,
  },
  card: {
    borderBottomColor: "#eaecf0",
    borderBottomWidth: 1,
    gap: 4,
    paddingVertical: 14,
  },
  cardHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  vaccineName: {
    flex: 1,
    fontWeight: "600",
  },
  vaccineDate: {
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
