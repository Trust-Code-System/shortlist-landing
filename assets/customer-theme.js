// Apply before styles render. Match the admin palette without changing admin state.
(() => {
  document.documentElement.classList.add('customer-root');
  let theme;
  try { theme = localStorage.getItem('shortlist-client-theme'); } catch {}
  document.documentElement.dataset.theme = theme === 'dark' ? 'dark' : 'light';
  try {
    const width = parseInt(localStorage.getItem('shortlist-client-sidebar-width'), 10);
    if (width >= 200 && width <= 400) document.documentElement.style.setProperty('--client-sidebar-width', `${width}px`);
  } catch {}
})();
