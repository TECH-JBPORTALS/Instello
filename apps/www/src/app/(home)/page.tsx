import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@instello/ui/components/button";
import {
  DownloadIcon,
  PaperPlaneTiltIcon,
  StarIcon,
} from "@phosphor-icons/react/ssr";

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
    <div className="rounded-4xl border-secondary/40 bg-linear-to-r flex h-full flex-col items-center justify-center gap-6 border-8 from-fuchsia-500 to-cyan-500 px-10 sm:gap-10">
      <div className="bg-accent/50  shadow-accent-foreground/20 mb-8 flex size-28 items-center justify-center rounded-3xl shadow-sm backdrop-blur-2xl sm:size-32 dark:border">
        <Image
          src={"/instello-feather.svg"}
          alt="Instello Feather Logo"
          height={100}
          width={100}
        />
      </div>
      <h1 className="text-center text-4xl font-bold text-white sm:text-6xl">
        One Platform. Every Possibility.
      </h1>
      <h3 className="max-w-3xl text-center text-base text-white/80 sm:text-xl">
        Instello is a comprehensive educational platform that connects students,
        teachers, and institutions. Learn anywhere, teach better, and manage
        with ease on our unified platform.
      </h3>

      <span className="inline-flex items-center gap-2.5">
        <span className="inline-flex items-center gap-1.5 text-white">
          <StarIcon weight="fill" className="size-5 text-amber-500" />
          <span className="text-lg font-semibold">5 Ratings</span>
        </span>
        <span className="text-3xl text-white">·</span>
        <span className="inline-flex items-center gap-1.5 text-white">
          <DownloadIcon weight="duotone" className="size-5 text-white/80" />
          <span className="text-lg font-semibold">100+ Downloads</span>
        </span>
      </span>
      <div className="flex w-full flex-col-reverse gap-3.5 sm:w-fit sm:flex-row">
        <Button
          size={"xl"}
          variant={"secondary"}
          className="rounded-full  shadow-sm"
        >
          <PaperPlaneTiltIcon weight="duotone" />
          Contact Us
        </Button>

        <Button size={"xl"} className="rounded-full shadow-sm" asChild>
          <Link
            target="_blank"
            href={
              "https://play.google.com/store/apps/details?id=in.instello.app"
            }
          >
            <Image src={"/play.png"} alt="Play" height={16} width={16} />
            Download App
          </Link>
        </Button>
      </div>
    </div>
  );
}
