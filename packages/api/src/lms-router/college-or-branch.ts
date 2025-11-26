import { eq, isNull } from "@instello/db";
import { collegeOrBranch } from "@instello/db/lms";
import { z } from "zod/v4";

import { protectedProcedure } from "../trpc";

export const collegeOrBranchRouter = {
  list: protectedProcedure
    .input(z.object({ byCollegeId: z.string() }).optional())
    .query(async ({ ctx, input }) => {
      return await ctx.db.query.collegeOrBranch.findMany({
        where: input?.byCollegeId
          ? eq(collegeOrBranch.collegeId, input.byCollegeId)
          : isNull(collegeOrBranch.collegeId),
        orderBy: (col, { asc }) => asc(col.name),
      });
    }),
};
