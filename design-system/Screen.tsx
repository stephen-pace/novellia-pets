import type { ReactNode } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "./Button";
import { Title } from "./TextComponent";

type ScreenProps = {
  title: string;
  children: ReactNode;
  buttonTitle?: string;
  onButtonPress?: () => void;
  buttonDisabled?: boolean;
  centered?: boolean;
};

export const Screen = ({
  title,
  children,
  buttonTitle,
  onButtonPress,
  buttonDisabled = false,
  centered = false,
}: ScreenProps) => {
  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.container}>
          <ScrollView
            contentContainerStyle={[
              styles.scrollContent,
              centered && styles.centeredContent,
            ]}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <Title style={styles.title}>{title}</Title>
            <View style={styles.content}>{children}</View>
          </ScrollView>

          {buttonTitle && onButtonPress ? (
            <View style={styles.footer}>
              <Button
                title={buttonTitle}
                onPress={onButtonPress}
                disabled={buttonDisabled}
              />
            </View>
          ) : null}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    width: "100%",
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 24,
  },
  centeredContent: {
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    textAlign: "left",
    marginBottom: 16,
  },
  content: {
    gap: 16,
  },
  footer: {
    paddingTop: 12,
    paddingBottom: 12,
    backgroundColor: "white",
  },
});
