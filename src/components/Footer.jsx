import { Link } from "react-router-dom";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { owner, services } from "../data/services";

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-line bg-canvas">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-4">
        <div>
          <Link to="/" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 font-display text-sm font-bold text-white">
              {owner.initials}
            </span>
            <span className="font-display text-[15px] font-bold text-ink-900">
              {owner.shortName}
            </span>
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-600">
            {owner.title}. Websites, banking systems, mobile apps — plus the SEO, Google Ads and
            Google Business work that gets them found. Start to finish, one person.
          </p>
        </div>

        <div>
          <h3 className="font-display text-sm font-bold text-ink-900">Services</h3>
          <ul className="mt-4 space-y-2.5 text-sm text-ink-600">
            {services.slice(0, 5).map((s) => (
              <li key={s.id}>
                <Link
                  to={`/book?service=${s.id}`}
                  className="transition-colors hover:text-brand-700"
                >
                  {s.name}
                </Link>
              </li>
            ))}
            <li>
              <Link to="/services" className="font-semibold text-brand-700 hover:underline">
                See all services
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-display text-sm font-bold text-ink-900">Get in touch</h3>
          <ul className="mt-4 space-y-3 text-sm text-ink-600">
            <li>
              <a href={owner.phoneHref} className="flex gap-2.5 transition-colors hover:text-brand-700">
                <Phone size={16} className="mt-0.5 shrink-0 text-brand-600" />
                {owner.phone}
              </a>
            </li>
            <li>
              <a
                href={`mailto:${owner.email}`}
                className="flex gap-2.5 break-all transition-colors hover:text-brand-700"
              >
                <Mail size={16} className="mt-0.5 shrink-0 text-brand-600" />
                {owner.email}
              </a>
            </li>
            <li className="flex gap-2.5">
              <MapPin size={16} className="mt-0.5 shrink-0 text-brand-600" />
              {owner.location}
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-display text-sm font-bold text-ink-900">Consultation hours</h3>
          <ul className="mt-4 space-y-2.5 text-sm text-ink-600">
            <li className="flex items-center justify-between gap-4">
              <span className="flex gap-2.5">
                <Clock size={16} className="shrink-0 text-brand-600" />
                Mon – Fri
              </span>
              <span className="font-medium text-ink-900">08:00 – 18:00</span>
            </li>
            <li className="flex items-center justify-between gap-4 pl-[26px]">
              <span>Saturday</span>
              <span className="font-medium text-ink-900">08:00 – 18:00</span>
            </li>
            <li className="flex items-center justify-between gap-4 pl-[26px]">
              <span>Sunday</span>
              <span className="text-ink-400">Closed</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-line px-5 py-6 sm:px-8">
        <p className="mx-auto max-w-6xl text-center text-xs text-ink-400">
          © {new Date().getFullYear()} {owner.name}. All rights reserved.{" "}
          <Link to="/dashboard" className="transition-colors hover:text-brand-700">
            Admin
          </Link>
        </p>
      </div>
    </footer>
  );
}
