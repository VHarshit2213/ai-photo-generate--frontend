export default function AuthLayout({ children, rightContent }) {
  return (
    <div className="relative flex h-dvh w-full items-center justify-center overflow-hidden bg-neutral-bg p-4 font-body text-neutral-50">

      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_16%,rgba(192,132,252,0.22),transparent_26%),radial-gradient(circle_at_78%_74%,rgba(147,51,234,0.18),transparent_34%),linear-gradient(135deg,rgba(88,28,135,0.30),rgba(15,10,25,0.96))]" />

      <div className="grid h-full min-h-0 w-full max-w-7xl overflow-hidden rounded-3xl border border-neutral-border bg-neutral-surface/80 shadow-card backdrop-blur-xl lg:grid-cols-[0.82fr_1.18fr]">

        <section className="no-scrollbar min-h-0 overflow-y-auto overscroll-contain px-4 py-4 sm:px-6 lg:px-12">
          <div className="flex min-h-full flex-col items-center">
            <div className="my-auto w-full max-w-md py-2">
              {children}
            </div>
          </div>
        </section>

        <aside className="relative hidden min-h-0 overflow-hidden px-6 py-8 lg:flex lg:items-center lg:justify-center">
          {rightContent}
        </aside>
      </div>
    </div>
  );
}