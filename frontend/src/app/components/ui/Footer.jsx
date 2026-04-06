import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import svgPaths from "../../../imports/svg-go1x4xx39u";

import { courseService } from "../../services/courseService";

// ─────────────────────────────────────────────

function SocialMediaLogo() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Social Media logo">
      <div className="absolute inset-[-4.17%_0]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 21.6667">
          <g id="Social Media logo">
            <path d={svgPaths.p3ca0dd00} fill="var(--fill-0, #2E7E96)" id="Vector" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function SocialMediaCard({ children }) {
  return (
    <button
      className="bg-[#9fc3ce] content-stretch flex flex-col items-center justify-center p-[14px] relative rounded-[8px] hover:bg-[#8fb3be] transition-colors"
      data-name="Social Media card"
    >
      {children}
    </button>
  );
}

function SocialMediaLogo1() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Social Media logo">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g clipPath="url(#clip0_1_3333)" id="Social Media logo">
          <path d={svgPaths.p2cd2c200} fill="var(--fill-0, #2E7E96)" id="Vector" />
        </g>
        <defs>
          <clipPath id="clip0_1_3333">
            <rect fill="white" height="20" width="20" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function SocialMediaLogo2() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Social Media logo">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g clipPath="url(#clip0_1_3342)" id="Social Media logo">
          <path d={svgPaths.p4926900} fill="var(--fill-0, #2E7E96)" id="Vector" />
        </g>
        <defs>
          <clipPath id="clip0_1_3342">
            <rect fill="white" height="20" width="20" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

// ─────────────────────────────────────────────
// Category section — fetches from API
// ─────────────────────────────────────────────
function CategorySection() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchCategories() {
      try {
        setLoading(true);
        setError(null);

        // Returns [{ _id, name, slug }, ...] from the CategoryTag model
        const data = await courseService.getCategories();
        if (!cancelled) setCategories(data.slice(0, 7));
      } catch (err) {
        if (!cancelled) setError(err.message ?? "Failed to load categories");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchCategories();
    return () => { cancelled = true; };
  }, []);

  const linkClass =
    "block font-['Public_Sans:Regular',sans-serif] font-normal text-[#6d737a] text-[14px] md:text-[16px] leading-[24px] hover:text-[#14627a] transition";

  return (
    <div className="space-y-4">
      <div className="font-['Public_Sans:SemiBold',sans-serif] font-semibold text-[#1b1d1f] text-[20px] md:text-[24px] tracking-[0.048px]">
        <p className="leading-[32px]">Category</p>
      </div>

      <div className="space-y-2">
        {loading && (
          Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-4 w-24 bg-gray-200 rounded animate-pulse"
            />
          ))
        )}

        {error && (
          <p className="text-red-400 text-sm">{error}</p>
        )}

        {!loading && !error && categories.map((cat) => (
          <Link
            key={cat._id}
            to={`/courses?category=${encodeURIComponent(cat.slug)}`}
            className={linkClass}
          >
            {cat.name}
          </Link>
        ))}

        {!loading && !error && categories.length === 0 && (
          <p className="text-[#6d737a] text-sm">No categories available.</p>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Footer
// ─────────────────────────────────────────────
export default function Footer({ settings }) {
  const currentYear = new Date().getFullYear();

  return (
    <div className="bg-white relative shrink-0 w-full py-12 px-4 sm:px-8 md:px-16 lg:px-32">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

          {/* Contact Us Section */}
          <div className="space-y-4">
            <div className="mb-6 text-left">
              <p className="text-[36px] sm:text-[42px] md:text-[48px] font-bold italic font-['PT_Serif',serif] leading-tight">
                <span className="text-[#14627a]">edu</span>
                <span className="text-[#ffc27a]">Tech</span>
              </p>
            </div>

            <div className="font-['Public_Sans:SemiBold',sans-serif] font-semibold text-[#1b1d1f] text-[20px] md:text-[24px] tracking-[0.048px]">
              <p className="leading-[32px]">Contact Us</p>
            </div>
            <div className="space-y-2">
              {settings?.phone && (
                <a href={`tel:${settings.phone}`} className="flex items-center gap-2 text-sm md:text-base text-[#6d737a] hover:text-[#14627a] transition">
                  <i className="bi bi-telephone text-lg"></i>
                  <span>{settings.phone}</span>
                </a>
              )}

              {settings?.address && (
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(settings.address)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="font-['Public_Sans',sans-serif] text-[#6d737a] text-sm md:text-base leading-[24px] flex items-start gap-2 hover:text-[#14627a] transition"
                >
                  <i className="bi bi-house text-[#14627a] text-lg mt-[2px]"></i>
                  <span>{settings.address}</span>
                </a>
              )}

              {settings?.email && (
                <a href={`mailto:${settings.email}`} className="flex items-center gap-2 text-sm md:text-base text-[#363a3d] hover:text-[#14627a] transition">
                  <i className="bi bi-envelope-at text-[#14627a] text-lg"></i>
                  <span>{settings.email}</span>
                </a>
              )}
            </div>
            <div className="flex gap-4 mt-4">
              <SocialMediaCard><SocialMediaLogo /></SocialMediaCard>
              <SocialMediaCard><SocialMediaLogo1 /></SocialMediaCard>
              <SocialMediaCard><SocialMediaLogo2 /></SocialMediaCard>
            </div>
            <p className="text-[#6d737a] text-xs pt-4">
              © {currentYear} eduTech. All rights reserved.
            </p>
          </div>

          {/* Explore Section */}
          <div className="space-y-4">
            <div className="font-['Public_Sans:SemiBold',sans-serif] font-semibold text-[#1b1d1f] text-[20px] md:text-[24px] tracking-[0.048px]">
              <p className="leading-[32px]">Explore</p>
            </div>
            <div className="space-y-2">
              {[
                { to: "/",         label: "Home"     },
                { to: "/about",    label: "About"    },
                { to: "/courses",  label: "Course"   },
                { to: "/blog",     label: "Blog"     },
                { to: "/workshop", label: "Workshop" },
              ].map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  className="block font-['Public_Sans:Regular',sans-serif] font-normal text-[#6d737a] text-[14px] md:text-[16px] leading-[24px] hover:text-[#14627a]"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Category Section — API driven */}
          <CategorySection />

          {/* Get in Touch Section */}
          <div className="space-y-4">
            <div className="font-['Public_Sans:SemiBold',sans-serif] font-semibold text-[#1b1d1f] text-[18px] md:text-[20px]">
              <p className="leading-[24px]">Get in Touch</p>
            </div>
            <p className="font-['Public_Sans:Regular',sans-serif] font-normal text-[#6d737a] text-[14px] md:text-[16px] leading-[24px]">
              Enter your email address to get in touch soon with us.
            </p>
            <div className="space-y-4">
              <input
                type="email"
                placeholder="Email here"
                className="bg-[rgba(231,233,235,0.5)] w-full p-[16px] rounded-[8px] font-['Public_Sans:Regular',sans-serif] font-normal text-[#6d737a] text-[14px] md:text-[16px] leading-[24px] outline-none focus:ring-2 focus:ring-[#14627a]"
              />
              <input
                type="text"
                placeholder="Message here"
                className="bg-[rgba(231,233,235,0.5)] w-full p-[16px] rounded-[8px] font-['Public_Sans:Regular',sans-serif] font-normal text-[#6d737a] text-[14px] md:text-[16px] leading-[24px] outline-none focus:ring-2 focus:ring-[#14627a]"
              />
              <button className="bg-[#14627a] w-full px-[24px] py-[12px] rounded-[8px] font-['Public_Sans:Medium',sans-serif] font-medium text-[14px] md:text-[16px] text-center text-white leading-[24px] hover:bg-[#0f4a5b] transition-colors">
                Get in Touch
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}