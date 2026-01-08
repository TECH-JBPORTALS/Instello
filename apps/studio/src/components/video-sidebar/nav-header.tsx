"use client";

import { useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { env } from "@/env";
import { useTRPC } from "@/trpc/react";
import { UploadButton } from "@/utils/uploadthing";
import { buttonVariants } from "@instello/ui/components/button";
import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
} from "@instello/ui/components/sidebar";
import { cn } from "@instello/ui/lib/utils";
import { ArrowLeftIcon } from "@phosphor-icons/react";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export function NavHeader() {
  const { channelId, videoId } = useParams<{
    channelId: string;
    videoId: string;
  }>();
  const router = useRouter();
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { data: video } = useSuspenseQuery(
    trpc.lms.video.getById.queryOptions({ videoId }),
  );
  const [thumbnailId, setThumbnailId] = useState(video.thumbnailId);

  return (
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuButton
          onClick={() => router.push(`/c/${channelId}`)}
          size={"lg"}
        >
          <ArrowLeftIcon weight="duotone" /> Channel content
        </SidebarMenuButton>
      </SidebarMenu>
      <div className="bg-accent relative aspect-video h-32 w-full overflow-hidden rounded-md">
        <Image
          fill
          src={
            thumbnailId
              ? `https://${env.NEXT_PUBLIC_UPLOADTHING_PROJECT_ID}.ufs.sh/f/${thumbnailId}`
              : `https://image.mux.com/${video.playbackId}/thumbnail.png?width=214&height=121&time=15`
          }
          alt={"Video thumneil"}
          className="object-cover"
        />
        <div className="absolute flex h-full w-full items-center justify-center bg-black/40 transition-all duration-200">
          <UploadButton
            config={{ cn }}
            appearance={{
              button: buttonVariants({
                className: "rounded-full",
                size: "xs",
                variant: "outline",
              }),
              allowedContent: "text-accent text-center",
            }}
            content={{ button: () => "Change Thumbnail" }}
            input={{ videoId }}
            endpoint={"videoThumbneilUploader"}
            onClientUploadComplete={async (res) => {
              setThumbnailId(res.at(0)?.serverData.newThumbnailId ?? "");
              await queryClient.invalidateQueries(
                trpc.lms.channel.getById.queryOptions({
                  channelId,
                }),
              );
              toast.info(`Channel thumbneil image changed.`);
            }}
            onUploadError={(e) => {
              toast.error(e.message);
            }}
          />
        </div>
      </div>
      <span className="px-2 text-sm font-semibold">Your Video</span>
      <p className="text-muted-foreground max-w-full truncate px-2 text-xs">
        {video.title}
      </p>
    </SidebarHeader>
  );
}
