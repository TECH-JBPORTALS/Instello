import { and, asc, count, countDistinct, sql, eq, sum } from "@instello/db";
import {
  channel,
  chapter,
  CreateChannelSchema,
  subscription,
  UpdateChannelSchema,
  video,
} from "@instello/db/lms";
import { TRPCError } from "@trpc/server";
import { z } from "zod/v4";

import { getClerkUserById, withTx } from "../router.helpers";
import { protectedProcedure } from "../trpc";
import { deleteChapter } from "./chapter";
import { generateBlurHash } from "../utils";

export const channelRouter = {
  create: protectedProcedure
    .input(CreateChannelSchema)
    .mutation(async ({ ctx, input }) => {
      return await ctx.db
        .insert(channel)
        .values({
          ...input,
          createdByClerkUserId: ctx.auth.userId,
          collegeId: !input.isPublic ? input.collegeId : null,
          branchId: !input.isPublic ? input.branchId : null,
        })
        .returning();
    }),

  list: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.query.channel.findMany({
      where: eq(channel.createdByClerkUserId, ctx.auth.userId),
      orderBy: (col, { desc }) => desc(col.createdAt),
    });
  }),

  listPublic: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.transaction(async (tx) => {
      // 1. List all published channels
      const allPublicChannels = await tx.query.channel.findMany({
        where: eq(channel.isPublic, true),
        orderBy: ({ createdAt }, { desc }) => [desc(createdAt)],
        with: {
          chapters: {
            columns: {},
            with: { videos: { columns: { id: true } } },
          },
        },
      });

      // 2. Append the user details & chapters count to the each channel
      return await Promise.all(
        allPublicChannels.map(async (channel) => {
          const chapterAggr = await tx
            .select({ total: countDistinct(chapter.id) })
            .from(chapter)
            .where(
              and(
                eq(chapter.channelId, channel.id),
                eq(chapter.isPublished, true),
              ),
            );

          // Fetch channel creator's user details from the clerk api
          const user = await ctx.clerk.users.getUser(
            channel.createdByClerkUserId,
          );

          // Get total subscribers
          const subscribersAggr = await tx
            .select({ total: count() })
            .from(subscription)
            .where(eq(subscription.channelId, channel.id));

          // Get total views
          const filters = channel.chapters.flatMap((c) =>
            c.videos.map((v) => `video_id:${v.id}`),
          );

          const overallValues = await ctx.mux.data.metrics.getOverallValues(
            "views",
            {
              filters,
              timeframe: ["3:months"],
            },
          );

          const thumbneilBlurHash = channel.thumbneilId ? await generateBlurHash(`https://${process.env.NEXT_PUBLIC_UPLOADTHING_PROJECT_ID}.ufs.sh/f/${channel.thumbneilId}`) : undefined

          const firstChapter = await tx.query.chapter.findFirst({
            where: eq(chapter.channelId, channel.id), orderBy: [
              asc(sql`CAST(SUBSTRING(${chapter.title} FROM '^[0-9]+') AS INTEGER)`),
              asc(chapter.title),
            ]
          })
          return {
            ...channel,
            numberOfChapters: chapterAggr[0]?.total ?? 0,
            createdByClerkUser: user,
            totalSubscribers: subscribersAggr[0]?.total ?? 0,
            overallValues,
            thumbneilBlurHash,
            firstChapter
          };
        }),
      );
    });
  }),

  getById: protectedProcedure
    .input(z.object({ channelId: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.transaction(async (tx) => {
        // 1. Find channel
        const singleChannel = await tx.query.channel.findFirst({
          where: eq(channel.id, input.channelId),
        });

        if (!singleChannel)
          throw new TRPCError({
            message: "Channel not found",
            code: "NOT_FOUND",
          });

        // 2. Get channel creator details
        const createdByClerkUser = await getClerkUserById(
          singleChannel.createdByClerkUserId,
          ctx,
        );

        // 3. Get total chapters of the channel
        const chapterAggr = await tx
          .select({ total: countDistinct(chapter.id) })
          .from(chapter)
          .leftJoin(
            video,
            and(eq(chapter.id, video.chapterId), eq(chapter.isPublished, true)),
          )
          .where(
            and(
              eq(chapter.channelId, singleChannel.id),
              eq(chapter.isPublished, true),
            ),
          );

        // 4. Get total hours of channel content
        const hoursAggr = await tx
          .select({ total: sum(video.duration).mapWith(Number) })
          .from(chapter)

          .leftJoin(
            video,
            and(eq(chapter.id, video.chapterId), eq(video.isPublished, true)),
          )
          .where(
            and(
              eq(chapter.channelId, singleChannel.id),
              eq(chapter.isPublished, true),
            ),
          );

        // 5. Get total subscribers
        const subscribersAggr = await tx
          .select({ total: count() })
          .from(subscription)
          .where(eq(subscription.channelId, singleChannel.id));

        const thumbneilBlurHash = singleChannel.thumbneilId ? await generateBlurHash(`https://${process.env.NEXT_PUBLIC_UPLOADTHING_PROJECT_ID}.ufs.sh/f/${singleChannel.thumbneilId}`) : undefined

        return {
          ...singleChannel,
          createdByClerkUser,
          thumbneilBlurHash,
          numberOfChapters: chapterAggr[0]?.total ?? 0,
          totalDuration: hoursAggr[0]?.total ?? 0,
          totalSubscribers: subscribersAggr[0]?.total ?? 0,
        };
      });
    }),

  update: protectedProcedure
    .input(UpdateChannelSchema)
    .mutation(async ({ ctx, input }) => {
      return await ctx.db
        .update(channel)
        .set({
          ...input,
          collegeId: !input.isPublic ? input.collegeId : null,
          branchId: !input.isPublic ? input.branchId : null,
        })
        .where(eq(channel.id, input.id))
        .returning()
        .then((r) => r[0]);
    }),

  delete: protectedProcedure
    .input(z.object({ channelId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.transaction(async (tx) => {
        try {
          // 1. Find all the chapters in the channel
          const allVideos = await tx.query.chapter.findMany({
            where: eq(chapter.channelId, input.channelId),
          });

          // 2. Delete all video assets in the chapter
          await Promise.all(
            allVideos.map(
              async (chapter) =>
                await deleteChapter({ chapterId: chapter.id }, withTx(ctx, tx)),
            ),
          );

          // 3. Delete the channel
          const deletedChannel = await tx
            .delete(channel)
            .where(eq(channel.id, input.channelId))
            .returning()
            .then((r) => r[0]);

          if (!deletedChannel) {
            throw new TRPCError({
              message: "Unable to delete the channel",
              code: "INTERNAL_SERVER_ERROR",
            });
          }

          return deletedChannel;
        } catch (e) {
          console.error("delete:chapter:error: ", e);
          throw new TRPCError({
            message: "Unable to delete the chapter",
            code: "INTERNAL_SERVER_ERROR",
          });
        }
      });
    }),
};
