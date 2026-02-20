'use client'

import Link from 'next/link'
import type React from 'react'

export function NavLink({
  id,
  ...props
}: React.ComponentProps<typeof Link> & { id: string }) {
  const handleClick = () => {
    const el = document.getElementById(id)
    if (!el) return

    el.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }

  return <Link {...props} onClick={handleClick} />
}
