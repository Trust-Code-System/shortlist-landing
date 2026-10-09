(() => {
  const { $, $$, esc, reduce } = Flow;
  const tabs = $$(".ptab");
  function show(id, focus = false) {
    if (!tabs.some((t) => t.getAttribute("aria-controls") === id)) return;
    for (const tab of tabs) {
      const on = tab.getAttribute("aria-controls") === id;
      tab.setAttribute("aria-selected", on);
      tab.tabIndex = on ? 0 : -1;
      const panel = $("#" + tab.getAttribute("aria-controls"));
      panel.hidden = !on;
      panel.classList.toggle("active", on);
    }
    const tab = tabs.find((t) => t.getAttribute("aria-controls") === id);
    $("#currentSection").textContent =
      tab.querySelector("span:nth-child(2)").textContent;
    document.title = `${$("#currentSection").textContent} · Shortlist`;
    history.replaceState(null, "", "#" + id);
    window.scrollTo({
      top: 0,
      behavior:
        reduce || document.body.classList.contains("keyboard-nav")
          ? "auto"
          : "smooth",
    });
    if (focus) $("#" + id + " h1")?.focus({ preventScroll: true });
  }
  tabs.forEach((tab, i) => {
    tab.addEventListener("click", () =>
      show(tab.getAttribute("aria-controls"), true),
    );
    tab.addEventListener("keydown", (e) => {
      const next = {
        ArrowDown: (i + 1) % tabs.length,
        ArrowUp: (i - 1 + tabs.length) % tabs.length,
        Home: 0,
        End: tabs.length - 1,
      }[e.key];
      if (next === undefined) return;
      e.preventDefault();
      tabs[next].focus();
      show(tabs[next].getAttribute("aria-controls"));
    });
  });
  $$("[data-goto]").forEach((el) =>
    el.addEventListener("click", () => show(el.dataset.goto, true)),
  );
  $("#headerSearch").addEventListener("click", () => {
    show("documents");
    $("#docSearch").focus({ preventScroll: true });
  });
  window.addEventListener("hashchange", () =>
    show(location.hash.slice(1) || "overview"),
  );
  show(
    tabs.some((t) => t.getAttribute("aria-controls") === location.hash.slice(1))
      ? location.hash.slice(1)
      : "overview",
  );
  function stamp(value) {
    const date = new Date(value);
    return Number.isNaN(date.getTime())
      ? ""
      : date.toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
          timeZone: "Africa/Lagos",
        });
  }
  function renderFiles() {
    const data = ClientPreview.read();
    const files = Array.isArray(data.submission?.files)
      ? data.submission.files
      : [];
    const query = $("#docSearch").value.trim().toLowerCase();
    const matching = files.filter(
      (f) =>
        f && typeof f.name === "string" && f.name.toLowerCase().includes(query),
    );
    $("#uploadedFiles").innerHTML = matching
      .map(
        (f) =>
          `<li><span class="doc-ic" aria-hidden="true">${esc(f.name.split(".").pop().slice(0, 4).toUpperCase())}</span><div><b>${esc(f.name)}</b><small>${esc(f.kind === "cv" ? "CV" : "Supporting document")} · ${esc(stamp(data.submission.at))} · preview</small></div></li>`,
      )
      .join("");
    $("#documentEmpty").hidden = files.length > 0;
    $("#documentSearchEmpty").hidden = !files.length || matching.length > 0;
    $("#docCount").textContent = files.length
      ? `${matching.length} of ${files.length} preview files`
      : "No documents added yet";
  }
  function render() {
    const data = ClientPreview.read(),
      profile = data.profile;
    const fullName =
      typeof profile?.name === "string" && profile.name.trim()
        ? profile.name
        : "Adaeze Okafor";
    const first = fullName.split(" ")[0],
      initials = fullName
        .split(/\s+/)
        .slice(0, 2)
        .map((x) => x[0])
        .join("")
        .toUpperCase();
    $$("[data-client-name]").forEach((el) => (el.textContent = fullName));
    $$("[data-client-first]").forEach((el) => (el.textContent = first));
    $$("[data-client-initials]").forEach((el) => (el.textContent = initials));
    $("#profileButton").setAttribute(
      "aria-label",
      `${fullName}, view your overview`,
    );
    $("#accountStatus").textContent = profile
      ? "Preview created"
      : "Get started";
    const hasFiles =
      Array.isArray(data.submission?.files) && data.submission.files.length > 0;
    $("#uploadStatus").textContent = hasFiles ? "Ready" : "Not yet";
    $("#reviewStatus").textContent = hasFiles ? "Pending" : "Not yet";
    $$("[data-review-copy]").forEach(
      (el) =>
        (el.textContent = hasFiles
          ? "Your preview submission is ready for admin review. Files have not been sent to the team."
          : "Upload your CV and supporting documents first. The team will review them before arranging preparation."),
    );
    $("#overviewFiles").textContent = hasFiles
      ? `${data.submission.files.length} file${data.submission.files.length === 1 ? "" : "s"} selected in your preview`
      : "CV and supporting documents";
    const payment = data.payment?.demo === true ? data.payment : null;
    $("#paymentStatus").textContent = payment ? "Preview" : "Not yet";
    $("#paymentHistory").hidden = !payment;
    $("#paymentEmpty").hidden = !!payment;
    if (payment) {
      $("#paymentRef").textContent = payment.ref;
      $("#paymentAmount").textContent = new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: payment.currency === "USD" ? "USD" : "NGN",
        maximumFractionDigits: 0,
      }).format(Number(payment.amount) || 0);
      $("#paymentDate").textContent = stamp(payment.at);
      $("#paymentPackage").textContent = payment.package;
    }
    $("#signupPrompt").hidden = !!profile;
    const invite = data.invite;
    let meet;
    try {
      const url = new URL(invite?.url);
      if (
        url.protocol === "https:" &&
        url.hostname === "meet.google.com" &&
        !url.username &&
        !url.password &&
        !url.search &&
        !url.hash &&
        /^\/[a-z]{3}-[a-z]{4}-[a-z]{3}$/.test(url.pathname)
      )
        meet = url.href;
    } catch {}
    const validInvite =
      !!meet && Number.isFinite(new Date(invite?.at).getTime());
    $("#prepEmpty").hidden = validInvite;
    $("#prepInvite").hidden = !validInvite;
    $("#prepStatus").textContent = validInvite ? "Ready" : "Not yet";
    if (validInvite) {
      $("#meetLink").href = meet;
      $("#inviteDate").textContent =
        new Date(invite.at).toLocaleString("en-GB", {
          dateStyle: "full",
          timeStyle: "short",
          timeZone: "Africa/Lagos",
        }) + " WAT";
      $("#inviteTitle").textContent =
        typeof invite.title === "string"
          ? invite.title
          : "Your preparation session";
    }
    renderFiles();
  }
  $("#docSearch").addEventListener("input", renderFiles);
  window.addEventListener("client-preview-change", render);
  window.addEventListener("storage", render);
  window.addEventListener("pageshow", render);
  render();
})();
