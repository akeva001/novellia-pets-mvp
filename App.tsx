import React, { useCallback, useEffect, useState } from "react";
import { Provider } from "react-redux";
import { store } from "./src/store";
import { Navigation } from "./src/navigation";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ThemeProvider } from "@rneui/themed";
import { theme } from "./src/theme";
import * as Font from "expo-font";
import { SplashScreen } from "./src/components/SplashScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { restoreUser } from "./src/store/userSlice";

const USER_STORAGE_KEY = "@user_data";

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadInitialData() {
      try {
        await Font.loadAsync({
          "PublicSans-Regular": require("./assets/fonts/public-sans/PublicSans-Regular.otf"),
          "PublicSans-Italic": require("./assets/fonts/public-sans/PublicSans-Italic.otf"),
          "PublicSans-Medium": require("./assets/fonts/public-sans/PublicSans-Medium.otf"),
          "PublicSans-MediumItalic": require("./assets/fonts/public-sans/PublicSans-MediumItalic.otf"),
          "PublicSans-Bold": require("./assets/fonts/public-sans/PublicSans-Bold.otf"),
          "PublicSans-BoldItalic": require("./assets/fonts/public-sans/PublicSans-BoldItalic.otf"),
          "PublicSans-ExtraBold": require("./assets/fonts/public-sans/PublicSans-ExtraBold.otf"),
          "PublicSans-ExtraBoldItalic": require("./assets/fonts/public-sans/PublicSans-ExtraBoldItalic.otf"),
          "PublicSans-SemiBold": require("./assets/fonts/public-sans/PublicSans-SemiBold.otf"),
          "PublicSans-SemiBoldItalic": require("./assets/fonts/public-sans/PublicSans-SemiBoldItalic.otf"),
        });

        const storedUser = await AsyncStorage.getItem(USER_STORAGE_KEY);
        if (storedUser) {
          store.dispatch(restoreUser());
        }

        setFontsLoaded(true);
      } catch (error) {
        console.error("Error loading initial data:", error);
        setFontsLoaded(true);
      }
    }

    loadInitialData();
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
