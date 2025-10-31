import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@instello/ui/components/button";

export function Header() {
  return (
    <header className="flex h-16 w-full items-center justify-between px-4 sm:px-8 md:px-10 xl:px-14">
      <Link href={"/"}>
        <Image
          src={"/instello.svg"}
          height={28}
          width={140}
          alt="Instello Logo"
        />
      </Link>

      <div className="space-x-1.5">
        <Button variant={"outline"} asChild>
          <Link href={"/get-started"}>Get started</Link>
        </Button>
      </div>
    </header>
  );
}
