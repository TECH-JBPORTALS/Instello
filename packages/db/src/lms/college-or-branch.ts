import { relations } from 'drizzle-orm'
import { foreignKey, index } from 'drizzle-orm/pg-core'
import { createInsertSchema, createUpdateSchema } from 'drizzle-zod'
import { z } from 'zod/v4'

import { initialColumns } from '../columns.helpers'
import { lmsPgTable } from '../table.helpers'

/** Colleges are different from channels. In LMS couses just for mapping the students to right content,
 * this is not any important entity in LMS itself. Later studio creators can map thier content to
 * particular group of students under different colleges and branches */
export const collegeOrBranch = lmsPgTable(
  'college_or_branch',
  (d) => ({
    ...initialColumns,
    name: d.varchar({ length: 100 }).notNull(),
    /** If course id is not null for record then it's a branch */
    collegeId: d.text(),
    code: d.text(),
  }),
  (self) => [
    foreignKey({
      columns: [self.collegeId],
      foreignColumns: [self.id],
    }).onDelete('cascade'),
    index().on(self.name, self.code),
  ],
)

export const courseOrBranchRelations = relations(
  collegeOrBranch,
  ({ many, one }) => ({
    branches: many(collegeOrBranch),
    course: one(collegeOrBranch, {
      fields: [collegeOrBranch.collegeId],
      references: [collegeOrBranch.id],
    }),
  }),
)

export const CreateCourseOrBranchSchema = createInsertSchema(collegeOrBranch, {
  name: z
    .string()
    .min(3, 'Title of the college or branch must be atleast 2 characters long'),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})

export const UpdateCourseOrBranchSchema = createUpdateSchema(collegeOrBranch, {
  id: z.string().min(1, 'College or Branch ID is required for updation'),
  name: z
    .string()
    .min(3, 'name of the college or branch must be atlease 2 characters long'),
}).omit({
  createdAt: true,
  updatedAt: true,
})
