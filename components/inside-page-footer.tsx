import Link from "next/link";

export function InsidePageFooter() {
  return (
    <footer className="mt-auto bg-[#f2f2f2]">
      <div className="relative mx-auto flex min-h-40 max-w-7xl items-start justify-end px-6 py-6">
        <Link href="#" className="text-base text-[#111827] hover:underline">
          Webinars
        </Link>
        <Link
          href="#top"
          aria-label="Back to top"
          className="absolute right-6 top-14 flex h-[72px] w-[72px] items-center justify-center rounded-full bg-[#00adff] text-5xl font-light leading-none text-white transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#152ea9] focus-visible:ring-offset-2"
        >
          <span aria-hidden="true" className="-mt-2">↑</span>
        </Link>
      </div>
      <div className="bg-[#152ea9] px-6 py-3 text-sm text-white">
        <div className="mx-auto max-w-7xl">© 2026 Johnson Controls. All Rights Reserved.</div>
      </div>
    </footer>
  );
}
