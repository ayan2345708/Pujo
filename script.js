/* ---------- Navbar compact on scroll ---------- */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', ()=>{
  navbar.classList.toggle('compact', window.scrollY > 40);
});

/* ---------- Mobile drawer ---------- */
const drawerItems = [
  {icon:'⌂', label:'Home', desc:'Cinematic gateway to the archive'},
  {icon:'⏳', label:'Puja Countdown', desc:'Live count to every major tithi'},
  {icon:'📅', label:'Puja Panjika', desc:'Bengali & Gregorian calendar'},
  {icon:'🪔', label:'Puja Updates', desc:'News from pandals across the city'},
  {icon:'🛕', label:'Chattogram Temple Heritage', desc:'Histories, maps, timelines'},
  {icon:'📸', label:'Pujography Contest', desc:'Submit and browse photography'},
  {icon:'🎬', label:'Puja Reels', desc:'Vertical video from the festival'},
  {icon:'🎵', label:'Puja Sounds', desc:'Dhak, shankh, aarti, mantra'},
  {icon:'🕉️', label:'Kahini • Mantra • Slok', desc:'Stories, prayers, verses'},
  {icon:'🌺', label:'Puja Journey', desc:'From Khuti Puja to Visarjan'},
  {icon:'📻', label:'Echoes of Chandi: MAHALAYA', desc:'The dawn broadcast, remembered'},
];
const drawerList = document.getElementById('drawerList');
drawerItems.forEach((it,i)=>{
  const el = document.createElement('div');
  el.className = 'drawer-item';
  el.style.animationDelay = (i*0.05)+'s';
  el.innerHTML = `<span class="num">0${i+1}</span><span class="icon">${it.icon}</span><span class="txt"><strong>${it.label}</strong><span>${it.desc}</span></span>`;
  drawerList.appendChild(el);
});
const drawer = document.getElementById('drawer');
document.getElementById('hamburger').onclick = ()=> drawer.classList.add('open');
document.getElementById('drawerClose').onclick = ()=> drawer.classList.remove('open');

/* ---------- Scroll reveal ---------- */
const io = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); } });
},{threshold:0.15});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

/*-----------VIDEO-------------------*/

const video = document.getElementById("heritageVideo");
const playBtn = document.getElementById("playBtn");
const wrapper = document.querySelector(".video-wrapper");
const playPause =document.getElementById("playPause");
button
const centerIcon= playBtn.querySelector("i");
const controlIcon= playPause.querySelector("i");
const progress= document.getElementById("progress");
const muteBtn= document.getElementById("muteBtn");
function toggleVideo(){
  if(video.paused){
    video.play();
    centerIcon.classList.remove("fa-play");
    centerIcon.classList.add("fa-pause");
    controlIcon.classList.remove("fa-play");
    controlIcon.classList.add("fa-pause");
  } else{
       video.pause();
       centerIcon.classList.remove("fa-pause");
       centerIcon.classList.add("fa-play");
       controlIcon.classList.remove("fa-pause");
       controlIcon.classList.add("fa-play");
  }
}
playBtn.addEventListener("click", toggleVideo);
playPause.addEventListener("click", toggleVideo);


video.addEventListener("ended", () => {

    centerIcon.classList.remove("fa-pause");
    centerIcon.classList.add("fa-play");

    controlIcon.classList.remove("fa-pause");
    controlIcon.classList.add("fa-play");

});

/* ---------- Countdown ---------- */
const events = [
  {name:'Mahalaya', bn:'মহালয়া', date:'2026-10-11T05:30:00'},
  {name:'Maha Shashthi', bn:'ষষ্ঠী', date:'2026-10-16T00:00:00'},
  {name:'Maha Saptami', bn:'সপ্তমী', date:'2026-10-17T00:00:00'},
  {name:'Maha Ashtami', bn:'অষ্টমী', date:'2026-10-18T00:00:00'},
  {name:'Maha Navami', bn:'নবমী', date:'2026-10-19T00:00:00'},
  {name:'Vijayadashami', bn:'বিজয়া দশমী', date:'2026-10-20T00:00:00'},
  {name:'Lakshmi Puja', bn:'লক্ষ্মী পূজা', date:'2026-10-25T00:00:00'},
  {name:'Kali Puja', bn:'কালী পূজা', date:'2026-11-08T00:00:00'},
  {name:'Saraswati Puja', bn:'সরস্বতী পূজা', date:'2027-01-23T00:00:00'},
];
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
   source name — real photography needs attribution. */
const photos = [
  {h:260, cap:'ISKCON Radha Madhava Mandir', loc:'Nandankanan, Chattogram', img:'https://lh3.googleusercontent.com/place-photos/AG9NLjA6zjj_W-fQhGikPUli7xFT6E8Wr41uRUHYs6MQt6DXTzGNcWlvO4YozkNQbeAmj5zNg06SUKHaAhLzKcUmOoupzcwb2jO5PtjzEK0GKmmQ15Cbz0StbsFH6b_0Y3nvvGiNwZ5QuuDWQfRFgw=s4800-w800-h600', credit:'Acyuta Anantananda'},
  {h:190, cap:'Goshaildanga Chowdhury Bari Puja Mondop', loc:'Chattogram', img:'https://lh3.googleusercontent.com/place-photos/AG9NLjByEd05J_4n1KFncPTdUi5tuvDw8U9Aogs3AEvr1DEFaSuYYRGhrgbRZ2KoBNkrQsuZu2EN-t2K0bAF6I8dbu9Bummna_SyH2Dp-Ekr5AHHuEikFu0rpLFsH_fYRkjz1U56mRILo6f7TMyMrr4=s4800-w800-h600', credit:'Shilpi D'},
  {h:230, cap:'ISKCON Prabartak Sri Krishna Mandir', loc:'Prabartak Circle', img:'https://lh3.googleusercontent.com/place-photos/AG9NLjBEZkd-evSfq5NcENUsK7KF8Udm4hJHUcdQfUnXyLZPLLwF9B6nD_ufSLeRgNo3kuFMNPUn72kO3zzUzwTchzcn0RaUioQ1LOZkdF-PHpq-Kj25quZNqEFo_xforTn8_-55optlw6do4gNZocY=s4800-w800-h600', credit:'Sumit Chowdhury'},
  {h:200, cap:'Pilkhana Puja Udayan Parishad', loc:'Pilkhana', img:'https://lh3.googleusercontent.com/place-photos/AG9NLjCCGu6deUs2iCZ40qF2h4OYOaasxyTrEZfNgKNP4kLUUjJsT6lFWyisZJ8iMHx-8kD5P7x8ADFHCnHJ3szWjcM9xv0z-3iJS8kyu1JrEMvzCN9uPz1o-hBZs01vmbXpW5VyEzjdABXpYNYz=s4800-w800-h600', credit:'Chamak Bhattacharjee Jony'},
  {h:270, cap:'Ramakrishna Mission Sevashrama', loc:'Chattogram', img:'https://lh3.googleusercontent.com/place-photos/AG9NLjDT3YmfOjtOBklNguzeU1x_4JOuoZ4W3SvPF1F1aGpqNqwLoP8ySd4OixA0-m6dUp3E9PyYupuE-vwPoYVgD4IGtwC8Sqz9JpSRwVvMY2JMwq7XXmmGJyCrG-rAwrqeRujVdKYgfmSMYyHcfp4=s4800-w800-h600', credit:'Raj Mallick'},
  {h:210, cap:'Sri Sri Kaibalyadham', loc:'Chattogram', img:'https://lh3.googleusercontent.com/grass-cs/ACvplmPeMa6KlRQwX_rVI17BN6EepEet7LeBPNcr_RpCK5kx-N9Mw4RFDA14RCRB98qAndomUSH_AV4kQEMZj4UHdZwR-E9oGJ85hReDJITvzwOM6eOvZe9abGaOrESbP0cBqQfw_37d=s4800-w800-h600', credit:'Kajol Nath'},
];
const masonry = document.getElementById('masonryGrid');
const tones = ['#a8462b','#c9a24c','#1f130d','#7a3a24'];
photos.forEach((p,i)=>{
  const tile = document.createElement('div');
  tile.className = 'tile';
  const bg = p.img
    ? `<img class="ph" loading="lazy" src="${p.img}" alt="${p.cap}" style="height:${p.h}px; object-fit:cover;">`
    : `<div class="ph" style="height:${p.h}px; background:linear-gradient(160deg, ${tones[i%tones.length]}, #0a0705); display:flex; align-items:center; justify-content:center; color:var(--cream-dim); font-size:0.68rem; text-align:center; padding:10px;">Add a real photo URL<br>(see photos[] in the script)</div>`;
  tile.innerHTML = `${bg}<div class="cap"><strong>${p.cap}</strong><span>${p.loc}${p.credit ? ' · © '+p.credit : ''}</span></div>`;
  masonry.appendChild(tile);
});

/* ---------- Sounds list + mini player ---------- */
const tracks = [
  {name:'Dhaker Bol', artist:'Traditional • Community Archive', dur:'3:12'},
  {name:'Shankha Dhwani', artist:'Field Recording', dur:'1:48'},
  {name:'Kansa Ghanta Aarti', artist:'Temple Recording', dur:'4:05'},
  {name:'Sandhya Aarti', artist:'Traditional', dur:'6:20'},
  {name:'Chandi Path (Excerpt)', artist:'Archival Broadcast', dur:'5:40'},
];
const soundList = document.getElementById('soundList');
tracks.forEach(t=>{
  const row = document.createElement('div');
  row.className = 'sound-row';
  row.innerHTML = `<div class="play">▶</div><div class="meta"><strong>${t.name}</strong><span>${t.artist}</span></div><div class="dur">${t.dur}</div>`;
  row.onclick = ()=>{
    document.getElementById('miniTrackName').textContent = t.name;
    document.getElementById('miniTrackArtist').textContent = t.artist;
    document.getElementById('miniPlayer').classList.add('show');
  };
  soundList.appendChild(row);
});
document.getElementById('miniClose').onclick = ()=> document.getElementById('miniPlayer').classList.remove('show');
document.getElementById('miniPlayBtn').onclick = (e)=>{
  e.target.textContent = e.target.textContent === '▶' ? '❚❚' : '▶';
};

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
  {greg:'11 Oct 2026', bn:'১১ অক্টোবর', tithi:'Chaturthi', nakshatra:'—', event:'Mahalaya'},
  {greg:'16 Oct 2026', bn:'১৬ অক্টোবর', tithi:'Shashthi', nakshatra:'—', event:'Bodhon'},
  {greg:'17 Oct 2026', bn:'১৭ অক্টোবর', tithi:'Saptami', nakshatra:'—', event:'Maha Saptami'},
  {greg:'18 Oct 2026', bn:'১৮ অক্টোবর', tithi:'Ashtami', nakshatra:'—', event:'Maha Ashtami'},
  {greg:'19 Oct 2026', bn:'১৯ অক্টোবর', tithi:'Navami', nakshatra:'—', event:'Maha Navami'},
  {greg:'20 Oct 2026', bn:'২০ অক্টোবর', tithi:'Dashami', nakshatra:'—', event:'Vijayadashami'},
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
      <div class="panjika-note">${panLang==='bn'?'যাচাইকৃত পঞ্জিকা প্রয়োজন':'Pending verified Panjika source'}</div>`;
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

/* ---------- Puja Updates ---------- */
const updates = [
  {cat:'Community', title:'Pilkhana Puja Udayan Parishad — one of Chattogram\'s active community puja councils', loc:'Pilkhana', date:'Sample entry', img:'https://lh3.googleusercontent.com/place-photos/AG9NLjDoZO9QsjYCKtmYaYLjVdUtGBaEXG9JjuxMDGaB5l8txonPxhcGb8nKCajRSuF4vbR5EFWukYQZWOlJFOMHJ8dtS79Twn55bmO44c85-45_Tq1TsIJjZvY-Op2VQMlEBKHi8FGWFSEHqg2IEbc=s4800-w800-h600', credit:'Santu Das'},
  {cat:'Temple Life', title:'Ramakrishna Mission Sevashrama continues its daily prayer and community programs', loc:'Chattogram', date:'Sample entry', img:'https://lh3.googleusercontent.com/place-photos/AG9NLjBzLKeO-Ifyn_k65DqTNGqzN6MDeEYlhCbIhho5GK_4pjVWJHcOa5cg_xLwTlaJlyCj5qb0n0xaJgnr94sEY5OxxoMwa_HlLKfIJu1t19_6H_vyVyAfmwajuPb5fx9VFOorDoeGDuG_HFgcJQ=s4800-w800-h600', credit:'Pranta Das Tibra'},
  {cat:'Puja Mondop', title:'Goshaildanga Chowdhury Bari — a long-running family puja mondop in the city', loc:'Chattogram', date:'Sample entry', img:'https://lh3.googleusercontent.com/place-photos/AG9NLjArqNK0eHtdRIK9jBUaHlfdw9qj1Jf3c_H5r1spLx5VhZCk_YbrYKX_P-7hZlja3L3rMFeNRsjXgeV_Dld-aeErJ9MI6D4VDBzFsIZ7W7mCRkHPKWhTcQQLfTn4bMPFdDm4u9xfUTPDsF-wiA=s4800-w800-h600', credit:'Dipak Kumar'},
  {cat:'Temple Life', title:'ISKCON Prabartak Sri Krishna Mandir remains a major evening Aarti destination', loc:'Prabartak Circle', date:'Sample entry', img:'https://lh3.googleusercontent.com/place-photos/AG9NLjDkMoxmDIFEyRiVFWBRjo6seIOHC3nliv3oYQfy6HZFVsmaon4ezfW0_PTJLzAqJ2L5PZ8qT85-tqEhPxX6Xex9iCK3n8FxquCQJtaLWnpRSAKsOExDwP6sZvoHjbXWKPLrgCRbAdhdyMh3SkY=s4800-w720-h600', credit:'Suman Dutta'},
];
const updateGrid = document.getElementById('updateGrid');
const uTones = ['#a8462b','#c9a24c','#7a3a24','#1f130d'];
updates.forEach((u,i)=>{
  const card = document.createElement('div');
  card.className = 'update-card glass';
  const art = u.img
    ? `<div class="update-art"><img src="${u.img}" alt="${u.cat}" loading="lazy" style="width:100%;height:100%;object-fit:cover;"><span class="update-cat">${u.cat}</span></div>`
    : `<div class="update-art" style="background:linear-gradient(150deg, ${uTones[i%uTones.length]}, #0a0705);"><span class="update-cat">${u.cat}</span></div>`;
  card.innerHTML = `${art}
    <div class="update-body">
      <div class="update-meta"><span>${u.loc}</span><span>${u.date}${u.credit ? ' · Photo: '+u.credit : ''}</span></div>
      <h4>${u.title}</h4>
      <span class="update-read">Read More →</span>
    </div>`;
  updateGrid.appendChild(card);
});

/* ---------- Puja Reels ----------
   HOW TO ADD A REAL YOUTUBE VIDEO: paste the video ID (the part after
   "v=" in a YouTube URL, e.g. youtube.com/watch?v=THIS_PART) into the
   `youtubeId` field. Tapping the card then embeds and plays the real
   video. Leave youtubeId:'' to keep the placeholder card. */
const reels = [
  {name:'Dhak Beat Loop', creator:'@chattogram_pujo', loc:'Nandankanan', views:'2.1k', youtubeId:'3GIMI4aJh9M'},
  {name:'Idol Reveal', creator:'@artisan_kolpo', loc:'Sholoshohor', views:'5.4k', youtubeId:'NZjs5FUYqnM'},
  {name:'Sindoor Khela', creator:'@porichoy_cx', loc:'Panchlaish', views:'8.9k', youtubeId:'eUQ4fxI-EZg'},
  {name:'Dhunuchi Naach', creator:'@utsob.cx', loc:'GEC Circle', views:'3.7k', youtubeId:'rQp2uRVf9Ic'},
  {name:'Puja Moments', creator:'@chattogram_pujo', loc:'Chattogram', views:'4.6k', youtubeId:'XehuMK8q9_I'},
];
const reelStrip = document.getElementById('reelStrip');
const rTones = ['#7a3a24','#c9a24c','#a8462b','#1f130d'];
reels.forEach((r,i)=>{
  const card = document.createElement('div');
  card.className = 'reel-card';
  card.innerHTML = `<div class="reel-bg" style="background:linear-gradient(200deg, ${rTones[i%rTones.length]}, #0a0705);"></div>
    <div class="reel-overlay"></div>
    <div class="reel-stats">▶ ${r.views}</div>
    <div class="reel-play">▶</div>
    <div class="reel-info"><strong>${r.name}</strong><span>${r.creator} · ${r.loc}</span></div>`;
  card.querySelector('.reel-play').onclick = ()=>{
    if(r.youtubeId){
      card.innerHTML = `<iframe src="https://www.youtube.com/embed/${r.youtubeId}?autoplay=1" style="position:absolute;inset:0;width:100%;height:100%;border:0;" allow="autoplay; encrypted-media" allowfullscreen loading="lazy"></iframe>`;
    } else {
      card.querySelector('.reel-info span').textContent = 'Add a YouTube video ID in reels[] to play this';
    }
  };
  reelStrip.appendChild(card);
});

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
function openModal(id){ document.getElementById(id).classList.add('open'); }
function closeModal(id){ document.getElementById(id).classList.remove('open'); }
document.getElementById('openPhotoModal').onclick = ()=> openModal('photoModalOverlay');
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

/* ---------- Submission handling (stored via window.storage) ---------- */
async function handleSubmit(formEl, msgId, captchaAnsRef, kind, resetCaptcha){
  formEl.addEventListener('submit', async (e)=>{
    e.preventDefault();
    const msg = document.getElementById(msgId);
    const fd = new FormData(formEl);
    if(fd.get('website')){ // honeypot tripped
      msg.textContent = 'Submission blocked.'; msg.className='form-msg err'; return;
    }
    if(parseInt(fd.get('captcha'),10) !== captchaAnsRef.val){
      msg.textContent = 'That answer doesn\'t look right — please try again.'; msg.className='form-msg err';
      return;
    }
    const entry = {id: Date.now()+'-'+Math.random().toString(36).slice(2,7), kind, status:'pending', submitted: new Date().toISOString()};
    fd.forEach((v,k)=>{ if(k!=='captcha' && k!=='website' && k!=='photo') entry[k] = v; });
    if(fd.get('photo') && fd.get('photo').name) entry.photoName = fd.get('photo').name;
    try{
      const existing = await window.storage.get('submissions:'+kind, true).catch(()=>null);
      const list = existing ? JSON.parse(existing.value) : [];
      list.push(entry);
      await window.storage.set('submissions:'+kind, JSON.stringify(list), true);
      msg.textContent = 'Thank you — submitted for review.'; msg.className='form-msg ok';
      formEl.reset();
      captchaAnsRef.val = resetCaptcha();
      setTimeout(()=>{ closeModal(formEl.closest('.modal-overlay').id); msg.textContent=''; }, 1400);
    }catch(err){
      msg.textContent = 'Something went wrong — please try again.'; msg.className='form-msg err';
    }
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
document.getElementById('adminLink').onclick = (e)=>{ e.preventDefault(); adminOverlay.classList.add('open'); loadAdmin('photo'); };
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

