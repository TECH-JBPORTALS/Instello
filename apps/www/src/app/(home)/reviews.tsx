import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@instello/ui/components/avatar";
import { Quote } from "lucide-react";

const reviews = [
  {
    name: "Shreeja S Kumar",
    designation: "Student, Dayananda Sagar Institute Of Technology ",
    review: `Really helped a lot in managing the time while writing our exam and learnt to develop answers using technical words. Explanations were done using slides which was even more better to understand  Overall was a helpful sessions which helped writing the exam good  and even slides and explanation videos for each important topic was very helpful at the last moment of the exam to understand topics which was difficult Thank you Instello!!`,
    avatar: "/avatars/ravi.png",
  },
  {
    name: "Nikita T H",
    designation: "Head of Department, Computer Science",
    review:
      "The LMS and assessment workflows are intuitive for both faculty and students. Adoption across departments was smooth and fast.",
    avatar: "/avatars/anitha.png",
  },
  {
    name: "Mr. Suresh Patil",
    designation: "Training & Placement Officer",
    review:
      "Workshops and seminars conducted through Instello added real industry value for our students. The coordination was seamless.",
    avatar: "/avatars/suresh.png",
  },
];

export function ReviewsSection() {
  return (
    <section className="border-primary/10 bg-linear-to-bl relative w-full rounded-3xl border-4 from-indigo-500/10 via-cyan-500/10 to-fuchsia-500/10 py-24">
      {/* Background Accent */}
      <div className="absolute inset-0 -z-10 " />

      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Trusted by Institutions
          </h2>
          <p className="text-muted-foreground mx-auto mt-4 max-w-2xl">
            Hear from academic leaders who are using Instello to modernize
            learning, teaching, and institutional management.
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((item) => (
            <div
              key={item.name}
              className="bg-background/80 relative rounded-2xl border p-6 backdrop-blur transition-all hover:-translate-y-1 hover:shadow-xl"
            >
              {/* Quote Icon */}
              <Quote className="text-muted-foreground/30 absolute right-6 top-6 h-6 w-6" />

              <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
                “{item.review}”
              </p>

              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={item.avatar} alt={item.name} />
                  <AvatarFallback>
                    {item.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>

                <div>
                  <div className="text-sm font-semibold">{item.name}</div>
                  <div className="text-muted-foreground text-xs">
                    {item.designation}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
