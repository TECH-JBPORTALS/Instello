import { asc, eq, sql } from "@instello/db";
import {
  chapter,
  CreateChapterSchema,
  UpdateChapterSchema,
  video,
} from "@instello/db/lms";
import { TRPCError } from "@trpc/server";
import { z } from "zod/v4";

import type { withTx } from "../router.helpers";
import type { Context } from "../trpc";
import { protectedProcedure } from "../trpc";
import { deleteVideo } from "./video";

export const chapterRouter = {
  create: protectedProcedure
    .input(CreateChapterSchema)
    .mutation(async ({ ctx, input }) => {
      return await ctx.db
        .insert(chapter)
        .values({
          ...input,
          createdByClerkUserId: ctx.auth.userId,
        })
        .returning();
    }),

  list: protectedProcedure
    .input(z.object({ channelId: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.query.chapter.findMany({
        where: eq(chapter.channelId, input.channelId),
        orderBy: asc(sql`(substring(${chapter.title}, '^[0-9]+'))::integer`),
      });
    }),

  getById: protectedProcedure
    .input(z.object({ chapterId: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.query.chapter.findFirst({
        where: eq(chapter.id, input.chapterId),
      });
    }),

  update: protectedProcedure
    .input(UpdateChapterSchema)
    .mutation(async ({ ctx, input }) => {
      return await ctx.db
        .update(chapter)
        .set({ ...input })
        .where(eq(chapter.id, input.id))
        .returning()
        .then((r) => r[0]);
    }),

  delete: protectedProcedure
    .input(z.object({ chapterId: z.string() }))
    .mutation(({ ctx, input }) => {
      return deleteChapter(input, ctx);
    }),
};

export function deleteChapter(
  input: { chapterId: string },
  ctx: Context | ReturnType<typeof withTx>,
) {
  return ctx.db.transaction(async (tx) => {
    try {
      // 1. Find all the video in the chapter
      const allVideos = await tx.query.video.findMany({
        where: eq(video.chapterId, input.chapterId),
      });

      // 2. Delete all video assets in the chapter
      await Promise.all(
        allVideos.map(
          async (video) => await deleteVideo({ videoId: video.id }, ctx),
        ),
      );

      // 3. Delete the chapter
      const deletedChapter = await tx
        .delete(chapter)
        .where(eq(chapter.id, input.chapterId))
        .returning()
        .then((r) => r[0]);

      if (!deletedChapter) {
        throw new TRPCError({
          message: "Unable to delete the chapter",
          code: "INTERNAL_SERVER_ERROR",
        });
      }

      return deletedChapter;
    } catch (e) {
      console.error("delete:chapter:error: ", e);
      throw new TRPCError({
        message: "Unable to delete the chapter",
        code: "INTERNAL_SERVER_ERROR",
      });
    }
  });
}
