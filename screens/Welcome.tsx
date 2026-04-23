import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Animated, StyleSheet, View } from "react-native";
import { AppText } from "../Design-System/TextComponent";
import { RootScreen, type RootStackParamList } from "../Navigation/routes";
import { Screen } from "../Design-System/Screen";
import { useEffect, useRef } from "react";

type WelcomeNavigation = NativeStackNavigationProp<RootStackParamList>;

export const Welcome = () => {
  const navigation = useNavigation<WelcomeNavigation>();
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(12)).current;
  const scale = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 450,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 450,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        friction: 4,
        tension: 140,
        useNativeDriver: true,
      }),
    ]).start();
  }, [opacity, scale, translateY]);

  return (
    <Screen
      title="Welcome to Novellia Pets"
      buttonTitle="Create account"
      onButtonPress={() => navigation.navigate(RootScreen.CreateUsername)}
      centered
    >
      <View style={styles.content}>
        <Animated.Text
          style={[
            styles.emoji,
            {
              opacity,
              transform: [{ translateY }, { scale }],
            },
          ]}
        >
          🐶🐱
        </Animated.Text>

        <AppText style={styles.subtitle}>
          Keep your pet's health info organized in one place.
        </AppText>
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  content: {
    alignItems: "center",
    marginTop: 32,
    gap: 16,
  },
  emoji: {
    fontSize: 96,
    lineHeight: 145,
    paddingTop: 12,
  },
  subtitle: {
    textAlign: "left",
    marginTop: 32,
  },
});
