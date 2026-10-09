/* Adapted from Kargul Studio's sales-crm sidebar/resizer (MIT).
   Copyright (c) 2026 Kargul Studio; see licenses/KargulStudio.txt. */
(() => {
  const root = document.documentElement;
  const sidebar = document.getElementById('clientSidebar');
  const resizer = document.getElementById('sidebarResizer');
  const drawer = document.getElementById('navigationDrawer');
  const openButton = document.getElementById('openNavigation');
  const closeButton = document.getElementById('closeNavigation');
  if (!sidebar || !resizer || !drawer) return;
  const mobile = matchMedia('(max-width:1023px)');
  const reduce = matchMedia('(prefers-reduced-motion:reduce)');
  const widthKey = 'shortlist-client-sidebar-width';
  let width = parseInt(getComputedStyle(root).getPropertyValue('--client-sidebar-width'), 10) || 254;
  let drag = null, closeTimer;
  function applyWidth(next) {
    width = Math.round(Math.min(400, Math.max(200, next)));
    root.style.setProperty('--client-sidebar-width', `${width}px`);
    resizer.setAttribute('aria-valuenow', width);
    resizer.setAttribute('aria-valuetext', `${width} pixels`);
  }
  function saveWidth() { try { localStorage.setItem(widthKey, width); } catch {} }
  applyWidth(width);
  resizer.addEventListener('pointerdown', e => {
    if (e.button !== 0) return;
    e.preventDefault(); resizer.focus({preventScroll:true});
    resizer.setPointerCapture(e.pointerId);
    drag = {x:e.clientX,width}; root.dataset.sidebarResizing = '';
  });
  resizer.addEventListener('pointermove', e => { if (drag) applyWidth(drag.width + e.clientX - drag.x); });
  function endDrag(e) {
    if (!drag) return; drag = null;
    if (resizer.hasPointerCapture(e.pointerId)) resizer.releasePointerCapture(e.pointerId);
    delete root.dataset.sidebarResizing; saveWidth();
  }
  resizer.addEventListener('pointerup', endDrag); resizer.addEventListener('pointercancel', endDrag);
  resizer.addEventListener('lostpointercapture', endDrag);
  resizer.addEventListener('dblclick', () => { applyWidth(254); saveWidth(); });
  resizer.addEventListener('keydown', e => {
    const next = {ArrowLeft:width-10,ArrowRight:width+10,Home:200,End:400};
    if (!(e.key in next)) return;
    e.preventDefault(); applyWidth(next[e.key]); saveWidth();
  });
  function finishClose(focus) {
    clearTimeout(closeTimer); delete drawer.dataset.closing;
    if (drawer.open) drawer.close();
    openButton.setAttribute('aria-expanded','false');
    document.body.style.overflow = '';
    if (focus && !mobile.matches) return;
    if (focus) focus.focus({preventScroll:true});
  }
  function closeDrawer(focus = openButton) {
    if (!drawer.open || drawer.dataset.closing !== undefined) return;
    drawer.dataset.closing = ''; openButton.setAttribute('aria-expanded','false');
    closeTimer = setTimeout(() => finishClose(focus), reduce.matches ? 0 : 250);
  }
  openButton.addEventListener('click', () => {
    if (!mobile.matches) return;
    clearTimeout(closeTimer); delete drawer.dataset.closing;
    if (!drawer.open) drawer.showModal();
    document.body.style.overflow = 'hidden'; openButton.setAttribute('aria-expanded','true');
    sidebar.querySelector('.ptab[aria-selected="true"]')?.focus({preventScroll:true});
  });
  closeButton.addEventListener('click', () => closeDrawer());
  drawer.addEventListener('cancel', e => { e.preventDefault(); closeDrawer(); });
  drawer.addEventListener('click', e => {
    if (e.target === drawer) {
      const r = drawer.getBoundingClientRect();
      if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) closeDrawer();
    }
    const action = e.target.closest('.ptab,[data-goto]');
    if (action) {
      const id = action.getAttribute('aria-controls') || action.dataset.goto;
      closeDrawer(document.querySelector(`#${id} h1`));
    }
  });
  function adapt() {
    finishClose(null);
    if (mobile.matches) drawer.append(sidebar);
    else resizer.before(sidebar);
  }
  adapt(); mobile.addEventListener('change', adapt);
  document.getElementById('headerSearch').setAttribute('aria-keyshortcuts','Meta+K Control+K');
  document.addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      if (document.querySelector('dialog[open]:not(#navigationDrawer)')) return;
      e.preventDefault(); finishClose(null); document.getElementById('headerSearch').click();
    }
  });
})();
