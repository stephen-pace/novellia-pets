import {
  NavigationContainer,
  NavigationProp,
  useNavigation,
} from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useState } from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import { AppDataProvider, useAppData } from "./Context/AppDataContext";
import { RootScreen, type RootStackParamList } from "./Navigation/routes";
import { AddPet } from "./Screens/AddPet";
import { CreateUsername } from "./Screens/CreateUsername";
import { Welcome } from "./Screens/Welcome";
import { VaccineRecordForm } from "./Screens/Vaccines/VaccineRecordForm";
import { MedicationRecordForm } from "./Screens/Medications/MedicationRecordForm";
import { AllergyRecordForm } from "./Screens/Allergies/AllergyRecordForm";
import { VaccinesTab } from "./Screens/Vaccines/Vaccines";
import { AllergiesTab } from "./Screens/Allergies/Allergies";
import { MedicationsTab } from "./Screens/Medications/Medications";
import { PetSelectorHeaderButton } from "./Navigation/PetSelectorHeaderButton";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { ProfileMenu } from "./Screens/Profile/ProfileMenu";
import { ProfileTab } from "./Screens/Profile/Profile";

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

const HomeTab = {
  Vaccines: "VaccinesTab",
  Allergies: "AllergiesTab",
  Medications: "MedicationsTab",
  Profile: "ProfileTab",
} as const;

type HomeTabName = (typeof HomeTab)[keyof typeof HomeTab];

const HomeTabs = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { currentPet } = useAppData();
  const [selectedTab, setSelectedTab] = useState<HomeTabName>(HomeTab.Vaccines);

  const navigateToAddMedicalRecord = useCallback(() => {
    if (!currentPet) {
      return;
    }

    if (selectedTab === HomeTab.Vaccines) {
      navigation.navigate(RootScreen.VaccineRecordForm, {
        petId: currentPet.id,
      });
      return;
    }

    if (selectedTab === HomeTab.Allergies) {
      navigation.navigate(RootScreen.AllergyRecordForm, {
        petId: currentPet.id,
      });
      return;
    }

    if (selectedTab === HomeTab.Profile) {
      return;
    }

    navigation.navigate(RootScreen.MedicationRecordForm, {
      petId: currentPet.id,
    });
  }, [currentPet, navigation, selectedTab]);

  useEffect(() => {
    navigation.setOptions({
      title: selectedTab === HomeTab.Profile ? "Profile" : "Medical History",
      headerLeft: currentPet
        ? () =>
            selectedTab === HomeTab.Profile ? (
              <ProfileMenu />
            ) : (
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
            )
        : undefined,
    });

    return () => {
      navigation.setOptions({
        title: "Medical History",
        headerLeft: undefined,
      });
    };
  }, [currentPet, navigateToAddMedicalRecord, navigation, selectedTab]);

  // Tab navigator for medical records since it keeps the UX clear and data
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#00A36C",
      }}
    >
      <Tab.Screen
        name={HomeTab.Vaccines}
        component={VaccinesTab}
        listeners={{
          focus: () => setSelectedTab(HomeTab.Vaccines),
        }}
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="syringe" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name={HomeTab.Allergies}
        component={AllergiesTab}
        listeners={{
          focus: () => setSelectedTab(HomeTab.Allergies),
        }}
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="allergies" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name={HomeTab.Medications}
        component={MedicationsTab}
        listeners={{
          focus: () => setSelectedTab(HomeTab.Medications),
        }}
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="briefcase-medical" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name={HomeTab.Profile}
        component={ProfileTab}
        listeners={{
          focus: () => setSelectedTab(HomeTab.Profile),
        }}
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="wrench" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  const { isLoading, username, pets } = useAppData();
  const appFlowKey = !username
    ? "unauthenticated"
    : pets.length === 0
      ? "setup"
      : "authenticated";

  const determineInitialScreen = () => {
    if (username && pets.length > 0) {
      return RootScreen.Home;
    } else if (username) {
      return RootScreen.AddPet;
    }
    return RootScreen.Welcome;
  };

  if (isLoading) {
    return null;
  }

  return (
    <NavigationContainer key={appFlowKey}>
      <Stack.Navigator
        key={appFlowKey}
        initialRouteName={determineInitialScreen()}
        screenOptions={{
          headerBackTitle: "Back",
          headerShown: false,
          contentStyle: styles.container,
        }}
      >
        <Stack.Screen name={RootScreen.Welcome} component={Welcome} />
        <Stack.Screen
          name={RootScreen.CreateUsername}
          component={CreateUsername}
        />
        <Stack.Screen
          name={RootScreen.AddPet}
          component={AddPet}
          options={({ route }) => ({
            headerShown: route.params?.source === "home",
            title: "",
          })}
        />
        <Stack.Screen
          options={{
            title: "Medical History",
            headerShown: true,
            headerRight: () => <PetSelectorHeaderButton />,
          }}
          name={RootScreen.Home}
          component={HomeTabs}
        />
        <Stack.Screen
          options={{
            headerShown: true,
            title: "",
          }}
          name={RootScreen.VaccineRecordForm}
          component={VaccineRecordForm}
        />
        <Stack.Screen
          options={{
            headerShown: true,
            title: "",
          }}
          name={RootScreen.MedicationRecordForm}
          component={MedicationRecordForm}
        />
        <Stack.Screen
          options={{
            headerShown: true,
            title: "",
          }}
          name={RootScreen.AllergyRecordForm}
          component={AllergyRecordForm}
        />
      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
};

const App = () => {
  return (
    <AppDataProvider>
      <AppNavigator />
    </AppDataProvider>
  );
};

export default App;

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
