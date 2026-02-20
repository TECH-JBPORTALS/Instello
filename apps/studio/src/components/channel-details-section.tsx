'use client'

import { useSuspenseQuery } from '@tanstack/react-query'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import { env } from '@/env'
import { useTRPC } from '@/trpc/react'

export function ChannelDetailsSection() {
  const trpc = useTRPC()
  const { channelId } = useParams<{ channelId: string }>()
  const { data } = useSuspenseQuery(
    trpc.lms.channel.getById.queryOptions({ channelId }),
  )

  return (
    <div className="space-y-3.5">
      <div className="bg-accent relative aspect-video h-auto w-full overflow-hidden rounded-md object-cover">
        {data.thumbneilId ? (
          <Image
            fill
            alt="Channel Thumbneil"
            src={`https://${env.NEXT_PUBLIC_UPLOADTHING_PROJECT_ID}.ufs.sh/f/${data.thumbneilId}`}
            objectFit="cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="text-muted-foreground font-mono text-3xl font-bold opacity-50">
              No Thumbneil
            </span>
          </div>
        )}
      </div>

      <div>
        <h4 className="scroll-m-20 font-semibold tracking-tight">
          {data.title}
        </h4>
        <p className="text-muted-foreground text-xs">{data.description}</p>
        <p className="text-muted-foreground mt-1 text-xs font-bold">
          {data.totalSubscribers} Subscribers
        </p>
      </div>
    </div>
  )
}
