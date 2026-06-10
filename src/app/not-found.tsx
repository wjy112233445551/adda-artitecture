export const dynamic = "force-dynamic";

export default function NotFound() {
  return (
    <div className="max-w-[1400px] mx-auto px-6 pt-32 pb-16 text-center">
      <h1 className="text-white text-3xl mb-4" style={{ fontFamily: "var(--font-display)" }}>
        404
      </h1>
      <p className="text-white/40 text-sm" style={{ fontFamily: "var(--font-body)" }}>
        Page not found
      </p>
    </div>
  );
}
