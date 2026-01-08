import { relations } from "drizzle-orm";
import { createInsertSchema, createUpdateSchema } from "drizzle-zod";
import { z } from "zod/v4";

import { initialColumns } from "../columns.helpers";
import { lmsPgTable } from "../table.helpers";
import { chapter } from "./chapter";
import { subscription } from "./subscription";

export const author = lmsPgTable("author", (d) => ({
  ...initialColumns,
  createdByClerkUserId: d.text().notNull(),
  firstName: d.varchar({ length: 100 }).notNull(),
  lastName: d.varchar({ length: 100 }),
  email: d.varchar({ length: 256 }),
  phone: d.varchar({ length: 256 }),
  //Uploadthing file hash / id
  imageUTFileId: d.varchar({ length: 100 }),
  designation: d.text(),
  organization: d.text(),
  experienceYears: d.integer().notNull(),
  bio: d.text(),
}));

export const authorRelations = relations(author, ({ many }) => ({
  chapters: many(chapter),
  subscriptions: many(subscription),
}));

export const CreateAuthorSchema = createInsertSchema(author, {
  firstName: z
    .string({ error: "Required" })
    .min(3, "Name must be atleast 3 characters long"),
  lastName: z.string().min(1, "Required").nullable().optional(),
  email: z.email({ error: "Required" }).min(1, "Required"),
  phone: z.string().min(10).max(10),
  designation: z.string().optional(),
  experienceYears: z.number().min(0),
  organization: z.string().optional(),
  bio: z.string().optional(),
}).omit({
  id: true,
  createdAt: true,
  createdByClerkUserId: true,
  updatedAt: true,
  imageUTFileId: true,
});

export const UpdateAuthorSchema = createUpdateSchema(author, {
  id: z.string().min(1, "Author ID is required for updation"),
  name: z
    .string({ error: "Required" })
    .min(3, "Name must be atleast 3 characters long"),
  email: z.email({ error: "Required" }).min(1, "Required"),
  phone: z.string().min(10).max(10),
  designation: z.string().optional(),
  experienceYears: z.number().min(0),
  organization: z.string().optional(),
  bio: z.string().optional(),
  imageUTFileId: z.string().nullable().optional(),
}).omit({
  createdAt: true,
  createdByClerkUserId: true,
  updatedAt: true,
});
