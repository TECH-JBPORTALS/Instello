import Image from "next/image";
import Link from "next/link";
import { NavLink } from "@/components/nav-link";
import { Button } from "@instello/ui/components/button";
import {
  DownloadIcon,
  PaperPlaneTiltIcon,
  StarIcon,
} from "@phosphor-icons/react/ssr";

export function Hero() {
  return (
    <section
      className="
        rounded-4xl
        border-secondary/40 bg-linear-to-r
        relative flex min-h-[calc(100svh-96px)]
        flex-col items-center
        justify-center gap-6 border-4
        from-blue-500 via-orange-500 to-yellow-500 px-4
        py-12 shadow-2xl sm:gap-8
        sm:px-8 sm:py-16
        lg:px-12
      "
    >
      {/* Logo */}
      <div
        className="
          bg-accent/50
          mb-6 flex size-24 items-center
          justify-center rounded-3xl
          shadow-sm
          backdrop-blur-2xl
          sm:size-28 lg:size-32
          dark:border
        "
      >
        <Image
          src="/instello-feather.svg"
          alt="Instello Feather Logo"
          height={96}
          width={96}
          priority
        />
      </div>

      {/* Heading */}
      <h1
        className="
          bg-linear-to-t
          from-gray-50 to-gray-300 bg-clip-text
          text-center font-mono
          text-3xl font-extrabold leading-tight
          text-transparent sm:text-5xl
          lg:text-6xl
        "
      >
        One Platform. Every Possibility.
      </h1>

      {/* Subheading */}
      <p
        className="
          max-w-3xl
          text-center
          text-sm text-white/90 sm:text-lg
          lg:text-xl
        "
      >
        Instello is a comprehensive educational platform that connects students,
        teachers, and institutions. Learn anywhere, teach better, and manage
        with ease on our unified platform.
      </p>

      {/* Stats */}
      <div
        className="
          mt-2
          flex flex-wrap items-center justify-center
          gap-3 text-white
        "
      >
        <span className="inline-flex items-center gap-1.5">
          <StarIcon weight="fill" className="size-5 text-amber-400" />
          <span className="text-sm font-semibold sm:text-base">5 Ratings</span>
        </span>

        <span className="hidden text-2xl sm:inline">·</span>

        <span className="inline-flex items-center gap-1.5">
          <DownloadIcon weight="duotone" className="size-5 text-white/80" />
          <span className="text-sm font-semibold sm:text-base">
            100+ Downloads
          </span>
        </span>
      </div>

      {/* CTA Buttons */}
      <div
        className="
          mt-4
          flex w-full max-w-xs
          flex-col-reverse items-center
          justify-center
          gap-3 sm:flex-row
        "
      >
        <Button
          size="xl"
          variant="secondary"
          className="w-full rounded-full shadow-sm"
          asChild
        >
          <NavLink id="contact" href="#contact">
            <PaperPlaneTiltIcon weight="duotone" />
            Contact Us
          </NavLink>
        </Button>

        <Button size="xl" className="w-full rounded-full shadow-sm" asChild>
          <Link
            href="https://play.google.com/store/apps/details?id=in.instello.app"
            target="_blank"
          >
            <Image src="/play.png" alt="Play Store" height={18} width={18} />
            Download App
          </Link>
        </Button>
      </div>
    </section>
  );
}
