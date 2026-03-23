(() => {
  // 50 dark oklch colors, evenly distributed across the hue wheel
  // L ∈ [0.18–0.24]  C ∈ [0.05–0.09]  H ∈ [0–360)
  const COLORS = Array.from({ length: 50 }, (_, i) => {
    const h = ((i * 360) / 50).toFixed(1);
    const l = (0.18 + (i % 4) * 0.02).toFixed(2);   // 0.18 / 0.20 / 0.22 / 0.24
    const c = (0.05 + (i % 5) * 0.01).toFixed(2);   // 0.05 – 0.09
    return `oklch(${l} ${c} ${h})`;
  });

  // 13 Fontshare serif fonts (Elegant / Dramatic / Clean / Futuristic / Serious)
  const FONTS = [
    'Boska', 'Zodiak', 'Gambetta', 'Gambarino', 'Sentient',
    'Erode', 'Bespoke Serif', 'Rowan', 'Author', 'Stardom',
    'Melodrama', 'Tanker', 'Ranade',
  ];

  let quotes = [];
  let currentIndex = -1;
  let currentColorIndex = -1;
  let currentFontIndex = -1;
  let hintHidden = false;

  const app = document.getElementById('app');
  const quoteText = document.getElementById('quote-text');
  const quoteAuthor = document.getElementById('quote-author');
  const pullIndicator = document.getElementById('pull-indicator');
  const pullText = document.getElementById('pull-text');
  const hint = document.getElementById('hint');

  // Pull-to-refresh state
  let touchStartY = 0;
  let pulling = false;
  let canPull = false;
  const PULL_THRESHOLD = 80;

  async function loadQuotes() {
    try {
      const res = await fetch('quotes.json');
      quotes = await res.json();
    } catch {
      quotes = [{ text: 'The best is yet to come.', author: 'Unknown' }];
    }
  }

  function pickRandomColor() {
    let next;
    do { next = Math.floor(Math.random() * COLORS.length); }
    while (next === currentColorIndex && COLORS.length > 1);
    currentColorIndex = next;
    return COLORS[next];
  }

  function pickRandomFont() {
    let next;
    do { next = Math.floor(Math.random() * FONTS.length); }
    while (next === currentFontIndex && FONTS.length > 1);
    currentFontIndex = next;
    return FONTS[next];
  }

  function pickRandomQuote() {
    let next;
    do { next = Math.floor(Math.random() * quotes.length); }
    while (next === currentIndex && quotes.length > 1);
    currentIndex = next;
    return quotes[next];
  }

  function showQuote(quote, color, font) {
    document.body.style.backgroundColor = color;
    document.querySelector('meta[name="theme-color"]').setAttribute('content', color);
    quoteText.style.fontFamily = `'${font}', Georgia, serif`;
    quoteText.textContent = quote.text;
    quoteAuthor.textContent = quote.author;
  }

  async function refresh() {
    // Fade out
    app.classList.add('refreshing');
    await wait(300);

    const quote = pickRandomQuote();
    const color = pickRandomColor();
    const font  = pickRandomFont();
    showQuote(quote, color, font);

    // Fade in
    app.classList.remove('refreshing');
    app.classList.add('entering');
    // Force reflow
    app.offsetHeight; // eslint-disable-line no-unused-expressions
    app.classList.remove('entering');

    if (!hintHidden) {
      hintHidden = true;
      hint.classList.add('hidden');
    }
  }

  function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Pull-to-refresh
  document.addEventListener('touchstart', (e) => {
    touchStartY = e.touches[0].clientY;
    canPull = window.scrollY === 0;
  }, { passive: true });

  document.addEventListener('touchmove', (e) => {
    if (!canPull) return;
    const dy = e.touches[0].clientY - touchStartY;
    if (dy <= 0) return;

    pulling = true;
    const progress = Math.min(dy / PULL_THRESHOLD, 1);

    pullIndicator.classList.add('visible');
    if (dy >= PULL_THRESHOLD) {
      pullIndicator.classList.add('release');
      pullText.textContent = 'Release to refresh';
    } else {
      pullIndicator.classList.remove('release');
      pullText.textContent = 'Pull to refresh';
    }

    // Dampen the drag
    app.style.transform = `translateY(${Math.min(dy * 0.35, 40)}px)`;
    app.style.opacity = 1 - progress * 0.3;
  }, { passive: true });

  document.addEventListener('touchend', async (e) => {
    if (!pulling) return;
    pulling = false;

    const dy = e.changedTouches[0].clientY - touchStartY;
    const triggered = dy >= PULL_THRESHOLD;

    pullIndicator.classList.remove('visible', 'release');
    pullText.textContent = 'Pull to refresh';
    app.style.transform = '';
    app.style.opacity = '';

    if (triggered) await refresh();
  }, { passive: true });

  // Mouse wheel / trackpad for desktop
  let wheelCooldown = false;
  document.addEventListener('wheel', async (e) => {
    if (wheelCooldown) return;
    if (e.deltaY < -40) {
      wheelCooldown = true;
      await refresh();
      setTimeout(() => { wheelCooldown = false; }, 800);
    }
  }, { passive: true });

  // Keyboard: Space or ArrowDown
  document.addEventListener('keydown', async (e) => {
    if (e.code === 'Space' || e.code === 'ArrowDown' || e.code === 'ArrowRight') {
      e.preventDefault();
      await refresh();
    }
  });

  // Init
  async function init() {
    document.body.classList.add('loading');
    await loadQuotes();

    const quote = pickRandomQuote();
    const color = pickRandomColor();
    const font  = pickRandomFont();
    showQuote(quote, color, font);

    document.body.classList.remove('loading');

    // Hide hint after first manual interaction
    setTimeout(() => {
      if (!hintHidden) {
        hint.classList.add('hidden');
        hintHidden = true;
      }
    }, 5000);

    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('sw.js').catch(() => {});
    }
  }

  init();
})();
