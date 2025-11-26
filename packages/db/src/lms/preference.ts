import { relations } from "drizzle-orm";
import { createInsertSchema, createUpdateSchema } from "drizzle-zod";
import { z } from "zod/v4";

import { initialColumns } from "../columns.helpers";
import { lmsPgTable } from "../table.helpers";
import { collegeOrBranch } from "./course-or-branch";

export const preference = lmsPgTable("preference", (d) => ({
  ...initialColumns,
  collegeId: d
    .text()
    .notNull()
    .references(() => collegeOrBranch.id, { onDelete: "cascade" }),
  branchId: d
    .text()
    .notNull()
    .references(() => collegeOrBranch.id, { onDelete: "cascade" }),
}));

export const CreatePreferenceSchema = createInsertSchema(preference, {
  collegeId: z.string().min(2, "Course ID required"),
  branchId: z.string().min(2, "Branch ID required"),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const UpdatePreferenceSchema = createUpdateSchema(preference, {
  collegeId: z.string().min(2, "Course ID required"),
  branchId: z.string().min(2, "Branch ID required"),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const preferenceRealations = relations(preference, ({ one }) => ({
  course: one(collegeOrBranch, {
    fields: [preference.collegeId],
    references: [collegeOrBranch.collegeId],
  }),
  branch: one(collegeOrBranch, {
    fields: [preference.collegeId],
    references: [collegeOrBranch.id],
  }),
}));
