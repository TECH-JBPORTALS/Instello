import type { StartSSOFlowParams } from "@clerk/clerk-expo";
import type { ClerkAPIError } from "@clerk/types";
import type { ImageSourcePropType } from "react-native";
import * as React from "react";
import { Image, Platform, useColorScheme, View } from "react-native";
import * as AuthSession from "expo-auth-session";
import Constants from "expo-constants";
import { usePathname } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { isClerkAPIResponseError, useSSO } from "@clerk/clerk-expo";
import { usePostHog } from "posthog-react-native";

import { Text } from "./ui/text";

WebBrowser.maybeCompleteAuthSession();

type SocialConnectionStrategy = Extract<
  StartSSOFlowParams["strategy"],
  "oauth_google" | "oauth_github" | "oauth_apple"
>;

const SOCIAL_CONNECTION_STRATEGIES: {
  type: SocialConnectionStrategy;
  source: ImageSourcePropType;
  useTint?: boolean;
  title: string;
}[] = [
  {
    type: "oauth_google",
    source: { uri: "https://img.clerk.com/static/google.png?width=160" },
    useTint: false,
    title: "Continue with Google",
  },
];

export function SocialConnections() {
  useWarmUpBrowser();
  const theme = useColorScheme();
  const { startSSOFlow } = useSSO();
  const [isLoading, setIsLoading] = React.useState(false);
  const scheme =
    (Constants.expoConfig?.scheme as string | undefined) ?? "in.instello.app";
  const path = usePathname().split("/")[1] ?? "sign-in";
  const posthog = usePostHog();
  const [errors, setErrors] = React.useState<ClerkAPIError[]>();

  function onSocialLoginPress(strategy: SocialConnectionStrategy) {
    return async () => {
      setIsLoading(true);
      setErrors(undefined);
      try {
        // Start the authentication process by calling `startSSOFlow()`
        const { createdSessionId, setActive, signUp } = await startSSOFlow({
          strategy,
          // For web, defaults to current path
          // For native, you must pass a scheme, like AuthSession.makeRedirectUri({ scheme, path })
          // For more info, see https://docs.expo.dev/versions/latest/sdk/auth-session/#authsessionmakeredirecturioptions
          redirectUrl: AuthSession.makeRedirectUri({
            scheme,
            path,
          }),
        });

        // If sign in was successful, set the active session
        if (createdSessionId) {
          await setActive?.({
            session: createdSessionId,
          });
        } else {
          // If there is no `createdSessionId`,
          // there are missing requirements, such as MFA
          // See https://clerk.com/docs/guides/development/custom-flows/authentication/oauth-connections#handle-missing-requirements
          posthog.capture("social_login_missing_requirements", {
            strategy,
            signUpMissingFields: JSON.stringify(signUp?.missingFields),
          });
        }
      } catch (err) {
        if (isClerkAPIResponseError(err)) {
          setErrors(err.errors);
        }

        posthog.captureException(err, { scheme, path });
      }
      setIsLoading(false);
    };
  }

  return (
    <View className="gap-2 sm:flex-row sm:gap-3">
      {SOCIAL_CONNECTION_STRATEGIES.map((strategy) => {
        return (
          <Button
            key={strategy.type}
            variant="outline"
            className="sm:flex-1"
            onPress={onSocialLoginPress(strategy.type)}
            disabled={isLoading}
          >
            <Image
              className={cn(
                "size-4",
                strategy.useTint && Platform.select({ web: "dark:invert" }),
              )}
              tintColor={Platform.select({
                native: strategy.useTint
                  ? theme === "dark"
                    ? "white"
                    : "black"
                  : undefined,
              })}
              source={strategy.source}
            />
            <Text>{isLoading ? "Signing in..." : strategy.title}</Text>
          </Button>
        );
      })}
      <Text variant={"muted"} className="text-destructive">
        {errors?.map((error) => error.longMessage).join(",")}
      </Text>
    </View>
  );
}

export const useWarmUpBrowser = () => {
  React.useEffect(() => {
    if (Platform.OS !== "android") return;
    void WebBrowser.warmUpAsync();
    return () => {
      // Cleanup: closes browser when component unmounts
      void WebBrowser.coolDownAsync();
    };
  }, []);
};
