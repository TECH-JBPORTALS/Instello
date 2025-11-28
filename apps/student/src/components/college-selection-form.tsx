import React, { useState } from "react";
import {
  ActivityIndicator,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { useOnboardingStore } from "@/lib/useOnboardingStore";
import { cn } from "@/lib/utils";
import { trpc } from "@/utils/api";
import { FlashList } from "@shopify/flash-list";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useDebounce } from "@uidotdev/usehooks";
import { ArrowCircleRightIcon, CheckCircleIcon } from "phosphor-react-native";

import { BranchCollegeSkeleton } from "./branch-college-skeleton";
import { Button } from "./ui/button";
import { Icon } from "./ui/icon";
import { Input } from "./ui/input";
import { Text } from "./ui/text";

export function CollegeSelectionForm() {
  const theme = useColorScheme();
  const { setField, college } = useOnboardingStore();
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);

  const { data, isLoading, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useInfiniteQuery(
      trpc.lms.collegeOrBranch.list.infiniteQueryOptions(
        { query: debouncedQuery },
        {
          getNextPageParam: (lastPage) => lastPage.nextCursor,
        },
      ),
    );

  const branches = data?.pages.flatMap((d) => d.items);

  React.useEffect(() => {
    setField("isCoursesLoading", isLoading);
  }, [isLoading]);

  return (
    <View className="relative gap-3.5">
      <Text variant={"h3"} className="text-left">
        Tell us which is your college
      </Text>
      <Text variant={"muted"}>
        Select college which you prefer it's yours, and will show more content
        related to that
      </Text>

      <View>
        <Input
          value={query}
          onChangeText={(q) => setQuery(q)}
          placeholder="Search..."
          className="h-11 text-lg"
          style={{ paddingHorizontal: 32 }}
        />
      </View>

      {isLoading ? (
        <BranchCollegeSkeleton />
      ) : (
        <View className="flex-1 gap-2">
          <FlashList
            data={branches}
            onEndReached={() => hasNextPage && fetchNextPage()}
            ListEmptyComponent={
              <View className="flex-1 items-center justify-center p-6">
                <Text variant={"large"}>No colleges</Text>
                <Text variant={"muted"} className="text-center">
                  No colleges found. Try to clear the query from the input or no
                  data associated.
                </Text>
              </View>
            }
            ListFooterComponent={
              <View className="items-center py-2">
                {isFetchingNextPage && (
                  <ActivityIndicator
                    size={"small"}
                    color={theme == "dark" ? "white" : "black"}
                  />
                )}
              </View>
            }
            renderItem={({ item: c }) => (
              <TouchableOpacity
                onPress={() => {
                  (setField("college", c), setField("branch", undefined));
                }}
                key={c.id}
                activeOpacity={0.8}
              >
                <View
                  className={cn(
                    "border-border mt-3 w-full flex-row items-center justify-between rounded-lg border p-6",
                    c.id === college?.id && "bg-primary/10 border-primary",
                  )}
                >
                  <View>
                    <Text className="text-muted-foreground text-lg font-bold">
                      {c.code}
                    </Text>
                    <Text className="font-semibold">{c.name}</Text>
                  </View>

                  <Icon
                    as={CheckCircleIcon}
                    className={cn(
                      "text-primary opacity-0",
                      c.id === college?.id && "opacity-100",
                    )}
                    size={24}
                  />
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  );
}

export function CollegeSelectionFormFooter() {
  const router = useRouter();
  const { college, isCoursesLoading } = useOnboardingStore();

  return (
    <Button
      disabled={!college || isCoursesLoading}
      onPress={() => router.push(`/(onboarding)/step-three`)}
      size={"lg"}
    >
      <Text>Continue</Text>
      <Icon
        as={ArrowCircleRightIcon}
        className="text-primary-foreground size-5"
      />
    </Button>
  );
}
