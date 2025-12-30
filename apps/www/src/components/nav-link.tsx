"use client";

import type React from "react";
import Link from "next/link";

export function NavLink({
  id,
  ...props
}: React.ComponentProps<typeof Link> & { id: string }) {
  const handleClick = () => {
    const el = document.getElementById(id);
    if (!el) return;

    el.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return <Link {...props} onClick={handleClick} />;
}
