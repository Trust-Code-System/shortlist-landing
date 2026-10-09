/* Shortlist: shared helpers for the booking and checkout flows. */
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const wait = ms => new Promise(r => setTimeout(r, ms));

  /* Steps: panels are [data-step="id"], stepper items are [data-step-ind="id"]. */
  function goTo(id, { focus = true } = {}) {
    const panels = $$('[data-step]');
    const order = panels.map(p => p.dataset.step);
    const idx = order.indexOf(id);
    panels.forEach(p => {
      const on = p.dataset.step === id;
      p.classList.toggle('active', on);
      p.hidden = !on;
    });
    $$('[data-step-ind]').forEach(li => {
      const i = order.indexOf(li.dataset.stepInd);
      li.classList.toggle('done', i < idx);
      if (i === idx) li.setAttribute('aria-current', 'step'); else li.removeAttribute('aria-current');
      const n = $('.n', li);
      if (n) n.textContent = i < idx ? '✓' : String(i + 1);
    });
    const mobile = $('.stepper-m');
    const cur = $(`[data-step-ind="${id}"]`);
    if (mobile && cur) mobile.innerHTML = `Step ${idx + 1} of ${$$('[data-step-ind]').length} · <b>${cur.dataset.label}</b>`;
    const bar = $('.progress i');
    if (bar) bar.style.transform = `scaleX(${(idx + 1) / order.length})`;
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
    if (focus) { const h = $(`[data-step="${id}"] h1`); if (h) { h.tabIndex = -1; setTimeout(() => h.focus({ preventScroll: true }), 60); } }
    document.title = `${cur ? cur.dataset.label + ' · ' : ''}${document.body.dataset.title}`;
  }

  /* Field errors: an element #err-<id> holds the message; aria wiring is set here. */
  function setError(el, msg) {
    const id = el.id || el.dataset.errId;
    const box = document.getElementById('err-' + id);
    el.setAttribute('aria-invalid', msg ? 'true' : 'false');
    if (box) {
      box.textContent = msg || '';
      const d = new Set((el.getAttribute('aria-describedby') || '').split(' ').filter(Boolean));
      d.add(box.id); el.setAttribute('aria-describedby', [...d].join(' '));
    }
    return !msg;
  }
  /* Run checks in order; focus the first failing field. checks: [[el, message-or-empty]] */
  function validate(checks) {
    let first = null;
    checks.forEach(([el, msg]) => { if (!setError(el, msg) && !first) first = el; });
    if (first) {
      const target = first.matches('input,select,textarea,button,[tabindex]') ? first : $('input,button', first);
      target && target.focus();
      return false;
    }
    return true;
  }
  /* Clear an error as soon as the person fixes the field. */
  function liveClear(root = document) {
    root.addEventListener('input', e => { if (e.target.getAttribute('aria-invalid') === 'true') setError(e.target, ''); });
    root.addEventListener('change', e => {
      const group = e.target.closest('[role="radiogroup"]');
      if (group && group.getAttribute('aria-invalid') === 'true') setError(group, '');
      if (e.target.getAttribute('aria-invalid') === 'true') setError(e.target, '');
    });
  }

  function busy(btn, on) {
    btn.setAttribute('aria-busy', on ? 'true' : 'false');
    btn.disabled = !!on;
  }

  const isEmail = v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());
  const digits = v => v.replace(/\D/g, '');
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const qs = new URLSearchParams(location.search);

  window.Flow = { $, $$, wait, reduce, goTo, setError, validate, liveClear, busy, isEmail, digits, esc, qs };
})();
