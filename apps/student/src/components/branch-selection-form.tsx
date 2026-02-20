import { useUser } from '@clerk/clerk-expo'
import { FlashList } from '@shopify/flash-list'
import { useInfiniteQuery, useMutation } from '@tanstack/react-query'
import { useDebounce } from '@uidotdev/usehooks'
import { Redirect } from 'expo-router'
import { CheckCircleIcon } from 'phosphor-react-native'
import React, { useState } from 'react'
import {
  ActivityIndicator,
  ToastAndroid,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native'
import { useOnboardingStore } from '@/lib/useOnboardingStore'
import { cn } from '@/lib/utils'
import { trpc } from '@/utils/api'

import { BranchCollegeSkeleton } from './branch-college-skeleton'
import { Button } from './ui/button'
import { Icon } from './ui/icon'
import { Input } from './ui/input'
import { Text } from './ui/text'

export function BranchSelectionForm() {
  const theme = useColorScheme()
  const { setField, college, branch } = useOnboardingStore()
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query, 300)
  const { data, isLoading, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useInfiniteQuery(
      trpc.lms.collegeOrBranch.list.infiniteQueryOptions(
        { byCollegeId: college!.id, query: debouncedQuery },
        {
          enabled: !!college,
          getNextPageParam: (lastPage) => lastPage.nextCursor,
        },
      ),
    )

  const branches = data?.pages.flatMap((d) => d.items)

  React.useEffect(() => {
    setField('isBranchesLoading', isLoading)
  }, [isLoading, setField])

  if (!college?.id)
    return <Redirect href={'/(protected)/(onboarding)/step-two'} />

  return (
    <View className="relative gap-3.5">
      <Text variant={'h3'} className="text-left">
        In which branch your studying currenlty
      </Text>
      <Text variant={'muted'}>
        Select branch which you prefer it's yours, and will show more content
        related to that
      </Text>

      <View>
        <Input
          value={query}
          onChangeText={(q) => setQuery(q)}
          placeholder="Search..."
          className="h-11 text-lg"
          style={{ paddingHorizontal: 32 }}
        />
      </View>

      <View className="flex-1 gap-2">
        {isLoading ? (
          <BranchCollegeSkeleton />
        ) : (
          <FlashList
            data={branches}
            onEndReached={() => hasNextPage && fetchNextPage()}
            ListFooterComponent={
              <View className="items-center py-2">
                {isFetchingNextPage && (
                  <ActivityIndicator
                    size={'small'}
                    color={theme == 'dark' ? 'white' : 'black'}
                  />
                )}
              </View>
            }
            ListEmptyComponent={
              <View className="flex-1 items-center justify-center p-6">
                <Text variant={'large'}>No branches</Text>
                <Text variant={'muted'} className="text-center">
                  No branches found. Try to clear the query from the input or no
                  data associated.
                </Text>
              </View>
            }
            renderItem={({ item: b }) => (
              <TouchableOpacity
                onPress={() => setField('branch', b)}
                key={b.id}
                activeOpacity={0.8}
              >
                <View
                  className={cn(
                    'border-border mt-3 w-full flex-row items-center justify-between rounded-lg border p-6',
                    b.id === branch?.id && 'bg-primary/10 border-primary',
                  )}
                >
                  <View>
                    <Text className="text-muted-foreground text-lg font-bold">
                      {b.code}
                    </Text>
                    <Text className="font-semibold">{b.name}</Text>
                  </View>

                  <Icon
                    as={CheckCircleIcon}
                    className={cn(
                      'text-primary opacity-0',
                      b.id === branch?.id && 'opacity-100',
                    )}
                    size={23}
                  />
                </View>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    </View>
  )
}

export function BranchSelectionFormFooter() {
  const { college, branch, firstName, lastName, dob, isBranchesLoading } =
    useOnboardingStore()
  const { user } = useUser()

  const { mutateAsync: updatePreference, isPending } = useMutation(
    trpc.lms.preference.update.mutationOptions({
      onSuccess() {
        user?.reload()
      },
      onError(error) {
        ToastAndroid.show(error.message, ToastAndroid.SHORT)
      },
    }),
  )

  async function onSubmit() {
    if (!college || !branch) return
    await updatePreference({
      firstName,
      lastName,
      dob,
      branchId: branch?.id,
      collegeId: college?.id,
    })
  }

  return (
    <Button
      disabled={!branch || isPending || isBranchesLoading}
      onPress={onSubmit}
      size={'lg'}
    >
      {isPending ? (
        <Text>Finishing up...</Text>
      ) : (
        <>
          <Text>Finish</Text>
          <Icon
            as={CheckCircleIcon}
            className="text-primary-foreground size-5"
          />
        </>
      )}
    </Button>
  )
}
