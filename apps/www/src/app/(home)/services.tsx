import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@instello/ui/components/card";
import {
  BookOpenIcon,
  GraduationCapIcon,
  HammerIcon,
  PresentationIcon,
} from "@phosphor-icons/react/ssr";

const services = [
  {
    title: "LMS",
    description:
      "Structured digital learning made simple. Manage courses, track progress, and deliver content seamlessly through a unified learning platform.",
    icon: BookOpenIcon,
  },
  {
    title: "Workshops",
    description:
      "Hands-on, practical, skill-based training programs designed to bridge the gap between theory and real-world application.",
    icon: HammerIcon,
  },
  {
    title: "Seminars",
    description:
      "Career guidance, industry exposure, and awareness programs led by experienced professionals and domain experts.",
    icon: PresentationIcon,
  },
  {
    title: "Visiting Faculty (Subject Takeover)",
    description:
      "Complete subject ownership by visiting faculty, including syllabus coverage, academic planning, assessments, and exam support.",
    icon: GraduationCapIcon,
  },
];

export default function Services() {
  return (
    <section
      id="services"
      className="border-primary/10 relative w-full rounded-2xl border-4 py-24"
    >
      {/* Background Gradient */}
      <div className="bg-linear-to-br absolute inset-0 -z-10 from-fuchsia-500/15 via-indigo-500/15 to-cyan-500/15" />

      <div className="mx-auto max-w-7xl px-6">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Our Services
          </h2>
          <p className="text-muted-foreground mx-auto mt-4 max-w-2xl">
            Instello partners with institutions to deliver end-to-end academic,
            training, and learning solutions — all aligned with modern education
            needs.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => (
            <Card
              key={service.title}
              className="border-muted bg-background/80 group relative overflow-hidden backdrop-blur transition-all"
            >
              {/* Decorative Gradient Accent */}
              <div className="bg-linear-to-r absolute inset-x-0 top-0 h-1 from-fuchsia-500 via-indigo-500 to-cyan-500" />

              <CardHeader className="flex flex-col items-center text-center">
                <div className="bg-linear-to-br mb-4 flex h-14 w-14 items-center justify-center rounded-2xl from-fuchsia-500 to-indigo-500 text-white shadow-lg">
                  <service.icon weight="fill" className="h-7 w-7" />
                </div>
                <CardTitle className="text-lg font-semibold">
                  {service.title}
                </CardTitle>
              </CardHeader>

              <CardContent className="text-muted-foreground text-center text-sm">
                {service.description}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
