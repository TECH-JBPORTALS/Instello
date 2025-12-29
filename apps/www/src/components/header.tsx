import Image from "next/image";
import Link from "next/link";
import { Button } from "@instello/ui/components/button";

export function Header() {
  return (
    <header className="bg-background/10 sticky left-0 right-0 top-0 z-50  flex h-16 w-full items-center justify-between px-4  backdrop-blur-3xl  sm:px-8 md:px-10  xl:px-14">
      <div className="inline-flex items-center gap-14">
        <Link href={"/"}>
          <Image
            src={"/instello.svg"}
            height={28}
            width={140}
            alt="Instello Logo"
          />
        </Link>

        <div className="space-x-6">
          <Link href={"#services"} scroll>
            Services
          </Link>
          <Link href={"#contact"} scroll>
            Contact
          </Link>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button asChild>
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
    </header>
  );
}
