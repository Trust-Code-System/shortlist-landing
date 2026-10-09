/* Progressive enhancement: the original select remains the form's source of truth. */
(() => {
  let openControl = null;
  let nextId = 0;
  const controls = new WeakMap();
  const chevron = '<svg class="select-chevron" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="m2 4 4 4 4-4"/></svg>';

  function enhance(select) {
    if (controls.has(select) || select.multiple || select.size > 1) return;
    const id = select.id || `client-select-${++nextId}`;
    select.id = id;
    const trigger = document.createElement('button');
    trigger.type = 'button'; trigger.id = `${id}-combobox`; trigger.className = 'select-control';
    trigger.setAttribute('role', 'combobox');
    trigger.setAttribute('aria-haspopup', 'listbox');
    trigger.setAttribute('aria-expanded', 'false');
    trigger.innerHTML = `<span class="select-value"></span>${chevron}`;
    const value = trigger.querySelector('.select-value');
    const menu = document.createElement('div');
    menu.id = `${id}-listbox`; menu.className = 'select-menu'; menu.role = 'listbox'; menu.hidden = true;
    const label = [...document.querySelectorAll('label[for]')].find(el => el.htmlFor === id);
    if (label) {
      label.id ||= `${id}-label`; label.htmlFor = trigger.id;
      trigger.setAttribute('aria-labelledby', label.id); menu.setAttribute('aria-labelledby', label.id);
    } else {
      const name = select.getAttribute('aria-label') || select.name || 'Choose an option';
      trigger.setAttribute('aria-label', name); menu.setAttribute('aria-label', name);
    }
    select.after(trigger); document.body.append(menu);
    select.hidden = true; select.tabIndex = -1; select.setAttribute('aria-hidden', 'true');
    // Existing validation focuses the native field by ID; route it to the visible control.
    select.focus = options => trigger.focus(options);
    let options = [], active = -1, search = '', searchTimer, closeTimer, isOpen = false;
    const enabled = () => options.map((el, i) => el.getAttribute('aria-disabled') !== 'true' ? i : -1).filter(i => i >= 0);

    function sync() {
      value.textContent = select.selectedOptions[0]?.textContent || 'Choose an option';
      trigger.disabled = select.disabled;
      for (const attr of ['aria-invalid', 'aria-describedby', 'aria-required']) {
        const v = attr === 'aria-required' ? (select.required ? 'true' : null) : select.getAttribute(attr);
        if (v) trigger.setAttribute(attr, v); else trigger.removeAttribute(attr);
      }
      options.forEach((el, i) => el.setAttribute('aria-selected', i === select.selectedIndex ? 'true' : 'false'));
    }
    function build() {
      menu.replaceChildren(); options = [];
      [...select.children].forEach(child => {
        if (child.tagName === 'OPTGROUP') {
          const group = document.createElement('div'); group.role = 'group'; group.setAttribute('aria-label', child.label);
          const heading = document.createElement('div'); heading.className = 'select-group-label'; heading.textContent = child.label; group.append(heading);
          [...child.children].forEach(opt => appendOption(opt, group, child.disabled)); menu.append(group);
        } else if (child.tagName === 'OPTION') appendOption(child, menu, false);
      });
      sync();
    }
    function appendOption(opt, parent, groupDisabled) {
      const index = options.length;
      const row = document.createElement('div'); row.role = 'option'; row.id = `${id}-option-${index}`; row.textContent = opt.textContent;
      row.setAttribute('aria-disabled', opt.disabled || groupDisabled ? 'true' : 'false');
      row.addEventListener('pointerdown', e => e.preventDefault());
      row.addEventListener('pointermove', () => { if (row.getAttribute('aria-disabled') !== 'true') setActive(index, false); });
      row.addEventListener('click', () => { if (row.getAttribute('aria-disabled') !== 'true') { setActive(index); close(true); trigger.focus(); } });
      options.push(row); parent.append(row);
    }
    function position() {
      if (!isOpen) return;
      const r = trigger.getBoundingClientRect(), margin = 8, gap = 6;
      const below = innerHeight - r.bottom - gap - margin, above = r.top - gap - margin;
      const flip = below < 160 && above > below;
      const available = Math.max(40, flip ? above : below);
      menu.style.width = `${Math.min(Math.max(r.width, 160), innerWidth - 2 * margin)}px`;
      menu.style.maxHeight = `${Math.min(280, available)}px`;
      menu.style.left = `${Math.max(margin, Math.min(r.left, innerWidth - menu.offsetWidth - margin))}px`;
      menu.style.top = `${flip ? Math.max(margin, r.top - gap - menu.offsetHeight) : r.bottom + gap}px`;
      menu.style.transformOrigin = flip ? 'bottom center' : 'top center';
    }
    function setActive(index, scroll = true) {
      active = index;
      options.forEach((el, i) => el.dataset.active = i === index ? 'true' : 'false');
      if (options[index]) {
        trigger.setAttribute('aria-activedescendant', options[index].id);
        if (scroll) {
          const row = options[index];
          if (row.offsetTop < menu.scrollTop) menu.scrollTop = row.offsetTop;
          else if (row.offsetTop + row.offsetHeight > menu.scrollTop + menu.clientHeight) menu.scrollTop = row.offsetTop + row.offsetHeight - menu.clientHeight;
        }
      } else trigger.removeAttribute('aria-activedescendant');
    }
    function open() {
      if (trigger.disabled || isOpen) return;
      openControl?.close(false);
      clearTimeout(closeTimer); delete menu.dataset.closing; menu.removeAttribute('aria-hidden');
      build(); isOpen = true; menu.hidden = false; trigger.setAttribute('aria-expanded', 'true'); trigger.setAttribute('aria-controls', menu.id);
      openControl = control; position();
      setActive(enabled().includes(select.selectedIndex) ? select.selectedIndex : enabled()[0] ?? -1);
    }
    function close(commit) {
      if (!isOpen) return;
      if (commit && active >= 0 && active !== select.selectedIndex) {
        select.selectedIndex = active;
        select.dispatchEvent(new Event('input', {bubbles:true}));
        select.dispatchEvent(new Event('change', {bubbles:true}));
      }
      isOpen = false; menu.dataset.closing = ''; menu.setAttribute('aria-hidden','true');
      closeTimer = setTimeout(() => { menu.hidden = true; delete menu.dataset.closing; }, matchMedia('(prefers-reduced-motion:reduce)').matches ? 0 : 150);
      trigger.setAttribute('aria-expanded', 'false'); trigger.removeAttribute('aria-activedescendant'); trigger.removeAttribute('aria-controls');
      clearTimeout(searchTimer); search = ''; sync();
      if (openControl === control) openControl = null;
    }
    function move(delta) {
      const rows = enabled(); if (!rows.length) return;
      setActive(rows[Math.max(0, Math.min(rows.length - 1, rows.indexOf(active) + delta))]);
    }
    const control = {close, trigger, menu, position}; controls.set(select, control);
    trigger.addEventListener('click', () => isOpen ? close(false) : open());
    trigger.addEventListener('blur', () => close(true));
    trigger.addEventListener('keydown', e => {
      const wasClosed = !isOpen;
      if (['ArrowDown','ArrowUp','Home','End','PageDown','PageUp'].includes(e.key)) {
        e.preventDefault(); open();
        if (e.key === 'Home') setActive(enabled()[0] ?? -1);
        else if (e.key === 'End') setActive(enabled().at(-1) ?? -1);
        else if (!wasClosed) move(e.key === 'ArrowDown' ? 1 : e.key === 'ArrowUp' ? -1 : e.key === 'PageDown' ? 5 : -5);
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault(); if (wasClosed) open(); else close(true);
      } else if (e.key === 'Escape' && !wasClosed) {
        e.preventDefault(); close(false);
      } else if (e.key === 'Tab') close(true);
      else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault(); open(); clearTimeout(searchTimer); search += e.key.toLowerCase();
        const repeated = [...search].every(char => char === search[0]);
        const term = repeated ? search[0] : search;
        const rows = enabled(); const start = rows.indexOf(active);
        const ordered = repeated ? [...rows.slice(start + 1), ...rows.slice(0, start + 1)] : rows;
        const match = ordered.find(i => options[i].textContent.trim().toLowerCase().startsWith(term));
        if (match !== undefined) setActive(match);
        searchTimer = setTimeout(() => { search = ''; }, 650);
      }
    });
    select.addEventListener('change', sync); select.addEventListener('invalid', e => { e.preventDefault(); trigger.focus(); });
    select.form?.addEventListener('reset', () => setTimeout(sync));
    new MutationObserver(() => { if (isOpen) close(false); build(); }).observe(select, {attributes:true,childList:true,subtree:true,characterData:true});
    build();
  }
  function init() {
    document.querySelectorAll('body.customer select').forEach(enhance);
    new MutationObserver(records => { if (records.some(r => r.addedNodes.length)) document.querySelectorAll('body.customer select').forEach(enhance); }).observe(document.body,{childList:true,subtree:true});
    document.addEventListener('pointerdown', e => { if (openControl && !openControl.trigger.contains(e.target) && !openControl.menu.contains(e.target)) openControl.close(true); });
    window.addEventListener('resize', () => openControl?.position());
    document.addEventListener('scroll', e => { if (openControl && !openControl.menu.contains(e.target)) openControl.position(); }, true);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
