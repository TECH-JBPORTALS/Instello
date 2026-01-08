"use client";

import type { z } from "zod/v4";
import React, { useState } from "react";
import { useTRPC } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { UpdateAuthorSchema } from "@instello/db/lms";
import { Button } from "@instello/ui/components/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@instello/ui/components/form";
import { Input } from "@instello/ui/components/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@instello/ui/components/input-group";
import { ScrollArea } from "@instello/ui/components/scroll-area";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@instello/ui/components/sheet";
import { Spinner } from "@instello/ui/components/spinner";
import { Textarea } from "@instello/ui/components/textarea";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export function AuthorEditSheet({
  children,
  authorId,
}: {
  children: React.ReactNode;
  authorId: string;
}) {
  const [open, setOpen] = useState(false);
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { data: author, isLoading } = useQuery(
    trpc.lms.author.getById.queryOptions({ authorId }, { enabled: open }),
  );

  const form = useForm({
    resolver: zodResolver(UpdateAuthorSchema),
    defaultValues: {
      id: authorId,
      firstName: author?.firstName ?? "",
      lastName: author?.lastName ?? "",
      designation: author?.designation ?? "",
      bio: author?.bio ?? "",
      email: author?.email ?? "",
      experienceYears: author?.experienceYears ?? 0,
      imageUTFileId: author?.imageUTFileId ?? "",
      organization: author?.organization ?? "",
      phone: author?.phone ?? "",
    },
  });

  React.useEffect(() => {
    form.reset({
      id: authorId,
      firstName: author?.firstName ?? "",
      lastName: author?.lastName ?? "",
      designation: author?.designation ?? "",
      bio: author?.bio ?? "",
      email: author?.email ?? "",
      experienceYears: author?.experienceYears ?? 0,
      imageUTFileId: author?.imageUTFileId ?? "",
      organization: author?.organization ?? "",
      phone: author?.phone ?? "",
    });
  }, [author, authorId, form]);

  const { mutateAsync: updateAuthor } = useMutation(
    trpc.lms.author.update.mutationOptions({
      async onSuccess() {
        await queryClient.invalidateQueries(trpc.lms.author.list.queryFilter());
        setOpen(false);
        toast.info("Author updated");
      },
      onError(error) {
        toast.error(error.message);
      },
    }),
  );

  async function onSubmit(values: z.infer<typeof UpdateAuthorSchema>) {
    await updateAuthor(values);
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Author Details</SheetTitle>
        </SheetHeader>
        {isLoading ? (
          <div className="flex h-full flex-1 items-center justify-center">
            <Spinner className="size-6" />
          </div>
        ) : (
          <ScrollArea className="relative h-svh">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4 px-4 pb-20"
              >
                <div className="grid grid-cols-2 gap-2.5">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First name</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Jhon" />
                        </FormControl>
                        <div className="min-h-3.5">
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last name</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Lark" />
                        </FormControl>
                        <div className="min-h-3.5">
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email address</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          placeholder="jhonlark@mi.com"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{"Phone Number"}</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="organization"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{"Organization (optional)"}</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="designation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{"Designation (optional)"}</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="experienceYears"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{"Experience (optional)"}</FormLabel>
                      <FormControl>
                        <InputGroup>
                          <InputGroupInput
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseInt(e.target.value))
                            }
                            type="number"
                          />
                          <InputGroupAddon align={"inline-end"}>
                            Years
                          </InputGroupAddon>
                        </InputGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="instagramLink"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{"Instagram Link (optional)"}</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{"Bio (optional)"}</FormLabel>
                      <FormControl>
                        <Textarea
                          maxLength={256}
                          placeholder="Add about author's interest's, fassion, vision..."
                          className="h-28 resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <SheetFooter className="bg-background/20 sticky bottom-20 border-t  px-0 backdrop-blur-lg">
                  <Button
                    disabled={!form.formState.isDirty}
                    loading={form.formState.isSubmitting}
                  >
                    Save
                  </Button>
                  <SheetClose asChild>
                    <Button variant={"outline"}>Close</Button>
                  </SheetClose>
                </SheetFooter>
              </form>
            </Form>
          </ScrollArea>
        )}
      </SheetContent>
    </Sheet>
  );
}
