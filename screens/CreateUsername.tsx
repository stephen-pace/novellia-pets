import { useState } from "react";
import { StyleSheet } from "react-native";
import { useAppData } from "../Context/AppDataContext";
import { Input } from "../Design-System/Input";
import { Screen } from "../Design-System/Screen";
import { AppText } from "../Design-System/TextComponent";

export const CreateUsername = () => {
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
