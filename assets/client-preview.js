/* Local UI preview only. This is never authentication, payment verification,
   document storage or evidence of an admin review. File contents are not saved. */
(() => {
  const KEY = "shortlist-client-preview-v1";
  const read = () => {
    try {
      const data = JSON.parse(localStorage.getItem(KEY) || "{}");
      return data && typeof data === "object" && !Array.isArray(data)
        ? data
        : {};
    } catch {
      return {};
    }
  };
  function save(change) {
    const next = { ...read(), ...change };
    localStorage.setItem(KEY, JSON.stringify(next));
    window.dispatchEvent(new Event("client-preview-change"));
    return next;
  }
  function profile(name, email) {
    const previous = read();
    const normalizedEmail = email.trim().toLowerCase();
    if (previous.profile?.email && previous.profile.email !== normalizedEmail)
      localStorage.removeItem(KEY);
    return save({
      profile: { name: name.trim(), email: normalizedEmail },
    });
  }
  window.ClientPreview = { read, save, profile };
})();
