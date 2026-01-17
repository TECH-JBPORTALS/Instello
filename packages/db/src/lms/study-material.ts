import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

import { initialColumns } from "../columns.helpers";
import { lmsPgTable } from "../table.helpers";
import { chapter } from "./chapter";

export const studyMaterial = lmsPgTable("study_material", (d) => ({
  ...initialColumns,
  createdByClerkUserId: d.text().notNull(),
  title: d.text().notNull(),
  fileId: d.text().notNull(),
  chapterId: d
    .text()
    .notNull()
    .references(() => chapter.id, { onDelete: "cascade" }),
}));

export const studyMaterialRealations = relations(studyMaterial, ({ one }) => ({
  chapter: one(chapter, {
    fields: [studyMaterial.chapterId],
    references: [chapter.id],
  }),
}));

export const CreateStudyMaterialSchema = createInsertSchema(studyMaterial, {
  title: z
    .string()
    .min(3, "Title of the chapter must be atleast 2 characters long"),
  fileId: z.string().min(3, "File ID is required"),
}).omit({
  id: true,
  createdAt: true,
  createdByClerkUserId: true,
  updatedAt: true,
});
