function Footer() {
  return (
    <footer className="relative z-10 mt-12 border-t border-white/10 bg-black/20 backdrop-blur-md">
      <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-8 text-sm text-white/70 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div className="lg:col-span-1">
          <p className="font-semibold text-white">FitTrack App</p>
          <p className="mt-2 text-white/60">
            Track nutrition, manage sessions, and stay consistent.
          </p>
        </div>

        <div id="footer-contact" className="scroll-mt-28">
          <p className="font-semibold text-white">Contact</p>
          <p className="mt-2 text-white/60">Email: izhan3008@gmail.com</p>
          <p className="text-white/60">Phone: +92 348 6186394</p>
        </div>

        <div id="footer-about" className="scroll-mt-28">
          <p className="font-semibold text-white">About Us</p>
          <p className="mt-2 text-white/60">
            Full-stack fitness tracking app built to help users manage
            nutrition, goals, onboarding, and sessions in one place.
          </p>
        </div>

        <div id="footer-guide" className="scroll-mt-28">
          <p className="font-semibold text-white">Guide</p>
          <p className="mt-2 text-white/60">
            Choose your goal, complete onboarding, explore foods, and track
            daily nutrition progress from the dashboard.
          </p>
          <p className="mt-3 text-white/50">
            &copy; {new Date().getFullYear()} FitTrack App
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
