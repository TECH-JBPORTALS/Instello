import type { Metadata } from "next";

import { Associates } from "./associates";
import { ContactSection } from "./contact";
import { Courses } from "./courses";
import { Hero } from "./hero";
import { ReviewsSection } from "./reviews";
import Services from "./services";
import { SkillsSection } from "./skills";

export const metadata: Metadata = {
  title: "Home",
  description:
    "Instello is a comprehensive educational platform that connects students, teachers, and institutions. Learn anywhere, teach better, and manage with ease on our unified platform.",
  openGraph: {
    title: "Instello - One Platform. Every Possibility.",
    description:
      "Instello is a comprehensive educational platform that connects students, teachers, and institutions. Learn anywhere, teach better, and manage with ease.",
    images: ["/banner.jpg"],
  },
  twitter: {
    title: "Instello - One Platform. Every Possibility.",
    description:
      "Instello is a comprehensive educational platform that connects students, teachers, and institutions. Learn anywhere, teach better, and manage with ease.",
    images: ["/banner.jpg"],
  },
};

export default function Home() {
  return (
    <>
      <Hero />
      <Associates />
      <Services />
      <Courses />
      <ReviewsSection />
      <SkillsSection />
      <ContactSection />
    </>
  );
}
