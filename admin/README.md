# Shortlist Admin

Internal client-operations dashboard for the Shortlist team: every client, their package and stage, assigned specialist, applications sent, response rate and latest touchpoint.

> **Sample data only.** Every client, specialist and figure in `data/` is invented. There is no login and no database yet, so do not put real client information in this app until authentication and a backend are added.

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Where things live

| Path | What it is |
| --- | --- |
| `data/companies.ts` | Sample clients, specialists, packages and stages |
| `data/notifications.ts` | Sample activity feed (bookings, payments, agreements, interviews) |
| `components/companies/` | Clients table, detail panel, new-client form, search, profile |
| `components/_common/sidebar/` | Navigation |

Internal identifiers still use the original CRM names (`Company`, `openDeals`, `pipelineValue`, `winProbability`). In this app they mean client, applications sent, monthly value (NGN) and response rate.

## Credit

Built on [kargulstudio/sales-crm](https://github.com/kargulstudio/sales-crm) (MIT License, © 2026 Kargul Studio). The original licence is kept in `LICENSE`.
