/* Static fixture adapter, NOT part of the reusable runtime. No persistence or network. */
(() => {
  'use strict';
  if (!window.bootstrap) return;
  const theme = document.documentElement.dataset.uiTheme;
  document.querySelectorAll('[data-demo-theme]').forEach(link => {
    if (link.dataset.demoTheme === theme) link.setAttribute('aria-current', 'true');
    else link.removeAttribute('aria-current');
    const target = new URL(location.href);
    target.searchParams.set('theme', link.dataset.demoTheme);
    link.href = target.href;
  });
  document.querySelectorAll('[data-demo-theme-name]').forEach(label => {
    label.textContent = document.querySelector(`[data-demo-theme="${theme}"]`).textContent;
  });
  if (theme !== 'graphite-blue') {
    // Preserve the visual preview across ordinary links and GET forms.
    document.querySelectorAll('a[href]').forEach(link => {
      if (link.hasAttribute('data-demo-theme') || link.getAttribute('href').startsWith('#')) return;
      const target = new URL(link.href, location.href);
      if (target.protocol !== location.protocol || (target.protocol !== 'file:' && target.origin !== location.origin)) return;
      if (!target.pathname.endsWith('.html')) return;
      target.searchParams.set('theme', theme);
      link.href = target.href;
    });
    document.querySelectorAll('form[method="get"]').forEach(form => {
      const input = document.createElement('input');
      input.type = 'hidden'; input.name = 'theme'; input.value = theme;
      form.append(input);
    });
  }
  document.addEventListener('submit', event => {
    if (event.defaultPrevented || !event.target.matches('[data-demo-post]')) return;
    event.preventDefault();
    const toast = document.querySelector('#ui-toast');
    toast.querySelector('.toast-body').textContent = event.target.dataset.demoPost;
    bootstrap.Toast.getOrCreateInstance(toast, { delay:5000 }).show();
  });
  document.querySelectorAll('[data-demo-filter]').forEach(form => {
    const params = new URLSearchParams(location.search);
    [...form.elements].forEach(input => {
      if (input.name && params.has(input.name)) input.value = params.get(input.name);
    });
    const q = (params.get('q') || '').toLocaleLowerCase().trim();
    const state = params.get('status') || '';
    const type = params.get('type') || '';
    const from = params.get('from') || '';
    const until = params.get('until') || '';
    let count = 0;
    document.querySelectorAll('[data-fixture-row]').forEach(row => {
      const matches = row.textContent.toLocaleLowerCase().includes(q)
        && (!state || row.dataset.status === state) && (!type || row.dataset.type === type)
        && (!from || row.dataset.timestamp?.slice(0,16) >= from) && (!until || row.dataset.timestamp?.slice(0,16) <= until);
      row.hidden = !matches;
      const box = row.querySelector('[data-row-select]');
      if (box && !matches) box.disabled = true;
      if (matches) count++;
    });
    document.querySelectorAll('[data-result-count]').forEach(el => { el.textContent = String(count); });
    document.querySelector('[data-no-results]').hidden = count !== 0;
  });
  const sortLinks = document.querySelectorAll('[data-demo-sort]');
  if (sortLinks.length) {
    const params = new URLSearchParams(location.search);
    const allowed = new Set(['name', 'role', 'status', 'active']);
    const sort = allowed.has(params.get('sort')) ? params.get('sort') : '';
    const direction = params.get('dir') === 'desc' ? 'desc' : 'asc';
    sortLinks.forEach(link => {
      const column = link.dataset.demoSort;
      const active = column === sort;
      const target = new URL(location.href);
      target.searchParams.set('sort', column);
      target.searchParams.set('dir', active && direction === 'asc' ? 'desc' : 'asc');
      target.searchParams.delete('page');
      link.href = target.href;
      link.querySelector('.bi').className = `bi bi-${active ? (direction === 'asc' ? 'arrow-up' : 'arrow-down') : 'arrow-down-up'}`;
      if (active) link.closest('th').setAttribute('aria-sort', direction === 'asc' ? 'ascending' : 'descending');
    });
    if (sort) {
      const body = document.querySelector('[data-fixture-row]')?.closest('tbody');
      if (body) {
        const rows = [...body.querySelectorAll('[data-fixture-row]')];
        const collator = new Intl.Collator(document.documentElement.lang || 'en', { numeric:true, sensitivity:'base' });
        const value = row => sort === 'name' ? (row.querySelector('.ui-person strong') || row.cells[0]).textContent.trim()
          : sort === 'role' ? row.dataset.type
          : sort === 'status' ? row.dataset.status : row.dataset.sortActive;
        rows.sort((a, b) => {
          const first = value(a), second = value(b);
          if (sort === 'active' && (!first || !second)) return first ? -1 : second ? 1 : 0;
          const order = collator.compare(first, second);
          return direction === 'asc' ? order : -order;
        });
        body.append(...rows);
      }
    }
  }
})();
