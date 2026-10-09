import styles from "./shortlist-logo.module.css";

/** The client portal's brand-mark, shared by every admin brand header. */
export default function ShortlistLogo() {
  return <span aria-hidden="true" className={styles.mark} />;
}
