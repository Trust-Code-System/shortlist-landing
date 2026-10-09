(() => {
  const { $, esc, validate, isEmail, busy, liveClear, wait } = Flow;
  liveClear(document);
  const kind = document.body.dataset.clientFlow;
  const error = $("#formError");
  const fail = (e) => {
    error.textContent =
      e?.name === "QuotaExceededError"
        ? "The preview could not be saved. Free some browser storage and try again."
        : "The preview could not be saved in this browser. Please try again.";
  };
  const saved = ClientPreview.read();
  if ($("#name")) $("#name").value = saved.profile?.name || "";
  if ($("#email")) $("#email").value = saved.profile?.email || "";
  if (kind === "signup") {
    $("#signupForm").addEventListener("submit", (e) => {
      e.preventDefault();
      error.textContent = "";
      if (
        !validate([
          [
            $("#name"),
            $("#name").value.trim().split(/\s+/).length < 2
              ? "Enter your first and last name"
              : "",
          ],
          [
            $("#email"),
            isEmail($("#email").value) ? "" : "Enter a valid email address",
          ],
        ])
      )
        return;
      try {
        ClientPreview.profile($("#name").value, $("#email").value);
        location.href = "tracker.html#overview";
      } catch (e) {
        fail(e);
      }
    });
  }
  if (kind === "upload") {
    let cv = null,
      supporting = [];
    const max = 10 * 1024 * 1024,
      ext = (f) => f.name.split(".").pop().toLowerCase();
    function accept(files, kind) {
      error.textContent = "";
      if (kind === "cv" && files.length > 1) {
        error.textContent =
          "Choose one CV. Add other files under Supporting documents.";
        return;
      }
      const allowed =
        kind === "cv"
          ? ["pdf", "doc", "docx"]
          : ["pdf", "doc", "docx", "png", "jpg", "jpeg"];
      for (const file of files) {
        if (file.size > max || !file.size || !allowed.includes(ext(file))) {
          error.textContent = `Choose a ${kind === "cv" ? "PDF or Word file" : "PDF, Word or image file"} under 10 MB. Empty files aren’t accepted.`;
          return;
        }
      }
      if (kind === "cv") cv = files[0] || null;
      else {
        if (files.length > 8) {
          error.textContent = "Choose up to 8 supporting documents.";
          return;
        }
        supporting = [...files];
      }
      $("#cvFiles").innerHTML = cv
        ? `<li>${esc(cv.name)} · ${(cv.size / 1024).toFixed(0)} KB</li>`
        : "";
      $("#supportingFiles").innerHTML = supporting
        .map(
          (f) => `<li>${esc(f.name)} · ${(f.size / 1024).toFixed(0)} KB</li>`,
        )
        .join("");
      if (cv) Flow.setError($("#cvDrop"), "");
    }
    for (const [id, kind] of [
      ["cv", "cv"],
      ["supporting", "supporting"],
    ]) {
      const input = $("#" + id + "Input"),
        drop = $("#" + id + "Drop");
      input.addEventListener("change", () => accept([...input.files], kind));
      drop.addEventListener("dragover", (e) => {
        e.preventDefault();
        drop.classList.add("over");
      });
      drop.addEventListener("dragleave", () => drop.classList.remove("over"));
      drop.addEventListener("drop", (e) => {
        e.preventDefault();
        drop.classList.remove("over");
        accept([...e.dataTransfer.files], kind);
      });
    }
    $("#uploadForm").addEventListener("submit", async (e) => {
      e.preventDefault();
      error.textContent = "";
      if (
        !validate([
          [$("#cvDrop"), cv ? "" : "Choose your CV before continuing"],
        ])
      )
        return;
      const button = $("#saveUpload");
      busy(button, true);
      try {
        await wait(250);
        const files = [
          { name: cv.name, size: cv.size, kind: "cv" },
          ...supporting.map((f) => ({
            name: f.name,
            size: f.size,
            kind: "supporting",
          })),
        ];
        ClientPreview.save({
          submission: {
            files,
            notes: $("#notes").value.trim(),
            at: new Date().toISOString(),
          },
        });
        $("#uploadDone").hidden = false;
        $("#uploadDone").focus({ preventScroll: true });
      } catch (e) {
        fail(e);
      } finally {
        busy(button, false);
      }
    });
  }
  if (kind === "payment") {
    const packages = {
      readiness: { name: "Readiness", amount: 60000 },
      starter: { name: "Starter", amount: 45000 },
      standard: { name: "Standard", amount: 180000 },
      full: { name: "Full Service", amount: 300000 },
    };
    const chosen = new URLSearchParams(location.search).get("plan");
    if (packages[chosen]) $("#package").value = chosen;
    const money = (n) => "₦" + n.toLocaleString("en-NG");
    function render() {
      const p = packages[$("#package").value] || packages.standard;
      $("#sumPackage").textContent = p.name;
      $("#sumPrice").textContent = money(p.amount);
      $("#payButtonText").textContent = "Preview payment · " + money(p.amount);
    }
    $("#package").addEventListener("change", render);
    render();
    $("#paymentForm").addEventListener("submit", async (e) => {
      e.preventDefault();
      error.textContent = "";
      if (
        !validate([
          [
            $("#name"),
            $("#name").value.trim().split(/\s+/).length < 2
              ? "Enter your first and last name"
              : "",
          ],
          [
            $("#email"),
            isEmail($("#email").value) ? "" : "Enter a valid email address",
          ],
        ])
      )
        return;
      const button = $("#payBtn");
      busy(button, true);
      try {
        await wait(400);
        const p = packages[$("#package").value] || packages.standard;
        ClientPreview.profile($("#name").value, $("#email").value);
        const payment = {
          demo: true,
          package: p.name,
          amount: p.amount,
          currency: "NGN",
          ref: "PREVIEW-" + Date.now().toString(36).toUpperCase(),
          at: new Date().toISOString(),
        };
        ClientPreview.save({ payment });
        $("#receiptRef").textContent = payment.ref;
        $("#paymentDone").hidden = false;
        $("#paymentDone").focus({ preventScroll: true });
      } catch (e) {
        fail(e);
      } finally {
        busy(button, false);
      }
    });
  }
})();
