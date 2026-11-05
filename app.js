(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const seg = (p, a, b) => clamp((p - a) / (b - a));
  const ease = t => t * t * (3 - 2 * t);
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (RM) document.documentElement.classList.add('rm');

  /* ---------- Aparecer al bajar ---------- */
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .12, rootMargin: '0px 0px -6% 0px' });
  const observeRv = root => $$('.rv:not(.in)', root || document).forEach(el => (RM ? el.classList.add('in') : io.observe(el)));

  /* ---------- Sticker festoneado (generado) ---------- */
  const scallop = (n = 16, r1 = 54, r2 = 46) => {
    let d = '';
    for (let i = 0; i < n * 2; i++) {
      const a = (i / (n * 2)) * Math.PI * 2, r = i % 2 ? r2 : r1;
      d += (i ? 'L' : 'M') + (60 + Math.cos(a) * r).toFixed(1) + ' ' + (60 + Math.sin(a) * r).toFixed(1);
    }
    return d + 'Z';
  };
  $$('.scallop').forEach(p => p.setAttribute('d', scallop()));

  /* ---------- Marquee ---------- */
  const words = ['Hecho al momento', '◂ sin congelados ▸', 'Papas crocantes', '◂ salsas de la casa ▸'];
  const marq = $('#marq');
  marq.innerHTML = [...words, ...words, ...words, ...words].map(w => '<span>' + w + '</span>').join('');

  /* ---------- Nav / menú ---------- */
  const nav = $('.nav'), burger = $('#burger'), drawer = $('#drawer');
  const setMenu = open => {
    drawer.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', String(open));
    drawer.setAttribute('aria-hidden', String(!open));
    document.body.classList.toggle('lock', open);
  };
  burger.addEventListener('click', () => setMenu(!drawer.classList.contains('open')));
  $$('a', drawer).forEach(a => a.addEventListener('click', () => setMenu(false)));
  addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });

  /* ---------- Tabs de combos ---------- */
  const combos = [
    { n: 'Combo Clásico', d: 'La Clásica + papas + gaseosa mediana.', p: 'S/ 22.90', ph: 'burger' },
    { n: 'Combo Doble', d: 'La Doble + papas grandes + gaseosa grande.', p: 'S/ 29.90', ph: 'burger' },
    { n: 'Combo Mordisco', d: 'La Mordisco + papas + nuggets x5 + gaseosa.', p: 'S/ 36.90', ph: 'nuggets' },
    { n: 'Combo Para dos', d: '2 Clásicas + papas familiares + 2 gaseosas.', p: 'S/ 44.90', ph: 'fries' },
  ];
  $$('.tab').forEach(t => t.addEventListener('click', () => {
    $$('.tab').forEach(x => { x.classList.toggle('is-active', x === t); x.setAttribute('aria-selected', String(x === t)); });
    const c = combos[+t.dataset.c];
    $('#cName').textContent = c.n; $('#cDesc').textContent = c.d;
    $('#cPrice').textContent = c.p; const ci = $('#cImg'); ci.className = 'ph ph-' + c.ph; ci.src = '' + c.ph + '.jpg';
    const art = $('.combo__art'); art.animate([{ transform: 'scale(.85) rotate(-6deg)' }, { transform: 'none' }], { duration: 400, easing: 'cubic-bezier(.2,1.4,.4,1)' });
  }));

  /* ---------- Productos (datos) ---------- */
  const P = [
    { id: 'clasica', n: 'La Clásica', c: 'Burger', p: 14.90, ph: 'burger', d: 'La de siempre: carne a la plancha, queso derretido y salsa de la casa.',
      tags: ['Hecha al momento', 'Pan tostado', 'Sin congelados'],
      ing: ['Pan brioche tostado', 'Carne de res a la plancha', 'Queso cheddar', 'Lechuga fresca', 'Tomate en rodajas', 'Salsa de la casa'],
      prep: ['Tostamos el pan al momento.', 'La carne va a la plancha cuando haces el pedido.', 'Se arma con queso derretido, lechuga, tomate y salsa.'],
      ext: [['Tocino crocante', 3], ['Huevo frito', 2.5], ['Papas al hilo', 2]] },
    { id: 'doble', n: 'La Doble', c: 'Burger', p: 19.90, ph: 'burger2', d: 'Doble carne y doble queso para cuando hay hambre de verdad.',
      tags: ['Doble carne', 'Doble queso'],
      ing: ['Pan brioche tostado', 'Dos carnes de res a la plancha', 'Doble queso cheddar', 'Cebolla caramelizada', 'Pepinillos', 'Salsa de la casa'],
      prep: ['Tostamos el pan.', 'Dos carnes a la plancha, una encima de la otra.', 'Doble queso, cebolla y pepinillos al final.'],
      ext: [['Tocino crocante', 3], ['Ají de la casa', 1.5], ['Papas al hilo', 2]] },
    { id: 'mordisco', n: 'La Mordisco', c: 'Firma', p: 24.90, ph: 'burger3', d: 'Nuestra firma: triple carne, queso y la salsa secreta.',
      tags: ['Firma de la casa', 'Triple carne', 'Salsa secreta'],
      ing: ['Pan brioche tostado', 'Tres carnes de res a la plancha', 'Queso cheddar y queso crema', 'Tocino crocante', 'Lechuga y tomate', 'Salsa secreta Mordisco'],
      prep: ['Pan tostado con mantequilla.', 'Tres carnes a la plancha, bien selladas.', 'Queso, tocino y la salsa secreta encima.'],
      ext: [['Huevo frito', 2.5], ['Papas al hilo', 2], ['Salsa extra', 1.5]] },
    { id: 'hotdog', n: 'Hot Dog Brutal', c: 'Snack', p: 9.90, ph: 'hotdog', d: 'Salchicha grande, papas al hilo y tres salsas.',
      tags: ['Papas al hilo', 'Tres salsas'],
      ing: ['Pan suave', 'Salchicha grande', 'Papas al hilo', 'Mayo ahumada', 'Ají de la casa', 'Chimichurri'],
      prep: ['Dorado de la salchicha.', 'Pan tibio.', 'Papas al hilo y las tres salsas.'],
      ext: [['Queso fundido', 2], ['Tocino crocante', 3]] },
    { id: 'papas', n: 'Papas Mordisco', c: 'Snack', p: 8.50, ph: 'fries', d: 'Crocantes por fuera, suaves por dentro. Con la salsa que elijas.',
      tags: ['Crocantes', 'Salsa a elección'],
      ing: ['Papas cortadas al día', 'Sal marina', 'Una salsa a elección'],
      prep: ['Se fríen cuando las pides.', 'Se sazonan al salir.', 'Van con tu salsa favorita.'],
      ext: [['Queso fundido', 2], ['Salsa extra', 1.5]] },
    { id: 'nuggets', n: 'Nuggets x10', c: 'Snack', p: 12.00, ph: 'nuggets', d: 'Pollo jugoso con cobertura dorada y dip.',
      tags: ['Pollo', 'Con dip'],
      ing: ['Pechuga de pollo', 'Cobertura dorada y crocante', 'Un dip a elección'],
      prep: ['Se empanizan al momento.', 'Fritura rápida para que queden jugosos.', 'Se sirven con su dip.'],
      ext: [['Dip extra', 1.5]] },
    { id: 'wrap', n: 'Wrap Crunch', c: 'Snack', p: 11.50, ph: 'wrap', d: 'Pollo crujiente, verduras y salsa picante suave.',
      tags: ['Pollo crujiente', 'Picante suave'],
      ing: ['Tortilla tibia', 'Pollo crujiente', 'Lechuga y tomate', 'Salsa picante suave'],
      prep: ['Pollo crujiente recién frito.', 'Verduras frescas.', 'Se enrolla caliente.'],
      ext: [['Queso fundido', 2], ['Papas al hilo', 2]] },
    { id: 'gaseosa', n: 'Gaseosa grande', c: 'Bebida', p: 5.00, ph: 'cola', d: 'Bien fría, con hielo. Refill en el local.',
      tags: ['Bien fría', 'Refill en el local'],
      ing: ['Gaseosa a elección', 'Hielo'],
      prep: ['Vaso grande con hielo.', 'Refill gratis en el local.'],
      ext: [['Vaso para llevar', 0.5]] },
  ];
  const money = v => 'S/ ' + v.toFixed(2);
  const byId = id => P.find(x => x.id === id);

  /* ---------- Menú: categorías con contador + carrusel con flechas y puntos ---------- */
  const CATS = [['Burgers', x => x.c === 'Burger' || x.c === 'Firma'], ['Snacks', x => x.c === 'Snack'], ['Bebidas', x => x.c === 'Bebida']];
  const trackEl = $('#track'), catsEl = $('#cats'), dotsEl = $('#dots'), carL = $('#carL'), carR = $('#carR');
  let catIdx = 0;
  catsEl.innerHTML = CATS.map((c, i) => '<button class="cat' + (i ? '' : ' is-active') + '" role="tab" aria-selected="' + (i === 0) + '" data-i="' + i + '">' + c[0] + '<b>' + P.filter(c[1]).length + '</b></button>').join('');
  const cardHTML = (x, i) => `
    <article class="pc rv" style="--d:${(i * 0.09).toFixed(2)}s" data-id="${x.id}" tabindex="0" role="link" aria-label="Ver ${x.n}">
      <div class="pc__art"><img class="ph ph-${x.ph}" src="${x.ph}.jpg" alt="${x.n}" loading="lazy"></div>
      <h3>${x.n}</h3><span class="price">${money(x.p)}</span>
      <div class="pc__btns"><span class="btn btn--primary btn--sm">Ver <svg class="ico"><use href="#i-caret"/></svg></span><button class="addq" data-add="${x.id}">+ Agregar</button></div>
    </article>`;
  const step = () => { const c = trackEl.firstElementChild; return c ? c.getBoundingClientRect().width + parseFloat(getComputedStyle(trackEl).columnGap || 16) : 300; };
  const updateCar = () => {
    const max = trackEl.scrollWidth - trackEl.clientWidth;
    carL.disabled = trackEl.scrollLeft <= 4; carR.disabled = trackEl.scrollLeft >= max - 4;
    const idx = Math.round(trackEl.scrollLeft / step());
    $$('i', dotsEl).forEach((d, k) => d.classList.toggle('on', k === idx));
  };
  const renderCars = () => {
    const list = P.filter(CATS[catIdx][1]);
    trackEl.scrollLeft = 0;
    trackEl.innerHTML = list.map(cardHTML).join('');
    dotsEl.innerHTML = list.map(() => '<i></i>').join('');
    observeRv(trackEl); updateCar();
  };
  catsEl.addEventListener('click', e => {
    const b = e.target.closest('.cat'); if (!b) return;
    catIdx = +b.dataset.i;
    $$('.cat', catsEl).forEach(x => { x.classList.toggle('is-active', x === b); x.setAttribute('aria-selected', String(x === b)); });
    renderCars();
  });
  carL.addEventListener('click', () => trackEl.scrollBy({ left: -step(), behavior: 'smooth' }));
  carR.addEventListener('click', () => trackEl.scrollBy({ left: step(), behavior: 'smooth' }));
  trackEl.addEventListener('scroll', () => requestAnimationFrame(updateCar), { passive: true });
  addEventListener('resize', updateCar);

  /* ---------- El festín: píldoras que cambian las fotos ---------- */
  const SETS = [['burger', 'wrap'], ['burger', 'hotdog'], ['nuggets', 'fries']];
  $$('.pl').forEach(b => b.addEventListener('click', () => {
    $$('.pl').forEach(x => { x.classList.toggle('is-active', x === b); x.setAttribute('aria-selected', String(x === b)); });
    const s = SETS[+b.dataset.set];
    [['#duoA', s[0]], ['#duoB', s[1]]].forEach(([sel, ph], i) => {
      const im = $(sel); im.className = 'ph ph-' + ph; im.src = '' + ph + '.jpg'; im.decoding = 'async';
      if (!RM) im.parentElement.animate([{ opacity: .3, transform: 'scale(.96)' }, { opacity: 1, transform: 'none' }], { duration: 420, delay: i * 70, easing: 'cubic-bezier(.23,1,.32,1)' });
    });
  }));

  /* ---------- Pedido ---------- */
  let n = 0;
  const addOne = () => { n++; $('#cart-n').textContent = n; $('#cart').hidden = false; };

  /* ---------- Página de producto (rutas con #/p/id) ---------- */
  const page = $('#page'), pgScroll = $('#pgScroll');
  let cur = null, tab = 'ing', clickPt = null;
  const renderPanel = () => {
    const x = cur; let html = '';
    if (tab === 'ing') html = '<ul>' + x.ing.map(i => '<li>' + i + '</li>').join('') + '</ul>';
    if (tab === 'prep') html = '<ol>' + x.prep.map(i => '<li>' + i + '</li>').join('') + '</ol>';
    if (tab === 'ext') html = '<ul>' + x.ext.map(e => '<li><b>' + e[0] + '</b><span class="xp">+ ' + money(e[1]) + '</span></li>').join('') + '</ul>';
    $('#pgPanel').innerHTML = html;
  };
  const fillPage = x => {
    cur = x; tab = 'ing';
    $('#pgCat').textContent = x.c;
    const ws = x.n.split(' '); const long = ws.reduce((a, b) => (b.length > a.length ? b : a));
    $('#pgName').innerHTML = ws.map(w => '<span class="' + (w === long ? 'big' : 'sm') + '">' + w + '</span>').join('');
    const pi = $('#pgImg'); pi.className = 'ph ph-' + x.ph; pi.src = '' + x.ph + '.jpg'; pi.alt = x.n;
    $('#pgPrice').textContent = money(x.p);
    $('#pgDesc').textContent = x.d;
    $('#pgTags').innerHTML = x.tags.map(t => '<span>' + t + '</span>').join('');
    $$('#pgTabs .tab').forEach(t => { const on = t.dataset.t === 'ing'; t.classList.toggle('is-active', on); t.setAttribute('aria-selected', String(on)); });
    renderPanel();
    $('#pgMore').innerHTML = P.filter(o => o.id !== x.id).map(o => '<a class="mini" href="#/p/' + o.id + '"><span class="imgw"><img class="ph ph-' + o.ph + '" src="' + o.ph + '.jpg" alt="" loading="lazy"></span><b>' + o.n + '</b><i>' + money(o.p) + '</i></a>').join('');
    pgScroll.scrollTop = 0;
  };
  const openPage = (x, ox, oy) => {
    fillPage(x);
    page.style.setProperty('--ox', (ox == null ? innerWidth / 2 : ox) + 'px');
    page.style.setProperty('--oy', (oy == null ? innerHeight / 2 : oy) + 'px');
    page.classList.add('open'); page.setAttribute('aria-hidden', 'false');
    document.body.classList.add('lock');
    setTimeout(() => $('#pgBack').focus({ preventScroll: true }), 50);
  };
  const closePage = () => {
    page.classList.remove('open'); page.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('lock'); cur = null;
  };
  const route = () => {
    const m = location.hash.match(/^#\/p\/([\w-]+)/);
    const x = m && byId(m[1]);
    if (x) { if (!cur || cur.id !== x.id) openPage(x, clickPt && clickPt[0], clickPt && clickPt[1]); }
    else if (cur) closePage();
    clickPt = null;
  };
  trackEl.addEventListener('click', e => {
    const q = e.target.closest('[data-add]');
    if (q) { addOne(); q.textContent = '¡Agregado!'; setTimeout(() => { q.textContent = '+ Agregar'; }, 1200); return; }
    const c = e.target.closest('.pc'); if (!c) return;
    clickPt = [e.clientX, e.clientY]; location.hash = '#/p/' + c.dataset.id;
  });
  trackEl.addEventListener('keydown', e => { if (e.key === 'Enter') { const c = e.target.closest('.pc'); if (c) location.hash = '#/p/' + c.dataset.id; } });
  $('#pgBack').addEventListener('click', () => { if (/^#\/p\//.test(location.hash) && history.length > 1) history.back(); else location.hash = '#menu'; });
  addEventListener('keydown', e => { if (e.key === 'Escape' && cur) $('#pgBack').click(); });
  addEventListener('hashchange', route);
  $('#pgTabs').addEventListener('click', e => {
    const t = e.target.closest('.tab'); if (!t) return;
    tab = t.dataset.t;
    $$('#pgTabs .tab').forEach(x => { x.classList.toggle('is-active', x === t); x.setAttribute('aria-selected', String(x === t)); });
    renderPanel();
  });
  $('#pgAdd').addEventListener('click', () => {
    addOne(); const b = $('#pgAdd'); b.textContent = '¡Agregado!';
    setTimeout(() => { b.innerHTML = 'Agregar al pedido <svg class="ico"><use href="#i-caret"/></svg>'; }, 1300);
  });
  pgScroll.addEventListener('scroll', () => {
    if (RM) return;
    const s = pgScroll.scrollTop;
    $('#pgSticker').style.transform = 'rotate(' + s * .25 + 'deg)';
    $('#pgImg').style.setProperty('--ty', Math.min(s, 500) * -.04 + 'px');
    $('#pgName').style.transform = 'translateY(' + s * .12 + 'px)';
  }, { passive: true });
  route();

  $('#signup').addEventListener('submit', e => {
    e.preventDefault();
    const v = $('#email').value.trim();
    $('#msg').textContent = /^\S+@\S+\.\S+$/.test(v) ? 'Listo. (Demo: no se guardó ningún correo.)' : 'Escribe un correo válido.';
  });

  /* ---------- Escenas de scroll ---------- */
  const hero = $('#hero'), heroTitle = $('#heroTitle'), b3 = $('#burger3d'), bsvg = $('#burgerSvg'), heroEnd = $('#heroEnd');
  const hint = $('#hint'), st1 = $('#sticker1'), st2 = $('#sticker2');
  const layers = [0, 1, 2, 3, 4].map(i => $('#L' + i));
  const lbls = $$('.lbl');
  const spread = [-76, -38, 0, 38, 76];       // separación de capas (unidades del SVG)
  const yc = [43, 94, 116, 145, 182];          // centro vertical de cada capa
  const wavy = $('#wavyArt'), sA = $('.s-a'), sC = $('.s-c'), sauces = $('#sauces');
  let lastY = scrollY, ticking = false;
  const hex = s => [1, 3, 5].map(i => parseInt(s.slice(i, i + 2), 16));
  const BURG = hex('#4b1a26'), TEAL = hex('#8cc7bf'), INK = hex('#10312f');
  const mixC = (a, b, t) => 'rgb(' + a.map((v, i) => Math.round(v + (b[i] - v) * t)).join(',') + ')';
  let lastT = -1, lastQ = -1;
  const misCols = [['.kick--m', '#c4352a'], ['.mission__h', '#c4352a'], ['.mission__p', '#f4eae2'], ['.mission__by', '#ecc3b8']].map(([s, c]) => [$(s), hex(c)]);
  const flEls = $$('.fl'), plateEl = $('#plate'), misEl = $('#manifesto'), whyEl = $('#why'), rootEl = document.documentElement;

  const prog = el => clamp(-el.getBoundingClientRect().top / (el.offsetHeight - innerHeight));

  function frame() {
    ticking = false;
    const vh = innerHeight, y = scrollY;

    // nav: se esconde al bajar, vuelve al subir
    if (!drawer.classList.contains('open')) nav.classList.toggle('hide', y > lastY && y > 160);
    lastY = y;

    if (!RM) {
      // HERO
      const p = prog(hero);
      const a = ease(seg(p, 0, .3));
      b3.style.transform = `translateY(${(1 - a) * 16 + ease(seg(p, .78, .95)) * 27}vh) scale(${.62 + a * .38 - ease(seg(p, .78, .95)) * .36})`;
      heroTitle.style.opacity = 1 - seg(p, .1, .34);
      heroTitle.style.transform = `translateY(${-seg(p, 0, .34) * 24}vh) scale(${1 + seg(p, 0, .34) * .25})`;
      const e = ease(seg(p, .36, .6)) * (1 - ease(seg(p, .74, .9)));
      layers.forEach((g, i) => g.setAttribute('transform', `translate(0 ${(spread[i] * e).toFixed(1)})`));
      const H = bsvg.clientHeight;
      lbls.forEach((l, i) => { l.style.top = ((yc[i] + spread[i] * e) * (H / 220)) + 'px'; l.style.opacity = clamp((e - .35) / .4); });
      st1.style.transform = `rotate(${y * .18}deg) scale(${.4 + a * .6})`;
      heroEnd.style.opacity = ease(seg(p, .78, .93));
      heroEnd.style.pointerEvents = p > .85 ? 'auto' : 'none';
      hint.style.opacity = 1 - seg(p, 0, .08);

      // SALSAS: letras se desplazan en sentido contrario y la foto flota
      const r = sauces.getBoundingClientRect(), c = clamp((vh - r.top) / (vh + r.height)) - .5;
      sA.style.transform = `translateX(${c * -18}vw)`;
      sC.style.transform = `translateX(${c * 18}vw)`;
      wavy.style.setProperty('--ty', (c * -34) + 'px');

      // frames flotantes de la portada (como las fotos de las esquinas del original)
      // portada: el plato cae mientras el título sube; los marcos salen hacia los lados
      const pl = plateEl;
      if (pl) { const yy = Math.min(y, vh * 1.2); pl.style.setProperty('--py', (yy * 1.6) + 'px'); pl.style.opacity = String(1 - seg(y, vh * .55, vh * 1.05)); }
      flEls.forEach(f => { const dir = (f.classList.contains('fl--a') || f.classList.contains('fl--c')) ? -1 : 1; f.style.transform = 'translate(' + (dir * Math.min(y, vh * 1.2) * .6) + 'px,' + (Math.min(y, vh * 1.2) * .22) + 'px)'; f.style.opacity = String(1 - seg(y, vh * .5, vh * 1.1)); });
      // stickers y marquee
      st2.style.transform = `rotate(${y * .2}deg)`;
      marq.style.transform = `translateX(${-(y * .6) % (marq.scrollWidth / 4)}px)`;

      // MISIÓN: el fondo pasa de vino a verde agua; la tarjeta, de clara a oscura
      const mr = misEl.getBoundingClientRect(), wr = whyEl.getBoundingClientRect();
      const enter = seg(vh * .85 - mr.top, 0, vh * .45);
      const q = seg(vh * .85 - wr.top, vh * .1, vh * .62);
      const tt = Math.round(Math.min(enter, 1 - q) * 200) / 200, qq = Math.round(q * 200) / 200;
      if (tt !== lastT) {
        lastT = tt;
        const bg = mixC(BURG, TEAL, tt);
        document.body.style.background = bg; rootEl.style.background = bg;
        misCols.forEach(([el, c0]) => { const col = mixC(c0, INK, tt); el.style.color = col; if (el.classList.contains('kick')) $$('i', el).forEach(i => (i.style.background = col)); });
        nav.classList.toggle('lite', tt > .5);
      }
      if (qq !== lastQ) { lastQ = qq; whyEl.style.setProperty('--q', qq); }
    }
  }
  /* ---------- Tarjeta "por qué" ---------- */
  const why = [
    ['Nos encanta hacer hamburguesas que saben a recién hechas: pan crocante, carne jugosa y salsas de la casa.', 'Cada pedido se arma cuando lo pides. Por eso llega caliente, y por eso no tenemos nada recalentándose en el mostrador.'],
    ['Verduras cortadas en el día, queso que se derrite sobre la carne caliente y pan tostado en la misma plancha.', 'Compramos poco y seguido para que lo que llega a tu mesa esté fresco, sin guardar de un día para otro.'],
    ['Nada de congelados ni de bolsas calentadas al microondas: aquí todo se cocina al momento.', 'Si algo no está en su mejor punto, no sale de la cocina. Así de simple.'],
    ['Ají de la casa, mayo ahumada y chimichurri: las preparamos aquí, en tandas chicas, para que sepan a lo que son.', 'Puedes pedirlas aparte o agregarlas a cualquier burger desde la pestaña Extras de cada producto.'],
  ];
  $$('.wtab').forEach(t => t.addEventListener('click', () => {
    $$('.wtab').forEach(x => { x.classList.toggle('is-active', x === t); x.setAttribute('aria-selected', String(x === t)); });
    const w = why[+t.dataset.w];
    $('#whyBig').textContent = w[0]; $('#whySmall').textContent = w[1];
    const body = $('.why__body'); body.classList.remove('sw'); void body.offsetWidth; body.classList.add('sw');
    if (!RM) $$('.why__grid svg').forEach((s, i) => s.animate([{ transform: 'scale(.8) rotate(-8deg)', opacity: .4 }, { transform: 'none', opacity: 1 }], { duration: 380, delay: i * 40, easing: 'cubic-bezier(.23,1,.32,1)', fill: 'backwards' }));
  }));

  renderCars();
  observeRv();

  /* Animaciones infinitas: solo corren cuando se ven */
  const animEls = $$('.why__grid svg, .pin, .plate, .scrollhint span');
  const aio = new IntersectionObserver(es => es.forEach(e => { e.target.style.animationPlayState = e.isIntersecting ? 'running' : 'paused'; }), { rootMargin: '80px' });
  animEls.forEach(el => { el.style.animationPlayState = 'paused'; aio.observe(el); });

  const req =() => { if (!ticking) { ticking = true; requestAnimationFrame(frame); } };
  addEventListener('scroll', req, { passive: true });
  addEventListener('resize', req);
  frame();
})();
