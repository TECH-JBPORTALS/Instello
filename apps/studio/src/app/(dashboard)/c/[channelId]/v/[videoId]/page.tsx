import Container from '@/components/container'
import { VideoForm } from '@/components/forms/video-form'
import { prefetch, trpc } from '@/trpc/server'

export default function Page() {
  prefetch(trpc.lms.author.list.queryOptions())
  return (
    <Container>
      <VideoForm />
    </Container>
  )
}
