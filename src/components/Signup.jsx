import DNavbar from "./DNavbar";
import Data from "./Data";
import Footer from "./Footer";

function Signup() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 font-dm-sans relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/4 left-1/4 w-40 h-40 bg-yellow-400/10 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

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
