import { StatusBar } from 'expo-status-bar'
import { ChannelLessonsList } from '@/components/channel-lessons-list'

// We are passing the channelId & initialChapterId to select lessons from the channel to the localSearchParams
export default function ChannelDetailsScreen() {
  return (
    <>
      <StatusBar style="light" />

      <ChannelLessonsList />
    </>
  )
}
