import Image from "next/image";
import Link from "next/link";
import {
  GoogleLogoIcon,
  InstagramLogoIcon,
} from "@phosphor-icons/react/dist/ssr";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      {/* Main Footer Content */}
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-2.5 py-12 sm:grid-cols-2 md:grid-cols-4">
        {/* Brand / About */}
        <div>
          <Image
            src={"/instello.svg"}
            height={28}
            width={140}
            alt="Instello Logo"
          />
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
            Phone:{" "}
            <a href="tel:+910000000000" className="hover:underline">
              +91 91641 94556
            </a>
          </p>
          <p className="mb-2 text-sm">
            Email:{" "}
            <a href="mailto:info@example.com" className="hover:underline">
              contact@instello.in
            </a>
          </p>
          <p className="text-sm">Working Hours: Mon – Sat, 9:00 AM – 6:00 PM</p>
        </div>

        {/* Social Links */}
        <div>
          <h4 className="mb-3 font-semibold ">Follow Us</h4>
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
      </div>

      {/* Copyright Bar */}
      <div className="text-muted-foreground border-t border-gray-800 py-4 text-center text-sm">
        © {new Date().getFullYear()} Company Name. All rights reserved.
      </div>
    </footer>
  );
}
