import React from 'react'
import { ActivityIndicator, useColorScheme, View } from 'react-native'

export function BranchCollegeSkeleton() {
  const theme = useColorScheme()
  return (
    <View className="relative h-screen flex-1 gap-3.5">
      <ActivityIndicator
        size={'large'}
        color={theme == 'dark' ? 'white' : 'black'}
      />
    </View>
  )
}
