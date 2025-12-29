import Image from "next/image";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      {/* Main Footer Content */}
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-6 py-12 sm:grid-cols-2 md:grid-cols-4">
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
            Building Name / Street
            <br />
            Area / Locality
            <br />
            City, State – Pincode
            <br />
            Country
          </p>
        </div>

        {/* Contact Details */}
        <div>
          <h4 className="mb-3 font-semibold ">Contact</h4>
          <p className="mb-2 text-sm">
            Phone:{" "}
            <a href="tel:+910000000000" className="hover:underline">
              +91 00000 00000
            </a>
          </p>
          <p className="mb-2 text-sm">
            Email:{" "}
            <a href="mailto:info@example.com" className="hover:underline">
              info@example.com
            </a>
          </p>
          <p className="text-sm">Working Hours: Mon – Sat, 9:00 AM – 6:00 PM</p>
        </div>

        {/* Social Links */}
        <div>
          <h4 className="mb-3 font-semibold ">Follow Us</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="#" className="hover:underline">
                Instagram
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Facebook
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                LinkedIn
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Twitter / X
              </a>
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
