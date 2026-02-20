'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { CreateChannelSchema } from '@instello/db/lms'
import { Button } from '@instello/ui/components/button'
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@instello/ui/components/dialog'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@instello/ui/components/form'
import { Input } from '@instello/ui/components/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@instello/ui/components/select'
import { Textarea } from '@instello/ui/components/textarea'
import {
  GlobeHemisphereEastIcon,
  LockLaminatedIcon,
} from '@phosphor-icons/react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import type React from 'react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import type { z } from 'zod/v4'
import { useTRPC } from '@/trpc/react'

import CollegeBranchCommand from '../college-branch.command'

export function CreateChannelDialog({
  children,
}: {
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(false)
  const form = useForm({
    resolver: zodResolver(CreateChannelSchema),
    defaultValues: {
      subjectCode: '',
      title: '',
      description: '',
      collegeId: '',
      branchId: '',
      isPublic: false,
    },
  })

  const trpc = useTRPC()
  const queryClient = useQueryClient()

  const { mutateAsync: createChannel } = useMutation(
    trpc.lms.channel.create.mutationOptions({
      async onSuccess() {
        await queryClient.invalidateQueries(trpc.lms.channel.list.queryFilter())
        setOpen(false)
        form.reset()
      },
      onError() {
        toast.error('Failed to create channel')
      },
    }),
  )

  const values = form.watch()

  async function onSubmit(values: z.infer<typeof CreateChannelSchema>) {
    await createChannel(values)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Channel</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogBody className="space-y-3.5">
              <FormField
                control={form.control}
                name="subjectCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject Code</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="text-sm font-medium md:text-base"
                        placeholder="eg. MATH101"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        maxLength={100}
                        className="h-11 resize-none text-2xl font-semibold"
                        placeholder="Title of your channel / course"
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
                    <FormLabel>{'Description (Optional)'}</FormLabel>
                    <FormControl className="h-full">
                      <Textarea
                        {...field}
                        maxLength={256}
                        className="h-28 resize-none"
                        placeholder="Add description..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isPublic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{`Accessibility`}</FormLabel>
                    <FormDescription>
                      You can make the channel public to make it accesible to
                      everyone
                    </FormDescription>
                    <FormControl>
                      <Select
                        {...field}
                        onValueChange={(value) =>
                          field.onChange(value == 'public')
                        }
                        value={field.value ? 'public' : 'private'}
                      >
                        <SelectTrigger className="min-w-full">
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

              {!values.isPublic && (
                <>
                  <FormField
                    control={form.control}
                    name="collegeId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{'College (Optional)'}</FormLabel>
                        <FormControl className="h-full">
                          <CollegeBranchCommand
                            value={field.value}
                            onChange={(value) => {
                              field.onChange(value)
                              form.setValue('branchId', undefined)
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {values.collegeId && (
                    <FormField
                      control={form.control}
                      name="branchId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{'Branch (Optional)'}</FormLabel>
                          <FormControl className="h-full">
                            <CollegeBranchCommand
                              value={field.value}
                              onChange={field.onChange}
                              byCollegeId={values.collegeId}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </>
              )}
            </DialogBody>
            <DialogFooter>
              <Button loading={form.formState.isSubmitting}>Create</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
