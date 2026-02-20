import { createInsertSchema, createUpdateSchema } from 'drizzle-zod'
import { z } from 'zod/v4'

import { initialColumns } from '../columns.helpers'
import { lmsPgTable } from '../table.helpers'

export const author = lmsPgTable('author', (d) => ({
  ...initialColumns,
  createdByClerkUserId: d.text().notNull(),
  firstName: d.varchar({ length: 100 }).notNull(),
  lastName: d.varchar({ length: 100 }),
  email: d.varchar({ length: 256 }).notNull(),
  phone: d.varchar({ length: 256 }).notNull(),
  //Uploadthing file hash / id
  imageUTFileId: d.text(),
  instagramLink: d.text(),
  designation: d.text(),
  experienceYears: d.integer(),
  organization: d.text(),
  bio: d.text(),
}))

export const CreateAuthorSchema = createInsertSchema(author, {
  firstName: z
    .string({ error: 'Required' })
    .min(3, 'Atleast 3 letters required'),
  lastName: z.string().optional(),
  email: z.email({ error: 'Required' }).min(1, 'Required'),
  phone: z.string().min(10, 'Minimum 10 digits').max(10, 'Maximum 10 digits'),
  organization: z.string().optional(),
  designation: z.string().optional(),
  experienceYears: z.number().min(0).optional(),
  bio: z.string().optional(),
  instagramLink: z.string().optional(),
}).omit({
  id: true,
  createdAt: true,
  createdByClerkUserId: true,
  updatedAt: true,
  imageUTFileId: true,
})

export const UpdateAuthorSchema = createUpdateSchema(author, {
  id: z.string().min(1, 'Author ID is required for updation'),
  firstName: z
    .string({ error: 'Required' })
    .min(3, 'Atleast 3 letters required'),
  lastName: z.string().optional(),
  email: z.email({ error: 'Required' }).min(1, 'Required'),
  phone: z.string().min(10).max(10),
  designation: z.string().optional(),
  experienceYears: z.number().min(0),
  organization: z.string().optional(),
  bio: z.string().optional(),
  imageUTFileId: z.string().nullable().optional(),
  instagramLink: z.string().optional(),
}).omit({
  createdAt: true,
  createdByClerkUserId: true,
  updatedAt: true,
})
