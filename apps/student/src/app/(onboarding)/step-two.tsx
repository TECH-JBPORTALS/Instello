import React from "react";
import { ScrollView, View } from "react-native";
import { Stack } from "expo-router";
import {
  CourseSelectionForm,
  CourseSelectionFormFooter,
} from "@/components/course-selection-form";

export default function OnboardingStepTwo() {
  return (
    <View className="flex-1">
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerClassName="sm:flex-1 items-center p-4"
        keyboardDismissMode="interactive"
      >
        <Stack.Screen
          options={{
            headerShown: true,
            headerTitle: "",
          }}
        />
        <CourseSelectionForm />
      </ScrollView>
      <View className="border-1 px-4 py-8">
        <CourseSelectionFormFooter />
      </View>
    </View>
  );
}
