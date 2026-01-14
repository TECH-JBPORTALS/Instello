import { View } from "react-native";
import { Stack } from "expo-router";
import { DeviceGaurd } from "@/components/device-gaurd";
import { useAuth } from "@clerk/clerk-expo";
import { PortalHost } from "@rn-primitives/portal";

export default function ProtectedLayout() {
  const { sessionClaims } = useAuth();

  return (
    <View className="flex-1">
      <PortalHost name="protected-layout" />
      <DeviceGaurd />
      <Stack>
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
      </Stack>
    </View>
  );
}
