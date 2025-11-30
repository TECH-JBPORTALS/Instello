import { useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ChannelLessonsList } from "@/components/channel-lessons-list";

export default function ChannelDetailsScreen() {
  const { channelId } = useLocalSearchParams<{ channelId: string }>();

  return (
    <>
      <StatusBar style="light" />

      <ChannelLessonsList channelId={channelId} />
    </>
  );
}
