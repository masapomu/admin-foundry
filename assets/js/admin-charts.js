/* Optional Chart.js adapter. Data and every displayed string belong to host HTML/JSON. */
(() => {
  'use strict';
  const instances = new WeakMap();
  const types = new Set(['line', 'bar', 'doughnut', 'mini']);
  const patterns = [[], [6, 4], [2, 3], [8, 3, 2, 3], [10, 4]];
  const points = ['circle', 'rectRot', 'triangle', 'rect', 'crossRot'];
  function read(canvas) {
    const type = canvas.dataset.uiChart;
    const source = canvas.dataset.chartSource || '';
    if (!types.has(type) || !/^#[A-Za-z][\w:.-]*$/.test(source)) throw new Error('Invalid chart declaration');
    const element = document.getElementById(source.slice(1));
    if (!element || element.tagName !== 'SCRIPT' || element.type !== 'application/json') throw new Error('Missing JSON source');
    const data = JSON.parse(element.textContent);
    for (const key of ['locale', 'categoryAxis', 'valueAxis']) {
      if (data && data[key] !== undefined && typeof data[key] !== 'string') throw new Error('Invalid text metadata');
    }
    if (!data || !Array.isArray(data.labels) || !data.labels.every(v => typeof v === 'string') || data.labels.length > 500) throw new Error('Invalid labels');
    if (!Array.isArray(data.datasets) || data.datasets.length > 5) throw new Error('Invalid series');
    if (type === 'doughnut' && (data.datasets.length > 1 || data.labels.length > 5)) throw new Error('Composition limit');
    for (const series of data.datasets) {
      if (!series || typeof series.label !== 'string' || !Array.isArray(series.data) || series.data.length !== data.labels.length ||
        !series.data.every(v => v === null || (typeof v === 'number' && Number.isFinite(v) && (type !== 'doughnut' || v >= 0)))) throw new Error('Invalid values');
    }
    return data;
  }
  function formatter(data, canvas) {
    const meta = data.format || {};
    if (typeof meta !== 'object' || Array.isArray(meta)) throw new Error('Invalid format metadata');
    const options = {};
    // Whitelist metadata; never merge arbitrary JSON into Chart.js options.
    for (const key of ['style', 'unit', 'unitDisplay', 'notation', 'minimumFractionDigits', 'maximumFractionDigits']) {
      if (Object.hasOwn(meta, key)) options[key] = meta[key];
    }
    if (options.style && !['decimal', 'percent', 'unit'].includes(options.style)) throw new Error('Unsupported number style');
    const intl = new Intl.NumberFormat(data.locale || canvas.closest('[lang]')?.lang || document.documentElement.lang, options);
    const suffix = typeof meta.suffix === 'string' ? meta.suffix : '';
    return value => intl.format(value) + suffix;
  }
  function configuration(canvas, data) {
    const kind = canvas.dataset.uiChart, mini = kind === 'mini', doughnut = kind === 'doughnut';
    const css = getComputedStyle(canvas), token = name => css.getPropertyValue('--ui-chart-' + name).trim();
    const palette = Array.from({length:5}, (_, i) => token('series-' + (i + 1)));
    const format = formatter(data, canvas);
    const datasets = data.datasets.map((series, index) => ({
      label:series.label, data:[...series.data],
      borderColor:doughnut ? token('surface') : palette[index],
      backgroundColor:doughnut ? palette.slice(0, data.labels.length) : palette[index],
      borderWidth:2, borderDash:patterns[index], pointStyle:points[index],
      pointRadius:mini ? 0 : 2.5, pointHoverRadius:4, pointHitRadius:8,
      tension:0.15, fill:false, spanGaps:false, maxBarThickness:30
    }));
    const numeric = {
      beginAtZero:true, grid:{color:token('grid'), lineWidth:1}, border:{display:false},
      ticks:{color:token('label'), maxTicksLimit:5, callback:value => format(value)},
      title:{display:!!data.valueAxis, text:data.valueAxis, color:token('axis')}
    };
    if (typeof data.maximum === 'number' && Number.isFinite(data.maximum) && data.maximum > 0) numeric.max = data.maximum;
    const category = {
      grid:{display:false}, border:{color:token('grid')},
      ticks:{color:token('label'), maxRotation:0, autoSkip:true, maxTicksLimit:6,
        callback:function(value) { return String(this.getLabelForValue(value)).split('\n'); }},
      title:{display:!!data.categoryAxis, text:data.categoryAxis, color:token('axis')}
    };
    return {
      type:mini ? 'line' : kind,
      data:{labels:[...data.labels], datasets},
      options:{
        responsive:true, maintainAspectRatio:false,
        animation:false, // Calm first paint and refresh; also satisfies reduced motion.
        color:token('label'), font:{family:css.fontFamily, size:13},
        locale:data.locale || document.documentElement.lang,
        indexAxis:kind === 'bar' ? 'y' : 'x',
        interaction:{mode:doughnut || kind === 'bar' ? 'nearest' : 'index', intersect:false},
        plugins:{
          legend:{display:false}, // Wrapping, accessible HTML legend is rendered by the host.
          tooltip:{
            enabled:!mini, backgroundColor:token('tooltip-bg'), titleColor:token('tooltip-text'), bodyColor:token('tooltip-text'),
            borderColor:token('grid'), borderWidth:1, padding:10, cornerRadius:4,
            titleFont:{size:13}, bodyFont:{size:13}, usePointStyle:true,
            callbacks:{label:context => `${doughnut ? data.labels[context.dataIndex] : context.dataset.label}: ${format(context.raw)}`}
          }
        },
        ...(doughnut ? {cutout:'68%'} : {scales:mini ? {x:{display:false}, y:{display:false, beginAtZero:true}} :
          kind === 'bar' ? {x:numeric, y:category} : {x:category, y:numeric}})
      }
    };
  }
  function refresh(canvas) {
    const host = canvas.closest('[data-chart-panel]');
    if (!host) return false;
    const frame = canvas.parentElement;
    const show = (selector, visible) => host.querySelectorAll(selector).forEach(el => { el.hidden = !visible; });
    show('[data-chart-error], [data-chart-empty]', false);
    try {
      const data = read(canvas);
      const values = data.datasets.flatMap(series => series.data).filter(v => v !== null);
      if (!values.length || (canvas.dataset.uiChart === 'doughnut' && !values.some(v => v > 0))) {
        instances.get(canvas)?.destroy(); instances.delete(canvas);
        frame.hidden = true; show('[data-chart-empty]', true); show('[data-chart-fallback]', false);
        host.dataset.chartState = 'empty'; return true;
      }
      if (!window.Chart) throw new Error('Optional Chart.js unavailable');
      const config = configuration(canvas, data);
      frame.hidden = false;
      const existing = instances.get(canvas);
      if (existing) {
        existing.data = config.data; existing.options = config.options; existing.update('none');
      } else {
        instances.set(canvas, new Chart(canvas, config));
      }
      show('[data-chart-fallback]', false);
      host.dataset.chartState = 'ready';
      return true;
    } catch {
      // A single malformed/missing source must not break other charts or the page.
      if (!instances.has(canvas)) {
        window.Chart?.getChart(canvas)?.destroy();
        frame.hidden = true;
      }
      show('[data-chart-error]', true);
      host.dataset.chartState = instances.has(canvas) ? 'stale' : 'error';
      return false;
    }
  }
  window.AdminCharts = Object.freeze({refresh});
  document.querySelectorAll('canvas[data-ui-chart]').forEach(refresh);
})();
