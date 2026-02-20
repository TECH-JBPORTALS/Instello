import { GraduationCapIcon } from '@phosphor-icons/react/dist/ssr'
import { defineField, defineType } from 'sanity'
import { academicYearType } from './academicYearType'

export const dcetType = defineType({
  name: 'dcetStudent',
  title: 'DCET Student',
  type: 'document',
  icon: GraduationCapIcon,
  fields: [
    defineField({
      name: 'name',
      type: 'string',
      title: 'Name of the Student',
      validation: (rule) => rule.required().min(2).max(200),
    }),
    defineField({
      name: 'academicYear',
      type: 'reference',
      title: 'Academic Year',
      to: academicYearType,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'rank',
      type: 'number',
      title: 'Rank of the Student',
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: 'avatar',
      type: 'image',
      title: 'Picture of Student',
      validation: (rule) => rule.required().assetRequired(),
    }),

    defineField({
      name: 'college',
      type: 'string',
      title: 'College of the Student',
      validation: (rule) => rule.required().min(2).max(200),
    }),
  ],
})
