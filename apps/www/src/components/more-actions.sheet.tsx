'use client'

import { Button } from '@instello/ui/components/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@instello/ui/components/sheet'
import { ListIcon } from '@phosphor-icons/react/dist/ssr'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

import { NavLink } from './nav-link'

export function MoreActionsSheet() {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button size={'icon'} className="sm:hidden" variant={'ghost'}>
          <ListIcon weight="bold" className="text-muted-foreground size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent className="bg-background/80 w-full backdrop-blur-lg">
        <SheetHeader>
          <SheetTitle className="sr-only">More actions</SheetTitle>
          <Link href={'/'} onClick={() => setOpen(false)}>
            <Image
              src={'/instello.svg'}
              height={28}
              width={120}
              alt="Instello Logo"
            />
          </Link>
        </SheetHeader>
        <div className="flex flex-col items-center gap-8 px-4">
          <div className="flex flex-col items-center gap-6 text-lg font-medium [&>a]:hover:underline">
            <NavLink
              id="services"
              onClick={() => setOpen(false)}
              href={'/#services'}
              scroll
            >
              Services
            </NavLink>
            <NavLink
              id="contact"
              onClick={() => setOpen(false)}
              href={'/#contact'}
              scroll
            >
              Contact
            </NavLink>
            <Link href={'/company'} onClick={() => setOpen(false)}>
              Company
            </Link>
            <Link href={'/achievements'} onClick={() => setOpen(false)}>
              Achievements
            </Link>
          </div>
          <Button asChild className="w-full">
            <Link
              target="_blank"
              href={
                'https://play.google.com/store/apps/details?id=in.instello.app'
              }
            >
              <Image src={'/play.png'} alt="Play" height={16} width={16} />
              Download App
            </Link>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
