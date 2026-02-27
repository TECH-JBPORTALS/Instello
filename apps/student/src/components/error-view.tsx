import { router } from "expo-router";
import { WarningOctagonIcon } from "phosphor-react-native";
import { View } from "react-native";
import { Button } from "./ui/button";
import { Icon } from "./ui/icon";
import { Text } from "./ui/text";

export function ErrorView({code,refetchFn,isRefetching}:{code?:string,refetchFn:()=>void, isRefetching?:boolean}) {
  return (
    <View className="flex-1 items-center justify-center gap-2.5">
      <Icon
        as={WarningOctagonIcon}
        size={52}
        weight="duotone"
        className="text-muted-foreground"
      />
      <Text variant={'large'}>Something went wrong!</Text>
      <Text variant={'muted'} className="text-center">
        Check your internet connection or may be our code is broken. We are
        looking into it please wait. May you could retry or contact us for
        further assistant.
      </Text>
      {code && (
        <Text variant={'muted'} className="text-xs text-center">
          ERROR CODE: {code}
        </Text>
      )}
      <View className="flex-row gap-1.5 flex-1">
        <Button
          size={'sm'}
          onPress={() => router.push('/help')}
          variant={'outline'}
        >
          <Text>Help</Text>
        </Button>
        <Button disabled={isRefetching} onPress={() => refetchFn()} size={'sm'} variant={'secondary'}>
          <Text>{isRefetching?"Retrying...":"Retry"}</Text>
        </Button>
      </View>
    </View>
  )
}
