'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@instello/ui/components/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@instello/ui/components/form'
import { Input } from '@instello/ui/components/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@instello/ui/components/select'
import { Textarea } from '@instello/ui/components/textarea'
import { HandsPrayingIcon } from '@phosphor-icons/react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod/v4'

const schema = z.object({
  name: z.string().min(1, 'Name is required').trim(),
  role: z.string().min(1, 'Role is required').trim(),
  email: z.email().min(1, 'Email is required').trim(),
  contact: z
    .string()
    .min(10, 'Contact number is less than 10 digits')
    .max(10, 'Contact number is more than 10 digits'),
  message: z
    .string()
    .min(3, 'Message is required')
    .max(526, "Message can't exceed more than 526 characters"),
})

export function ContactSection() {
  const [success, setSuccess] = useState(false)
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      role: '',
      email: '',
      contact: '',
      message: '',
    },
  })

  async function onSubmit(params: z.infer<typeof schema>) {
    const res = await fetch('/api/contact', {
      body: JSON.stringify(params),
      method: 'POST',
    })

    if (res.ok) setSuccess(true)

    if (res.status !== 200) {
      const error = (await res.json()) as { message: string }
      toast.error(error.message)
    }
  }

  if (success)
    return (
      <section
        id="contact"
        className="relative flex w-full flex-col items-center gap-6 py-24"
      >
        <HandsPrayingIcon className="size-14 text-orange-600" />
        <div className="w-full space-y-2 text-center">
          <h4 className="font-semibold">Thanks for contacting us</h4>
          <p className="text-muted-foreground text-sm">
            We will respond to your message as soon as possible.
            <br /> So sit tight. Have a nice day : )
          </p>
        </div>
        <Button
          onClick={() => {
            setSuccess(false)
            form.reset()
          }}
          variant={'outline'}
          size={'sm'}
        >
          Ok, Thanks
        </Button>
      </section>
    )

  return (
    <section id="contact" className=" relative w-full py-24">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-16 text-center">
          <h2 className="font-mono text-3xl font-semibold tracking-tight sm:text-4xl">
            Contact Us
          </h2>
          <p className="text-muted-foreground mx-auto mt-4 max-w-2xl">
            Whether you are a student, faculty member, or institution, reach out
            to us and we’ll help you get started with Instello.
          </p>
        </div>

        {/* Form Card */}
        <Form {...form}>
          <form className="grid gap-6" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Role */}
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <Select onValueChange={field.onChange} {...field}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select your role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="faculty">Faculty</SelectItem>
                      <SelectItem value="institution">Institution</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email address</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contact"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Number</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Message */}
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message</FormLabel>
                  <FormControl>
                    <Textarea
                      className="min-h-[200px] resize-none"
                      maxLength={526}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit */}
            <div className="flex justify-end">
              <Button
                loading={form.formState.isSubmitting}
                size="lg"
                className="w-full px-8"
              >
                Submit
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </section>
  )
}
