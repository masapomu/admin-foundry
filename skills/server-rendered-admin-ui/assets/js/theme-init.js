/* Apply the static demo theme before styles render. No persistence or network. */
(() => {
  const requested = new URLSearchParams(location.search).get('theme');
  const theme = ['graphite-blue', 'sapphire-blue', 'garnet-red', 'aqua-ivory', 'dark'].includes(requested) ? requested : 'graphite-blue';
  document.documentElement.dataset.uiTheme = theme;
  document.documentElement.dataset.bsTheme = theme === 'dark' ? 'dark' : 'light';
})();
