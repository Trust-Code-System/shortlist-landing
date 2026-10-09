import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type ReviewStatus = "Pending review" | "Approved" | "Changes requested";
export type PreviewRecord = {
  review: ReviewStatus;
  note: string;
  invite?: { url: string; date: string };
};

// Only these sample clients have fixture submissions. No real files are stored here.
export const SAMPLE_SUBMISSIONS = [
  "adaeze-okafor",
  "chinedu-okeke",
  "ibrahim-musa",
];
export function hasSubmission(id: string) {
  return SAMPLE_SUBMISSIONS.includes(id);
}
export function validMeetUrl(value: string) {
  try {
    const url = new URL(value);
    return (
      url.protocol === "https:" &&
      url.hostname === "meet.google.com" &&
      !url.port &&
      !url.username &&
      !url.password &&
      !url.search &&
      !url.hash &&
      /^\/[a-z]{3}-[a-z]{4}-[a-z]{3}$/.test(url.pathname)
    );
  } catch {
    return false;
  }
}

type PreviewState = {
  records: Record<string, PreviewRecord>;
  saveReview: (id: string, review: ReviewStatus, note: string) => void;
  saveInvite: (id: string, url: string, date: string) => void;
};

export const useAdminPreviewStore = create<PreviewState>()(
  persist(
    (set, get) => ({
      records: {},
      saveReview: (id, review, note) => {
        if (!hasSubmission(id))
          throw new Error("This sample client has no submission to review.");
        if (review === "Changes requested" && !note.trim())
          throw new Error("Add a note about the changes needed.");
        set((state) => ({
          records: {
            ...state.records,
            [id]: {
              ...state.records[id],
              review,
              note: note.trim(),
              invite:
                review === "Approved" ? state.records[id]?.invite : undefined,
            },
          },
        }));
      },
      saveInvite: (id, url, date) => {
        const record = get().records[id];
        if (record?.review !== "Approved")
          throw new Error(
            "Approve the documents before adding a preparation invite.",
          );
        if (!validMeetUrl(url))
          throw new Error(
            "Use a Google Meet link such as https://meet.google.com/abc-defg-hij.",
          );
        if (
          !Number.isFinite(Date.parse(date)) ||
          Date.parse(date) <= Date.now()
        )
          throw new Error("Choose a future preparation date and time.");
        set((state) => ({
          records: {
            ...state.records,
            [id]: { ...record, invite: { url, date } },
          },
        }));
      },
    }),
    {
      name: "shortlist-admin-preview-v1",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ records: state.records }),
      skipHydration: true,
    },
  ),
);
