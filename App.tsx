import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { StyleSheet } from "react-native";
import { AppDataProvider, useAppData } from "./context/AppDataContext";
import { RootScreen, type RootStackParamList } from "./navigation/routes";
import { AddPet } from "./screens/AddPet";
import { CreateUsername } from "./screens/CreateUsername";
import { Welcome } from "./screens/Welcome";
import { Home } from "./screens/Home";
import { PetDetails } from "./screens/PetDetails";

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  const { isLoading, username } = useAppData();

  if (isLoading) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={username ? RootScreen.Home : RootScreen.Welcome}
        screenOptions={{
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
        <Stack.Screen name={RootScreen.Home} component={Home} />
        <Stack.Screen
          options={{
            headerShown: true,
            title: "Pet details",
          }}
          name={RootScreen.PetDetails}
          component={PetDetails}
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
});
