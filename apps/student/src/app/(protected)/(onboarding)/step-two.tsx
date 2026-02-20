import { Stack } from 'expo-router'
import React from 'react'
import { ScrollView, View } from 'react-native'
import {
  CollegeSelectionForm,
  CollegeSelectionFormFooter,
} from '@/components/college-selection-form'

export default function OnboardingStepTwo() {
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
            headerTitle: '',
          }}
        />
        <CollegeSelectionForm />
      </ScrollView>
      <View className="border-border border-t px-4 py-8">
        <CollegeSelectionFormFooter />
      </View>
    </View>
  )
}
