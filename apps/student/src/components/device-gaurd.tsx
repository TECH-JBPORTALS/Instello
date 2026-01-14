import { View } from "react-native";
import { DevicesIcon } from "phosphor-react-native";

import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from "./ui/dialog";
import { Icon } from "./ui/icon";
import { Text } from "./ui/text";

export function DeviceGaurd() {
  return (
    <Dialog open>
      <DialogContent portalHost="protected-layout" showClose={false}>
        <DialogOverlay />
        <View className="items-center justify-center py-2">
          <Icon
            as={DevicesIcon}
            mirrored
            weight="duotone"
            className="text-primary"
            size={100}
          />
        </View>
        <DialogHeader className="items-center">
          <DialogTitle className="text-center">
            Device Limit Reached
          </DialogTitle>
          <DialogDescription className="text-center">
            There are multiple sessions detected with this email address. Only
            one session at a time is allowed, so please sign out from other
            devices to continue.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button size={"lg"} className="rounded-full">
            <Text className="font-[MontserratBold] font-bold">
              {false ? "Signing out..." : "Sign out from devices"}
            </Text>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
