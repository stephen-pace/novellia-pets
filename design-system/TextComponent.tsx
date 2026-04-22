import {
  Text,
  StyleSheet,
  TextProps,
  StyleProp,
  TextStyle,
} from "react-native";

type BaseTextProps = TextProps & {
  children: React.ReactNode;
  style?: StyleProp<TextStyle>;
};

export const Title = ({ children, style, ...props }: BaseTextProps) => {
  return (
    <Text style={[styles.title, style]} {...props}>
      {children}
    </Text>
  );
};

export const AppText = ({ children, style, ...props }: BaseTextProps) => {
  return (
    <Text style={[styles.appText, style]} {...props}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: "600",
  },
  appText: {
    fontSize: 16,
    lineHeight: 22,
  },
});
