import React from "react";
import { TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Image, ImageBackground } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import ExapandableText from "@/components/ui/expandable-text";
import { Icon } from "@/components/ui/icon";
import { Skeleton } from "@/components/ui/skeleton";
import { Text } from "@/components/ui/text";
import { useVideoPrefetch } from "@/hooks/useVideoPrefetch";
import { formatDuration } from "@/lib/utils";
import { trpc } from "@/utils/api";
import { FlashList } from "@shopify/flash-list";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  ArrowLeftIcon,
  CardsThreeIcon,
  ClockIcon,
  CrownIcon,
  LockLaminatedIcon,
} from "phosphor-react-native";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";

export function ChannelLessonsList({ channelId }: { channelId: string }) {
  const { data: videos, isLoading } = useQuery(
    trpc.lms.video.listPublicByChannelId.queryOptions({ channelId }),
  );
  const { prefetchVideo, prefetchVideos } = useVideoPrefetch();

  // Prefetch all video details when the channel videos are loaded
  React.useEffect(() => {
    if (videos && Array.isArray(videos)) {
      const videoIds = videos
        .filter(
          (item): item is NonNullable<typeof item> & { id: string } =>
            typeof item === "object" &&
            "canWatch" in item &&
            "id" in item &&
            item.canWatch,
        )
        .map((item) => item.id);

      if (videoIds.length > 0) {
        prefetchVideos(videoIds).catch((e) => console.error(e));
      }
    }
  }, [videos, prefetchVideos]);

  return (
    <FlashList
      data={videos ?? []}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={<ChannelDetailsSection />}
      ListEmptyComponent={
        isLoading ? (
          <View className="px-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <View key={index} className="mb-2.5">
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
      ListFooterComponent={
        <View className="items-center justify-center py-8">
          <Text variant={"muted"} className="text-xs">
            © All rights reserved to this channel
          </Text>
        </View>
      }
      ItemSeparatorComponent={() => <View className="h-2.5 w-full" />}
      renderItem={({ item }) => {
        if (typeof item === "string") {
          // Rendering header
          return (
            <Text variant={"large"} className="px-4 text-base font-medium">
              {item}
            </Text>
          );
        } else {
          // Render item
          return (
            <Link
              asChild
              href={`/video?playbackId=${item.playbackId}&videoId=${item.id}&assetId=${item.assetId}`}
              disabled={!item.canWatch}
            >
              <TouchableOpacity
                onPress={() => {
                  if (item.canWatch) {
                    prefetchVideo(item.id);
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
                        width: "auto",
                        aspectRatio: 16 / 11,
                        borderRadius: 8,
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
                        variant={"muted"}
                        className="text-muted-foreground text-xs"
                      >
                        {formatDuration(item.duration ?? 0)}
                      </Text>
                    </View>
                  </CardHeader>
                  {!item.canWatch && (
                    <CardFooter>
                      <Icon
                        weight="duotone"
                        as={LockLaminatedIcon}
                        className="text-muted-foreground"
                      />
                    </CardFooter>
                  )}
                </Card>
              </TouchableOpacity>
            </Link>
          );
        }
      }}
      getItemType={(item) => {
        // To achieve better performance, specify the type based on the item
        return typeof item === "string" ? "sectionHeader" : "row";
      }}
    />
  );
}

const blurhash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

function ChannelDetailsSection() {
  const router = useRouter();
  const { top } = useSafeAreaInsets();
  const { channelId } = useLocalSearchParams<{ channelId: string }>();
  const {
    data: channel,
    isLoading,
    isError,
    error,
  } = useQuery(trpc.lms.channel.getById.queryOptions({ channelId }));

  if (isError)
    return (
      <View>
        <Text variant={"lead"}>Something went wrong!</Text>
        <Text variant={"muted"}>{error.message}</Text>
      </View>
    );

  return (
    <>
      <ImageBackground
        source={{
          uri: `https://${process.env.EXPO_PUBLIC_UPLOADTHING_PROJECT_ID}.ufs.sh/f/${channel?.thumbneilId}`,
        }}
        style={{ height: "auto", width: "auto", aspectRatio: 16 / 10 }}
        contentFit="cover"
        placeholder={{ blurhash }}
      >
        <LinearGradient
          colors={[
            "rgba(0,0,0,0.4)",
            "rgba(0,0,0,0.4)",
            "rgba(0,0,0,0.2)",
            "rgba(0,0,0,0)",
            "rgba(0,0,0,0)",
          ]}
          style={{
            width: "auto",
            height: "100%",
          }}
        >
          <View className="flex-1">
            <View className="justify-between px-4 py-8">
              <View style={{ marginTop: top - 22 }}>
                <Button
                  onPress={() => router.back()}
                  size={"icon"}
                  variant={"outline"}
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
          <Skeleton className={"h-4 w-[90%]"} />
          <View className="flex-row items-center gap-1">
            <Icon
              as={ClockIcon}
              weight="duotone"
              className="text-muted-foreground"
            />

            <Skeleton className={"h-2 w-8"} />
            <Text variant={"muted"}>·</Text>
            <Icon
              as={CardsThreeIcon}
              weight="duotone"
              className="text-muted-foreground"
            />

            <Skeleton className={"h-2 w-8"} />
            <Text variant={"muted"}>·</Text>
            <Skeleton className={"h-2 w-8"} />
          </View>

          <View className="gap-1.5">
            <Skeleton className={"h-2.5 w-full"} />
            <Skeleton className={"h-2.5 w-3/4"} />
          </View>

          <View className="flex-row items-center gap-2.5 py-1.5">
            <Skeleton className={"size-6 rounded-full"} />
            <Skeleton className={"h-3 w-20"} />
          </View>
        </View>
      ) : (
        <View style={{ paddingVertical: 12, paddingHorizontal: 16, gap: 10 }}>
          <Text variant={"h4"} className="font-medium tracking-wide">
            {channel?.title}
          </Text>
          <View className="flex-row items-center gap-1">
            <Icon
              as={ClockIcon}
              weight="duotone"
              className="text-muted-foreground"
            />

            <Text variant={"muted"} className="text-xs">
              {channel && formatDuration(channel.totalDuration)}
            </Text>
            <Text variant={"muted"}>·</Text>
            <Icon
              as={CardsThreeIcon}
              weight="duotone"
              className="text-muted-foreground"
            />

            <Text variant={"muted"} className="text-xs">
              {channel?.numberOfChapters} Chapters
            </Text>
            <Text variant={"muted"}>·</Text>
            <Text variant={"muted"} className="text-xs">
              {channel && format(channel.createdAt, "MMM yyyy")}
            </Text>
          </View>

          {channel?.description && channel.description.length !== 0 && (
            <ExapandableText variant={"muted"}>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum
              laudantium possimus tenetur nesciunt ut facere optio atque
              recusandae dolorum hic, vero corporis, accusantium deleniti.
              Praesentium, molestias? Sequi nesciunt temporibus veniam.
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
              <Text variant={"small"}>
                {channel?.createdByClerkUser.firstName}{" "}
                {channel?.createdByClerkUser.lastName}
              </Text>
            </View>
            <SubscribeButton />
          </View>
        </View>
      )}
    </>
  );
}

function SubscribeButton() {
  const { channelId } = useLocalSearchParams<{ channelId: string }>();
  const { data, isLoading } = useQuery(
    trpc.lms.subscription.getByChannelId.queryOptions({ channelId }),
  );
  const router = useRouter();

  if (isLoading) return <Skeleton className={"h-[38px] w-28 rounded-full"} />;

  const renderSubscriptionButotn = () => {
    switch (data?.status) {
      case "expired":
        return (
          <Button
            size={"sm"}
            onPress={() => router.push(`/(subscribe)?channelId=${channelId}`)}
            variant={"outline"}
            className="rounded-full"
          >
            <Text className="text-xs">Renew Subscription</Text>
          </Button>
        );

      case "subscribed":
        return (
          <Button size={"sm"} variant={"secondary"} className="rounded-full">
            <Text className="text-xs">Subscribed</Text>
          </Button>
        );

      default:
        return (
          <Button
            size={"sm"}
            onPress={() => router.push(`/(subscribe)?channelId=${channelId}`)}
            className="rounded-full"
          >
            <Icon
              as={CrownIcon}
              weight="duotone"
              className="text-primary-foreground"
            />
            <Text className="text-xs">Subscribe to Watch</Text>
          </Button>
        );
    }
  };

  return <>{renderSubscriptionButotn()}</>;
}
