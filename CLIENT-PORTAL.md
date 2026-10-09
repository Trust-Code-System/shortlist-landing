# Client portal scope

The current client experience focuses on account creation/sign-in, CV and supporting document upload, document review status, preparation invitations with a Google Meet link, and package payment.

Applications and employer interviews open a clearly labelled Coming soon screen. CV rewriting/version approvals, cover letters, LinkedIn drafts, messaging, agreement management, plan changes, pausing/cancellation and subscriptions are unavailable. Future previews contain no interactive controls.

## Preview behavior

- `signup.html` validates a name and email and opens the portal. No live account or authentication credential is created.
- `upload.html` validates file types, sizes and count. Only filenames, sizes, submission date and notes are saved locally; file contents never leave the browser.
- `checkout.html` saves an explicitly labelled payment preview using the existing sample NGN prices. It does not charge money or send a receipt.
- `tracker.html` renders those preview details, review status and preparation information. A Meet action appears only for a valid HTTPS `meet.google.com/xxx-xxxx-xxx` invitation with a date. No invitation is fabricated or sent.
- `assets/client-preview.js` is a local UI model, not authentication, storage, an admin approval or payment verification. Real services must use authenticated server data and private document storage.

The existing admin dashboard and public landing page are unchanged by this client scope change.

## Local preview

Run `node scripts/preview.cjs`, then open `http://127.0.0.1:4173/tracker.html?view=client`.

Customer styles adapt the MIT-licensed Kargul Studio sales-crm design system. Attribution and the Geist font licence are in `assets/licenses/`.
