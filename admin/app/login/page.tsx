import type { Metadata } from "next";
import LoginForm from "./login-form";
import ThemeToggle from "@/components/_common/theme-toggle";
import ShortlistLogo from "@/components/_common/shortlist-logo";
import styles from "./login.module.css";

export const metadata: Metadata = { title: "Sign in · Shortlist Admin" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <span className={styles.brand}>
          <ShortlistLogo />
          <span>
            <span className={styles.brandName}>Shortlist</span>
            <span className={styles.brandCaption}>Client operations</span>
          </span>
        </span>
        <ThemeToggle />
      </header>

      <div className={styles.layout}>
        <section className={styles.story} aria-labelledby="support-title">
          <span className={styles.eyebrow}>
            <span aria-hidden="true" />A little more care, at every step
          </span>
          <h2 id="support-title" className={styles.storyTitle}>
            Good support starts with a clear next step.
          </h2>
          <p className={styles.storyCopy}>
            A calmer place to review documents, organise preparation, and help
            clients move forward.
          </p>
          <div className={styles.documentScene} aria-hidden="true">
            <div className={styles.documentBack} />
            <div className={styles.document}>
              <div className={styles.documentTop}>
                <span className={styles.documentIcon}>
                  <svg viewBox="0 0 24 24" fill="none">
                    <path
                      d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9l-6-6Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M14 3v6h6M8 13h8M8 17h5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
                <span>
                  Client readiness<small>Every detail matters</small>
                </span>
              </div>
              <div className={styles.documentLine} />
              <div className={styles.documentLine} />
              <div className={styles.documentLine} />
              <div className={styles.documentBottom}>
                <span>CV & supporting documents</span>
                <span className={styles.reviewPill}>Ready for review</span>
              </div>
            </div>
            <div className={styles.prepNote}>
              <svg viewBox="0 0 20 20" fill="none">
                <path
                  d="M3 5h9v10H3V5Zm9 3 5-3v10l-5-3"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
              </svg>
              <span>
                A conversation can change what’s next.
                <small>Preparation, with a personal touch.</small>
              </span>
            </div>
          </div>
          <p className={styles.storyFoot}>
            Thoughtful support. One shared workspace.
          </p>
        </section>
        <section aria-labelledby="login-title" className={styles.formSection}>
          <span className={styles.accessLabel}>
            <span aria-hidden="true" />
            Shortlist Admin
          </span>
          <h1 id="login-title" className={styles.title}>
            Welcome back.
          </h1>
          <p className={styles.intro}>
            Sign in to keep your clients’ next steps moving.
          </p>
          <LoginForm next={next ?? ""} />
          <div className={styles.accessNote}>
            <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <rect
                x="5"
                y="9"
                width="10"
                height="8"
                rx="2"
                stroke="currentColor"
                strokeWidth="1.4"
              />
              <path
                d="M7 9V6a3 3 0 0 1 6 0v3"
                stroke="currentColor"
                strokeWidth="1.4"
              />
            </svg>
            <p>
              For the Shortlist team.
              <br />
              <span>Use your approved work email to continue.</span>
            </p>
          </div>
        </section>
      </div>

      <footer className={styles.footer}>
        <span>Shortlist · Client operations</span>
        <span>Local preview</span>
      </footer>
    </main>
  );
}
