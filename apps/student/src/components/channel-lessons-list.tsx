import type { BottomSheetBackdropProps } from '@gorhom/bottom-sheet'
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from '@gorhom/bottom-sheet'
import { FlashList } from '@shopify/flash-list'
import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import { Image, ImageBackground } from 'expo-image'
import { LinearGradient } from 'expo-linear-gradient'
import { Link, useLocalSearchParams, useRouter } from 'expo-router'
import {
  ArrowLeftIcon,
  CardsThreeIcon,
  CaretDownIcon,
  ClockIcon,
  CrownIcon,
  LockLaminatedIcon,
} from 'phosphor-react-native'
import React, { useCallback, useRef } from 'react'
import {
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import ExapandableText from '@/components/ui/expandable-text'
import { Icon } from '@/components/ui/icon'
import { Skeleton } from '@/components/ui/skeleton'
import { Text } from '@/components/ui/text'
import { useVideoPrefetch } from '@/hooks/useVideoPrefetch'
import { THEME } from '@/lib/theme'
import { formatDuration, formatNumber } from '@/lib/utils'
import { trpc } from '@/utils/api'
import { Badge } from './ui/badge'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card'

export function ChannelLessonsList() {
  const chapterId = useLocalSearchParams().chapterId as string
  const {
    data,
    isLoading,
    refetch,
    isRefetching,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery(
    trpc.lms.video.listPublicByChapterId.infiniteQueryOptions(
      { chapterId },
      { getNextPageParam: (p) => p.nextCursor },
    ),
  )

  const videos = data?.pages.flatMap((p) => p.items)
  const theme = useColorScheme()

  const { prefetchVideo, prefetchVideos } = useVideoPrefetch()

  // Prefetch all video details when the channel videos are loaded
  React.useEffect(() => {
    if (videos && Array.isArray(videos)) {
      const videoIds = videos
        .filter(
          (item): item is NonNullable<typeof item> & { id: string } =>
            'id' in item && item.canWatch,
        )
        .map((item) => item.id)

      if (videoIds.length > 0) {
        prefetchVideos(videoIds).catch((e) => console.error(e))
      }
    }
  }, [videos, prefetchVideos])

  return (
    <FlashList
      data={videos ?? []}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={<ChannelDetailsSection />}
      refreshControl={
        <RefreshControl onRefresh={() => refetch()} refreshing={isRefetching} />
      }
      ListEmptyComponent={
        isLoading ? (
          <View className="px-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <View key={`skeleton-${index + 1}`} className="mb-2.5">
                <View className="bg-accent/40 flex-row gap-2 rounded-md p-2">
                  <Skeleton
                    className="h-14 w-[120px] rounded-md"
                    style={{ height: 64, width: 120, borderRadius: 8 }}
                  />
                  <View className="flex-1 justify-center gap-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/3" />
                  </View>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View className="px-4 py-6">
            <View className="bg-accent/30 items-center justify-center rounded-md p-6">
              <Text variant="large" className="mb-1 text-base font-medium">
                No lessons yet
              </Text>
              <Text
                variant="muted"
                className="text-muted-foreground text-center text-sm"
              >
                Lessons will appear here when this channel adds content.
              </Text>
            </View>
          </View>
        )
      }
      onEndReached={() => hasNextPage && fetchNextPage()}
      ListFooterComponent={
        <View className="items-center justify-center py-8">
          {isFetchingNextPage && (
            <ActivityIndicator style={{ marginBottom: 16 }} size={'small'} />
          )}
          <Text variant={'muted'} className="text-xs">
            © All rights reserved to this channel
          </Text>
        </View>
      }
      ItemSeparatorComponent={() => <View className="h-2.5 w-full" />}
      renderItem={({ item }) => {
        return (
          <Link
            asChild
            href={`/video?playbackId=${item.playbackId}&videoId=${item.id}&assetId=${item.assetId}`}
            disabled={!item.canWatch}
          >
            <TouchableOpacity
              onPress={() => {
                if (item.canWatch && item.id) {
                  prefetchVideo(item.id)
                }
              }}
              style={{ paddingHorizontal: 16 }}
            >
              <Card className="bg-accent/40 flex-row gap-2 p-2">
                <CardContent className="p-0">
                  <Image
                    source={{
                      uri: item.thumbnailId
                        ? `https://${process.env.EXPO_PUBLIC_UPLOADTHING_PROJECT_ID}.ufs.sh/f/${item.thumbnailId}`
                        : `https://image.mux.com/${item.playbackId}/thumbnail.png?width=214&height=121&time=15`,
                    }}
                    className="bg-accent h-14 w-auto rounded-sm p-0"
                    style={{
                      height: 64,
                      width: 'auto',
                      aspectRatio: 16 / 11,
                      borderRadius: 8,
                      borderWidth: 1,
                      borderColor: THEME[theme ?? 'light'].border,
                    }}
                  />
                </CardContent>
                <CardHeader className="flex-1 justify-center pl-0">
                  <CardTitle
                    numberOfLines={2}
                    className="w-full text-sm font-medium"
                  >
                    {item.title}
                  </CardTitle>
                  <View className="flex-row items-center gap-1">
                    <Icon
                      as={ClockIcon}
                      weight="duotone"
                      className="text-muted-foreground"
                    />

                    <Text
                      variant={'muted'}
                      className="text-muted-foreground text-xs"
                    >
                      {formatDuration(item.duration ?? 0)}
                    </Text>
                    <Text variant={'muted'}>·</Text>
                    <Text
                      variant={'muted'}
                      className="text-muted-foreground text-xs"
                    >
                      {formatNumber(item.overallValues.data.total_views)} Views
                    </Text>
                  </View>
                </CardHeader>
                <CardFooter className="p-0">
                  {item.isPreview && (
                    <Badge variant={'secondary'}>
                      <Text className="text-xs">Preview</Text>
                    </Badge>
                  )}
                  {!item.canWatch && (
                    <View className="p-4">
                      <Icon
                        weight="duotone"
                        as={LockLaminatedIcon}
                        className="text-muted-foreground"
                      />
                    </View>
                  )}
                </CardFooter>
              </Card>
            </TouchableOpacity>
          </Link>
        )
      }}
    />
  )
}

function ChannelDetailsSection() {
  const router = useRouter()
  const { top } = useSafeAreaInsets()
  const { channelId } = useLocalSearchParams<{ channelId: string }>()
  const {
    data: channel,
    isLoading,
    isError,
    error,
  } = useQuery(trpc.lms.channel.getById.queryOptions({ channelId }))
  const theme = useColorScheme()

  if (isError)
    return (
      <View>
        <Text variant={'lead'}>Something went wrong!</Text>
        <Text variant={'muted'}>{error.message}</Text>
      </View>
    )

  const thumbnailUri = `https://${process.env.EXPO_PUBLIC_UPLOADTHING_PROJECT_ID}.ufs.sh/f/${channel?.thumbneilId}`

  return (
    <>
      <ImageBackground
        source={{
          uri: thumbnailUri,
        }}
        style={{
          height: 'auto',
          width: 'auto',
          aspectRatio: 16 / 10,
          backgroundColor: THEME[theme ?? 'light'].muted,
        }}
        contentFit="cover"
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-require-imports
        placeholder={require('assets/images/thumbnail-placeholder.png')}
      >
        <LinearGradient
          colors={[
            'rgba(0,0,0,0.4)',
            'rgba(0,0,0,0.4)',
            'rgba(0,0,0,0.2)',
            'rgba(0,0,0,0)',
            'rgba(0,0,0,0)',
          ]}
          style={{
            width: 'auto',
            height: '100%',
          }}
        >
          <View className="flex-1">
            <View className="justify-between px-4 py-8">
              <View style={{ marginTop: top - 22 }}>
                <Button
                  onPress={() => router.back()}
                  size={'icon'}
                  variant={'outline'}
                  className="size-11 rounded-full bg-transparent"
                >
                  <Icon
                    as={ArrowLeftIcon}
                    className="size-5 text-white"
                    weight="duotone"
                  />
                </Button>
              </View>
            </View>
          </View>
        </LinearGradient>
      </ImageBackground>

      {isLoading ? (
        <View style={{ paddingVertical: 12, paddingHorizontal: 16, gap: 10 }}>
          <Skeleton className={'h-4 w-[90%]'} />
          <View className="flex-row items-center gap-1">
            <Icon
              as={ClockIcon}
              weight="duotone"
              className="text-muted-foreground"
            />

            <Skeleton className={'h-2 w-8'} />
            <Text variant={'muted'}>·</Text>
            <Icon
              as={CardsThreeIcon}
              weight="duotone"
              className="text-muted-foreground"
            />

            <Skeleton className={'h-2 w-8'} />
            <Text variant={'muted'}>·</Text>
            <Icon
              as={CrownIcon}
              weight="duotone"
              className="text-muted-foreground"
            />

            <Skeleton className={'h-2 w-8'} />
            <Text variant={'muted'}>·</Text>
            <Skeleton className={'h-2 w-8'} />
          </View>

          <View className="gap-1.5">
            <Skeleton className={'h-2.5 w-full'} />
            <Skeleton className={'h-2.5 w-3/4'} />
          </View>

          <View className="flex-row items-center gap-2.5 py-1.5">
            <Skeleton className={'size-6 rounded-full'} />
            <Skeleton className={'h-3 w-20'} />
          </View>
        </View>
      ) : (
        <View style={{ paddingVertical: 12, paddingHorizontal: 16, gap: 10 }}>
          <Text variant={'h4'} className="font-medium tracking-wide">
            {channel?.title}
          </Text>
          <View className="flex-row items-center gap-1">
            <Icon
              as={ClockIcon}
              weight="duotone"
              className="text-muted-foreground"
            />

            <Text variant={'muted'} className="text-xs">
              {channel && formatDuration(channel.totalDuration)}
            </Text>
            <Text variant={'muted'}>·</Text>
            <Icon
              as={CardsThreeIcon}
              weight="duotone"
              className="text-muted-foreground"
            />

            <Text variant={'muted'} className="text-xs">
              {channel && formatNumber(channel.numberOfChapters)} Chapters
            </Text>
            <Text variant={'muted'}>·</Text>
            <Icon
              as={CrownIcon}
              weight="duotone"
              className="text-muted-foreground"
            />
            <Text variant={'muted'} className="text-xs">
              {channel && formatNumber(channel.totalSubscribers)} Subscribers
            </Text>
            <Text variant={'muted'}>·</Text>
            <Text variant={'muted'} className="text-xs">
              {channel && format(channel.createdAt, 'MMM yyyy')}
            </Text>
          </View>

          {channel?.description && channel.description.length !== 0 && (
            <ExapandableText variant={'muted'}>
              {channel.description}
            </ExapandableText>
          )}

          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-2.5 py-1.5">
              <Avatar alt={`${channel?.createdByClerkUser.firstName}'s Logo`}>
                <AvatarImage
                  source={{ uri: channel?.createdByClerkUser.imageUrl }}
                />
                <AvatarFallback>
                  <Text>
                    {channel?.createdByClerkUser.firstName?.charAt(0)}
                  </Text>
                </AvatarFallback>
              </Avatar>
              <Text variant={'small'}>
                {channel?.createdByClerkUser.firstName}{' '}
                {channel?.createdByClerkUser.lastName}
              </Text>
            </View>
            <SubscribeButton />
          </View>
          <ChapterButton />
        </View>
      )}
    </>
  )
}

function SubscribeButton() {
  const { channelId } = useLocalSearchParams<{ channelId: string }>()
  const { data, isLoading } = useQuery(
    trpc.lms.subscription.getByChannelId.queryOptions({ channelId }),
  )
  const router = useRouter()

  if (isLoading) return <Skeleton className={'h-[38px] w-28 rounded-full'} />

  const renderSubscriptionButotn = () => {
    switch (data?.status) {
      case 'expired':
        return (
          <Button
            size={'sm'}
            onPress={() =>
              router.push(`/(protected)/(subscribe)?channelId=${channelId}`)
            }
            variant={'outline'}
            className="rounded-full"
          >
            <Text className="text-xs">Renew Subscription</Text>
          </Button>
        )

      case 'subscribed':
        return (
          <Button size={'sm'} variant={'secondary'} className="rounded-full">
            <Text className="text-xs">Subscribed</Text>
          </Button>
        )

      default:
        return (
          <Button
            size={'sm'}
            onPress={() =>
              router.push(`/(protected)/(subscribe)?channelId=${channelId}`)
            }
            className="rounded-full"
          >
            <Icon
              as={CrownIcon}
              weight="duotone"
              className="text-primary-foreground"
            />
            <Text className="text-xs">Subscribe to Watch</Text>
          </Button>
        )
    }
  }

  return <>{renderSubscriptionButotn()}</>
}

function ChapterButton() {
  const { chapterId, channelId } = useLocalSearchParams<{
    chapterId: string
    channelId: string
  }>()
  const { data, isLoading } = useQuery(
    trpc.lms.chapter.list.queryOptions({ channelId, published: true }),
  )
  const router = useRouter()

  const bottomSheetModalRef = useRef<BottomSheetModal>(null)
  const theme = useColorScheme()

  // callbacks
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present()
  }, [])

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop {...props} appearsOnIndex={1} />
    ),
    [],
  )

  if (isLoading) return <Skeleton className={'h-10 w-40'} />

  const selectedChapter = data?.find((chapter) => chapter.id == chapterId)

  if (!selectedChapter) return null

  return (
    <>
      <View className="flex-row">
        <Button
          variant={'secondary'}
          onPress={handlePresentModalPress}
          className="justify-between"
        >
          <Text numberOfLines={1} ellipsizeMode="tail" className="max-w-[90%]">
            {selectedChapter.title}
          </Text>
          <Icon as={CaretDownIcon} className="text-muted-foreground" />
        </Button>
      </View>
      <BottomSheetModal
        ref={bottomSheetModalRef}
        backgroundStyle={{
          backgroundColor: THEME[theme ?? 'light'].popover,
          borderWidth: 1,
          borderColor: THEME[theme ?? 'light'].border,
        }}
        backdropComponent={renderBackdrop}
        enableDynamicSizing={false}
        handleStyle={{
          borderTopEndRadius: 8,
          borderTopStartRadius: 8,
          paddingVertical: 10,
        }}
        handleIndicatorStyle={{
          backgroundColor: THEME[theme ?? 'light'].mutedForeground,
        }}
        snapPoints={['60%', '60%']}
        $modal={false}
        style={{
          minHeight: 320,
        }}
      >
        <BottomSheetView
          style={{
            ...styles.contentContainer,
          }}
        >
          <View className="pb-4">
            <Text variant={'muted'} className="text-xs">
              CHAPTERS
            </Text>
          </View>
          <FlashList
            data={data}
            renderItem={({ item: chapter }) => (
              <Button
                size={'lg'}
                variant={chapter.id == chapterId ? 'secondary' : 'ghost'}
                key={chapter.id}
                className="w-full justify-start"
                onPress={() => {
                  if (chapter.id !== chapterId) {
                    router.setParams({
                      chapterId: chapter.id,
                    })
                    bottomSheetModalRef.current?.close()
                  }
                }}
              >
                <Text>{chapter.title}</Text>
              </Button>
            )}
          />
        </BottomSheetView>
      </BottomSheetModal>
    </>
  )
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
})
