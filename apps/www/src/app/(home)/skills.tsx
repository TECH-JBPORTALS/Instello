import { Bug, Code2, Palette, Rocket, Server } from 'lucide-react'

const skills = [
  {
    title: 'UI Design',
    icon: Palette,
    items: ['Wireframing', 'Designing using Figma', 'Design using Shadcn UI'],
  },
  {
    title: 'Front-end Development',
    icon: Code2,
    items: ['HTML, CSS, JavaScript', 'React JS', 'Next JS'],
  },
  {
    title: 'Back-end Development',
    icon: Server,
    items: ['Back-end with TypeScript', 'Python', 'Spring Boot', 'PHP'],
  },
  {
    title: 'Testing',
    icon: Bug,
    items: [
      'Manual Testing',
      'API Testing using Postman',
      'Automation Testing using Java',
    ],
  },
  {
    title: 'Deployment',
    icon: Rocket,
    items: ['Deployment on Vercel'],
  },
]

export function SkillsSection() {
  return (
    <section className="relative w-full py-24">
      {/* Background Accent */}
      <div className="bg-linear-to-br absolute inset-0 -z-10 " />

      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-16 text-center">
          <h2 className="font-mono text-3xl font-semibold tracking-tight sm:text-4xl">
            Skills & Technologies Covered
          </h2>
          <p className="text-muted-foreground mx-auto mt-4 max-w-2xl">
            A comprehensive curriculum covering design, development, testing,
            and deployment using modern, industry-relevant technologies.
          </p>
        </div>

        {/* Skills Grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {skills.map((skill) => (
            <div
              key={skill.title}
              className="bg-background/80 relative rounded-2xl border p-6 backdrop-blur transition-all hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="mb-4 flex items-center gap-3">
                <div className="bg-linear-to-br flex h-10 w-10 items-center justify-center rounded-xl from-fuchsia-500 via-indigo-500 to-cyan-500 shadow">
                  <skill.icon className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold">{skill.title}</h3>
              </div>

              <ul className="text-muted-foreground space-y-2 text-sm">
                {skill.items.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="bg-foreground/60 mt-1 h-1.5 w-1.5 rounded-full" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
