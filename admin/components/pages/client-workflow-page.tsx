"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import PageHeader from "@/components/_common/page/page-header";
import PageShell from "@/components/_common/page/page-shell";
import DataTable, { type Column } from "@/components/_common/page/data-table";
import StatStrip from "@/components/_common/page/stat-strip";
import { ClientCell } from "@/components/_common/page/cells";
import Button from "@/components/_ui/button";
import Field from "@/components/_ui/field";
import { Input } from "@/components/_ui/input";
import Tag from "@/components/_ui/tag";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/_ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/_ui/select";
import { COMPANIES, TAG_TONES, type Company } from "@/data/companies";
import { PAYMENTS, packageOf } from "@/data/ops";
import {
  useAdminPreviewStore,
  hasSubmission,
  validMeetUrl,
  type ReviewStatus,
} from "@/stores/admin-preview-store";

type View = "clients" | "documents" | "preparation";
const TITLES: Record<View, string> = {
  clients: "Clients",
  documents: "Document review",
  preparation: "Preparation",
};

export default function ClientWorkflowPage({
  view = "clients",
}: {
  view?: View;
}) {
  const { records } = useAdminPreviewStore();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState<Company | null>(null);
  const opener = useRef<HTMLElement | null>(null);
  const [error, setError] = useState("");
  const errorMessage = useRef<HTMLParagraphElement | null>(null);
  useEffect(() => {
    useAdminPreviewStore.persist.rehydrate();
  }, []);
  useEffect(() => {
    if (error) errorMessage.current?.focus();
  }, [error]);
  const status = (client: Company) =>
    hasSubmission(client.id)
      ? (records[client.id]?.review ?? "Pending review")
      : "Awaiting upload";
  const approved = COMPANIES.filter((client) => status(client) === "Approved");
  const rows = COMPANIES.filter((client) => {
    if (view === "documents" && !hasSubmission(client.id)) return false;
    if (view === "preparation" && status(client) !== "Approved") return false;
    if (filter !== "all" && status(client) !== filter) return false;
    return client.name.toLowerCase().includes(query.trim().toLowerCase());
  });
  const columns: Column<Company>[] = [
    {
      key: "client",
      label: "Client",
      render: (client) => <ClientCell name={client.name} />,
    },
    {
      key: "package",
      label: "Package",
      render: (client) => (
        <Tag tone={TAG_TONES[packageOf(client)]}>{packageOf(client)}</Tag>
      ),
    },
    {
      key: "documents",
      label: "Documents",
      render: (client) => (
        <span className="text-soft">
          {hasSubmission(client.id)
            ? "CV + supporting document"
            : "No upload yet"}
        </span>
      ),
    },
    {
      key: "review",
      label: "Review",
      render: (client) => (
        <Tag
          tone={
            status(client) === "Approved"
              ? "green"
              : status(client) === "Changes requested"
                ? "orange"
                : "neutral"
          }
        >
          {status(client)}
        </Tag>
      ),
    },
    {
      key: "preparation",
      label: "Preparation",
      render: (client) => (
        <span className="text-soft">
          {records[client.id]?.invite
            ? "Invite saved · preview"
            : status(client) === "Approved"
              ? "Ready to schedule"
              : "After document approval"}
        </span>
      ),
    },
    {
      key: "payment",
      label: "Payment",
      render: (client) => (
        <span className="text-soft">
          {PAYMENTS.find((item) => item.clientId === client.id)?.status ??
            "No payment"}
        </span>
      ),
    },
  ];
  return (
    <PageShell
      header={<PageHeader title={TITLES[view]} status="Local preview" />}
      toolbar={
        <>
          <div className="flex flex-wrap items-center gap-2">
            <Input
              type="search"
              aria-label="Search clients"
              placeholder="Find a client…"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="w-[220px] max-w-full"
            />
            {view !== "preparation" && (
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger
                  aria-label="Filter by review status"
                  className="w-[185px]"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[
                    "all",
                    "Awaiting upload",
                    "Pending review",
                    "Approved",
                    "Changes requested",
                  ].map((value) => (
                    <SelectItem key={value} value={value}>
                      {value === "all" ? "All review statuses" : value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
          <span className="caption-style text-soft">
            Sample records · no client submissions or emails
          </span>
        </>
      }
    >
      <StatStrip
        stats={[
          { label: "Sample clients", value: COMPANIES.length },
          {
            label: "Awaiting review",
            value: COMPANIES.filter(
              (client) => status(client) === "Pending review",
            ).length,
          },
          { label: "Approved for preparation", value: approved.length },
          {
            label: "Preview invites",
            value: approved.filter((client) => records[client.id]?.invite)
              .length,
          },
        ]}
      />
      {view === "preparation" && (
        <div className="caption-style border-border text-soft flex flex-wrap items-center justify-between gap-3 border-b px-4 py-3">
          <p>
            Approve documents first, then save a Google Meet invite. Preview
            invites stay in this browser.
          </p>
          <Button href="/document-review" size="sm">
            Review documents
          </Button>
        </div>
      )}
      <DataTable
        columns={columns}
        rows={rows}
        rowKey={(client) => client.id}
        onRowClick={(client) => {
          opener.current = document.activeElement as HTMLElement;
          setError("");
          setSelected(client);
        }}
        rowLabel={(client) => `Open ${client.name}`}
        countLabel="Sample clients in view"
        empty={
          view === "preparation"
            ? "No matching approved clients. Review documents to get started."
            : "No clients match this view."
        }
      />
      <Dialog
        open={!!selected}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
        }}
      >
        {selected && (
          <DialogContent
            onCloseAutoFocus={(event) => {
              event.preventDefault();
              opener.current?.focus();
            }}
          >
            <DialogHeader>
              <DialogTitle>{selected.name}</DialogTitle>
              <DialogDescription>
                Local workflow preview. Review decisions and invites are saved
                on this browser only.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-5 p-6">
              <div className="flex items-center gap-2">
                <Tag tone={TAG_TONES[packageOf(selected)]}>
                  {packageOf(selected)}
                </Tag>
                <Tag tone="neutral">{status(selected)}</Tag>
              </div>
              {hasSubmission(selected.id) ? (
                <>
                  <section
                    aria-label="Sample documents"
                    className="border-line-strong bg-card rounded-xl border p-4"
                  >
                    <h3>Submitted documents</h3>
                    <p className="text-soft mt-2 text-[13px] leading-6">
                      CV.pdf · Supporting-document.pdf
                    </p>
                    <p className="caption-style text-soft mt-2">
                      Fixture filenames for testing. Actual uploaded files and
                      document viewing will be connected with the backend.
                    </p>
                  </section>
                  <ReviewForm
                    key={`review-${selected.id}`}
                    clientId={selected.id}
                    onError={setError}
                  />
                  <PreparationForm
                    key={`prep-${selected.id}`}
                    clientId={selected.id}
                    onError={setError}
                  />
                </>
              ) : (
                <p className="text-soft text-[14px] leading-6">
                  Awaiting the client’s CV and supporting documents. There is
                  nothing to review yet.
                </p>
              )}
              {error && (
                <p
                  ref={errorMessage}
                  role="alert"
                  tabIndex={-1}
                  className="text-danger focus-visible:ring-ring rounded-lg text-[13px] outline-none focus-visible:ring-2"
                >
                  {error}
                </p>
              )}
              <Button href="/payments" variant="secondary" size="md">
                View payments
              </Button>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </PageShell>
  );
}

function ReviewForm({
  clientId,
  onError,
}: {
  clientId: string;
  onError: (value: string) => void;
}) {
  const record = useAdminPreviewStore((state) => state.records[clientId]);
  const saveReview = useAdminPreviewStore((state) => state.saveReview);
  const [decision, setDecision] = useState<ReviewStatus>(
    record?.review ?? "Pending review",
  );
  const [note, setNote] = useState(record?.note ?? "");
  const [saved, setSaved] = useState(false);
  function submit(event: FormEvent) {
    event.preventDefault();
    onError("");
    setSaved(false);
    try {
      saveReview(clientId, decision, note);
      setSaved(true);
    } catch (err) {
      onError(
        err instanceof Error
          ? err.message
          : "Unable to save this preview review.",
      );
    }
  }
  return (
    <form onSubmit={submit} className="flex flex-col gap-3">
      <h3>Document review</h3>
      <Field label="Review decision" htmlFor="review-decision">
        <Select
          value={decision}
          onValueChange={(value) => {
            setDecision(value as ReviewStatus);
            setSaved(false);
          }}
        >
          <SelectTrigger id="review-decision">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {["Pending review", "Approved", "Changes requested"].map(
              (value) => (
                <SelectItem key={value} value={value}>
                  {value}
                </SelectItem>
              ),
            )}
          </SelectContent>
        </Select>
      </Field>
      <Field
        label="Review note"
        htmlFor="review-note"
        hint="Include the changes needed if requesting a revision."
      >
        <textarea
          id="review-note"
          value={note}
          maxLength={1500}
          onChange={(event) => {
            setNote(event.target.value);
            setSaved(false);
          }}
          aria-describedby="review-note-hint"
          rows={3}
          className="border-line-strong bg-secondary focus-visible:outline-ring w-full resize-y rounded-lg border p-3 text-[14px] focus-visible:outline-2"
        />
      </Field>
      <Button type="submit" variant="primary" size="md">
        Save preview review
      </Button>
      {saved && (
        <p role="status" className="caption-style text-soft">
          Preview review saved. No update was sent to the client.
        </p>
      )}
    </form>
  );
}

function PreparationForm({
  clientId,
  onError,
}: {
  clientId: string;
  onError: (value: string) => void;
}) {
  const record = useAdminPreviewStore((state) => state.records[clientId]);
  const saveInvite = useAdminPreviewStore((state) => state.saveInvite);
  const [url, setUrl] = useState(record?.invite?.url ?? "");
  const [date, setDate] = useState(record?.invite?.date ?? "");
  const [saved, setSaved] = useState(false);
  function submit(event: FormEvent) {
    event.preventDefault();
    onError("");
    setSaved(false);
    try {
      saveInvite(clientId, url.trim(), date);
      setSaved(true);
    } catch (err) {
      onError(
        err instanceof Error
          ? err.message
          : "Unable to save this preview invite.",
      );
    }
  }
  if (record?.review !== "Approved")
    return (
      <section className="border-border border-t pt-4">
        <h3>Preparation invite</h3>
        <p className="caption-style text-soft mt-2">
          Approve the documents to add a Google Meet preparation invite.
        </p>
      </section>
    );
  return (
    <form
      onSubmit={submit}
      noValidate
      className="border-border flex flex-col gap-3 border-t pt-4"
    >
      <h3>Preparation invite</h3>
      <Field label="Google Meet link" htmlFor="meet-url">
        <Input
          id="meet-url"
          type="url"
          placeholder="https://meet.google.com/abc-defg-hij"
          value={url}
          onChange={(event) => {
            setUrl(event.target.value);
            setSaved(false);
          }}
        />
      </Field>
      <Field
        label="Date and time"
        htmlFor="meet-date"
        hint="Uses your browser’s local time zone."
      >
        <Input
          id="meet-date"
          type="datetime-local"
          value={date}
          onChange={(event) => {
            setDate(event.target.value);
            setSaved(false);
          }}
          aria-describedby="meet-date-hint"
        />
      </Field>
      <Button type="submit" variant="primary" size="md">
        Save preview invite
      </Button>
      {saved && (
        <p role="status" className="caption-style text-soft">
          Preview invite saved. No calendar event or email was sent.
        </p>
      )}
      {record.invite && validMeetUrl(record.invite.url) && (
        <a
          href={record.invite.url}
          target="_blank"
          rel="noopener noreferrer"
          className="caption-style underline underline-offset-4"
        >
          Open saved Google Meet link
        </a>
      )}
    </form>
  );
}
