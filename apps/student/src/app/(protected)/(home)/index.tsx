import type { RouterOutputs } from "@/utils/api";
import {
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { Skeleton } from "@/components/ui/skeleton";
import { Text } from "@/components/ui/text";
import { THEME } from "@/lib/theme";
import { cn, formatNumber } from "@/lib/utils";
import { trpc } from "@/utils/api";
import { FlashList } from "@shopify/flash-list";
import { useQuery } from "@tanstack/react-query";
import { formatDate } from "date-fns";
import { BookOpenTextIcon } from "phosphor-react-native";





function ChannelCard({
  channel,
  className,
}: {
  channel: RouterOutputs["lms"]["channel"]["listPublic"][number];
  className?: string;
}) {
  const theme = useColorScheme();
  const views = channel.overallValues.data.total_views;
  const totalSubscribers = channel.totalSubscribers;
  const thumbnailUri = `https://${process.env.EXPO_PUBLIC_UPLOADTHING_PROJECT_ID}.ufs.sh/f/${channel.thumbneilId}`;

  return (
    <Link href={`/channel?channelId=${channel.id}`} asChild>
      <TouchableOpacity>
        <Card
          key={channel.id}
          className={cn(
            "w-40 gap-3 border-0 bg-transparent p-2 shadow-none",
            className,
          )}
        >
          <Image
            source={{
              uri: thumbnailUri,
            }}
            style={{
              width: "auto",
              height: "auto",
              borderRadius: 8,
              aspectRatio: 16 / 10,
              backgroundColor: THEME[theme ?? "light"].muted,
            }}
            contentFit="cover"
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-require-imports
            placeholder={require("assets/images/thumbnail-placeholder.png")}
          />
          <CardContent className="w-full flex-1 gap-0.5 px-0">
            <CardTitle numberOfLines={1}>{channel.title}</CardTitle>
            <Text variant="muted" className="text-muted-foreground text-xs">
              {formatNumber(channel.numberOfChapters)} Chapters{" · "}
              {formatNumber(views)} Views
              {" · "}
              {formatNumber(totalSubscribers)} Subscribers
              {" · "}
              {formatDate(channel.createdAt, "MMM yyyy")}
            </Text>
            <View className=" flex-row flex-wrap items-center gap-2">
              <Avatar alt="Channel Creator" className="size-4">
                <AvatarImage
                  source={{ uri: channel.createdByClerkUser.imageUrl }}
                />
                <AvatarFallback>
                  <Text>{channel.createdByClerkUser.firstName?.charAt(0)}</Text>
                </AvatarFallback>
              </Avatar>
              <Text
                variant={"muted"}
                className="text-muted-foreground mt-3 text-xs"
              >
                {channel.createdByClerkUser.firstName}{" "}
                {channel.createdByClerkUser.lastName}
              </Text>
            </View>
          </CardContent>
        </Card>
      </TouchableOpacity>
    </Link>
  );
}

function ChannelCardSkeleton({ className }: { className?: string }) {
  return (
    <Card className={cn("w-40 gap-3 border-0 bg-transparent p-2", className)}>
      <Skeleton className="aspect-[16/10] h-auto w-auto" />
      <CardContent className="w-full flex-1 gap-1 px-0">
        <Skeleton className="h-4 max-w-full" />
        <Skeleton className="h-3 w-32" />
        <View className="mt-3 flex-row  items-center gap-2">
          <Skeleton className="size-4 rounded-full" />
          <Skeleton className="h-3 w-20" />
        </View>
      </CardContent>
    </Card>
  );
}

export default function Home() {
  const { data, isLoading } = useQuery(
    trpc.lms.channel.listPublic.queryOptions(),
  );

  const channelList = data ?? [];

  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      contentContainerClassName="gap-3.5"
      keyboardDismissMode="interactive"
      showsVerticalScrollIndicator={false}
    >
      <FlashList
        data={channelList}
        ListHeaderComponent={
          <Text
            variant={"large"}
            className="text-muted-foreground px-2 py-1.5 text-xs"
          >
            RECOMMENDED FOR YOU
          </Text>
        }
        ListEmptyComponent={
          isLoading ? (
            <View className="w-full flex-1 flex-row flex-wrap">
              {Array.from({ length: 8 }).map((_, i) => (
                <ChannelCardSkeleton className="w-full" key={i} />
              ))}
            </View>
          ) : (
            <View className="h-52 flex-1 items-center justify-center gap-2.5">
              <Icon
                as={BookOpenTextIcon}
                size={52}
                weight="duotone"
                className="text-muted-foreground"
              />
              <Text variant={"large"}>Comming Soon</Text>
              <Text variant={"muted"} className="text-center">
                We are excited to share some cool content based channels with
                you soon. Please wait for some time in while we are making
                things faster to reach out to you.
              </Text>
            </View>
          )
        }
        keyExtractor={(item) => item.id + "_recommended"}
        contentContainerStyle={{ paddingHorizontal: 8 }}
        renderItem={({ item }) => (
          <ChannelCard className={cn("w-full")} channel={item} />
        )}
      />
    </ScrollView>
  );
}