/* Shared progressive enhancements. All displayed messages come from rendered HTML. */
(() => {
  'use strict';
  if (!window.bootstrap) return;
  document.documentElement.classList.add('ui-js');
  const one = (selector, root = document) => root.querySelector(selector);
  const all = (selector, root = document) => [...root.querySelectorAll(selector)];
  const modalElement = one('#ui-dialog');
  const modal = modalElement ? new bootstrap.Modal(modalElement) : null;
  let pending = null;
  let opener = null;
  const approved = new WeakSet();
  const copyFeedback = new WeakMap();
  function resetCopyFeedback(button) {
    const feedback = copyFeedback.get(button);
    if (!feedback) return;
    clearTimeout(feedback.timer);
    feedback.icon.className = feedback.iconClass;
    button.classList.remove('ui-copy-confirmed');
    if (feedback.label === null) button.removeAttribute('aria-label');
    else button.setAttribute('aria-label', feedback.label);
    copyFeedback.delete(button);
  }
  function showCopyFeedback(button) {
    let feedback = copyFeedback.get(button);
    if (feedback) clearTimeout(feedback.timer);
    else {
      const icon = one('.bi-copy', button);
      if (!icon) return;
      feedback = { icon, iconClass:icon.className, label:button.getAttribute('aria-label') };
    }
    feedback.icon.classList.replace('bi-copy', 'bi-check-lg');
    button.classList.add('ui-copy-confirmed');
    if (feedback.label !== null) button.setAttribute('aria-label', button.dataset.copySuccess);
    feedback.timer = setTimeout(() => resetCopyFeedback(button), 2000);
    copyFeedback.set(button, feedback);
  }
  function dialog(trigger, continuation) {
    if (!modal) return;
    opener = trigger.closest('.dropdown')?.querySelector('[data-bs-toggle="dropdown"]') || trigger;
    modalElement.lang = trigger.closest('[lang]')?.lang || document.documentElement.lang;
    pending = continuation;
    one('[data-dialog-title]', modalElement).textContent = trigger.dataset.confirmTitle;
    one('[data-dialog-message]', modalElement).textContent = trigger.dataset.confirmMessage;
    const cancel = one('[data-dialog-cancel]', modalElement);
    cancel.textContent = trigger.dataset.confirmCancel || '';
    cancel.hidden = !continuation;
    const accept = one('[data-dialog-accept]', modalElement);
    accept.textContent = trigger.dataset.confirmButton;
    accept.className = trigger.dataset.confirmKind === 'danger' ? 'btn btn-danger' : 'btn btn-primary';
    modal.show();
  }
  modalElement?.addEventListener('shown.bs.modal', () => {
    const cancel = one('[data-dialog-cancel]', modalElement);
    (cancel.hidden ? one('[data-dialog-accept]', modalElement) : cancel).focus();
  });
  modalElement?.addEventListener('hidden.bs.modal', () => {
    pending = null;
    (opener?.closest('details:not([open])')?.querySelector('summary') || opener)?.focus();
  });
  one('[data-dialog-accept]', modalElement || document)?.addEventListener('click', () => {
    const proceed = pending;
    pending = null;
    modal.hide();
    proceed?.();
  });
  document.addEventListener('submit', event => {
    const form = event.target;
    const submitter = event.submitter;
    if (approved.has(form)) { approved.delete(form); return; }
    if (!submitter?.hasAttribute('data-ui-confirm') || !modal) return;
    event.preventDefault();
    dialog(submitter, () => {
      approved.add(form);
      form.requestSubmit(submitter); // Preserve action overrides, name/value, validation and normal POST.
      approved.delete(form);
    });
  });
  document.addEventListener('click', async event => {
    const message = event.target.closest('[data-ui-message]');
    if (message) { event.preventDefault(); dialog(message, null); }
    const toggle = event.target.closest('[data-ui-sidebar]');
    if (toggle) {
      const sidebar = one('#ui-sidebar');
      const open = sidebar.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
    }
    const copy = event.target.closest('[data-ui-copy]');
    if (copy) {
      try {
        await navigator.clipboard.writeText(one(copy.dataset.uiCopy).textContent.trim());
        showCopyFeedback(copy);
        notify(copy.dataset.copySuccess);
      } catch { resetCopyFeedback(copy); notify(copy.dataset.copyError); }
    }
    const password = event.target.closest('[data-ui-password]');
    if (password) {
      const input = one(password.dataset.uiPassword);
      const show = input.type === 'password';
      input.type = show ? 'text' : 'password';
      password.setAttribute('aria-pressed', String(show));
      if (password.hasAttribute('data-ui-password-icon')) {
        password.setAttribute('aria-label', show ? password.dataset.labelHide : password.dataset.labelShow);
        const icon = one('.bi', password);
        icon?.classList.toggle('bi-eye', !show);
        icon?.classList.toggle('bi-eye-slash', show);
      } else {
        password.textContent = show ? password.dataset.labelHide : password.dataset.labelShow;
      }
    }
    const toast = event.target.closest('[data-ui-toast]');
    if (toast) notify(toast.dataset.uiToast);
  });
  document.addEventListener('click', event => {
    all('.ui-account-menu[open]').forEach(menu => {
      if (!menu.contains(event.target) && !event.target.closest('#ui-dialog')) menu.open = false;
    });
  });
  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape' || one('#ui-dialog.show')) return;
    const menu = one('.ui-account-menu[open]');
    if (!menu) return;
    menu.open = false;
    one('summary', menu).focus();
  });
  const toastElement = one('#ui-toast');
  function restartToastCountdown() {
    if (!toastElement?.classList.contains('show') || toastElement.classList.contains('showing')) return;
    toastElement.classList.remove('ui-toast-counting');
    if (toastElement.matches(':hover, :focus-within')) return;
    void toastElement.offsetWidth;
    toastElement.classList.add('ui-toast-counting');
  }
  toastElement?.addEventListener('shown.bs.toast', restartToastCountdown);
  toastElement?.addEventListener('hidden.bs.toast', () => toastElement.classList.remove('ui-toast-counting'));
  toastElement?.addEventListener('mouseenter', () => toastElement.classList.remove('ui-toast-counting'));
  toastElement?.addEventListener('mouseleave', restartToastCountdown);
  toastElement?.addEventListener('focusin', () => toastElement.classList.remove('ui-toast-counting'));
  toastElement?.addEventListener('focusout', event => {
    if (!toastElement.contains(event.relatedTarget)) queueMicrotask(restartToastCountdown);
  });
  function notify(message) {
    if (!toastElement || !message) return;
    one('.toast-body', toastElement).textContent = message;
    bootstrap.Toast.getOrCreateInstance(toastElement, { delay:5000 }).show();
  }
  all('[data-bs-toggle="tooltip"]').forEach(el => new bootstrap.Tooltip(el));
  all('[data-bs-toggle="popover"]').forEach(el => new bootstrap.Popover(el));
  all('.ui-table-wrap [data-bs-toggle="dropdown"]').forEach(el => new bootstrap.Dropdown(el, {
    popperConfig: config => ({ ...config, strategy:'fixed' })
  }));
  all('[data-ui-bulk]').forEach(group => {
    const boxes = all('[data-row-select]', group);
    const available = () => boxes.filter(box => !box.disabled && !box.closest('tr').hidden);
    const master = one('[data-select-all]', group);
    function sync() {
      const eligible = available();
      const selected = eligible.filter(box => box.checked);
      one('[data-selected-count]', group).textContent = String(selected.length);
      master.checked = eligible.length > 0 && selected.length === eligible.length;
      master.indeterminate = selected.length > 0 && selected.length < eligible.length;
      all('[data-bulk-action]', group).forEach(button => { button.disabled = !selected.length; });
      boxes.forEach(box => box.closest('tr').classList.toggle('is-selected', box.checked));
    }
    master?.addEventListener('change', () => { available().forEach(box => { box.checked = master.checked; }); sync(); });
    boxes.forEach(box => box.addEventListener('change', sync));
    sync();
  });
  all('[data-ui-unsaved]').forEach(form => {
    let dirty = false;
    form.addEventListener('input', () => { dirty = true; });
    form.addEventListener('reset', () => { dirty = false; });
    form.addEventListener('submit', event => {
      // Wait until all confirmation/demo listeners have decided whether submission will proceed.
      queueMicrotask(() => { if (!event.defaultPrevented) dirty = false; });
    });
    window.addEventListener('beforeunload', event => {
      if (dirty) { event.preventDefault(); event.returnValue = ''; }
    });
  });
})();
