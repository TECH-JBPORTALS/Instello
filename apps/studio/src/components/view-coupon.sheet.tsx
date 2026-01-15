"use client";

import type { RouterOutputs } from "@instello/api";
import type { z } from "zod/v4";
import React, { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useTRPC } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { CouponTargetEmailSchema, UpdateCouponSchema } from "@instello/db/lms";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@instello/ui/components/avatar";
import { Button } from "@instello/ui/components/button";
import { Calendar } from "@instello/ui/components/calendar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@instello/ui/components/form";
import { Input } from "@instello/ui/components/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@instello/ui/components/popover";
import { ScrollArea } from "@instello/ui/components/scroll-area";
import { Separator } from "@instello/ui/components/separator";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@instello/ui/components/sheet";
import { Spinner } from "@instello/ui/components/spinner";
import { Textarea } from "@instello/ui/components/textarea";
import { cn } from "@instello/ui/lib/utils";
import {
  ArrowRightIcon,
  CalendarIcon,
  PlusIcon,
  UsersFourIcon,
} from "@phosphor-icons/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format, formatDistanceToNowStrict, subDays } from "date-fns";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export function ViewCouponSheet({
  children,
  couponId,
}: {
  children: React.ReactNode;
  couponId: string;
}) {
  const [open, setOpen] = React.useState(false);

  const [openPopover, onChangeOpenPopover] = React.useState(false);
  const addEmailform = useForm({
    resolver: zodResolver(CouponTargetEmailSchema),
    mode: "onChange",
    defaultValues: {
      targetEmails: "",
    },
  });

  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { data: coupon, isLoading } = useQuery(
    trpc.lms.coupon.getById.queryOptions(
      { couponId },
      {
        enabled: !!couponId,
      },
    ),
  );
  const couponForm = useForm({
    resolver: zodResolver(UpdateCouponSchema),
    mode: "onChange",
    defaultValues: {
      id: couponId,
      code: coupon?.code ?? "",
      channelId: coupon?.channelId ?? "",
      maxRedemptions: coupon?.maxRedemptions ?? undefined,
      subscriptionDurationDays: coupon?.subscriptionDurationDays ?? 30,
      type: coupon?.type ?? "general",
      valid: coupon?.valid ?? { from: new Date(), to: new Date() },
    },
  });

  const { mutateAsync: updateCoupon, isPending: isUpdating } = useMutation(
    trpc.lms.coupon.update.mutationOptions({
      async onSuccess(data) {
        toast.info(`Coupon changes saved`, {
          position: "bottom-center",
        });
        await queryClient.invalidateQueries(trpc.lms.coupon.pathFilter());
        couponForm.reset({
          ...data,
          maxRedemptions: data?.maxRedemptions ?? undefined,
        });
      },

      onError() {
        toast.error(`Something went wrong`, {
          description: `when saving the code`,
          position: "bottom-center",
        });
      },
    }),
  );

  const { mutateAsync: addEmail } = useMutation(
    trpc.lms.coupon.addTarget.mutationOptions({
      onSuccess(data, variables) {
        toast.success(`${variables.email} is added`);
      },
      async onSettled() {
        await queryClient.invalidateQueries(trpc.lms.coupon.pathFilter());
        router.refresh();
        onChangeOpenPopover(false);
      },
      onError(error, variables) {
        if (error.shape?.code === -32603)
          toast.error(`${variables.email} is already exists`);
        else
          toast.error(`Something went wrong`, {
            description: `When adding the ${variables.email}`,
          });
      },
    }),
  );

  const { mutateAsync: deleteCoupon, isPending } = useMutation(
    trpc.lms.coupon.delete.mutationOptions({
      async onSuccess(data) {
        toast.info(`${data?.code} is deleted`, {
          position: "bottom-center",
        });
        await queryClient.invalidateQueries(trpc.lms.coupon.pathFilter());
        router.refresh();
      },

      onError() {
        toast.error(`Something went wrong`, {
          description: `When deleting the code`,
          position: "bottom-center",
        });
      },
    }),
  );

  const router = useRouter();
  const couponFormValues = useMemo(() => couponForm.watch(), [couponForm]);

  useEffect(() => {
    couponForm.reset({
      id: couponId,
      code: coupon?.code ?? "",
      channelId: coupon?.channelId ?? "",
      maxRedemptions: coupon?.maxRedemptions ?? 10,
      subscriptionDurationDays: coupon?.subscriptionDurationDays ?? 30,
      type: coupon?.type ?? "general",
      valid: coupon?.valid ?? { from: new Date(), to: new Date() },
    });
  }, [couponForm, coupon, couponId]);

  async function onSubmit(values: z.infer<typeof CouponTargetEmailSchema>) {
    if (!values.targetEmails) return;

    await Promise.all(
      values.targetEmails.split(",").map((email) =>
        addEmail({
          email: email.trim().toLowerCase(),
          couponId,
        }),
      ),
    );
    addEmailform.reset();
  }

  async function onSave(values: z.infer<typeof UpdateCouponSchema>) {
    await updateCoupon(values);
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="gap-0 sm:max-w-xl">
        <SheetHeader>
          <SheetTitle className="text-primary">Coupon</SheetTitle>
        </SheetHeader>
        {isLoading || couponForm.formState.isLoading ? (
          <div className="flex flex-1 items-center justify-center">
            <Spinner className="size-6" />
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between px-5 pb-3">
              <div>
                <div className="text-primary text-2xl font-bold">
                  {coupon?.code}
                </div>

                <small className="text-muted-foreground text-sm font-medium leading-none">
                  Subscription of {coupon?.subscriptionDurationDays} days
                </small>
              </div>
              <Button
                variant={"link"}
                className="text-destructive w-fit self-end"
                loading={isPending}
                onClick={() => deleteCoupon({ couponId })}
              >
                Delete Coupon
              </Button>
            </div>

            <ScrollArea className="h-full max-h-full pr-5">
              <div className="space-y-6 overflow-visible px-5 pb-20">
                <Separator />
                <Form key={"Custom form"} {...couponForm}>
                  <form
                    onSubmit={couponForm.handleSubmit(onSave)}
                    key={"custom form"}
                    className="space-y-8"
                  >
                    <FormField
                      control={couponForm.control}
                      name="code"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Coupon Code</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="h-11 text-2xl font-semibold uppercase"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={couponForm.control}
                      name="valid"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Set validation period</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                  )}
                                >
                                  <span className="inline-flex items-center gap-1.5">
                                    {format(field.value.from, "PP")}
                                    <ArrowRightIcon
                                      weight="duotone"
                                      className="text-muted-foreground"
                                    />
                                    {format(field.value.to, "PP")}
                                  </span>
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <Calendar
                                mode="range"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) =>
                                  date < subDays(new Date(), 1)
                                }
                                captionLayout="dropdown"
                              />
                            </PopoverContent>
                          </Popover>
                          <FormDescription>
                            Student can claim this coupon within specific period
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {couponFormValues.type == "general" && (
                      <FormField
                        control={couponForm.control}
                        name="maxRedemptions"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Set max redemptions</FormLabel>
                            <FormControl>
                              <div className="relative inline-flex w-40 rounded-md">
                                <Input
                                  {...field}
                                  type="number"
                                  onChange={(e) =>
                                    field.onChange(parseInt(e.target.value))
                                  }
                                  className="pr-10"
                                />
                                <div className="bg-muted text-muted-foreground absolute right-0 flex h-full items-center justify-center rounded-e-md border px-2.5 text-sm">
                                  Students
                                </div>
                              </div>
                            </FormControl>
                            <FormDescription>
                              Only sepeficied number of students can use this
                              coupon
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    <FormField
                      control={couponForm.control}
                      name="subscriptionDurationDays"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Set subscription days</FormLabel>
                          <FormControl>
                            <div className="relative inline-flex w-40 rounded-md">
                              <Input
                                type="number"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(parseInt(e.target.value))
                                }
                                className="pr-10"
                              />
                              <div className="bg-muted text-muted-foreground absolute right-0 flex h-full items-center justify-center rounded-e-md border px-2.5 text-sm">
                                Days
                              </div>
                            </div>
                          </FormControl>
                          <FormDescription>
                            Student can claim subscription for specific number
                            of days
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <SheetFooter className="absolute bottom-0 w-[90%]">
                      {couponForm.formState.isDirty && (
                        <Button
                          size={"lg"}
                          loading={isUpdating}
                          className="animate-in w-full"
                        >
                          Save
                        </Button>
                      )}
                    </SheetFooter>
                  </form>
                </Form>

                {coupon?.type === "targeted" && (
                  <>
                    <Separator />
                    {/* Customer Header */}
                    <div className="flex items-end justify-between">
                      <div>
                        <div className="font-semibold">Targets</div>
                        <p className="text-muted-foreground text-xs">
                          All only users access to this coupon
                        </p>
                      </div>
                      <Popover
                        open={openPopover}
                        onOpenChange={onChangeOpenPopover}
                      >
                        <PopoverTrigger asChild>
                          <Button variant={"outline"} className="w-20">
                            Add
                            <PlusIcon className="size-4" strokeWidth={1.25} />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent align="end" className="h-fit w-[400px]">
                          <Form {...addEmailform}>
                            <form
                              className="space-y-3"
                              onSubmit={addEmailform.handleSubmit(onSubmit)}
                            >
                              <FormField
                                control={addEmailform.control}
                                name="targetEmails"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <Textarea
                                        rows={4}
                                        className="resize-none"
                                        placeholder="Enter emails seperated with comma ( , )"
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <div className="w-full text-right">
                                <Button
                                  loading={addEmailform.formState.isSubmitting}
                                >
                                  Apply
                                </Button>
                              </div>
                            </form>
                          </Form>
                        </PopoverContent>
                      </Popover>
                    </div>

                    {/* List */}
                    <div className="flex flex-col gap-3 pb-10 pr-5">
                      {coupon.couponTargets.length === 0 ? (
                        <div className="flex flex-col items-center justify-center gap-3 py-20">
                          <UsersFourIcon
                            className="text-muted-foreground/50 size-20"
                            strokeDasharray={2}
                            strokeDashoffset={4}
                            strokeWidth={0.2}
                          />
                          <p className="text-muted-foreground/80 w-1/2 text-center text-xs">
                            Add users to the particular coupon code to restrict
                            the copoun to that users
                          </p>
                        </div>
                      ) : (
                        coupon.couponTargets.map((target) => (
                          <CouponTargetListItem
                            key={target.id}
                            {...{ target }}
                          />
                        ))
                      )}
                    </div>
                  </>
                )}
              </div>
            </ScrollArea>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

export function CouponTargetListItem({
  target,
}: {
  target: RouterOutputs["lms"]["coupon"]["getById"]["couponTargets"][number];
}) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const trpc = useTRPC();
  const { mutateAsync: deleteTarget, isPending } = useMutation(
    trpc.lms.coupon.deleteTarget.mutationOptions({
      async onSuccess(data) {
        toast.info(`${data?.email} is removed`);
        await queryClient.invalidateQueries(
          trpc.lms.coupon.getById.queryFilter(),
        );
        router.refresh();
      },

      onError() {
        toast.error(`Something went wrong`, {
          description: "Try again later!",
        });
      },
    }),
  );

  return (
    <div className="flex items-center justify-between gap-1" key={target.id}>
      <div className="flex items-center gap-2">
        <Avatar className="border-accent-foreground/30 size-9 border-2">
          <AvatarImage src={target.imageUrl} />
          <AvatarFallback>
            {target.email.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <div className="text-sm font-medium">{target.fullName}</div>
          <p className="text-muted-foreground text-sm">{target.email}</p>
          {!target.fullName && (
            <p className="text-muted-foreground/80 text-xs">
              Not a user of Instello yet
            </p>
          )}
        </div>
      </div>
      <div className="text-right">
        <Button
          onClick={() => deleteTarget({ couponTargetId: target.id })}
          loading={isPending}
          loadingText=""
          variant={"link"}
          className="px-0"
        >
          Remove
        </Button>
        <p className="text-muted-foreground text-xs">
          {formatDistanceToNowStrict(target.createdAt, {
            addSuffix: true,
          })}
        </p>
      </div>
    </div>
  );
}
