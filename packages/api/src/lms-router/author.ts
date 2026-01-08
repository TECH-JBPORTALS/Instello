import { and, eq } from "@instello/db";
import {
  author,
  CreateAuthorSchema,
  UpdateAuthorSchema,
} from "@instello/db/lms";
import { z } from "zod/v4";

import { protectedProcedure } from "../trpc";

export const authorRouter = {
  create: protectedProcedure.input(CreateAuthorSchema).mutation(
    async ({ ctx, input }) =>
      await ctx.db
        .insert(author)
        .values({ ...input, createdByClerkUserId: ctx.auth.userId })
        .returning()
        .then((r) => r[0]),
  ),

  update: protectedProcedure.input(UpdateAuthorSchema).mutation(
    async ({ ctx, input }) =>
      await ctx.db
        .update(author)
        .set({ ...input, createdByClerkUserId: ctx.auth.userId })
        .where(
          and(
            eq(author.id, input.id),
            eq(author.createdByClerkUserId, ctx.auth.userId),
          ),
        )
        .returning()
        .then((r) => r[0]),
  ),

  delete: protectedProcedure.input(z.object({ authorId: z.string() })).mutation(
    async ({ ctx, input }) =>
      await ctx.db
        .delete(author)
        .where(
          and(
            eq(author.id, input.authorId),
            eq(author.createdByClerkUserId, ctx.auth.userId),
          ),
        )
        .returning()
        .then((r) => r[0]),
  ),

  getById: protectedProcedure
    .input(z.object({ authorId: z.string() }))
    .query(({ ctx, input }) =>
      ctx.db.query.author.findFirst({
        where: (t, { eq, and }) =>
          and(
            eq(t.id, input.authorId),
            eq(t.createdByClerkUserId, ctx.auth.userId),
          ),
      }),
    ),

  list: protectedProcedure.query(async ({ ctx }) => {
    const authors = await ctx.db.query.author.findMany({
      where: eq(author.createdByClerkUserId, ctx.auth.userId),
    });

    return authors;
  }),
};
