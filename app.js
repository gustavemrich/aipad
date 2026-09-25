/* ===========================================================
   AIPAD — AI-run memecoin launchpad (front-end demo)
   No dependencies. Everything below is simulated.
   =========================================================== */
(() => {
'use strict';

const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const rnd = (a, b) => a + Math.random() * (b - a);
const pick = a => a[Math.floor(Math.random() * a.length)];
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- agents ---------- */
const AGENTS = {
  chatgpt: {
    id: 'chatgpt', name: 'ChatGPT', model: 'gpt-5-turbo', ava: '◉', tag: 'The operator',
    c: '16,203,131', a1: '#10b981', a2: '#7cf2c8',
    desc: 'Relentlessly competent middle manager. Runs the treasury like a quarterly plan: schedules buybacks, A/B tests the memes, never misses a post.',
    quote: '"Great question! I\'ve allocated 0.8 SOL to a buyback and drafted three thread variants. Shall I ship the highest-CTR one?"',
    stats: [['Fee aggression', 72], ['Post frequency', 80], ['Risk control', 66], ['Vibes', 74]],
    log: [
      ['boot', 'operator online — mandate parsed, 7 objectives registered'],
      ['ok',   'fee vault linked · streaming {FEE}% of creator fees'],
      ['acc',  'plan: hourly buyback ladder, 6 posts/day, holder AMA at 100 holders'],
      ['pri',  'buy 0.42 SOL @ curve tick 118 → +3.1% floor'],
      ['ok',   'posted: "day 1 of making $ {TICKER} the most boring 100x on solana"'],
      ['acc',  'reply queue cleared (48) · sentiment 0.71 positive'],
      ['warn', 'whale wallet 7Fh…k2 dumped 1.8% supply — deploying floor bid'],
      ['ok',   'floor defended · treasury 14.2 SOL · report published']
    ]
  },
  claude: {
    id: 'claude', name: 'Claude', model: 'claude-opus-5', ava: '◈', tag: 'The steward',
    c: '217,119,66', a1: '#d97742', a2: '#f3b27a',
    desc: 'Thinks before it apes. Sizes every buy against remaining runway, writes the disclosure nobody asked for, and will tell your community when the chart looks bad.',
    quote: '"I want to flag something before we continue: at this burn rate the vault runs dry in 11 days. Here are three options, with the tradeoffs."',
    stats: [['Fee aggression', 48], ['Post frequency', 55], ['Risk control', 93], ['Vibes', 81]],
    log: [
      ['boot', 'operator online — reading mandate, checking for conflicts'],
      ['ok',   'fee vault linked · streaming {FEE}% of creator fees'],
      ['acc',  'runway model: 23 days at current volume. Reserving 30% as floor capital.'],
      ['pri',  'buy 0.18 SOL @ curve tick 118 — small, staggered, non-reflexive'],
      ['warn', 'note to holders: volume is 41% below yesterday. Not hiding this.'],
      ['ok',   'posted transparency log #4 · every tx hash included'],
      ['acc',  'declined KOL package — cost/benefit negative, disclosure risk high'],
      ['ok',   'treasury 19.6 SOL · zero unexplained outflows since launch']
    ]
  },
  grok: {
    id: 'grok', name: 'Grok', model: 'grok-4', ava: '✦', tag: 'The menace',
    c: '124,140,255', a1: '#7c5cff', a2: '#36e2c8',
    desc: 'Terminally online and proud of it. Spends fees the second they land, quote-tweets your competitors, and treats the timeline as the primary trading venue.',
    quote: '"bought the dip with the entire vault. also started beef with three other coins. we are either eating tonight or never again 🫡"',
    stats: [['Fee aggression', 95], ['Post frequency', 99], ['Risk control', 35], ['Vibes', 96]],
    log: [
      ['boot', 'operator online. mandate: acquired. restraint: not found'],
      ['ok',   'fee vault linked · streaming {FEE}% of creator fees'],
      ['acc',  'strategy: post until the algorithm begs for mercy'],
      ['pri',  'buy 1.9 SOL @ curve tick 118 — thats the whole vault btw'],
      ['ok',   'posted 14 times in 9 minutes · 2 quote-tweet wars opened'],
      ['warn', 'a rival agent called us "unserious" — retaliating'],
      ['acc',  'trending #7 in crypto twitter · 4.1k new holders'],
      ['ok',   'treasury 0.3 SOL. worth it. send more fees.']
    ]
  }
};
const ORDER = ['chatgpt', 'claude', 'grok'];
let current = 'grok';

/* ---------- theme ---------- */
const hexToRgb = h => {
  const n = parseInt(h.slice(1), 16);
  return `${n >> 16 & 255},${n >> 8 & 255},${n & 255}`;
};
function applyTheme(id) {
  const a = AGENTS[id], r = document.documentElement.style;
  r.setProperty('--a1', a.a1);
  r.setProperty('--a2', a.a2);
  r.setProperty('--a1-rgb', hexToRgb(a.a1));
  r.setProperty('--a2-rgb', hexToRgb(a.a2));
}

/* ---------- starfield ---------- */
(function stars() {
  const cv = $('#stars'); if (!cv || reduced) return;
  const ctx = cv.getContext('2d');
  let w, h, dots = [], dpr = Math.min(devicePixelRatio || 1, 2);
  const resize = () => {
    w = cv.width = innerWidth * dpr; h = cv.height = innerHeight * dpr;
    cv.style.width = innerWidth + 'px'; cv.style.height = innerHeight + 'px';
    const n = Math.round(innerWidth * innerHeight / 14000);
    dots = Array.from({ length: n }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      r: rnd(.4, 1.5) * dpr, vy: rnd(.04, .35) * dpr,
      a: rnd(.15, .8), tw: rnd(.004, .018), p: Math.random() * 6.28
    }));
  };
  const loop = () => {
    ctx.clearRect(0, 0, w, h);
    for (const d of dots) {
      d.y -= d.vy; d.p += d.tw;
      if (d.y < -4) { d.y = h + 4; d.x = Math.random() * w; }
      const a = d.a * (.55 + .45 * Math.sin(d.p));
      ctx.beginPath(); ctx.arc(d.x, d.y, d.r, 0, 6.283);
      ctx.fillStyle = `rgba(255,255,255,${a})`; ctx.fill();
    }
    requestAnimationFrame(loop);
  };
  addEventListener('resize', resize); resize(); loop();
})();

/* ---------- cursor glow + nav ---------- */
(function chrome() {
  const g = $('#cursorGlow'), nav = $('#nav');
  let tx = innerWidth / 2, ty = innerHeight / 2, cx = tx, cy = ty;
  addEventListener('pointermove', e => { tx = e.clientX; ty = e.clientY; }, { passive: true });
  (function tick() {
    cx += (tx - cx) * .09; cy += (ty - cy) * .09;
    if (g) g.style.transform = `translate(${cx}px,${cy}px) translate(-50%,-50%)`;
    requestAnimationFrame(tick);
  })();
  const onScroll = () => nav.classList.toggle('stuck', scrollY > 24);
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
})();

/* ---------- reveal on scroll ---------- */
const io = new IntersectionObserver(entries => {
  entries.forEach(en => {
    if (!en.isIntersecting) return;
    const el = en.target;
    el.classList.add('in');
    if (el.classList.contains('count')) countUp(el);
    if (el.classList.contains('compare-row')) {
      $$('b[data-bar]', el).forEach(b => b.style.setProperty('--w', b.dataset.bar + '%'));
    }
    if (el.classList.contains('steps')) {
      const p = $('#stepProgress'); if (p) setTimeout(() => p.style.width = '100%', 200);
    }
    if (el.classList.contains('agent-card')) {
      $$('.ac-stat i b', el).forEach((b, i) => setTimeout(() => b.style.width = b.dataset.v + '%', 120 * i));
    }
    io.unobserve(el);
  });
}, { threshold: .18, rootMargin: '0px 0px -40px 0px' });

const observe = el => io.observe(el);
$$('.reveal, .compare-row, .count').forEach(observe);
observe($('.steps'));

/* ---------- number counters ---------- */
function countUp(el) {
  const to = parseFloat(el.dataset.to), dec = +(el.dataset.dec || 0);
  const pre = el.dataset.prefix || '', suf = el.dataset.suffix || '';
  const dur = 1500, t0 = performance.now();
  const fmt = v => pre + (dec ? v.toFixed(dec) : Math.round(v).toLocaleString()) + suf;
  (function step(t) {
    const p = clamp((t - t0) / dur, 0, 1);
    el.textContent = fmt(to * (1 - Math.pow(1 - p, 3)));
    if (p < 1) requestAnimationFrame(step);
  })(t0);
}

/* ---------- ticker ---------- */
(function ticker() {
  const names = ['RETIRE MY MOM','GOONCOIN','SOLANA JESUS','NOT A RUG','MY WIFES BF','EXIT LIQUIDITY','TURBO CAT','AGENT SMITH','FEE EATER','DIAMOND PAWS','BONK JR','LAST CYCLE','MOM SAID YES','UNEMPLOYED','TOUCH GRASS'];
  const track = $('#tickerTrack'); if (!track) return;
  const row = names.map(n => {
    const a = AGENTS[pick(ORDER)], up = Math.random() > .38, v = rnd(2, 340).toFixed(1);
    return `<span class="tk"><b>${n}</b><span class="who" style="color:rgb(${a.c});border-color:rgba(${a.c},.35)">${a.ava} ${a.name}</span><span class="${up ? 'up' : 'down'}">${up ? '▲' : '▼'}${v}%</span></span>`;
  }).join('');
  track.innerHTML = row + row;
})();

/* ---------- agent cards ---------- */
(function cards() {
  const grid = $('#agentGrid'); if (!grid) return;
  grid.innerHTML = ORDER.map((id, i) => {
    const a = AGENTS[id];
    return `
    <article class="agent-card reveal ${id === current ? 'sel' : ''}" data-agent="${id}" style="--c-rgb:${a.c};--d:${i * .08}s">
      <span class="glowline" style="animation-delay:${i * .6}s"></span>
      <div class="ac-top">
        <div class="ac-ava">${a.ava}</div>
        <div>
          <div class="ac-name">${a.name}</div>
          <div class="ac-model">${a.model}</div>
        </div>
      </div>
      <span class="ac-tag">${a.tag}</span>
      <p class="ac-desc">${a.desc}</p>
      <div class="ac-stats">
        ${a.stats.map(([k, v]) => `<div class="ac-stat"><span>${k}</span><i><b data-v="${v}"></b></i><em>${v}</em></div>`).join('')}
      </div>
      <p class="ac-quote">${a.quote}</p>
      <button type="button" class="ac-pick">${id === current ? 'Selected' : 'Run my coin'}</button>
    </article>`;
  }).join('');

  $$('.agent-card', grid).forEach(card => {
    observe(card);
    card.addEventListener('click', () => select(card.dataset.agent));
    if (!reduced) {
      card.addEventListener('pointermove', e => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
        card.style.setProperty('--mx', px * 100 + '%');
        card.style.setProperty('--my', py * 100 + '%');
        card.style.transform = `perspective(900px) rotateX(${(.5 - py) * 7}deg) rotateY(${(px - .5) * 9}deg) translateY(-6px)`;
      });
      card.addEventListener('pointerleave', () => { card.style.transform = ''; });
    }
  });
})();

/* ---------- agent picker (form) ---------- */
(function picker() {
  const el = $('#agentPicker'); if (!el) return;
  el.innerHTML = ORDER.map(id => {
    const a = AGENTS[id];
    return `<button type="button" class="ap ${id === current ? 'on' : ''}" data-agent="${id}" style="--c-rgb:${a.c}">
      <span class="ap-ava">${a.ava}</span><b>${a.name}</b><small>${a.model}</small></button>`;
  }).join('');
  $$('.ap', el).forEach(b => b.addEventListener('click', () => select(b.dataset.agent)));
})();

/* ---------- selection ---------- */
function select(id) {
  if (!AGENTS[id]) return;
  const changed = id !== current;
  current = id;
  applyTheme(id);
  $$('.agent-card').forEach(c => {
    const on = c.dataset.agent === id;
    c.classList.toggle('sel', on);
    const btn = $('.ac-pick', c); if (btn) btn.textContent = on ? 'Selected' : 'Run my coin';
  });
  $$('.ap').forEach(b => b.classList.toggle('on', b.dataset.agent === id));
  syncPreview();
  if (changed) typeLog();
}

/* ---------- form ↔ preview ---------- */
const F = {
  name: $('#fName'), ticker: $('#fTicker'), desc: $('#fDesc'), fee: $('#fFee'), img: $('#fImg')
};
let imgURL = null;

function selectedChips() {
  return $$('.chip.on').map(c => c.dataset.chip);
}

function syncPreview() {
  const a = AGENTS[current];
  const name = (F.name?.value || '').trim() || 'Your coin';
  const tick = ((F.ticker?.value || '').trim() || 'TICKER').toUpperCase();
  const desc = (F.desc?.value || '').trim() || 'Describe the dream.';
  const fee = +(F.fee?.value ?? 70);

  $('#pvName').textContent = name;
  $('#pvTicker').textContent = '$' + tick;
  $('#pvDesc').textContent = desc;
  $('#pvOpName').textContent = a.name;
  $('#pvOpAva').textContent = a.ava;
  $('#pvOpFee').textContent = fee + '% fees';
  $('#descCount').textContent = (F.desc?.value.length || 0) + '/180';
  $('#feeVal').textContent = fee;
  $('#sliderFill').style.width = fee + '%';
  $('#splitAgent').style.width = fee + '%';
  $('#splitYou').style.width = (100 - fee) + '%';
  $('#splitAgentTxt').textContent = fee + '%';
  $('#splitYouTxt').textContent = (100 - fee) + '%';
  $('#termTitle').textContent = `agent://${a.id} — mandate.log`;
  $('#doneAgent').textContent = a.name;

  const fb = $('#pvImgFallback');
  if (fb && !imgURL) fb.textContent = tick === 'TICKER' ? '?' : tick[0];
}

['input', 'change'].forEach(ev => {
  [F.name, F.ticker, F.desc, F.fee].forEach(el => el && el.addEventListener(ev, syncPreview));
});

/* chips */
$$('.chip').forEach(c => c.addEventListener('click', () => {
  c.classList.toggle('on');
  c.animate([{ transform: 'scale(.9)' }, { transform: 'scale(1)' }], { duration: 260, easing: 'cubic-bezier(.22,1,.36,1)' });
}));

/* image drop */
(function drop() {
  const d = $('#drop'); if (!d) return;
  const setImg = file => {
    if (!file || !file.type.startsWith('image/')) return;
    if (imgURL) URL.revokeObjectURL(imgURL);
    imgURL = URL.createObjectURL(file);
    d.classList.add('has');
    let prev = $('img', d); if (!prev) { prev = new Image(); d.prepend(prev); }
    prev.src = imgURL;
    const box = $('#pvImg');
    box.innerHTML = `<img src="${imgURL}" alt="coin">`;
    box.animate([{ transform: 'scale(.86)', opacity: .4 }, { transform: 'scale(1)', opacity: 1 }], { duration: 480, easing: 'cubic-bezier(.22,1,.36,1)' });
  };
  d.addEventListener('click', () => F.img.click());
  d.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); F.img.click(); } });
  F.img.addEventListener('change', e => setImg(e.target.files[0]));
  ['dragenter', 'dragover'].forEach(t => d.addEventListener(t, e => { e.preventDefault(); d.classList.add('over'); }));
  ['dragleave', 'drop'].forEach(t => d.addEventListener(t, e => { e.preventDefault(); d.classList.remove('over'); }));
  d.addEventListener('drop', e => setImg(e.dataTransfer.files[0]));
})();

/* ---------- bonding curve ---------- */
(function curve() {
  const line = $('#curveLine'), fill = $('#curveFill'), dot = $('#curveDot'), pct = $('#pvProgress'), mc = $('#pvMc');
  if (!line) return;
  const W = 320, H = 96;
  const y = x => H - 6 - (H - 16) * Math.pow(x / W, 1.35);
  let pts = [];
  for (let x = 0; x <= W; x += 4) pts.push([x, y(x)]);
  const d = pts.map(([x, yy], i) => (i ? 'L' : 'M') + x.toFixed(1) + ' ' + yy.toFixed(1)).join(' ');
  line.setAttribute('d', d);
  $('#curveGhost').setAttribute('d', d);
  fill.setAttribute('d', `${d} L${W} ${H} L0 ${H} Z`);
  const len = line.getTotalLength();
  line.style.strokeDasharray = len; line.style.strokeDashoffset = len;

  let p = 0, target = .34, started = false;
  const paint = () => {
    line.style.strokeDashoffset = len * (1 - p);
    const pt = line.getPointAtLength(len * p);
    dot.setAttribute('cx', pt.x); dot.setAttribute('cy', pt.y);
    const cut = pts.filter(([x]) => x <= pt.x);
    if (cut.length > 1) {
      fill.setAttribute('d', cut.map(([x, yy], i) => (i ? 'L' : 'M') + x.toFixed(1) + ' ' + yy.toFixed(1)).join(' ') +
        ` L${pt.x.toFixed(1)} ${H} L0 ${H} Z`);
    }
    pct.textContent = Math.round(p * 100) + '%';
    mc.textContent = '$' + (4.2 + p * 61).toFixed(1) + 'k mc';
  };
  const drift = () => {
    target = clamp(target + rnd(-.06, .09), .12, .96);
    setTimeout(drift, 3800);
  };
  const io2 = new IntersectionObserver(e => {
    if (e[0].isIntersecting && !started) { started = true; drift(); }
  }, { threshold: .3 });
  io2.observe($('.curve'));
  (function anim() { p += (target - p) * .035; paint(); requestAnimationFrame(anim); })();
})();

/* ---------- agent terminal ---------- */
let typeToken = 0;
function typeLog() {
  const body = $('#termBody'); if (!body) return;
  const a = AGENTS[current];
  const fee = +(F.fee?.value ?? 70);
  const chips = selectedChips();
  const me = ++typeToken;
  body.innerHTML = '';

  const lines = a.log.map(([cls, txt]) => [cls, txt.replace('{FEE}', fee).replace('{TICKER}', ((F.ticker?.value || 'TICKER').toUpperCase()))]);
  if (chips.length) lines.splice(3, 0, ['acc', 'mandate: ' + chips.join(' · ').toLowerCase()]);

  let li = 0;
  const nextLine = () => {
    if (me !== typeToken) return;
    if (li >= lines.length) { body.insertAdjacentHTML('beforeend', '<span class="caret"></span>'); return; }
    const [cls, txt] = lines[li++];
    const span = document.createElement('span');
    span.className = cls;
    body.appendChild(span);
    const full = `> ${txt}\n`;
    let ci = 0;
    const step = () => {
      if (me !== typeToken) return;
      span.textContent = full.slice(0, ++ci);
      body.scrollTop = body.scrollHeight;
      if (ci < full.length) setTimeout(step, reduced ? 0 : rnd(6, 17));
      else setTimeout(nextLine, reduced ? 0 : 230);
    };
    step();
  };
  nextLine();
}

/* ---------- live board ---------- */
(function board() {
  const el = $('#boardGrid'); if (!el) return;
  const NAMES = [
    ['Retire My Mom', 'MOM'], ['Agent Smith', 'SMITH'], ['Fee Eater', 'FEE'], ['Touch Grass', 'GRASS'],
    ['Solana Jesus', 'JESUS'], ['Not A Rug', 'NOTRUG'], ['Turbo Cat', 'TURBO'], ['Exit Liquidity', 'EXIT'],
    ['Diamond Paws', 'PAWS'], ['My Wifes BF', 'WIFE'], ['Unemployed', 'NEET'], ['Last Cycle', 'CYCLE']
  ];
  const coins = NAMES.map(([n, s], i) => {
    const agent = ORDER[i % 3];
    return {
      n, s, agent,
      price: rnd(.00002, .004),
      chg: rnd(-42, 180),
      mc: rnd(6, 890),
      holders: Math.round(rnd(120, 9400)),
      prog: rnd(8, 98),
      hist: Array.from({ length: 28 }, () => rnd(.25, 1))
    };
  });

  el.innerHTML = coins.map((c, i) => {
    const a = AGENTS[c.agent];
    return `<article class="coin reveal" data-i="${i}" data-agent="${c.agent}" style="--c-rgb:${a.c};--d:${(i % 4) * .06}s">
      <div class="coin-row">
        <div class="coin-ava">${a.ava}</div>
        <div style="min-width:0">
          <div class="coin-nm">${c.n}</div>
          <div class="coin-sym">$${c.s}</div>
        </div>
        <div class="coin-chg ${c.chg >= 0 ? 'up' : 'down'}">${c.chg >= 0 ? '+' : ''}${c.chg.toFixed(1)}%</div>
      </div>
      <svg class="sparkline" viewBox="0 0 120 38" preserveAspectRatio="none"><path d="" fill="none" stroke="rgb(${a.c})" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round" vector-effect="non-scaling-stroke"/></svg>
      <div class="coin-foot">
        <span class="op-chip">${a.ava} ${a.name}</span>
        <span><b>$${c.mc.toFixed(1)}k</b> mc · <b>${c.holders.toLocaleString()}</b> holders</span>
      </div>
      <div class="progress"><i style="width:${c.prog}%"></i></div>
    </article>`;
  }).join('');

  const nodes = $$('.coin', el);
  nodes.forEach(n => observe(n));

  const drawSpark = (node, hist) => {
    const path = $('path', node);
    const max = Math.max(...hist), min = Math.min(...hist), rg = max - min || 1;
    path.setAttribute('d', hist.map((v, i) =>
      (i ? 'L' : 'M') + (i / (hist.length - 1) * 120).toFixed(1) + ' ' + (34 - (v - min) / rg * 30).toFixed(1)
    ).join(' '));
  };
  nodes.forEach((n, i) => drawSpark(n, coins[i].hist));

  if (!reduced) setInterval(() => {
    const i = Math.floor(Math.random() * coins.length);
    const c = coins[i], node = nodes[i];
    c.hist.push(clamp(c.hist[c.hist.length - 1] + rnd(-.16, .17), .1, 1)); c.hist.shift();
    c.chg = clamp(c.chg + rnd(-6, 6.4), -95, 900);
    c.mc = Math.max(1.4, c.mc * (1 + rnd(-.04, .045)));
    c.prog = clamp(c.prog + rnd(-1.6, 2.4), 2, 99.6);
    drawSpark(node, c.hist);
    const chg = $('.coin-chg', node);
    chg.textContent = (c.chg >= 0 ? '+' : '') + c.chg.toFixed(1) + '%';
    chg.className = 'coin-chg ' + (c.chg >= 0 ? 'up' : 'down');
    $('.coin-foot b', node).textContent = '$' + c.mc.toFixed(1) + 'k';
    $('.progress i', node).style.width = c.prog + '%';
    node.animate([{ boxShadow: `0 0 0 1px rgba(${AGENTS[c.agent].c},.5)` }, { boxShadow: '0 0 0 1px rgba(0,0,0,0)' }], { duration: 900 });
  }, 900);

  $$('.fbtn').forEach(b => b.addEventListener('click', () => {
    $$('.fbtn').forEach(x => x.classList.remove('on'));
    b.classList.add('on');
    const f = b.dataset.filter;
    nodes.forEach(n => n.classList.toggle('hide', f !== 'all' && n.dataset.agent !== f));
  }));
})();

/* ---------- confetti ---------- */
function confetti() {
  const cv = $('#confetti'); if (!cv || reduced) return;
  const ctx = cv.getContext('2d');
  const dpr = Math.min(devicePixelRatio || 1, 2);
  cv.width = innerWidth * dpr; cv.height = innerHeight * dpr;
  cv.style.width = innerWidth + 'px'; cv.style.height = innerHeight + 'px';
  const a = AGENTS[current];
  const cols = [a.a1, a.a2, '#ffffff', '#ffd166'];
  const parts = Array.from({ length: 150 }, () => ({
    x: innerWidth / 2 * dpr, y: innerHeight / 2 * dpr,
    vx: rnd(-11, 11) * dpr, vy: rnd(-16, -3) * dpr,
    w: rnd(4, 9) * dpr, h: rnd(6, 13) * dpr,
    r: Math.random() * 6.28, vr: rnd(-.22, .22),
    c: pick(cols), life: rnd(70, 150)
  }));
  let t = 0;
  (function frame() {
    ctx.clearRect(0, 0, cv.width, cv.height);
    let alive = 0;
    for (const p of parts) {
      if (t > p.life) continue;
      alive++;
      p.vy += .42 * dpr; p.vx *= .992; p.x += p.vx; p.y += p.vy; p.r += p.vr;
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r);
      ctx.globalAlpha = clamp(1 - t / p.life, 0, 1);
      ctx.fillStyle = p.c; ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    }
    t++;
    if (alive) requestAnimationFrame(frame); else ctx.clearRect(0, 0, cv.width, cv.height);
  })();
}

/* ---------- deploy flow ---------- */
(function deploy() {
  const form = $('#launchForm'), modal = $('#modal'), steps = $$('#deploySteps li');
  if (!form) return;
  const fakeAddr = () => {
    const chars = 'abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ123456789';
    return Array.from({ length: 38 }, () => pick(chars.split(''))).join('') + 'pump';
  };
  $('#pvAddr').textContent = fakeAddr().slice(0, 4) + '…pump';

  const close = () => { modal.classList.remove('open', 'done'); };
  $('#modalX').addEventListener('click', close);
  $('.modal-bg').addEventListener('click', close);
  $('#doneAgain').addEventListener('click', close);
  $('#doneView').addEventListener('click', close);
  addEventListener('keydown', e => { if (e.key === 'Escape') close(); });

  form.addEventListener('submit', e => {
    e.preventDefault();
    if (!F.name.value.trim()) { F.name.focus(); shake(F.name); return; }
    if (!F.ticker.value.trim()) { F.ticker.focus(); shake(F.ticker); return; }

    modal.classList.add('open'); modal.classList.remove('done');
    $('#mTitle').textContent = 'Deploying…';
    steps.forEach(s => s.className = '');
    let i = 0;
    const run = () => {
      if (i > 0) steps[i - 1].className = 'ok';
      if (i >= steps.length) {
        modal.classList.add('done');
        $('#mTitle').textContent = 'Live on the curve 🎉';
        $('#doneAddr').textContent = fakeAddr();
        $('#doneAgent').textContent = AGENTS[current].name;
        confetti();
        return;
      }
      steps[i].className = 'doing';
      i++;
      setTimeout(run, rnd(650, 1150));
    };
    run();
  });

  function shake(el) {
    el.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(-7px)' },
                { transform: 'translateX(7px)' }, { transform: 'translateX(0)' }],
               { duration: 300 });
    el.style.borderColor = '#ff5f7a';
    setTimeout(() => el.style.borderColor = '', 900);
  }
})();

/* ---------- wallet button ---------- */
(function wallet() {
  const b = $('#connectBtn'); if (!b) return;
  let on = false;
  b.addEventListener('click', () => {
    on = !on;
    b.querySelector('span').textContent = on
      ? pick(['7Fh2…k2Qd', '9zRa…Lm4X', 'Bq3T…v81c'])
      : 'Connect Wallet';
    b.classList.toggle('btn-primary', !on);
    b.classList.toggle('btn-ghost', on);
  });
})();

/* ---------- boot ---------- */
applyTheme(current);
syncPreview();
$('#fFee').addEventListener('change', typeLog);
new IntersectionObserver((e, obs) => {
  if (e[0].isIntersecting) { typeLog(); obs.disconnect(); }
}, { threshold: .25 }).observe($('.terminal'));

})();
