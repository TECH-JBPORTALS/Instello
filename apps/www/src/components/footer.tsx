import {
  GoogleLogoIcon,
  InstagramLogoIcon,
} from '@phosphor-icons/react/dist/ssr'
import Image from 'next/image'
import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      {/* Main Footer Content */}
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-2.5 py-12 sm:grid-cols-2 md:grid-cols-4">
        {/* Brand / About */}
        <div>
          <Image
            src={'/instello.svg'}
            height={28}
            width={100}
            alt="Instello Logo"
          />
          <div className="text-muted-foreground py-4 text-sm">
            Developed by <span className="text-rose-500">❤️</span> JB Portals
          </div>
          <ul className="flex items-center gap-2 text-sm">
            <li>
              <Link
                href="https://www.instagram.com/instello_by_jbportals?igsh=MTVhMTVhM2p6MmtjdQ=="
                target="_blank"
                className="hover:underline"
              >
                <InstagramLogoIcon className="size-6" />
              </Link>
            </li>
            <li>
              <Link
                href="https://share.google/z27tOj76PE6Cu4SWm"
                className="hover:underline"
                target="_blank"
              >
                <GoogleLogoIcon className="size-6" />
              </Link>
            </li>
          </ul>
        </div>

        {/* Office Address */}
        <div>
          <h4 className=" mb-3 font-semibold">Office Address</h4>
          <p className="text-sm leading-relaxed">
            MNR Arcade.1364 41st Main, Kanakapura Main Rd, Sarakki Gate,
            <br />
            1st Phase, J. P. Nagar
            <br />
            Bengaluru, Karnataka - 560111
            <br />
            India
          </p>
        </div>

        {/* Contact Details */}
        <div>
          <h4 className="mb-3 font-semibold ">Contact</h4>
          <p className="mb-2 text-sm">
            Phone:{' '}
            <a href="tel:+910000000000" className="hover:underline">
              +91 91641 94556
            </a>
          </p>
          <p className="mb-2 text-sm">
            Email:{' '}
            <a href="mailto:info@example.com" className="hover:underline">
              contact@instello.in
            </a>
          </p>
          <p className="text-sm">Working Hours: Mon – Sat, 9:00 AM – 6:00 PM</p>
        </div>

        {/* Social Links & Legal */}

        <div>
          <h4 className="mb-3 font-semibold">Legal</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/privacy-policy" className="hover:underline">
                Privacy policy
              </Link>
            </li>
            <li>
              <Link href="/account-deletion" className="hover:underline">
                ADP{' '}
                <span className="text-muted-foreground">{`(Account Deletion Process)`}</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="text-muted-foreground border-border/20 border-t py-4 text-center text-sm">
        © {new Date().getFullYear()} Instello. All rights reserved.
      </div>
    </footer>
  )
}
