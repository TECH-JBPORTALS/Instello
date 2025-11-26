import React from "react";
import { ToastAndroid, TouchableOpacity, View } from "react-native";
import { Redirect } from "expo-router";
import { useOnboardingStore } from "@/lib/useOnboardingStore";
import { cn } from "@/lib/utils";
import { trpc } from "@/utils/api";
import { useUser } from "@clerk/clerk-expo";
import { useMutation, useQuery } from "@tanstack/react-query";
import { CheckCircleIcon } from "phosphor-react-native";

import { BranchCollegeSkeleton } from "./branch-college-skeleton";
import { Button } from "./ui/button";
import { Icon } from "./ui/icon";
import { Text } from "./ui/text";

export function BranchSelectionForm() {
  const { setField, college, branch } = useOnboardingStore();
  const { data: branches, isLoading } = useQuery(
    trpc.lms.collegeOrBranch.list.queryOptions(
      { byCollegeId: college!.id },
      { enabled: !!college },
    ),
  );

  React.useEffect(() => {
    setField("isBranchesLoading", isLoading);
  }, [isLoading]);

  if (!college?.id) return <Redirect href={"/(onboarding)/step-two"} />;

  if (isLoading) return <BranchCollegeSkeleton />;

  return (
    <View className="relative gap-3.5">
      <Text variant={"h3"} className="text-left">
        In which branch your studying currenlty
      </Text>
      <Text variant={"muted"}>
        Select branch which you prefer it's yours, and will show more content
        related to that
      </Text>

      <View className="flex-1 gap-2">
        {branches?.map((b) => (
          <TouchableOpacity
            onPress={() => setField("branch", b)}
            key={b.id}
            activeOpacity={0.8}
          >
            <View
              className={cn(
                "border-border w-full flex-row justify-between rounded-lg border p-6",
                b.id === branch?.id && "bg-primary/10 border-primary",
              )}
            >
              <Text className="font-semibold">{b.name}</Text>

              <Icon
                as={CheckCircleIcon}
                className={cn(
                  "text-primary size-6 opacity-0",
                  b.id === branch?.id && "opacity-100",
                )}
              />
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

export function BranchSelectionFormFooter() {
  const { college, branch, firstName, lastName, dob, isBranchesLoading } =
    useOnboardingStore();
  const { user } = useUser();

  const { mutateAsync: updatePreference, isPending } = useMutation(
    trpc.lms.preference.update.mutationOptions({
      onSuccess() {
        user?.reload();
      },
      onError(error) {
        ToastAndroid.show(error.message, ToastAndroid.SHORT);
      },
    }),
  );

  async function onSubmit() {
    if (!college || !branch) return;
    await updatePreference({
      firstName,
      lastName,
      dob,
      branchId: branch?.id,
      collegeId: college?.id,
    });
  }

  return (
    <Button
      disabled={!branch || isPending || isBranchesLoading}
      onPress={onSubmit}
      size={"lg"}
    >
      {isPending ? (
        <Text>Finishing up...</Text>
      ) : (
        <>
          <Text>Finish</Text>
          <Icon
            as={CheckCircleIcon}
            className="text-primary-foreground size-5"
          />
        </>
      )}
    </Button>
  );
}
