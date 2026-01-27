import type { ConfigContext, ExpoConfig } from "expo/config";

import { version } from "./package.json";
import type { ConfigPlugin } from "expo/config-plugins";
import { withAndroidManifest } from "expo/config-plugins";

export default ({ config }: ConfigContext): ExpoConfig => {
  const { name, scheme, slug } = getConfig();

  return {
    ...config,
    name,
    version,
    slug,
    owner: "tech.jbportals.team",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme,
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    splash: {
      image: "./assets/images/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: true,
      bundleIdentifier: scheme,
    },
    updates: {
      url: "https://u.expo.dev/055c4f68-c31e-41fe-bca2-8f4a15b5af71",
    },
    android: {
      edgeToEdgeEnabled: true,
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      package: scheme,
      runtimeVersion: "appVersion",
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png",
    },
    extra: {
      eas: {
        projectId: "055c4f68-c31e-41fe-bca2-8f4a15b5af71",
      },
    },
    plugins: [
      "expo-font",
      "expo-router",
      "expo-web-browser",
      "expo-secure-store",
      "expo-localization",
      [
        "expo-screen-orientation",
        {
          initialOrientation: "DEFAULT",
        },
      ],
      ["expo-video"],
      [
        "expo-splash-screen",
        {
          backgroundColor: "#FFFFFF",
          image: "./assets/images/splash-icon.png",
          dark: {
            image: "./assets/images/splash-icon-dark.png",
            backgroundColor: "#000000",
          },
          imageWidth: 200,
        },
      ],
      // Remove READ_MEDIA_IMAGES from expo-screen-capture; we only use
      // usePreventScreenCapture (FLAG_SECURE), not the screenshot listener.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- ExpoConfig.plugins type omits ConfigPlugin
      withRemoveScreenCaptureMediaPermission as any,
    ],
    experiments: {
      tsconfigPaths: true,
      typedRoutes: true,
    },
  };
};

export function getConfig() {
  switch (process.env.APP_ENV) {
    case "development":
      return {
        name: "Instello (Dev)",
        scheme: "in.instello.dev",
        slug: "instello-dev",
      };
    case "preview":
      return {
        name: "Instello (Preview)",
        scheme: "in.instello.preview",
        slug: "instello-preview",
      };
    case "production":
      return {
        name: "Instello",
        scheme: "in.instello.app",
        slug: "instello",
      };
    default:
      return {
        name: "Instello",
        scheme: "in.instello.app",
        slug: "instello",
      };
  }
}


/**
 * Removes READ_MEDIA_IMAGES from the merged Android manifest.
 *
 * expo-screen-capture declares READ_MEDIA_IMAGES (and READ_EXTERNAL_STORAGE) for
 * addScreenshotListener / useScreenshotListener. We only use usePreventScreenCapture,
 * which only needs FLAG_SECURE and does not need any storage/media permissions.
 * Removing this avoids the "Photos and videos" / "Media" permission prompt on Android 13.
 */
const withRemoveScreenCaptureMediaPermission: ConfigPlugin = (config) => {
  return withAndroidManifest(config, (cfg) => {
    const manifest = cfg.modResults.manifest;
    const perms = manifest["uses-permission"];
    if (!Array.isArray(perms)) return cfg;

    manifest["uses-permission"] = perms.filter(
      (p) => !["android.permission.READ_MEDIA_IMAGES", "android.permission.READ_MEDIA_VIDEO"].includes(p.$["android:name"]),
    );
    return cfg;
  });
};
