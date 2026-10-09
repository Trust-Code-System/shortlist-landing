# Shortlist Admin

Internal client portal for the Shortlist team, focused on client records, CV/supporting-document review, Google Meet preparation invitations, and payments.

> **Local preview only.** Every client and payment in `data/` is invented. Review decisions and preparation details persist in this browser under `shortlist-admin-preview-v1`. The email allowlist session gate is retained, but it is not a production identity service. There is no shared backend, real document viewing, client submission, calendar creation, email delivery, or payment processing. Client and admin previews do not share records across their separate origins. Use sample data only.

The active sections are Clients (`/`), Document review (`/document-review`), Preparation (`/preparation`), and Payments (`/payments`). Three sample clients have fixture document filenames for exercising the review UI; the remaining clients await uploads. Preparation invitations require an approved review, a valid HTTPS Google Meet link, and a future date/time. Requesting changes clears the saved invite. No invitation is sent to anyone.

Intake calls, agreements, applications, employer interviews, messages, team management, reporting, and market views show inert blurred “Coming soon” screens, including direct URLs. Invite teammates and Help are disabled with the same label. The previous global CRM detail, profile editing, search, new-client, and notifications overlays are not mounted in the current release.

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Where things live

| Path                                        | What it is                                                            |
| ------------------------------------------- | --------------------------------------------------------------------- |
| `data/companies.ts`                         | Sample clients, specialists, packages and stages                      |
| `data/notifications.ts`                     | Sample activity feed (bookings, payments, agreements, interviews)     |
| `components/pages/client-workflow-page.tsx` | Focused sample-client table, review form, and preparation invite form |
| `stores/admin-preview-store.ts`             | Local review/invite state and validation                              |
| `components/pages/coming-soon-page.tsx`     | Inert future-feature screen                                           |
| `components/_common/sidebar/`               | Navigation                                                            |

Internal identifiers still use the original CRM names (`Company`, `openDeals`, `pipelineValue`, `winProbability`). In this app they mean client, applications sent, monthly value (NGN) and response rate.

## Credit

Built on [kargulstudio/sales-crm](https://github.com/kargulstudio/sales-crm) (MIT License, © 2026 Kargul Studio). The original licence is kept in `LICENSE`.
