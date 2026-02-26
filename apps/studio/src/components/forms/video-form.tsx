'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { UpdateVideoSchema } from '@instello/db/lms'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@instello/ui/components/avatar'
import { Button } from '@instello/ui/components/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@instello/ui/components/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@instello/ui/components/select'
import { Spinner } from '@instello/ui/components/spinner'
import { Switch } from '@instello/ui/components/switch'
import { Textarea } from '@instello/ui/components/textarea'
import { cn } from '@instello/ui/lib/utils'
import MuxPlayer from '@mux/mux-player-react/lazy'
import {
  GlobeHemisphereEastIcon,
  LockLaminatedIcon,
} from '@phosphor-icons/react'
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import type { z } from 'zod/v4'
import { env } from '@/env'
import { useTRPC } from '@/trpc/react'

export function VideoForm() {
  const { videoId } = useParams<{ videoId: string }>()
  const trpc = useTRPC()
  const queryClient = useQueryClient()
  const { data, isError } = useSuspenseQuery(
    trpc.lms.video.getById.queryOptions({ videoId }),
  )
  const { data: authors } = useSuspenseQuery(
    trpc.lms.author.list.queryOptions(),
  )

  const form = useForm({
    resolver: zodResolver(UpdateVideoSchema),
    defaultValues: {
      title: data.title,
      description: data.description ?? '',
      isPublished: data.isPublished ?? false,
      authorId: data.authorId ?? '',
      isPreview: data.isPreview ?? false,
    },
  })

  const { mutateAsync: updateVideo } = useMutation(
    trpc.lms.video.update.mutationOptions({
      async onSuccess(data) {
        await Promise.all([
          queryClient.invalidateQueries(
            trpc.lms.video.getById.queryOptions({ videoId }),
          ),
          queryClient.invalidateQueries(trpc.lms.video.list.queryFilter()),
        ])
        if (data)
          form.reset({
            title: data.title,
            description: data.description ?? '',
            isPublished: data.isPublished ?? false,
            authorId: data.authorId ?? '',
          })
        toast.info('Details updated')
      },
    }),
  )

  const { mutate: setPreviewMode, isPending: isSettingPreviewMode } =
    useMutation(
      trpc.lms.video.setPreviewMode.mutationOptions({
        async onSuccess(_, v) {
          await Promise.all([
            queryClient.invalidateQueries(
              trpc.lms.video.getById.queryOptions({ videoId }),
            ),
            queryClient.invalidateQueries(trpc.lms.video.list.queryFilter()),
          ])

          toast.info(
            v.isPreview
              ? 'Preview mode is enabled'
              : 'Preview mode is disabled',
            {
              description: v.isPreview
                ? 'Now students can access this video without subscription'
                : "Now student can't able to access this video without subscription",
            },
          )
        },
        onError(error) {
          form.resetField('isPreview')
          toast.error(error.message)
        },
      }),
    )

  async function onSubmit(values: z.infer<typeof UpdateVideoSchema>) {
    await updateVideo({
      ...values,
      videoId,
    })
  }

  if (isError)
    return (
      <div className="flex h-full w-full items-center justify-center"></div>
    )

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-4">
        <div className="flex w-full justify-between">
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
            Video details
          </h3>

          <div className="space-x-3">
            <Button
              disabled={!form.formState.isDirty || form.formState.isSubmitting}
              variant={'secondary'}
              className="rounded-full"
              onClick={() => form.reset()}
              type="button"
              size={'lg'}
            >
              Discard changes
            </Button>
            <Button
              type="submit"
              loading={form.formState.isSubmitting}
              disabled={!form.formState.isDirty}
              className="rounded-full"
              size={'lg'}
            >
              Save
            </Button>
          </div>
        </div>

        <div className="grid w-full grid-cols-8 gap-6">
          <div className="col-span-5 space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{'Title (required)'}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Title of the video"
                      {...field}
                      maxLength={100}
                      className="resize-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{'Description'}</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Add description..."
                      maxLength={5000}
                      className="h-80 resize-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="authorId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{`Author`}</FormLabel>
                  <FormDescription>
                    Specify the author to access more info on the side of
                    audiences
                  </FormDescription>
                  <FormControl>
                    <Select
                      {...field}
                      value={field.value ?? undefined}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="min-w-sm">
                        <SelectValue placeholder={'Select...'} />
                      </SelectTrigger>
                      <SelectContent>
                        {authors.map((author, i) => (
                          <SelectItem key={i} value={author.id}>
                            <Avatar className="size-6 border">
                              <AvatarImage
                                className="object-cover"
                                src={`https://${env.NEXT_PUBLIC_UPLOADTHING_PROJECT_ID}.ufs.sh/f/${author.imageUTFileId}`}
                              />
                              <AvatarFallback>
                                {author.firstName.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            {author.firstName} {author.lastName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isPublished"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{`Visibility`}</FormLabel>
                  <FormDescription>
                    If the video is public then users can able to access it from
                    chapter.
                  </FormDescription>
                  <FormControl>
                    <Select
                      {...field}
                      onValueChange={(value) =>
                        field.onChange(value == 'public')
                      }
                      value={field.value ? 'public' : 'private'}
                    >
                      <SelectTrigger className="min-w-sm">
                        <SelectValue placeholder={'Select...'} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="private">
                          <LockLaminatedIcon weight="duotone" /> Private
                        </SelectItem>
                        <SelectItem value="public">
                          <GlobeHemisphereEastIcon weight="duotone" /> Public
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="col-span-3">
            {data.playbackId && (
              <MuxPlayer
                playbackId={data.playbackId}
                accentColor="#ffb203"
                className="w-full"
                metadataVideoTitle={data.title}
                metadataVideoId={data.id}
                loading="page"
                style={{
                  aspectRatio: 16 / 9,
                  borderRadius: 16,
                  overflow: 'hidden',
                  border: '1px solid var(--border)',
                }}
                maxResolution="720p"
                disableTracking
              />
            )}

            <FormField
              control={form.control}
              name="isPreview"
              render={({ field }) => (
                <FormItem
                  className={cn(
                    'flex items-center justify-between w-full py-4 space-x-2',
                    isSettingPreviewMode && 'opacity-60',
                  )}
                >
                  <div className="space-y-1">
                    <FormLabel htmlFor="preview-mode" className="font-semibold">
                      Preview Mode{' '}
                      {isSettingPreviewMode && <Spinner className="size-4" />}
                    </FormLabel>
                    <FormDescription>
                      Note: If you enable this video as preview mode exiting
                      preview video will be disabled from this mode
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      id="preview-mode"
                      onCheckedChange={(isPreview) => {
                        field.onChange(isPreview)
                        setPreviewMode({ videoId, isPreview })
                      }}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>
      </form>
    </Form>
  )
}
