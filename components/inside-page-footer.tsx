import Link from "next/link";

export function InsidePageFooter() {
  return (
    <footer className="mt-auto bg-[#152ea9] px-6 py-3 text-sm text-white">
      <div className="relative mx-auto flex min-h-10 max-w-7xl items-center">
        <div>© 2026 Johnson Controls. All Rights Reserved.</div>
        <Link
          href="#top"
          aria-label="Back to top"
          className="absolute right-0 bottom-12 flex h-14 w-14 items-center justify-center rounded-full bg-[#00adff] text-4xl font-light leading-none text-white transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#152ea9] focus-visible:ring-offset-2"
        >
          <span aria-hidden="true" className="-mt-2">↑</span>
        </Link>
      </div>
    </footer>
  );
}
