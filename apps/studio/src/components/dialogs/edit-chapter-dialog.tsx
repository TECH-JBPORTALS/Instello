"use client";

import type React from "react";
import type { z } from "zod/v4";
import { useEffect, useState } from "react";
import { useTRPC } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { UpdateChapterSchema } from "@instello/db/lms";
import { Button } from "@instello/ui/components/button";
import { Dialog, DialogBody, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@instello/ui/components/dialog";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@instello/ui/components/form";
import { Input } from "@instello/ui/components/input";
import { Skeleton } from "@instello/ui/components/skeleton";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";





export function EditChapterDialog({
  children,
  chapterId,
}: {
  children: React.ReactNode;
  chapterId: string;
}) {
  const [open, setOpen] = useState(false);
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { data: chapter } = useQuery(
    trpc.lms.chapter.getById.queryOptions({ chapterId }, { enabled: open }),
  );

  const form = useForm({
    resolver: zodResolver(UpdateChapterSchema),
    defaultValues: {
      title: chapter?.title ?? "",
      id: chapterId,
    },
  });

  const { mutateAsync: createChapter } = useMutation(
    trpc.lms.chapter.update.mutationOptions({
      async onSuccess(_, variable) {
        await queryClient.invalidateQueries(
          trpc.lms.chapter.list.queryFilter(),
        );
        form.reset({ title: variable.title, id: chapterId });
        toast.info("Chapter details updated");
        setOpen(false);
      },
      onError() {
        toast.error("Failed to update the chapter");
      },
    }),
  );

  useEffect(() => {
    if (chapter?.title && open)
      form.reset({ title: chapter.title, id: chapterId });
  }, [chapter?.title, form, open, chapterId]);

  async function onSubmit(values: z.infer<typeof UpdateChapterSchema>) {
    await createChapter(values);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rename Chapter</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3.5">
            {form.formState.isLoading ? (
              <DialogBody className="flex items-center justify-center">
                <Skeleton className="h-11 w-full" />
              </DialogBody>
            ) : (
              <DialogBody>
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          {...field}
                          className="h-11 text-2xl font-semibold"
                          placeholder="eg. Chapter 1"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </DialogBody>
            )}
            <DialogFooter>
              <Button
                disabled={form.formState.isLoading}
                loading={form.formState.isSubmitting}
              >
                Save
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}