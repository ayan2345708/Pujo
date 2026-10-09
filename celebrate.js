/* =====================================================================
   চট্টলার পুজো — greeting + fireworks when a countdown ends
   • Needs data.js (pujaEvents, each with a `greet:{t,s}` message).
   • When an event's time arrives, every visitor sees "শুভ নবমী" etc. over
     fireworks — ONCE per event per device (remembered in localStorage).
   • Works for visitors who are already on the page at that moment AND for
     visitors who arrive afterwards (while the greeting is still "fresh").
   • Preview any time:  add  ?celebrate=navami  to a page address
     (also: mahalaya, shashthi, saptami, ashtami, vijaya, lakshmi, kali, saraswati).
   ===================================================================== */
(function(){
  if(window.__pjCelebrate) return;
  window.__pjCelebrate = true;
  if(typeof pujaEvents === 'undefined') return;

  const FRESH_HOURS = 36;           // how long after the moment a newcomer still gets the greeting
  const AUTO_CLOSE_MS = 25000;      // fireworks fade out by themselves after this long
  const KEY = 'pj-greeted-v1';
  const reduced = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  const seenGet = ()=>{ try{ return JSON.parse(localStorage.getItem(KEY)) || {}; }catch(e){ return {}; } };
  const seenAdd = (name)=>{ try{ const s = seenGet(); s[name] = Date.now(); localStorage.setItem(KEY, JSON.stringify(s)); }catch(e){} };
  const esc = (s)=> String(s).replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  const events = pujaEvents.filter(e=> e.greet).map(e=> Object.assign({}, e, {ts: new Date(e.date).getTime()})).sort((a,b)=> a.ts - b.ts);

  /* the event whose moment has arrived and is still "fresh" (until the next event or FRESH_HOURS, whichever is first) */
  function activeEvent(now){
    for(let i = events.length - 1; i >= 0; i--){
      const e = events[i];
      if(now < e.ts) continue;
      const until = Math.min(e.ts + FRESH_HOURS * 36e5, events[i+1] ? events[i+1].ts : Infinity);
      return now < until ? e : null;
    }
    return null;
  }

  let open = false;

  /* ---------- the overlay ---------- */
  function show(ev, preview){
    if(open) return;
    open = true;
    if(!preview) seenAdd(ev.name);

    const style = document.createElement('style');
    style.textContent = `
      .pjc-overlay{position:fixed; inset:0; z-index:2000; display:flex; align-items:center; justify-content:center; padding:20px;
        background:radial-gradient(ellipse at 50% 70%, rgba(60,24,8,.88), rgba(8,4,2,.95)); opacity:0; transition:opacity .8s ease;}
      .pjc-overlay.in{opacity:1;} .pjc-overlay.out{opacity:0;}
      .pjc-canvas{position:absolute; inset:0; width:100%; height:100%; display:block;}
      .pjc-card{position:relative; z-index:2; max-width:640px; width:100%; text-align:center; padding:44px 30px 34px; border-radius:30px;
        background:rgba(22,12,6,.58); border:1px solid rgba(255,214,140,.4); backdrop-filter:blur(10px); -webkit-backdrop-filter:blur(10px);
        box-shadow:0 0 90px rgba(255,150,50,.28), 0 30px 80px rgba(0,0,0,.6);
        transform:translateY(24px) scale(.94); opacity:0; transition:transform 1s cubic-bezier(.2,.9,.25,1) .35s, opacity .9s ease .35s;}
      .pjc-overlay.in .pjc-card{transform:none; opacity:1;}
      .pjc-diya{font-size:2.6rem; display:block; margin-bottom:6px; animation:pjcFloat 3s ease-in-out infinite;}
      .pjc-title{font-family:'Tiro Bangla','Hind Siliguri',serif; font-size:clamp(2.4rem,9vw,4.4rem); line-height:1.25; margin:4px 0 12px;
        background:linear-gradient(180deg,#fff4cf,#ffc95c 55%,#e8862a); -webkit-background-clip:text; background-clip:text; color:transparent;
        filter:drop-shadow(0 4px 18px rgba(255,150,40,.45));}
      .pjc-sub{font-family:'Hind Siliguri',sans-serif; color:#f6e7cf; font-size:clamp(1rem,3.4vw,1.2rem); line-height:1.8; margin-bottom:6px;}
      .pjc-en{font-family:'Inter',sans-serif; color:rgba(246,231,207,.6); font-size:.85rem; letter-spacing:.2em; text-transform:uppercase; margin-bottom:24px;}
      .pjc-btn{font-family:'Hind Siliguri',sans-serif; font-size:1rem; font-weight:600; padding:13px 30px; border-radius:999px; border:none; cursor:pointer;
        background:linear-gradient(135deg,#ffcf6b,#e8862a); color:#2a1204; box-shadow:0 10px 30px rgba(232,134,42,.4); transition:transform .25s;}
      .pjc-btn:hover{transform:scale(1.05);}
      .pjc-x{position:absolute; top:12px; right:14px; z-index:3; width:34px; height:34px; border-radius:50%; border:none; background:rgba(255,255,255,.1); color:#fff; font-size:1rem; cursor:pointer;}
      .pjc-x:hover{background:rgba(255,255,255,.25);}
      @keyframes pjcFloat{0%,100%{transform:translateY(0);}50%{transform:translateY(-8px);}}
      @media (prefers-reduced-motion:reduce){ .pjc-diya{animation:none;} }
    `;
    const ov = document.createElement('div');
    ov.className = 'pjc-overlay';
    ov.setAttribute('role', 'dialog');
    ov.setAttribute('aria-label', ev.greet.t);
    ov.innerHTML = `
      <canvas class="pjc-canvas" aria-hidden="true"></canvas>
      <button type="button" class="pjc-x" aria-label="Close">✕</button>
      <div class="pjc-card">
        <span class="pjc-diya" aria-hidden="true">🪔</span>
        <h2 class="pjc-title">${esc(ev.greet.t)}</h2>
        <p class="pjc-sub">${esc(ev.greet.s)}</p>
        <p class="pjc-en">Happy ${esc(ev.name)}</p>
        <button type="button" class="pjc-btn">উৎসবে প্রবেশ করুন →</button>
      </div>`;
    document.head.appendChild(style);
    document.body.appendChild(ov);
    requestAnimationFrame(()=> requestAnimationFrame(()=> ov.classList.add('in')));

    const stopFx = fireworks(ov.querySelector('canvas'));
    let closed = false;
    const close = ()=>{
      if(closed) return; closed = true;
      clearTimeout(timer);
      document.removeEventListener('keydown', onKey);
      ov.classList.remove('in'); ov.classList.add('out');
      setTimeout(()=>{ stopFx(); ov.remove(); style.remove(); open = false; }, 850);
    };
    const onKey = (e)=>{ if(e.key === 'Escape') close(); };
    document.addEventListener('keydown', onKey);
    ov.querySelector('.pjc-btn').addEventListener('click', close);
    ov.querySelector('.pjc-x').addEventListener('click', close);
    const timer = setTimeout(close, AUTO_CLOSE_MS);
  }

  /* ---------- fireworks (plain canvas, no library) ---------- */
  function fireworks(canvas){
    const ctx = canvas.getContext('2d');
    let W = 0, H = 0, dpr = Math.min(window.devicePixelRatio || 1, 2), raf = 0, stopped = false;
    const rockets = [], sparks = [];
    const COLORS = [[255,214,102],[255,150,50],[255,90,70],[255,255,255],[255,120,190],[120,210,255],[160,255,160]];
    const resize = ()=>{
      W = canvas.clientWidth; H = canvas.clientHeight;
      canvas.width = W * dpr; canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize(); window.addEventListener('resize', resize);

    const launch = (x)=>{
      rockets.push({x: x ?? (W * (0.12 + Math.random() * 0.76)), y: H + 10, vy: -(H * (0.012 + Math.random() * 0.004)) - 6,
        targetY: H * (0.12 + Math.random() * 0.38), c: COLORS[Math.floor(Math.random() * COLORS.length)]});
    };
    const burst = (x, y, c)=>{
      const n = reduced ? 30 : 70 + Math.floor(Math.random() * 40);
      const second = COLORS[Math.floor(Math.random() * COLORS.length)];
      const ring = Math.random() < 0.4;
      for(let i = 0; i < n; i++){
        const a = (Math.PI * 2 * i / n) + (ring ? 0 : Math.random() * 0.4);
        const sp = ring ? 4.2 : 1.5 + Math.random() * 4.6;
        sparks.push({x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, life: 1, decay: 0.008 + Math.random() * 0.012,
          c: (Math.random() < 0.3) ? second : c, size: 1.2 + Math.random() * 1.6});
      }
    };

    let last = performance.now(), nextLaunch = 0;
    const frame = (now)=>{
      if(stopped) return;
      const dt = Math.min(2.2, (now - last) / 16.67); last = now;
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = 'rgba(0,0,0,0.22)';                     // fade old frame => trails
      ctx.fillRect(0, 0, W, H);
      ctx.globalCompositeOperation = 'lighter';

      if(now > nextLaunch){
        const burstOf = 1 + (Math.random() < 0.35 ? 1 : 0);
        for(let i = 0; i < burstOf; i++) launch();
        nextLaunch = now + (reduced ? 1400 : 420 + Math.random() * 520);
      }
      for(let i = rockets.length - 1; i >= 0; i--){
        const r = rockets[i];
        const py = r.y;
        r.y += r.vy * dt; r.vy *= 0.985;
        ctx.strokeStyle = `rgba(${r.c[0]},${r.c[1]},${r.c[2]},.85)`; ctx.lineWidth = 2; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(r.x, py); ctx.lineTo(r.x, r.y); ctx.stroke();      // continuous trail, not dots
        if(r.y <= r.targetY || r.vy > -1.2){ burst(r.x, r.y, r.c); rockets.splice(i, 1); }
      }
      for(let i = sparks.length - 1; i >= 0; i--){
        const s = sparks[i];
        s.vx *= 0.985; s.vy = s.vy * 0.985 + 0.045 * dt;      // drag + gravity
        s.x += s.vx * dt; s.y += s.vy * dt; s.life -= s.decay * dt;
        if(s.life <= 0){ sparks.splice(i, 1); continue; }
        ctx.fillStyle = `rgba(${s.c[0]},${s.c[1]},${s.c[2]},${Math.max(0, s.life)})`;
        ctx.beginPath(); ctx.arc(s.x, s.y, s.size * (0.6 + s.life * 0.6), 0, 6.283); ctx.fill();
      }
      raf = requestAnimationFrame(frame);
    };
    launch(W * 0.3); launch(W * 0.7);
    raf = requestAnimationFrame(frame);
    return ()=>{ stopped = true; cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }

  /* ---------- when to show it ---------- */
  const want = new URLSearchParams(location.search).get('celebrate');
  if(want !== null){
    const w = want.toLowerCase();
    const ev = events.find(e=> w && (e.name.toLowerCase().includes(w) || e.bn.includes(want))) || events.find(e=> /Navami/i.test(e.name)) || events[0];
    if(ev) setTimeout(()=> show(ev, true), 600);            // preview: never marks it as seen
    return;
  }

  function check(){
    if(open) return;
    const ev = activeEvent(Date.now());
    if(ev && !seenGet()[ev.name]) show(ev, false);
  }
  setTimeout(check, 900);               // someone arriving after the moment
  setInterval(check, 1000);             // someone who is already here when the countdown hits zero
})();
