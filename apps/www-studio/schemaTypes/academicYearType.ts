import {ListNumbersIcon} from '@phosphor-icons/react/dist/ssr'
import {defineField, defineType} from 'sanity'

export const academicYearType = defineType({
  name: 'academicYear',
  title: 'Academic Years',
  type: 'document',
  icon: ListNumbersIcon,
  fields: [
    defineField({
      name: 'year',
      type: 'number',
      validation: (rule) => rule.required().positive().min(2000).max(9999),
    }),
    defineField({
      name: 'title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
  ],
})
