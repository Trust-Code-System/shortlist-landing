export type NotificationKind =
  | "mention"
  | "stage"
  | "alert"
  | "update"
  | "invite";

export type Notification = {
  id: string;
  kind: NotificationKind;
  actor?: string;
  companyId: string;
  message: string;
  quote?: string;
  time: string;
  unread: boolean;
};

export const NOTIFICATIONS: Notification[] = [
  {
    id: "n1",
    kind: "mention",
    actor: "Ngozi Eze",
    companyId: "adaeze-okafor",
    message: "mentioned you on Adaeze Okafor",
    quote:
      "She has two UK interviews coming up. Can we upgrade her to Full Service so she gets mock interviews?",
    time: "2m ago",
    unread: true,
  },
  {
    id: "n2",
    kind: "stage",
    actor: "Tunde Bakare",
    companyId: "chinedu-okeke",
    message: "moved Chinedu Okeke to Interviewing",
    time: "18m ago",
    unread: true,
  },
  {
    id: "n3",
    kind: "alert",
    companyId: "segun-afolabi",
    message: "Segun Afolabi hasn’t replied in 41 days. Applications are paused.",
    time: "1h ago",
    unread: true,
  },
  {
    id: "n4",
    kind: "alert",
    companyId: "blessing-udoh",
    message: "Agreement for Blessing Udoh is still unsigned after 2 days",
    time: "2h ago",
    unread: true,
  },
  {
    id: "n5",
    kind: "update",
    actor: "Amaka Obi",
    companyId: "fatima-sule",
    message: "sent the first CV draft to Fatima Sule",
    time: "3h ago",
    unread: false,
  },
  {
    id: "n6",
    kind: "update",
    actor: "Seyi Adeyemi",
    companyId: "ibrahim-musa",
    message: "logged an offer for Ibrahim Musa",
    time: "Yesterday",
    unread: false,
  },
  {
    id: "n7",
    kind: "invite",
    actor: "Emeka Okonkwo",
    companyId: "obinna-chukwu",
    message: "assigned you to Obinna Chukwu’s intake call",
    time: "2d ago",
    unread: false,
  },
];
