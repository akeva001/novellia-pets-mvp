import React, { useCallback, useEffect, useState } from "react";
import { Provider } from "react-redux";
import { store } from "./src/store";
import { Navigation } from "./src/navigation";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ThemeProvider } from "@rneui/themed";
import { theme } from "./src/theme";
import * as Font from "expo-font";
import { SplashScreen } from "./src/components/SplashScreen";

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      try {
        await Font.loadAsync({
          // Regular styles
          "PublicSans-Regular": require("./assets/fonts/public-sans/PublicSans-Regular.otf"),
          "PublicSans-Italic": require("./assets/fonts/public-sans/PublicSans-Italic.otf"),

          // Medium styles
          "PublicSans-Medium": require("./assets/fonts/public-sans/PublicSans-Medium.otf"),
          "PublicSans-MediumItalic": require("./assets/fonts/public-sans/PublicSans-MediumItalic.otf"),

          // Bold styles
          "PublicSans-Bold": require("./assets/fonts/public-sans/PublicSans-Bold.otf"),
          "PublicSans-BoldItalic": require("./assets/fonts/public-sans/PublicSans-BoldItalic.otf"),

          // ExtraBold styles
          "PublicSans-ExtraBold": require("./assets/fonts/public-sans/PublicSans-ExtraBold.otf"),
          "PublicSans-ExtraBoldItalic": require("./assets/fonts/public-sans/PublicSans-ExtraBoldItalic.otf"),

          // SemiBold styles
          "PublicSans-SemiBold": require("./assets/fonts/public-sans/PublicSans-SemiBold.otf"),
          "PublicSans-SemiBoldItalic": require("./assets/fonts/public-sans/PublicSans-SemiBoldItalic.otf"),
        });
        setFontsLoaded(true);
      } catch (error) {
        console.error("Error loading fonts:", error);
        // Set fonts as loaded even if there's an error to not block the app
        setFontsLoaded(true);
      }
    }

    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return <SplashScreen />;
  }

  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <SafeAreaProvider>
          <Navigation />
        </SafeAreaProvider>
      </ThemeProvider>
    </Provider>
  );
}
