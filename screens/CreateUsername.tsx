import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useState } from "react";
import { StyleSheet } from "react-native";

import { useNavigation } from "@react-navigation/native";
import { useAppData } from "../context/AppDataContext";
import { Input } from "../design-system/Input";
import { Screen } from "../design-system/Screen";
import { AppText } from "../design-system/TextComponent";
import { RootScreen, type RootStackParamList } from "../navigation/routes";

type CreateUsernameProps = NativeStackNavigationProp<RootStackParamList>;

export const CreateUsername = () => {
  const navigation = useNavigation<CreateUsernameProps>();
  const { setUsername } = useAppData();
  const [username, setUsernameInput] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    const trimmedUsername = username.trim();

    if (trimmedUsername.length === 0) {
      setError("Please enter a username");
      return;
    }

    setError("");

    try {
      // This will cause the navigator to remount and show AddPet.tsx
      await setUsername(trimmedUsername);
    } catch {
      setError("Failed to save username, please try again");
    }
  };

  return (
    <Screen
      title="Create a username"
      buttonTitle="Submit"
      onButtonPress={handleSubmit}
    >
      <Input
        placeholder="User123"
        label="Username"
        value={username}
        onChangeText={(text) => {
          setError("");
          setUsernameInput(text);
        }}
        autoCorrect={false}
        autoComplete="off"
        spellCheck={false}
        onSubmitEditing={handleSubmit}
      />
      {error ? <AppText style={styles.error}>{error}</AppText> : null}
    </Screen>
  );
};

const styles = StyleSheet.create({
  error: {
    color: "red",
  },
});
