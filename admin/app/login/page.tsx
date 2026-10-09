import type { Metadata } from "next";
import LoginForm from "./login-form";
import ThemeToggle from "@/components/_common/theme-toggle";
import Logo from "@/public/assets/images/_common/logo.svg";

export const metadata: Metadata = { title: "Sign in · Shortlist Admin" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;

  return (
    <main className="bg-background relative flex min-h-dvh flex-col">
      <header className="flex items-center justify-between px-5 py-4">
        <span className="flex items-center gap-2">
          <Logo aria-hidden className="size-8 shrink-0 overflow-visible" />
          <span className="flex flex-col gap-1">
            <span className="lead-style font-medium tracking-[-0.01em]">Shortlist</span>
            <span className="caption-style text-subtle">Client operations</span>
          </span>
        </span>
        <ThemeToggle />
      </header>

      <div className="flex flex-1 items-center justify-center px-5 pb-16">
        <section
          aria-labelledby="login-title"
          className="bg-card w-full max-w-[400px] rounded-xl p-7 shadow-[0px_16px_40px_-12px_var(--overlay-shadow),0px_0px_0px_1px_var(--edge)]"
        >
          <span className="eyebrow-style text-subtle block">Team access</span>
          <h1 id="login-title" className="mt-4 text-[26px] leading-[1.1] font-semibold tracking-[-0.02em]">
            Sign in to Shortlist Admin
          </h1>
          <p className="text-soft mt-3 leading-[1.45]">
            Enter your work email to open the client dashboard.
          </p>
          <LoginForm next={next ?? ""} />
        </section>
      </div>

      <footer className="caption-style text-subtle px-5 pb-5 text-center">
        Internal tool. Access is limited to the Shortlist team.
      </footer>
    </main>
  );
}
