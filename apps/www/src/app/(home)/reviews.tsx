import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@instello/ui/components/avatar";
import { Quote } from "lucide-react";

const reviews = [
  {
    name: "Ms. Bhavani T V",
    designation: "HOD, CSE, SJES Polytechnic",
    review:
      "We are very happy to get collobrated with the Instello which is one stop solution for the academic needs of pathway subject like Full Stack Development. Here the learning is facilitated with a comprehensive teaching of both theory and practicals integrated with the real time projects. Instello ensures the skill development of every student and hence get a break through in their career.",
    avatar: "/avatars/bhavani.jpg",
  },
  {
    name: "Mr. Suresh K",
    designation: "Principal, K S Polytechnic",
    review:
      "I am truly proud of you, Narayan...... INSTELLO is an excellent platform for learning Full Stack Development (FSD). The concepts are explained clearly through your videos, making them easy for students to understand. The application is highly user-friendly, and I am confident that it will deliver outstanding outcomes.",
    avatar: "/avatars/suresh.jpg",
  },
  {
    name: "Shreeja S Kumar",
    designation: "Student, Dayananda Sagar Institute Of Technology ",
    review: `Really helped a lot in managing the time while writing our exam and learnt to develop answers using technical words. Explanations were done using slides which was even more better to understand  Overall was a helpful sessions which helped writing the exam good  and even slides and explanation videos for each important topic was very helpful at the last moment of the exam to understand topics which was difficult Thank you Instello!!`,
    avatar: "/avatars/shreeja.png",
  },
  {
    name: "Nikita T H",
    designation: "Student, Dayananda sagar institute of technology ",
    review:
      "One the best coaching centres great quality education with clear teaching methods supportive and knowledgeable teachers who explain concepts well definitely worth it to recommend to others!!!!",
    avatar: "/avatars/nikita.jpg",
  },
  {
    name: "Bindu",
    designation: "Student, KS Polytechnic",
    review:
      "I have completed the Full Stack Development course at Instello. The course was well-structured and easy to understand. The trainers explained concepts clearly with practical examples, which helped me gain confidence in coding. Overall, it was a good learning experience and helpful for building a strong foundation.",
    avatar: "/avatars/bindu.jpg",
  },
];

export function ReviewsSection() {
  return (
    <section className="border-primary/10 bg-linear-to-bl relative w-full  py-24">
      <div className="mx-auto">
        {/* Header */}
        <div className="mb-16 text-center">
          <h2 className="bg-linear-to-b from-foreground/80 to-muted-foreground/60 bg-clip-text text-3xl font-bold tracking-tight text-transparent sm:text-5xl">
            1,500+ Trained Students Till Now
          </h2>
          <p className="text-muted-foreground mx-auto mt-4 max-w-2xl">
            Hear from academic leaders who are using Instello to modernize
            learning, teaching, and institutional management.
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="flex overflow-hidden">
          <ul className="animate-scroll-x hover:paused flex gap-10">
            {[...reviews, ...reviews].map((item, i) => (
              <div
                key={i}
                className="bg-background/80 min-w-md bg-linear-to-b from-background to-background/10 relative rounded-2xl border border-b-0 border-slate-200 from-70% to-0% p-4 backdrop-blur transition-all"
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
          </ul>
        </div>
      </div>
    </section>
  );
}
