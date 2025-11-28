import { and, eq, gt, ilike, isNull, or } from "@instello/db";
import { collegeOrBranch } from "@instello/db/lms";
import { z } from "zod/v4";

import { protectedProcedure } from "../trpc";

export const collegeOrBranchRouter = {
  list: protectedProcedure
    .input(
      z
        .object({
          byCollegeId: z.string().optional(),
          cursor: z.string().optional(),
          limit: z.number().optional(),
          query: z.string().optional(),
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      const cursor = input?.cursor;
      const limit = input?.limit ?? 10;
      const query = input?.query;

      const whereClause = input?.byCollegeId
        ? eq(collegeOrBranch.collegeId, input.byCollegeId)
        : isNull(collegeOrBranch.collegeId);

      const queryClause = or(
        ilike(collegeOrBranch.name, `%${query}%`),
        ilike(collegeOrBranch.code, `%${query}%`),
      );

      const items = await ctx.db.query.collegeOrBranch.findMany({
        where: cursor
          ? and(whereClause, gt(collegeOrBranch.id, cursor), queryClause)
          : and(whereClause, queryClause),
        orderBy: (col, { asc }) => asc(col.id),
        limit,
      });

      // Determine next cursor
      const nextCursor =
        items.length === limit ? items[items.length - 1]?.id : null;

      return { items, nextCursor };
    }),
};
