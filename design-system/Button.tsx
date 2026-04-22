import {
  Pressable,
  PressableProps,
  StyleSheet,
  Text,
  TextStyle,
  ViewStyle,
} from "react-native";

type ButtonProps = PressableProps & {
  title: string;
  textStyle?: TextStyle;
};

export const Button = ({
  disabled,
  title,
  style,
  textStyle,
  ...props
}: ButtonProps) => {
  return (
    <Pressable
      disabled={disabled}
      style={[
        styles.button,
        disabled && styles.buttonDisabled,
        style as ViewStyle,
      ]}
      {...props}
    >
      <Text style={[styles.buttonText, disabled && styles.buttonTextDisabled, textStyle]}>
        {title}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#000",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: "center",
  },
  buttonDisabled: {
    backgroundColor: "#ccc",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  buttonTextDisabled: {
    color: "#666",
  },
});
