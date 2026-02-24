import {
  and,
  asc,
  count,
  countDistinct,
  eq,
  inArray,
  sql,
  sum,
} from '@instello/db'
import {
  CreateChannelSchema,
  channel,
  chapter,
  subscription,
  UpdateChannelSchema,
  video,
} from '@instello/db/lms'
import { TRPCError } from '@trpc/server'
import { z } from 'zod/v4'

import { getClerkUserById, withTx } from '../router.helpers'
import { protectedProcedure } from '../trpc'
import { deleteChapter } from './chapter'

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
        .returning()
    }),

  list: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.query.channel.findMany({
      where: eq(channel.createdByClerkUserId, ctx.auth.userId),
      orderBy: (col, { desc }) => desc(col.createdAt),
    })
  }),

  listPublic: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.transaction(async (tx) => {
      /* -------------------------------------------------- */
      /* 1. Fetch channels with chapters + videos */
      /* -------------------------------------------------- */

      const channels = await tx.query.channel.findMany({
        columns: {
          branchId: false,
          collegeId: false,
          isPublic: false,
        },
        where: eq(channel.isPublic, true),
        orderBy: ({ createdAt }, { desc }) => [desc(createdAt)],
        with: {
          chapters: {
            columns: { channelId: true },
            with: { videos: { columns: { id: true } } },
          },
        },
      })

      if (!channels.length) return []

      const channelIds = channels.map((c) => c.id)

      /* -------------------------------------------------- */
      /* 2. Batch chapter counts */
      /* -------------------------------------------------- */

      const chapterCounts = await tx
        .select({
          channelId: chapter.channelId,
          total: countDistinct(chapter.id),
        })
        .from(chapter)
        .where(
          and(
            eq(chapter.isPublished, true),
            inArray(chapter.channelId, channelIds),
          ),
        )
        .groupBy(chapter.channelId)

      const chapterCountMap = new Map(
        chapterCounts.map((c) => [c.channelId, c.total]),
      )

      // /* -------------------------------------------------- */
      // /* 3. Batch subscriber counts */
      // /* -------------------------------------------------- */

      const subscriberCounts = await tx
        .select({
          channelId: subscription.channelId,
          total: count(),
        })
        .from(subscription)
        .where(inArray(subscription.channelId, channelIds))
        .groupBy(subscription.channelId)

      const subscriberMap = new Map(
        subscriberCounts.map((s) => [s.channelId, s.total]),
      )

      // /* -------------------------------------------------- */
      // /* 4. Batch first chapters (window function) */
      // /* -------------------------------------------------- */

      const fc = tx
        .select({
          channelId: chapter.channelId,
          chapterId: chapter.id,
        })
        .from(chapter)
        .where(
          and(
            eq(chapter.isPublished, true),
            inArray(chapter.channelId, channelIds),
          ),
        )
        .orderBy(
          asc(sql`CAST(SUBSTRING(${chapter.title} FROM '^[0-9]+') AS INTEGER)`),
        )
        .limit(1)
        .as("fc");

      const firstChapters = await tx
        .select({
          channelId: fc.channelId,
          id: fc.chapterId,
        })
        .from(fc)

      const firstChapterMap = new Map(
        firstChapters.map((c) => [c.channelId, c]),
      )

      /* -------------------------------------------------- */
      /* 5. Batch Clerk users request */
      /* -------------------------------------------------- */

      const userIds = [...new Set(channels.map((c) => c.createdByClerkUserId))]

      const clerkUsers = await ctx.clerk.users.getUserList({
        userId: userIds,
      })

      const userMap = new Map(clerkUsers.data.map((u) => [u.id, u]))

      /* -------------------------------------------------- */
      /* 7. Final mapping (NO ASYNC INSIDE LOOP) */
      /* -------------------------------------------------- */

      return channels.map((channel) => {
        return {
          ...channel,
          numberOfChapters: chapterCountMap.get(channel.id) ?? 0,
          createdByClerkUser: userMap.get(channel.createdByClerkUserId),
          totalSubscribers: subscriberMap.get(channel.id) ?? 0,
          firstChapter: firstChapterMap.get(channel.id),
          overallValues: { data: { total_views: 0 } },
        }
      })
    })
  }),

  getById: protectedProcedure
    .input(z.object({ channelId: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.transaction(async (tx) => {
        // 1. Find channel
        const singleChannel = await tx.query.channel.findFirst({
          where: eq(channel.id, input.channelId),
        })

        if (!singleChannel)
          throw new TRPCError({
            message: 'Channel not found',
            code: 'NOT_FOUND',
          })

        // 2. Get channel creator details
        const createdByClerkUser = await getClerkUserById(
          singleChannel.createdByClerkUserId,
          ctx,
        )

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
          )

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
          )

        // 5. Get total subscribers
        const subscribersAggr = await tx
          .select({ total: countDistinct(subscription.clerkUserId) })
          .from(subscription)
          .where(eq(subscription.channelId, singleChannel.id))

        return {
          ...singleChannel,
          createdByClerkUser,
          numberOfChapters: chapterAggr[0]?.total ?? 0,
          totalDuration: hoursAggr[0]?.total ?? 0,
          totalSubscribers: subscribersAggr[0]?.total ?? 0,
        }
      })
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
        .then((r) => r[0])
    }),

  delete: protectedProcedure
    .input(z.object({ channelId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.transaction(async (tx) => {
        try {
          // 1. Find all the chapters in the channel
          const allVideos = await tx.query.chapter.findMany({
            where: eq(chapter.channelId, input.channelId),
          })

          // 2. Delete all video assets in the chapter
          await Promise.all(
            allVideos.map(
              async (chapter) =>
                await deleteChapter({ chapterId: chapter.id }, withTx(ctx, tx)),
            ),
          )

          // 3. Delete the channel
          const deletedChannel = await tx
            .delete(channel)
            .where(eq(channel.id, input.channelId))
            .returning()
            .then((r) => r[0])

          if (!deletedChannel) {
            throw new TRPCError({
              message: 'Unable to delete the channel',
              code: 'INTERNAL_SERVER_ERROR',
            })
          }

          return deletedChannel
        } catch (e) {
          console.error('delete:chapter:error: ', e)
          throw new TRPCError({
            message: 'Unable to delete the chapter',
            code: 'INTERNAL_SERVER_ERROR',
          })
        }
      })
    }),
}
