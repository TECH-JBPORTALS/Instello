import React from "react";
import { ActivityIndicator, useColorScheme, View } from "react-native";

export function BranchCourseSkeleton() {
  const theme = useColorScheme();
  return (
    <View className="bg-foreground relative h-screen flex-1 gap-3.5">
      <ActivityIndicator
        size={"large"}
        color={theme == "dark" ? "white" : "black"}
      />
    </View>
  );
}
