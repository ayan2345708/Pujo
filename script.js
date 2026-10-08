/* ---------- window.storage fallback ----------
   Bookmarks + the demo admin queue call window.storage. Outside the Claude
   artifact sandbox that API doesn't exist, so back it with localStorage. */
if(!window.storage){
  const k = (key, shared)=> (shared ? 'pj-shared:' : 'pj-local:') + key;
  window.storage = {
    async get(key, shared){ const v = localStorage.getItem(k(key, shared)); return v === null ? null : {key, value:v, shared:!!shared}; },
    async set(key, value, shared){ localStorage.setItem(k(key, shared), value); return {key, value, shared:!!shared}; },
    async delete(key, shared){ localStorage.removeItem(k(key, shared)); return {key, deleted:true, shared:!!shared}; },
    async list(prefix = '', shared){
      const base = k('', shared), keys = [];
      for(let i = 0; i < localStorage.length; i++){
        const full = localStorage.key(i);
        if(full.startsWith(base + prefix)) keys.push(full.slice(base.length));
      }
      return {keys, prefix, shared:!!shared};
    }
  };
}

/* Everything below runs inside one function so its const/let names can never
   collide with the globals defined in data.js. */
(function(){

/* ---------- Navbar compact on scroll + active link highlight ---------- */
const navbar = document.getElementById('navbar');
const navLinks = Array.from(document.querySelectorAll('.nav-links a'));
function highlightActiveSection(){
  const fromTop = window.scrollY + 120;
  let current = null;
  navLinks.forEach(link=>{
    const sec = document.querySelector(link.getAttribute('href'));
    if(sec && sec.offsetTop <= fromTop) current = link;
  });
  navLinks.forEach(l=>l.classList.remove('active'));
  if(current) current.classList.add('active');
}
let scrollTick = false;                         // at most one update per frame (scroll fires far more often)
window.addEventListener('scroll', ()=>{
  if(scrollTick) return;
  scrollTick = true;
  requestAnimationFrame(()=>{
    navbar.classList.toggle('compact', window.scrollY > 40);
    highlightActiveSection();
    scrollTick = false;
  });
}, {passive:true});
highlightActiveSection();

/* ---------- Mobile drawer ---------- */
const drawerItems = [
  {icon:'⌂', label:'Home', desc:'Cinematic gateway to the archive', target:'#home'},
  {icon:'⏳', label:'Puja Countdown', desc:'Live count to every major tithi', target:'#countdown'},
  {icon:'📅', label:'Puja Panjika', desc:'Bengali & Gregorian calendar', target:'#panjika'},
  {icon:'🪔', label:'Puja Updates', desc:'News from pandals across the city', target:'#updates'},
  {icon:'🛕', label:'Chattogram Temple Heritage', desc:'Histories, maps, timelines', target:'#temples'},
  {icon:'📸', label:'Pujography Contest', desc:'Submit and browse photography', target:'#gallery'},
  {icon:'🎬', label:'Puja Reels', desc:'Vertical video from the festival', target:'#reels'},
  {icon:'🎵', label:'Puja Sounds', desc:'Dhak, shankh, aarti, mantra', target:'#sounds'},
  {icon:'🕉️', label:'Kahini • Mantra • Slok', desc:'Stories, prayers, verses', target:'#kahini'},
  {icon:'🌺', label:'Puja Journey', desc:'From Khuti Puja to Visarjan', target:'#journey'},
  {icon:'📻', label:'Echoes of Chandi: MAHALAYA', desc:'The dawn broadcast, remembered', target:'#mahalaya'},
];
const drawerList = document.getElementById('drawerList');
const drawer = document.getElementById('drawer');
drawerItems.forEach((it,i)=>{
  const el = document.createElement('a');
  el.href = it.target;
  el.className = 'drawer-item';
  el.style.animationDelay = (i*0.05)+'s';
  el.innerHTML = `<span class="num">0${i+1}</span><span class="icon">${it.icon}</span><span class="txt"><strong>${it.label}</strong><span>${it.desc}</span></span>`;
  el.addEventListener('click', (e)=>{
    e.preventDefault();
    drawer.classList.remove('open');
    const sec = document.querySelector(it.target);
    if(sec){
      setTimeout(()=> sec.scrollIntoView({behavior:'smooth', block:'start'}), 300);
    }
  });
  drawerList.appendChild(el);
});
document.getElementById('hamburger').onclick = ()=> drawer.classList.add('open');
document.getElementById('drawerClose').onclick = ()=> drawer.classList.remove('open');

/* ---------- Scroll reveal ---------- */
const io = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); } });
},{threshold:0.15});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));
/* pause the hero's floating lights / dust once the hero is off-screen */
(function(){
  const hero = document.querySelector('.hero');
  if(!hero || !('IntersectionObserver' in window)) return;
  new IntersectionObserver(([e])=> hero.classList.toggle('fx-paused', !e.isIntersecting), {threshold:0}).observe(hero);
})();
/*----------Embermotion------------*/
const emberContainer =
document.getElementById("ember-container");

for(let i=0;i<8;i++){
    const ember =
    document.createElement("div");
    ember.classList.add("ember");
    ember.style.left =
        Math.random()*100 + "%";
    ember.style.bottom =
        Math.random()*20 + "%";
    ember.style.animationDuration =
        (12 + Math.random()*8) + "s";
    ember.style.animationDelay =
        Math.random()*10 + "s";
    emberContainer.appendChild(ember);

}

/*-----------VIDEO-------------------*/

const video = document.getElementById("heritageVideo");
const playBtn = document.getElementById("playBtn");
const wrapper = document.querySelector(".video-wrapper");
const playPause = document.getElementById("playPause");
const centerIcon = playBtn.querySelector("i");
const controlIcon = playPause.querySelector("i");
const progress = document.getElementById("progress");
const muteBtn = document.getElementById("muteBtn");
const fullscreenBtn = document.getElementById("fullscreenBtn");

function setPlayIcons(playing){
  centerIcon.classList.toggle("fa-play", !playing);
  centerIcon.classList.toggle("fa-pause", playing);
  controlIcon.classList.toggle("fa-play", !playing);
  controlIcon.classList.toggle("fa-pause", playing);
}
function toggleVideo(){
  if(video.paused){ video.play().catch(()=>{}); } else { video.pause(); }
}
playBtn.addEventListener("click", toggleVideo);
playPause.addEventListener("click", toggleVideo);
video.addEventListener("click", toggleVideo);

video.addEventListener("play", ()=>{ wrapper.classList.add("playing"); setPlayIcons(true); });
video.addEventListener("pause", ()=>{ wrapper.classList.remove("playing"); setPlayIcons(false); });
video.addEventListener("ended", ()=>{ wrapper.classList.remove("playing"); setPlayIcons(false); });

/* progress bar: reflect playback, and let the user scrub */
video.addEventListener("timeupdate", ()=>{
  if(video.duration) progress.value = (video.currentTime / video.duration) * 100;
});
progress.addEventListener("input", ()=>{
  if(video.duration) video.currentTime = (progress.value / 100) * video.duration;
});

/* mute toggle */
muteBtn.addEventListener("click", ()=>{
  video.muted = !video.muted;
  muteBtn.innerHTML = `<i class="fa-solid ${video.muted ? 'fa-volume-xmark' : 'fa-volume-high'}"></i>`;
});

/* fullscreen toggle */
fullscreenBtn.addEventListener("click", ()=>{
  if(document.fullscreenElement) document.exitFullscreen();
  else wrapper.requestFullscreen?.().catch(()=>{});
});

/* graceful fallback if the video file hasn't been uploaded yet */
video.addEventListener("error", ()=>{
  wrapper.insertAdjacentHTML("beforeend",
    '<div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:var(--cream-dim);font-size:0.8rem;text-align:center;padding:20px;">Video source not found — upload the media file to enable playback.</div>');
}, { once:true });
const glow =
document.querySelector(".cursor-glow");

let glowX = 0, glowY = 0, glowQueued = false;
document.addEventListener("mousemove",(e)=>{
  glowX = e.clientX; glowY = e.clientY;
  if(glowQueued) return;
  glowQueued = true;
  requestAnimationFrame(()=>{                   // transform only: no layout, no repaint
    glow.style.transform = `translate3d(${glowX}px, ${glowY}px, 0)`;
    glowQueued = false;
  });
}, {passive:true});
/* ---------- Countdown ---------- */
const events = pujaEvents;   // defined in data.js
const countGrid = document.getElementById('countGrid');
events.forEach((ev,i)=>{
  const card = document.createElement('div');
  card.className = 'count-card glass';
  card.innerHTML = `<h3>${ev.name}</h3><div class="bnname bn">${ev.bn}</div>
    <div class="count-nums">
      <div class="count-unit"><div class="num" data-d="${i}">--</div><div class="lbl">DAYS</div></div>
      <div class="count-unit"><div class="num" data-h="${i}">--</div><div class="lbl">HRS</div></div>
      <div class="count-unit"><div class="num" data-m="${i}">--</div><div class="lbl">MIN</div></div>
      <div class="count-unit"><div class="num" data-s="${i}">--</div><div class="lbl">SEC</div></div>
    </div>`;
  countGrid.appendChild(card);
});
/* cursor-follow glow on countdown cards (delegated: cards are created by JS above) */
countGrid.addEventListener('mousemove', (e)=>{
  const card = e.target.closest('.count-card');
  if(!card) return;
  const rect = card.getBoundingClientRect();
  card.style.setProperty('--x', `${e.clientX-rect.left}px`);
  card.style.setProperty('--y', `${e.clientY-rect.top}px`);
});
function tick(){
  const now = new Date();
  events.forEach((ev,i)=>{
    let diff = new Date(ev.date) - now;
    if(diff < 0) diff = 0;
    const d = Math.floor(diff/86400000);
    const h = Math.floor((diff%86400000)/3600000);
    const m = Math.floor((diff%3600000)/60000);
    const s = Math.floor((diff%60000)/1000);
    document.querySelector(`[data-d="${i}"]`).textContent = d;
    document.querySelector(`[data-h="${i}"]`).textContent = String(h).padStart(2,'0');
    document.querySelector(`[data-m="${i}"]`).textContent = String(m).padStart(2,'0');
    document.querySelector(`[data-s="${i}"]`).textContent = String(s).padStart(2,'0');
  });
}
tick(); setInterval(tick, 1000);

/* ---------- Gallery masonry ----------
   HOW TO ADD REAL PHOTOS: paste a direct image URL into the `img` field
   below (e.g. a Wikimedia Commons file URL ending in .jpg/.png, or an
   Unsplash/Pexels direct image link). Leave img:'' to keep the placeholder
   gradient tile. Always keep `credit` filled in with the photographer/
   source name — real photography needs attribution. Keep `id` unique and
   stable — likes/comments are stored against it, so changing an id later
   resets that photo's reactions. */

const masonry = document.getElementById('masonryGrid');

/* Homepage preview size (idea from script1.js). Left at "show all" so no photo
   disappears; set it to e.g. 4 once a "See More Photos" page exists. */
const HOME_GALLERY_LIMIT = 4;
const homePhotos = photos.slice(0, HOME_GALLERY_LIMIT);

/* Tiles + like/comment/lightbox come from data.js (same behaviour as the
   "See More" pages). The photos shown are the ones defined above. */
homePhotos.forEach((p,i)=> masonry.insertAdjacentHTML('beforeend', renderPhotoTileHTML(p,i)));
initGalleryInteractions(masonry, homePhotos);

/* Visitor-submitted photos you have approved (Supabase, see data.js → COMMUNITY).
   Newest first; the full set is on photos.html. Does nothing until COMMUNITY is configured. */
const HOME_COMMUNITY_LIMIT = 6;
loadCommunityPhotos(HOME_COMMUNITY_LIMIT).then(list=>{
  if(!list.length) return;
  masonry.insertAdjacentHTML('afterbegin', list.map((p,i)=> renderPhotoTileHTML(p,i)).join(''));
  initGalleryInteractions(masonry, list);
});

/* ---------- Contest winners ----------
   Fill this in once judging is done. `photo` is the winning image;
   `cert` is the certificate image (leave '' to show a placeholder until
   the certificate design is ready). `rank` controls the badge text and
   `rankClass` "rank-1" gives the top winner a gold outline. */
const localWinners = [
    {rank:'🥈 1st Runner-up', rankClass:'', name:'নাম আসবে', cap:'Waiting ', photo:'r1.png', cert:''},
  {rank:'🥇 Winner', rankClass:'rank-1', name:'নাম আসবে', cap:'Waiting ', photo:'winner.png', cert:''},
  {rank:'🥉 2nd Runner-up', rankClass:'', name:'নাম আসবে', cap:'Waiting ', photo:'r2.png', cert:''},
];
const winnersGrid = document.getElementById('winnersGrid');
localWinners.forEach((w,i)=>{
  const card = document.createElement('div');
  card.className = `winner-card glass ${w.rankClass}`;
  const photoInner = w.photo
    ? `<img src="${w.photo}" alt="${w.name}" loading="lazy">`
    : `<div class="ph" style="height:100%; background:linear-gradient(160deg, ${tones[i%tones.length]}, #0a0705); display:flex; align-items:center; justify-content:center; color:var(--cream-dim); font-size:0.68rem; text-align:center; padding:10px;">Add winning photo<br>(see winners[] in the script)</div>`;
  const certInner = w.cert
    ? `<span class="cert-label">Certificate</span><img src="${w.cert}" alt="Certificate — ${w.name}" loading="lazy" decoding="async">`
    : `<span class="cert-label">Certificate</span><div class="cert-placeholder"></div>`;
  card.innerHTML = `
    <div class="winner-photo">${photoInner}<span class="winner-badge">${w.rank}</span></div>
    <div class="winner-body">
      <div class="name">${w.name}</div>
      <div class="cap">${w.cap}</div>
    </div>
    <div class="winner-cert">${certInner}</div>`;
  winnersGrid.appendChild(card);
});

/* ---------- Sounds list + real audio mini player ---------- */
// 👉 Ekhane প্রতিটা track-e "src" property te tar mp3 file-er path den.
//    File gulo project folder-e ekta "sounds" folder banaiye rakhben, jemon:
//    puja-website/
//      ├─ index.html
//      ├─ sounds/
//      │    ├─ dhaker-taley.mp3
//      │    ├─ elo-je-maa.mp3
//      │    └─ ...
//    Ba direct kono hosted (S3 / Google Drive direct link / Cloudinary etc.) URL o dite paren.
const mahalayaAudio = new Audio();
mahalayaAudio.preload = 'none';                 // download nothing until the visitor presses play
mahalayaAudio.src = 'sounds/chandi-path.mp3';

/* mini-player (tracks[], audioPlayer, shuffle/repeat, playlist overlay —
   shob logic) ekhon shared data.js e ache (initSoundPlayer()), tai
   "See More Sounds"-er moto onno page o eki function use kore, ar
   gaan cholte cholte (currentTime + play state) ekta page theke arekta
   page e navigate korleo continue thake. Homepage-e shob track dekhabo
   bole limit dei na. */
if(typeof initSoundPlayer === 'function'){
  initSoundPlayer();
}else{
  console.warn('data.js not loaded — Puja Sounds player is unavailable. Make sure <script src="data.js"> comes before script.js.');
}

/* ---------- Kahini tabs ---------- */
document.querySelectorAll('.tab-btn').forEach(btn=>{
  btn.onclick = ()=>{
    document.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach(p=>p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(btn.dataset.tab).classList.add('active');
  };
});

/* ---------- Puja Journey timeline ---------- */
const stages = [
  {no:'01', name:'Khuti Puja', bn:'খুঁটি পূজা', desc:'The ritual first stake — marking the start of pandal construction and the season\'s formal beginning.'},
  {no:'02', name:'Idol Making', bn:'প্রতিমা তৈরি', desc:'Kumartuli-style artisans shape clay over straw frames across weeks of quiet, careful work.'},
  {no:'03', name:'Pandal Construction', bn:'প্যান্ডেল নির্মাণ', desc:'Bamboo and fabric rise into elaborate temporary architecture unique to each community.'},
  {no:'04', name:'Mahalaya', bn:'মহালয়া', desc:'The pre-dawn invocation that signals the Goddess\'s arrival is near.'},
  {no:'05', name:'Shashthi to Navami', bn:'ষষ্ঠী থেকে নবমী', desc:'Four days of ritual, music, feasting and community gathering.'},
  {no:'06', name:'Visarjan', bn:'বিসর্জন', desc:'The immersion — a bittersweet farewell that closes the festival until next year.'},
];
const track = document.getElementById('journeyTrack');
stages.forEach(s=>{
  const step = document.createElement('div');
  step.className = 'journey-step';
  step.innerHTML = `<div class="rail"><div class="node"></div><div class="line"></div></div>
    <div class="journey-card glass"><div class="stage-no">${s.no}</div><h4>${s.name} <span class="bn" style="color:var(--cream-dim); font-size:0.85rem;">${s.bn}</span></h4><p>${s.desc}</p></div>`;
  track.appendChild(step);
});

/* ---------- Puja Panjika ---------- */
const panjikaDays = [
  {
    greg: '14 Oct 2026',
    bn: '১৪ অক্টোবর',
    tithi: 'Panchami',
    nakshatra: '—',
    event: 'Panchami Begins',
    details: 'পঞ্চমী শুরু — রাত্রি ১১:৫১-এর পর',
    time: 'রাত্রি ১১:৫১-এর পর'
  },
  {
    greg: '15 Oct 2026',
    bn: '১৫ অক্টোবর',
    tithi: 'Panchami → Shashthi',
    nakshatra: '—',
    event: 'Panchami Ends • Shashthi Begins',
    details: 'পঞ্চমী শেষ রাত্রি ১:৪৩-এ; এরপর ষষ্ঠী শুরু',
    time: 'রাত্রি ১:৪৩'
  },
  {
    greg: '16 Oct 2026',
    bn: '১৬ অক্টোবর',
    tithi: 'Shashthi',
    nakshatra: '—',
    event: 'Durga Shashthi • Bodhon',
    details:
      'ষষ্ঠী পূজা • ষষ্ঠ্যাদি কল্পারম্ভ • ষষ্ঠীবিহিত পূজা • সন্ধ্যায় দেবীর বোধন, আমন্ত্রণ ও অধিবাস',
    time: 'ষষ্ঠী রাত্রি ৩:৪৭ পর্যন্ত'
  },
  {
    greg: '17 Oct 2026',
    bn: '১৭ অক্টোবর',
    tithi: 'Saptami',
    nakshatra: '—',
    event: 'Maha Saptami • Nabapatrika',
    details:
      'সপ্তমী পূজা • নবপত্রিকা প্রবেশ ও স্থাপন • সপ্তম্যাদি কল্পারম্ভ • সপ্তমীবিহিত পূজা • দেবীর ঘোটকে আগমন',
    time: 'সপ্তমী অহোরাত্র'
  },
  {
    greg: '18 Oct 2026',
    bn: '১৮ অক্টোবর',
    tithi: 'Saptami',
    nakshatra: '—',
    event: 'Saptami Puja',
    details:
      'সপ্তমী প্রাতঃ ৫:৫৩ পর্যন্ত • শুক্লা সপ্তমীবিহিত অধিক পূজা • অর্দ্ধরাত্রবিহিত পূজা',
    time: 'সপ্তমী প্রাতঃ ৫:৫৩ পর্যন্ত • অর্দ্ধরাত্র পূজা ১০:৫৯–১১:৪৭'
  },
  {
    greg: '19 Oct 2026',
    bn: '১৯ অক্টোবর',
    tithi: 'Ashtami',
    nakshatra: '—',
    event: 'Maha Ashtami • Sandhi Puja',
    details:
      'মহাষ্টমী পূজা • মহাষ্টম্যাদি কল্পারম্ভ • মহাষ্টমীবিহিত পূজা • বীরাষ্টমী ও মহাষ্টমীর ব্রতোপবাস',
    time: 'মহাষ্টমী দিবা ৭:৫০ পর্যন্ত'
  },
  {
    greg: '20 Oct 2026',
    bn: '২০ অক্টোবর',
    tithi: 'Navami',
    nakshatra: '—',
    event: 'Maha Navami • Navami Homa',
    details:
      'মহানবমী কল্পারম্ভ • মহানবমীবিহিত পূজা • নবরাত্রিক ব্রত সমাপন • অষ্টমী ব্রতের পারণ',
    time: 'মহানবমী দিবা ৯:৩১ পর্যন্ত'
  },
  {
    greg: '21 Oct 2026',
    bn: '২১ অক্টোবর',
    tithi: 'Dashami',
    nakshatra: '—',
    event: 'Vijayadashami • Visarjan',
    details:
      'দশমীবিহিত পূজা সমাপন • দেবীর বিসর্জন • অপরাজিতা পূজা • বিজয়াদশমী কৃত্য • দেবীর নৌকায় গমন',
    time: 'দশমী দিবা ১০:৪৭ পর্যন্ত'
  }
];
const panjikaGrid = document.getElementById('panjikaGrid');
let panLang = 'bn';
function renderPanjika(){
  panjikaGrid.innerHTML = '';
  panjikaDays.forEach(d=>{
    const card = document.createElement('div');
    card.className = 'panjika-card glass';
    card.innerHTML = `<div class="pj-date"><span class="pj-greg">${d.greg}</span><span class="pj-bn ${panLang==='bn'?'bn':''}">${panLang==='bn'?d.bn:d.event}</span></div>
      <div class="panjika-row"><span>${panLang==='bn'?'তিথি':'Tithi'}</span><span>${d.tithi}</span></div>
      <div class="panjika-row"><span>${panLang==='bn'?'নক্ষত্র':'Nakshatra'}</span><span>${d.nakshatra}</span></div>
      <div class="panjika-row"><span>${panLang==='bn'?'অনুষ্ঠান':'Observance'}</span><span>${d.event}</span></div>
      <div class="panjika-note"></div>`;
    panjikaGrid.appendChild(card);
  });
}
renderPanjika();
document.querySelectorAll('.lang-btn').forEach(b=>{
  b.onclick = ()=>{
    document.querySelectorAll('.lang-btn').forEach(x=>x.classList.remove('active'));
    b.classList.add('active');
    panLang = b.dataset.lang;
    renderPanjika();
  };
});

/* footer: media partner logos -> their Facebook pages (data.js → mediaPartners) */
renderMediaPartners(document.getElementById('mediaPartners'));

/* ---------- Puja Updates = your Facebook posts (data.js → fbPosts / FB_PAGE_URL) ---------- */
const updateGrid = document.getElementById('updateGrid');
const HOME_UPDATE_LIMIT = 8;           // posts in the side-scrolling row here; everything is on updates.html
let updateCount = renderFbPosts(updateGrid, fbPosts, HOME_UPDATE_LIMIT);
if(!updateCount && renderFbPage(updateGrid, FB_PAGE_URL)) updateCount = 1;
if(!updateCount) document.getElementById('updateEmpty').style.display = 'block';
else initFbStrip(updateGrid);

/* ---------- Puja Reels (homepage preview) ---------- */
const reelStrip = document.getElementById('reelStrip');
const HOME_REEL_LIMIT = parseInt(reelStrip.dataset.limit, 10) || 3;
if(typeof reels !== 'undefined' && typeof renderReelCardHTML === 'function' && typeof initReelPlayback === 'function'){
  const homeReels = reels.slice(0, HOME_REEL_LIMIT);
  homeReels.forEach((r,i)=> reelStrip.insertAdjacentHTML('beforeend', renderReelCardHTML(r,i)));
  initReelPlayback(reelStrip, homeReels);
}else{
  console.warn('data.js not loaded — Puja Reels unavailable.');
}

/* ---------- Search overlay ---------- */
const searchIndex = [
  {type:'Temple', name:'Chandranath Mandir', anchor:'#temples'},
  {type:'Temple', name:'Jagannath Mandir', anchor:'#temples'},
  {type:'Sound', name:'Dhaker Bol', anchor:'#sounds'},
  {type:'Sound', name:'Shankha Dhwani', anchor:'#sounds'},
  {type:'Slok', name:'Ya Devi Sarvabhuteshu', anchor:'#kahini'},
  {type:'Journey', name:'Visarjan', anchor:'#journey'},
  {type:'Feature', name:'Echoes of Chandi: Mahalaya', anchor:'#mahalaya'},
  {type:'Contest', name:'Pujography Contest', anchor:'#gallery'},
];
/* temples that exist on the page (incl. the new cards) become searchable automatically */
document.querySelectorAll('#temples .temple-card h3').forEach(h=>{
  const name = h.textContent.trim();
  if(name && !searchIndex.some(s=>s.name === name)) searchIndex.push({type:'Temple', name, anchor:'#temples'});
});
const searchOverlay = document.getElementById('searchOverlay');
const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');
function renderSearch(q){
  const list = q ? searchIndex.filter(s=>s.name.toLowerCase().includes(q.toLowerCase())) : searchIndex;
  searchResults.innerHTML = list.map(s=>`<a class="search-result glass" href="${s.anchor}"><span style="color:var(--cream);">${s.name}</span><span>${s.type}</span></a>`).join('');
}
document.getElementById('searchOpen').onclick = ()=>{
  searchOverlay.classList.add('open');
  searchInput.value=''; renderSearch(''); setTimeout(()=>searchInput.focus(), 200);
};
document.getElementById('searchClose').onclick = ()=> searchOverlay.classList.remove('open');
searchOverlay.addEventListener('click', (e)=>{ if(e.target === searchOverlay) searchOverlay.classList.remove('open'); });
searchResults.addEventListener('click', ()=> searchOverlay.classList.remove('open'));
searchInput.addEventListener('input', ()=> renderSearch(searchInput.value));
renderSearch('');

/* ---------- Keyboard shortcuts ---------- */
document.addEventListener('keydown', (e)=>{
  if((e.metaKey || e.ctrlKey) && e.key === 'k'){
    e.preventDefault();
    searchOverlay.classList.add('open');
    searchInput.value=''; renderSearch(''); setTimeout(()=>searchInput.focus(), 200);
  }
  if(e.key === 'Escape'){
    searchOverlay.classList.remove('open');
    drawer.classList.remove('open');
    document.querySelectorAll('.modal-overlay.open').forEach(m=>m.classList.remove('open'));
  }
});

/* ---------- Puja Near Me ---------- */
document.getElementById('nearMeBtn').onclick = ()=>{
  const status = document.getElementById('nearMeStatus');
  const list = document.getElementById('nearMeList');
  status.textContent = 'Requesting location permission…';
  list.innerHTML = '';
  if(!navigator.geolocation){
    status.textContent = 'Geolocation is not supported on this device.';
    return;
  }
  navigator.geolocation.getCurrentPosition(
    (pos)=>{
      status.textContent = `Location found (${pos.coords.latitude.toFixed(2)}, ${pos.coords.longitude.toFixed(2)}) — showing nearby sample listings. Connect a maps/places source for live results.`;
      const nearby = [
        {name:'Nandankanan Mandap', dist:'0.8 km'},
        {name:'Andarkilla Jagannath Mandir', dist:'2.1 km'},
        {name:'GEC Circle Pandal', dist:'3.4 km'},
      ];
      list.innerHTML = nearby.map(n=>`<div class="nearme-row glass"><span>${n.name}</span><span>${n.dist}</span></div>`).join('');
    },
    ()=>{ status.textContent = 'Location permission denied — showing citywide listings instead.'; }
  );
};

/* ---------- Bookmarks (persisted via window.storage) ---------- */
async function toggleBookmark(el, key){
  try{
    const existing = await window.storage.get('bookmarks', false).catch(()=>null);
    let saved = existing ? JSON.parse(existing.value) : [];
    if(saved.includes(key)){
      saved = saved.filter(k=>k!==key);
      el.classList.remove('saved');
    } else {
      saved.push(key);
      el.classList.add('saved');
    }
    await window.storage.set('bookmarks', JSON.stringify(saved), false);
  }catch(err){ console.error('Bookmark storage error', err); }
}
document.querySelectorAll('.kahini-actions span').forEach((el,i)=>{
  if(el.textContent.includes('Save')){
    el.onclick = ()=> toggleBookmark(el, 'kahini-'+i);
  }
});
(async ()=>{
  try{
    const existing = await window.storage.get('bookmarks', false).catch(()=>null);
    if(existing){
      const saved = JSON.parse(existing.value);
      document.querySelectorAll('.kahini-actions span').forEach((el,i)=>{
        if(el.textContent.includes('Save') && saved.includes('kahini-'+i)) el.classList.add('saved');
      });
    }
  }catch(err){}
})();

/* ---------- Modals: open/close ---------- */
const modal =
document.getElementById("kahiniModal");
const kahiniModalTitle =
document.getElementById("modalTitle");
const modalText =
document.getElementById("modalText");
const closeBtn =
document.querySelector(".modal-close");
document.querySelectorAll(".kahini-card")
.forEach(card=>{
   card.addEventListener("click",(e)=>{
      if(e.target.closest(".kahini-actions")) return;   // Listen / Copy / Save keep their own behaviour
      kahiniModalTitle.innerHTML =
        card.querySelector("h4").innerHTML;
        modalText.innerHTML =
        card.querySelector("p").innerHTML;
        modal.classList.add("active");
        document.body.style.overflow="hidden";
    });
});
closeBtn.addEventListener("click",()=>{
      modal.classList.remove("active");
    document.body.style.overflow="";
});
modal.addEventListener("click",(e)=>{
    if(e.target === modal){
        modal.classList.remove("active");
        document.body.style.overflow="";
    }
});
document.addEventListener("keydown",(e)=>{
    if(e.key==="Escape"){
        modal.classList.remove("active");
        document.body.style.overflow="";
    }
});
/*==============TempleArticle==============*/
const templeModal =
document.getElementById("templeModal");
const modalImg =
document.getElementById("modalTempleImg");
const modalLoc =
document.getElementById("modalTempleLoc");
const modalTitle =
document.getElementById("modalTempleTitle");
const modalHistory =
document.getElementById("modalTempleHistory");
document.addEventListener("click",(e)=>{
    const btn = e.target.closest(".temple-read-btn");
    if(!btn) return;
    e.stopPropagation();
    const card = btn.closest(".temple-card");
    const img = card.querySelector("img");
    modalImg.src = img ? img.src : "";
    modalImg.style.display = img ? "" : "none";
    modalLoc.innerHTML = card.querySelector(".loc").innerHTML;
    modalTitle.innerHTML = card.querySelector("h3").innerHTML;
    modalHistory.innerHTML = card.querySelector("p").innerHTML;
    templeModal.classList.add("active");
    document.body.style.overflow="hidden";
});
document
.getElementById("closeTempleModal")
.addEventListener("click",()=>{
    templeModal.classList.remove("active");
    document.body.style.overflow="";

});
templeModal.addEventListener("click",(e)=>{
    if(e.target===templeModal){
        templeModal.classList.remove("active");
        document.body.style.overflow="";
    }
});
document.addEventListener("keydown",(e)=>{
    if(e.key==="Escape"){
        templeModal.classList.remove("active");
        document.body.style.overflow="";
    }
});

function openModal(id){ document.getElementById(id).classList.add('open'); }
function closeModal(id){ document.getElementById(id).classList.remove('open'); }
/* "Submit Your Photograph" is now a normal link to submit.html (Google Form).
   The old pop-up form below is kept in the file but nothing opens it any more. */
document.querySelectorAll('[data-open]').forEach(a=>{
  a.onclick = (e)=>{ e.preventDefault(); openModal(a.dataset.open+'ModalOverlay'); };
});
document.querySelectorAll('.modal-close-x').forEach(x=>{
  x.onclick = ()=> closeModal(x.dataset.close);
});
document.querySelectorAll('.modal-overlay').forEach(ov=>{
  ov.addEventListener('click', (e)=>{ if(e.target === ov) ov.classList.remove('open'); });
});

/* ---------- Simple math captcha (anti-spam) ---------- */
function makeCaptcha(spanId){
  const a = Math.floor(Math.random()*8)+2, b = Math.floor(Math.random()*8)+1;
  document.getElementById(spanId).textContent = `Quick check: what is ${a} + ${b}?`;
  return a+b;
}
let photoCaptchaAns = makeCaptcha('photoCaptchaQ');
let storyCaptchaAns = makeCaptcha('storyCaptchaQ');
let pujaCaptchaAns = makeCaptcha('pujaCaptchaQ');

/* ---------- Submission handling (email via FormSubmit) ---------- */
// 👉 Nijer email dao. Prothom submission er por FormSubmit tomake ekta activation email pathabe, oita confirm korte hobe.
const FORMSUBMIT_URL = 'https://formsubmit.co/shohammallick528@gmail.com';

// Hidden iframe: form ei iframe e submit hoy, tai page reload hoy na
const submitFrame = document.createElement('iframe');
submitFrame.name = 'submitFrame';
submitFrame.style.display = 'none';
document.body.appendChild(submitFrame);
let pendingSubmit = null;

function addHidden(formEl, name, value){
  let el = formEl.querySelector(`input[name="${name}"][data-auto]`);
  if(!el){
    el = document.createElement('input');
    el.type = 'hidden'; el.name = name; el.dataset.auto = '1';
    formEl.appendChild(el);
  }
  el.value = value;
}

submitFrame.addEventListener('load', ()=>{
  if(!pendingSubmit) return;          // iframe er prothom blank load ignore
  const {formEl, msg, captchaAnsRef, resetCaptcha, btn, galleryOk} = pendingSubmit;
  pendingSubmit = null;
  msg.textContent = galleryOk
    ? 'Thank you! আপনার ছবি রিভিউয়ের পর গ্যালারিতে দেখা যাবে।'
    : 'Thank you — submitted for review.';
  msg.className = 'form-msg ok';
  formEl.reset();
  formEl.querySelectorAll('[data-disabled-by-submit]').forEach(el=>{ el.disabled = false; delete el.dataset.disabledBySubmit; });
  btn.disabled = false;
  captchaAnsRef.val = resetCaptcha();
  setTimeout(()=>{ closeModal(formEl.closest('.modal-overlay').id); msg.textContent=''; }, galleryOk ? 2600 : 1400);
});

function handleSubmit(formEl, msgId, captchaAnsRef, kind, resetCaptcha){
  formEl.addEventListener('submit', async (e)=>{
    e.preventDefault();
    const msg = document.getElementById(msgId);
    const btn = formEl.querySelector('button[type="submit"]');
    const fd = new FormData(formEl);

    if(fd.get('website')){ msg.textContent = 'Submission blocked.'; msg.className='form-msg err'; return; }
    if(parseInt(fd.get('captcha'),10) !== captchaAnsRef.val){
      msg.textContent = 'That answer doesn\'t look right — please try again.'; msg.className='form-msg err'; return;
    }
    const file = fd.get('attachment');
    if(file && file.size > 9 * 1024 * 1024){
      msg.textContent = 'Photo too large — please keep it under 9 MB.'; msg.className='form-msg err'; return;
    }

    /* photo form: also publish to the community gallery (held for your approval) */
    let galleryOk = false;
    if(kind === 'photo' && communityEnabled()){
      msg.textContent = 'Uploading your photograph…'; msg.className = 'form-msg';
      btn.disabled = true;
      try{
        await submitCommunityPhoto({file, caption: fd.get('caption'), location: fd.get('location'), credit: fd.get('name')});
        galleryOk = true;
      }catch(err){
        console.warn('Gallery upload failed (the email copy will still be sent):', err);
      }
    }

    // FormSubmit settings
    formEl.action  = FORMSUBMIT_URL;
    formEl.method  = 'POST';
    formEl.enctype = 'multipart/form-data';
    formEl.target  = 'submitFrame';
    addHidden(formEl, '_subject',  `চট্টলার পুজো — new ${kind} submission`);
    addHidden(formEl, '_template', 'table');
    addHidden(formEl, '_captcha',  'false');   // FormSubmit er nijer captcha page off (amader math captcha ache)

    // captcha answer ar honeypot email e jabe na
    formEl.querySelectorAll('[name="captcha"],[name="website"]').forEach(el=>{
      el.disabled = true; el.dataset.disabledBySubmit = '1';
    });

    msg.textContent = 'Sending…'; msg.className = 'form-msg';
    btn.disabled = true;
    pendingSubmit = {formEl, msg, captchaAnsRef, resetCaptcha, btn, galleryOk};
    formEl.submit();   // native submit: submit event abar fire hoy na
  });
}
const photoCaptchaRef = {val: photoCaptchaAns};
const storyCaptchaRef = {val: storyCaptchaAns};
const pujaCaptchaRef = {val: pujaCaptchaAns};
handleSubmit(document.getElementById('photoForm'), 'photoFormMsg', photoCaptchaRef, 'photo', ()=>makeCaptcha('photoCaptchaQ'));
handleSubmit(document.getElementById('storyForm'), 'storyFormMsg', storyCaptchaRef, 'story', ()=>makeCaptcha('storyCaptchaQ'));
handleSubmit(document.getElementById('pujaForm'), 'pujaFormMsg', pujaCaptchaRef, 'puja', ()=>makeCaptcha('pujaCaptchaQ'));

/* ---------- Admin panel ----------
   Demo only: reads/writes SHARED storage (visible to anyone using this
   artifact), since there is no real authentication layer here. A production
   build must gate this behind real auth and move data to a proper backend. */
const adminOverlay = document.getElementById('adminOverlay');
document.getElementById('adminLink').onclick = (e)=>{
  e.preventDefault();
  const pin = prompt('Admin PIN (demo only — replace with real auth before launch):');
  if(pin === null) return;
  if(pin !== '1234'){ alert('Incorrect PIN.'); return; }
  adminOverlay.classList.add('open'); loadAdmin('photo');
};
document.getElementById('adminClose').onclick = ()=> adminOverlay.classList.remove('open');
document.querySelectorAll('.admin-tab-btn').forEach(b=>{
  b.onclick = ()=>{
    document.querySelectorAll('.admin-tab-btn').forEach(x=>x.classList.remove('active'));
    b.classList.add('active');
    loadAdmin(b.dataset.atab);
  };
});
async function loadAdmin(kind){
  const queue = document.getElementById('adminQueue');
  const stats = document.getElementById('adminStats');
  queue.innerHTML = '<div class="admin-empty">Loading…</div>';
  const kinds = ['photo','story','puja'];
  const counts = {};
  for(const k of kinds){
    try{
      const r = await window.storage.get('submissions:'+k, true).catch(()=>null);
      counts[k] = r ? JSON.parse(r.value).filter(x=>x.status==='pending').length : 0;
    }catch(e){ counts[k] = 0; }
  }
  stats.innerHTML = kinds.map(k=>`<div class="admin-stat glass"><div class="n">${counts[k]}</div><div class="l">${k} pending</div></div>`).join('');
  try{
    const r = await window.storage.get('submissions:'+kind, true).catch(()=>null);
    const list = r ? JSON.parse(r.value) : [];
    if(!list.length){ queue.innerHTML = '<div class="admin-empty">No submissions yet.</div>'; return; }
    queue.innerHTML = list.slice().reverse().map(item=>`
      <div class="admin-item glass" data-id="${item.id}">
        <div class="meta">
          <strong>${item.name || item.org || 'Untitled'} ${item.status!=='pending' ? '· '+item.status : ''}</strong>
          <span>${item.caption || item.title || item.details || ''}</span>
        </div>
        <div class="admin-actions">
          <button class="approve" data-act="approved" data-id="${item.id}">Approve</button>
          <button class="reject" data-act="rejected" data-id="${item.id}">Reject</button>
        </div>
      </div>`).join('');
    queue.querySelectorAll('button[data-act]').forEach(btn=>{
      btn.onclick = async ()=>{
        const id = btn.dataset.id, act = btn.dataset.act;
        const r2 = await window.storage.get('submissions:'+kind, true).catch(()=>null);
        const list2 = r2 ? JSON.parse(r2.value) : [];
        const idx = list2.findIndex(x=>x.id===id);
        if(idx>-1){ list2[idx].status = act; await window.storage.set('submissions:'+kind, JSON.stringify(list2), true); }
        loadAdmin(kind);
      };
    });
  }catch(e){ queue.innerHTML = '<div class="admin-empty">Could not load submissions.</div>'; }
}

/* ---------- Mahalaya waveform ---------- */
const wave = document.getElementById('wave');
for(let i=0;i<24;i++){
  const bar = document.createElement('i');
  bar.style.animationDelay = (i*0.06)+'s';
  wave.appendChild(bar);
}
wave.querySelectorAll('i').forEach(i=> i.style.animationPlayState = 'paused');

/* ---------- Mahalaya broadcast player ---------- */
const mahalayaBtn = document.querySelector('.radio-player .play-lg');
const mahalayaNote = document.querySelector('.radio-player div[style*="font-size"]');
const waveBars = () => wave.querySelectorAll('i');

mahalayaAudio.preload = 'metadata';

mahalayaBtn.addEventListener('click', async ()=>{
  if(mahalayaAudio.paused){
    if(window.pujaAudioPlayer) window.pujaAudioPlayer.pause();      // mini-player e kichu bajle thamiye dao
    try{
      await mahalayaAudio.play();
    }catch(err){
      console.error('Mahalaya audio error:', err, mahalayaAudio.error);
      mahalayaNote.textContent = 'Audio file load hocche na — sounds/chandi-path.mp3 check korun';
    }
  } else {
    mahalayaAudio.pause();
  }
});

mahalayaAudio.addEventListener('error', ()=>{
  console.error('Mahalaya audio failed. Code:', mahalayaAudio.error && mahalayaAudio.error.code);
  mahalayaNote.textContent = 'Audio file khuje pawa jayni (sounds/chandi-path.mp3)';
});
mahalayaAudio.addEventListener('play', ()=>{
  mahalayaBtn.textContent = '❚❚';
  waveBars().forEach(i=> i.style.animationPlayState = 'running');
});
['pause','ended'].forEach(ev=>{
  mahalayaAudio.addEventListener(ev, ()=>{
    mahalayaBtn.textContent = '▶';
    waveBars().forEach(i=> i.style.animationPlayState = 'paused');
  });
});

// mini-player bajle Mahalaya thamiye dao
if(window.pujaAudioPlayer) window.pujaAudioPlayer.addEventListener('play', ()=> mahalayaAudio.pause());
})();
