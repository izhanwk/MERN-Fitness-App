import { Dumbbell, Mail, Phone } from "lucide-react";

function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/[0.06] bg-black/40 backdrop-blur-sm">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12 lg:px-10">
        <div className="flex flex-col gap-8 sm:gap-10 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-4 lg:max-w-[220px]">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/[0.07] ring-1 ring-white/[0.08]">
                <Dumbbell className="h-3.5 w-3.5 text-white/70" />
              </div>
              <span className="text-sm font-medium tracking-wide text-white/80">
                FitTrack
              </span>
            </div>
            <p className="max-w-xs text-xs leading-relaxed text-white/30">
              Nutrition, goals, and sessions in one quiet interface.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-x-10 sm:gap-y-8 lg:grid-cols-3 lg:gap-16">
            <div id="footer-about" className="space-y-3 scroll-mt-28">
              <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/25">
                About
              </p>
              <p className="text-xs leading-relaxed text-white/35">
                A calm, focused dashboard built for consistent fitness habits.
              </p>
            </div>

            <div id="footer-guide" className="space-y-3 scroll-mt-28">
              <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/25">
                Guide
              </p>
              <p className="text-xs leading-relaxed text-white/35">
                Set your goal, fill your profile, track from the dashboard.
              </p>
            </div>

            <div id="footer-contact" className="space-y-3 scroll-mt-28 sm:col-span-2 lg:col-span-1">
              <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/25">
                Contact
              </p>
              <div className="space-y-2.5">
                <a
                  href="mailto:izhan3008@gmail.com"
                  className="flex items-start gap-2 text-xs text-white/35 transition-colors duration-200 hover:text-white/60 break-all sm:break-normal"
                >
                  <Mail className="h-3 w-3 shrink-0" />
                  <span>izhan3008@gmail.com</span>
                </a>
                <a
                  href="tel:+923486186394"
                  className="flex items-center gap-2 text-xs text-white/35 transition-colors duration-200 hover:text-white/60"
                >
                  <Phone className="h-3 w-3 shrink-0" />
                  <span>+92 348 618 6394</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-2 border-t border-white/[0.05] pt-5 sm:mt-10 sm:pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[11px] text-white/20">
            &copy; {new Date().getFullYear()} FitTrack
          </p>
          <p className="text-[11px] text-white/20">Minimal fitness tracking</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
