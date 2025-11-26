import React from "react";
import { ScrollView, View } from "react-native";
import { Stack } from "expo-router";
import {
  BranchSelectionForm,
  BranchSelectionFormFooter,
} from "@/components/branch-selection-form";

export default function OnboardingStepThree() {
  return (
    <View className="flex-1">
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerClassName="sm:flex-1 items-center p-4"
        keyboardDismissMode="interactive"
        showsVerticalScrollIndicator={false}
      >
        <Stack.Screen
          options={{
            headerShown: true,
            headerTitle: "",
          }}
        />
        <BranchSelectionForm />
      </ScrollView>
      <View className="border-t-border border-t px-4 py-8">
        <BranchSelectionFormFooter />
      </View>
    </View>
  );
}
