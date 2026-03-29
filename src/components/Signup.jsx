import DNavbar from "./DNavbar";
import Data from "./Data";
import Footer from "./Footer";

function Signup() {
  return (
    <div className="app-shell font-dm-sans">
      <div className="ambient-orbs" />
      <div className="ambient-orb-center" />

      <div className="relative z-10 flex min-h-screen flex-col">
        <DNavbar />
        <div className="flex-1 flex items-center justify-center">
          <Data />
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default Signup;
