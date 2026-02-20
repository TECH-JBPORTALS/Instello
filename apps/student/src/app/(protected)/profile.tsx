import { useAuth, useUser } from '@clerk/clerk-expo'
import { Link } from 'expo-router'
import * as React from 'react'
import { View } from 'react-native'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Text } from '@/components/ui/text'

import appPackage from '../../../package.json'

export default function ProfileScreen() {
  const { user, isLoaded } = useUser()
  const { signOut } = useAuth()
  const [loading, setLoading] = React.useState(false)

  const fullName = user?.fullName ?? user?.username
  const email =
    user?.primaryEmailAddress?.emailAddress ??
    user?.emailAddresses[0]?.emailAddress
  const imageSource = user?.imageUrl ? { uri: user.imageUrl } : undefined
  const initials = React.useMemo(() => {
    const name = fullName ?? email ?? 'Unknown'
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
  }, [fullName, email])

  async function handleLogout() {
    setLoading(true)
    await signOut()
    setLoading(false)
  }

  if (!isLoaded) {
    return null
  }

  return (
    <View className="flex-1 p-4">
      <View className="flex-1">
        <View className="items-center gap-3 py-6">
          <Avatar
            className="border-border size-32 border"
            alt={`${fullName}'s avatar`}
          >
            <AvatarImage source={imageSource} />
            <AvatarFallback>
              <Text className="text-2xl font-semibold">{initials}</Text>
            </AvatarFallback>
          </Avatar>
          <View className="items-center gap-1.5">
            <Text
              variant={'large'}
              className="text-center text-lg font-semibold"
            >
              {fullName}
            </Text>
            {email ? (
              <Text
                variant="muted"
                className="text-muted-foreground text-center text-sm"
              >
                {email}
              </Text>
            ) : null}
          </View>
        </View>

        <View className="gap-3">
          <Button
            onPress={handleLogout}
            size="lg"
            variant={'secondary'}
            className="w-full"
            disabled={loading}
          >
            <Text>{loading ? 'Signing out...' : 'Sign out'}</Text>
          </Button>
        </View>
      </View>

      <View>
        <Text variant={'muted'} className="text-center">
          Developed by ❤️ JB Portals
        </Text>
        <Text variant="muted" className="py-6 text-center">
          App Version {appPackage.version}{' '}
          <Text variant={'muted'} className="text-2xl">
            {' · '}
          </Text>
          <Link href={'https://instello.in/privacy-policy'}>
            <Text variant={'muted'} className="underline">
              Privacy Policy{' '}
              <Text variant={'muted'} className="text-lg">
                ↗
              </Text>
            </Text>
          </Link>
        </Text>
      </View>
    </View>
  )
}
