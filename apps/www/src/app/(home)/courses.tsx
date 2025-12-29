import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@instello/ui/components/card";
import { Cpu, Layers, University } from "lucide-react";

const courses = [
  {
    title: "Diploma",
    description:
      "Industry-oriented diploma programs focused on practical skills, foundational engineering concepts, and job readiness.",
    icon: Layers,
  },
  {
    title: "Engineering",
    description:
      "Comprehensive engineering programs with structured curriculum, semester-wise tracking, assessments, and outcomes management.",
    icon: Cpu,
  },
  {
    title: "Degree",
    description:
      "Undergraduate degree programs designed for academic depth, career alignment, and higher education preparedness.",
    icon: University,
  },
];

export function Courses() {
  return (
    <section className="border-primary/10 relative mt-24 w-full  py-24">
      {/* Background Accent */}
      <div className="bg-linear-to-br absolute inset-0 -z-10 " />

      <div className="mx-auto max-w-6xl px-6">
        {/* Header */}
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Courses We Support
          </h2>
          <p className="text-muted-foreground mx-auto mt-4 max-w-2xl">
            Instello is built to support institutions across diploma,
            engineering, and degree education with flexible, scalable academic
            infrastructure.
          </p>
        </div>

        {/* Cards */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <Card
              key={course.title}
              className="border-muted bg-background/80 group relative overflow-hidden backdrop-blur transition-all hover:-translate-y-1 hover:shadow-xl"
            >
              {/* Top Gradient Bar */}
              <div className="bg-linear-to-r absolute inset-x-0 top-0 h-1 from-indigo-500 via-cyan-500 to-fuchsia-500" />

              <CardHeader className="flex flex-col items-center text-center">
                <div className="bg-linear-to-br mb-5 flex h-16 w-16 items-center justify-center rounded-2xl from-indigo-500 to-cyan-500 text-white shadow-lg">
                  <course.icon className="h-8 w-8" />
                </div>
                <CardTitle className="text-xl font-semibold">
                  {course.title}
                </CardTitle>
              </CardHeader>

              <CardContent className="text-muted-foreground text-center text-sm">
                {course.description}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
