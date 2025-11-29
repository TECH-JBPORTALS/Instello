import "../global.css";

import * as React from "react";
import { useColorScheme } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { NAV_THEME } from "@/lib/theme";
import { queryClient } from "@/utils/api";
import { ClerkProvider, useAuth } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { ThemeProvider } from "@react-navigation/native";
import { PortalHost } from "@rn-primitives/portal";
import { QueryClientProvider } from "@tanstack/react-query";
import { PostHogProvider } from "posthog-react-native";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <PostHogProvider
          apiKey={process.env.EXPO_PUBLIC_POSTHOG_API_KEY}
          options={{
            disabled: process.env.NODE_ENV !== "production",
            host: "https://eu.i.posthog.com",
            enableSessionReplay: true,
            errorTracking: {
              autocapture: {
                console: ["error", "warn"],
                unhandledRejections: true,
                uncaughtExceptions: true,
              },
            },
          }}
        >
          <ClerkProvider
            polling
            touchSession
            publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY}
            tokenCache={tokenCache}
          >
            <QueryClientProvider client={queryClient}>
              <ThemeProvider value={NAV_THEME[colorScheme ?? "light"]}>
                <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
                <Routes />
                <PortalHost />
              </ThemeProvider>
            </QueryClientProvider>
          </ClerkProvider>
        </PostHogProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}

SplashScreen.preventAutoHideAsync();

function Routes() {
  const { isSignedIn, isLoaded, sessionClaims } = useAuth();
  const [fontLoaded, error] = useFonts({
    MontserratRegular: require("assets/fonts/Montserrat-Regular.ttf"),
    MontserratMedium: require("assets/fonts/Montserrat-Medium.ttf"),
    MontserratSemiBold: require("assets/fonts/Montserrat-SemiBold.ttf"),
    MontserratBold: require("assets/fonts/Montserrat-Bold.ttf"),
    MontserratExtraBold: require("assets/fonts/Montserrat-ExtraBold.ttf"),
    MontserratBlack: require("assets/fonts/Montserrat-Black.ttf"),
  });

  React.useEffect(() => {
    if (isLoaded && fontLoaded) {
      SplashScreen.hideAsync();
    }
  }, [isLoaded, fontLoaded]);

  if (!isLoaded || error) {
    console.log(error);
    return null;
  }

  return (
    <Stack
      screenOptions={{
        headerShadowVisible: false,
        headerTitleStyle: { fontFamily: "MontserratSemiBold" },
      }}
    >
      {/* Screens only shown when the user is NOT signed in */}
      <Stack.Protected guard={!isSignedIn}>
        <Stack.Screen
          name="(auth)/index"
          options={DEFAULT_AUTH_SCREEN_OPTIONS}
        />
        <Stack.Screen name="(auth)/sign-in" options={SIGN_IN_SCREEN_OPTIONS} />
        <Stack.Screen name="(auth)/sign-up" options={SIGN_UP_SCREEN_OPTIONS} />
        <Stack.Screen
          name="(auth)/reset-password"
          options={DEFAULT_AUTH_SCREEN_OPTIONS}
        />
        <Stack.Screen
          name="(auth)/forgot-password"
          options={DEFAULT_AUTH_SCREEN_OPTIONS}
        />
      </Stack.Protected>

      {/* Screens only shown when the user IS signed in */}
      <Stack.Protected guard={isSignedIn}>
        {/** Screens only shown when the user is NOT completed the onboarding process */}
        <Stack.Protected guard={!sessionClaims?.metadata?.onBoardingCompleted}>
          <Stack.Screen name="(onboarding)" options={{ headerShown: false }} />
        </Stack.Protected>

        {/** Screens only shown when the user Is completed the onboarding process */}
        <Stack.Protected guard={!!sessionClaims?.metadata?.onBoardingCompleted}>
          <Stack.Screen name="(home)" options={{ headerShown: false }} />
          <Stack.Screen
            name="profile"
            options={{ title: "My Profile", headerTitleAlign: "center" }}
          />
          <Stack.Screen name="channel" options={{ headerShown: false }} />
          <Stack.Screen
            name="(subscribe)/index"
            options={{
              presentation: "modal",
              title: "Subscribe Now",
              headerTitleAlign: "center",
            }}
          />
          <Stack.Screen
            name="(subscribe)/apply-coupon"
            options={{
              headerShown: false,
              animation: "fade",
            }}
          />
          <Stack.Screen
            name="(subscribe)/coupon-success"
            options={{
              title: "",
            }}
          />
          <Stack.Screen
            name="video"
            options={{
              headerShown: false,
              animation: "slide_from_bottom",
              gestureDirection: "vertical",
            }}
          />
        </Stack.Protected>
      </Stack.Protected>

      {/* Screens outside the guards are accessible to everyone (e.g. not found) */}
    </Stack>
  );
}

const SIGN_IN_SCREEN_OPTIONS = {
  presentation: "modal",
  title: "",
  headerTransparent: true,
  gestureEnabled: false,
} as const;

const SIGN_UP_SCREEN_OPTIONS = {
  presentation: "modal",
  title: "",
  headerTransparent: true,
  gestureEnabled: false,
} as const;

const DEFAULT_AUTH_SCREEN_OPTIONS = {
  title: "",
  headerShadowVisible: false,
  headerTransparent: true,
};
