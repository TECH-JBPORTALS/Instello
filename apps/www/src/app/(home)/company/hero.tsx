import { UsersFourIcon } from "@phosphor-icons/react/dist/ssr";

export function Hero() {
  return (
    <section
      className="
         bg-linear-to-r
        relative flex
        flex-col
        items-center gap-6 
        px-4
        py-16
        sm:gap-8 sm:px-8
        sm:py-16
        lg:px-12
      "
    >
      {/* Logo */}
      <div
        className="
          bg-accent/50
          bg-linear-to-tl border-accent/60 mb-6
          flex size-24
          items-center
          justify-center
          rounded-3xl
          border-4
          from-blue-500 via-orange-500
          to-yellow-500
          shadow-sm backdrop-blur-2xl sm:size-28
          lg:size-32
        "
      >
        <UsersFourIcon
          weight="duotone"
          className="size-14 text-white/80 md:size-16 lg:size-20 "
        />
      </div>

      {/* Heading */}
      <h1
        className="
          bg-linear-to-t
          to-foreground from-gray-400 bg-clip-text
          text-center font-mono
          text-3xl font-extrabold leading-tight
          text-transparent sm:text-5xl
          lg:text-6xl
        "
      >
        Wonderful team behind
        <br /> the JB Portals Company
      </h1>

      {/* Subheading */}
      <p
        className="
          text-muted-foreground
          max-w-3xl
          text-center text-sm sm:text-lg
          lg:text-xl
        "
      >
        We believe in bringing great revolution in
        <br /> education & software realm through our company.
      </p>
    </section>
  );
}
