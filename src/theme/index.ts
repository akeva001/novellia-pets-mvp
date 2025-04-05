import { Theme, createTheme } from "@rneui/themed";

export const customColors = {
  primary: "#7A230F",
  secondary: "#E85A39",
  background: "#FFFFFF",
  surface: "#F8FAFC",
  error: "#DC2626",
  text: "#3D2607",
  secondaryText: "#3D5E71",
  disabled: "#CBD5E1",
  border: "#F3AC89",
  success: "#059669",
  warning: "#F59E0B",
  info: "#3B82F6",
  lightGray: "#F1F5F9",
  mediumGray: "#CBD5E1",
  darkGray: "#3D5E71",
  accent: "#F3AC89",
  highlight: "#FFF5F0",
  buttonPrimary: "#E85A39",
};

const darkColors = {
  ...customColors,
  primary: "#7A230F",
  background: "#1E1810",
  surface: "#2A2118",
  error: "#EF4444",
  text: "#FFFFFF",
  secondaryText: "#F3AC89",
  disabled: "#475569",
  border: "#E85A39",
  lightGray: "#2A2118",
  mediumGray: "#3D2607",
  highlight: "#3D2607",
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const;

export const theme = createTheme({
  lightColors: customColors,
  darkColors: darkColors,
  mode: "light",
  spacing,
});

export const commonStyles = {
  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  card: {
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: customColors.border,
  },
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: customColors.text,
    marginBottom: spacing.md,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 18,
    color: customColors.secondaryText,
    marginBottom: spacing.sm,
    letterSpacing: -0.25,
  },
  input: {
    borderWidth: 1,
    borderColor: customColors.border,
    borderRadius: 8,
    padding: spacing.sm,
    marginBottom: spacing.md,
    backgroundColor: customColors.background,
  },
  button: {
    borderRadius: 8,
    padding: spacing.md,
    marginVertical: spacing.sm,
    backgroundColor: customColors.buttonPrimary,
  },
  header: {
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: customColors.border,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
};

export const typography = {
  h1: {
    fontSize: 32,
    fontWeight: "bold",
    letterSpacing: -1,
    color: customColors.text,
  },
  h2: {
    fontSize: 24,
    fontWeight: "bold",
    letterSpacing: -0.5,
    color: customColors.text,
  },
  h3: {
    fontSize: 20,
    fontWeight: "bold",
    letterSpacing: -0.25,
    color: customColors.text,
  },
  body1: {
    fontSize: 16,
    color: customColors.text,
    lineHeight: 24,
  },
  body2: {
    fontSize: 14,
    color: customColors.secondaryText,
    lineHeight: 20,
  },
  caption: {
    fontSize: 12,
    color: customColors.secondaryText,
    lineHeight: 16,
  },
};
