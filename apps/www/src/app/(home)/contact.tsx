import { Button } from "@instello/ui/components/button";
import { Input } from "@instello/ui/components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@instello/ui/components/select";
import { Textarea } from "@instello/ui/components/textarea";

export function ContactSection() {
  return (
    <section className=" relative w-full py-24">
      {/* Background Accent */}
      <div className="bg-linear-to-br border-primary/15 absolute inset-0 -z-10 rounded-3xl border-4 from-cyan-500/5 via-indigo-500/5 to-fuchsia-500/5" />

      <div className="mx-auto max-w-2xl px-6">
        {/* Header */}
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Contact Us
          </h2>
          <p className="text-muted-foreground mx-auto mt-4 max-w-2xl">
            Whether you are a student, faculty member, or institution, reach out
            to us and we’ll help you get started with Instello.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-background/80 rounded-2xl border p-8 shadow-sm backdrop-blur">
          <form className="grid gap-6">
            {/* Name */}
            <div className="grid gap-2">
              <label className="text-sm font-medium">Name</label>
              <Input placeholder="Enter your full name" />
            </div>

            {/* Role */}
            <div className="grid gap-2">
              <label className="text-sm font-medium">Role</label>
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="faculty">Faculty</SelectItem>
                  <SelectItem value="institution">Institution</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium">Email ID</label>
              <Input type="email" placeholder="Enter email address" />
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium">Contact Number</label>
              <Input placeholder="+91" />
            </div>

            {/* Message */}
            <div className="grid gap-2">
              <label className="text-sm font-medium">Message</label>
              <Textarea
                placeholder="Tell us why you want to contact us"
                className="min-h-[120px] resize-none"
              />
            </div>

            {/* Submit */}
            <div className="flex justify-end">
              <Button size="lg" className="w-full px-8">
                Submit
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
