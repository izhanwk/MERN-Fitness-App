const Loader = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md">
      <div className="flex flex-col items-center gap-5">
        <div className="relative h-16 w-16">
          <div className="absolute inset-0 animate-spin rounded-full border-4 border-purple-500/20 border-t-purple-400" />
          <div
            className="absolute inset-3 animate-spin rounded-full border-4 border-blue-500/20 border-b-blue-400"
            style={{ animationDirection: "reverse" }}
          />
        </div>
        <p className="text-[11px] font-bold uppercase tracking-[0.35em] text-white/50">
          Loading...
        </p>
      </div>
    </div>
  );
};

export default Loader;
