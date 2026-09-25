/* Apply the static demo theme before styles render. No persistence or network. */
(() => {
  const requested = new URLSearchParams(location.search).get('theme');
  const theme = ['blue', 'red', 'dark'].includes(requested) ? requested : 'gray';
  document.documentElement.dataset.uiTheme = theme;
  document.documentElement.dataset.bsTheme = theme === 'dark' ? 'dark' : 'light';
})();
