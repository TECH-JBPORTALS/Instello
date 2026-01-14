import { View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import * as Linking from "expo-linking";
import { Stack } from "expo-router";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Separator } from "@/components/ui/separator";
import { Text } from "@/components/ui/text";
import {
  GoogleLogoIcon,
  InstagramLogoIcon,
  WhatsappLogoIcon,
} from "phosphor-react-native";

const items = [
  {
    link: `https://wa.me/+919164194556?text=${encodeURI("Hii Instello, I need an help...")}`,
    icon: WhatsappLogoIcon,
  },
  {
    link: "https://www.instagram.com/instello_by_jbportals?utm_source=instello_android_app",
    icon: InstagramLogoIcon,
  },
  {
    link: "https://share.google/OpdbPH2pthAt8razp",
    icon: GoogleLogoIcon,
  },
];

export default function ProfileScreen() {
  return (
    <ScrollView className="flex-1">
      <Stack.Screen options={{ title: "Help", headerShadowVisible: false }} />
      <View className="flex-1 gap-4 p-4">
        <Text variant={"large"} className="">
          You can contact us for further assistance through any one of the below
          contact informations
        </Text>
        <Separator />
        <View className="gap-2">
          <Text variant={"small"}>Office Address</Text>
          <Text variant={"muted"} className="text-justify">
            MNR Arcade.1364 41st Main, Kanakapura Main Rd, Sarakki Gate,{"\n"}
            1st Phase, J. P. Nagar{"\n"}Bengaluru, Karnataka - 560111{"\n"}India
          </Text>
        </View>
        <Separator />
        <View className="gap-2">
          <Text variant={"small"}>Contact</Text>
          <Text variant={"muted"} className="text-justify">
            Phone: +91 91641 94556{"\n"}Email: contact@instello.in{"\n"}
            Working Hours: Mon – Sat, 9:00 AM – 6:00 PM
          </Text>
        </View>
        <Separator />
        <View className="flex-row items-center justify-center gap-1.5">
          {items.map((item, i) => (
            <Button
              key={i}
              onPress={() => Linking.openURL(item.link)}
              size={"icon"}
              variant={"link"}
            >
              <Icon
                weight="duotone"
                className="text-muted-foreground"
                size={28}
                as={item.icon}
              />
            </Button>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
