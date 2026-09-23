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
window.addEventListener('scroll', ()=>{
  navbar.classList.toggle('compact', window.scrollY > 40);
  highlightActiveSection();
});
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
   source name — real photography needs attribution. Keep `id` unique and
   stable — likes/comments are stored against it, so changing an id later
   resets that photo's reactions. */
const photos = [
  {id:'p1', h:260, cap:'Ganesh PUJO', loc:'Chattogram', img:'i1.jpg', credit:'AYAN DAS'},
  {id:'p2', h:190, cap:'Durga Puja', loc:'Chattogram', img:'i7.jpeg', credit:'Amit D'},
  {id:'p3', h:230, cap:'Maa&Son', loc:'Chattogram', img:'i6.jpeg', credit:'Amit D'},
  {id:'p4', h:200, cap:'Vignaharta', loc:'Chattogram', img:'i4.jpeg', credit:'AYAN DAS'},
  {id:'p5', h:270, cap:'TeriBazar SharodiyaPuja', loc:'Chattogram', img:'i5.jpeg', credit:'Amit D'},
  {id:'p6', h:210, cap:'Jagatmata', loc:'Chattogram', img:'i2.jpeg', credit:'Amit D'},
];
const masonry = document.getElementById('masonryGrid');
const tones = ['#a8462b','#c9a24c','#1f130d','#7a3a24'];
photos.forEach((p,i)=>{
  const tile = document.createElement('div');
  tile.className = 'tile';
  tile.dataset.id = p.id;
  const bg = p.img
    ? `<img class="ph" loading="lazy" src="${p.img}" alt="${p.cap}" style="height:${p.h}px; object-fit:cover;">`
    : `<div class="ph" style="height:${p.h}px; background:linear-gradient(160deg, ${tones[i%tones.length]}, #0a0705); display:flex; align-items:center; justify-content:center; color:var(--cream-dim); font-size:0.68rem; text-align:center; padding:10px;">Add a real photo URL<br>(see photos[] in the script)</div>`;
  tile.innerHTML = `${bg}
    <div class="cap"><strong>${p.cap}</strong><span>${p.loc}${p.credit ? ' · © '+p.credit : ''}</span></div>
    <div class="tile-react" data-id="${p.id}">
      </div>`;
  if(p.img) tile.dataset.src = p.img;
  masonry.appendChild(tile);
});
/* ---------- Gallery lightbox ---------- */
function openLightbox(src){
  const box = document.createElement('div');
  box.style.cssText = 'position:fixed;inset:0;z-index:600;background:rgba(5,3,2,0.92);display:flex;align-items:center;justify-content:center;padding:24px;cursor:zoom-out;';
  box.innerHTML = `<img src="${src}" style="max-width:90vw;max-height:88vh;border-radius:10px;box-shadow:0 20px 60px rgba(0,0,0,0.6);">`;
  box.addEventListener('click', ()=> box.remove());
  document.body.appendChild(box);
}
masonry.addEventListener('click', (e)=>{
  if(e.target.closest('.tile-react')) return; // like/comment button handled separately
  const tile = e.target.closest('.tile');
  if(tile && tile.dataset.src) openLightbox(tile.dataset.src);
});



/* ---------- Contest winners ----------
   Fill this in once judging is done. `photo` is the winning image;
   `cert` is the certificate image (leave '' to show a placeholder until
   the certificate design is ready). `rank` controls the badge text and
   `rankClass` "rank-1" gives the top winner a gold outline. */
const winners = [
    {rank:'🥈 1st Runner-up', rankClass:'', name:'নাম আসবে', cap:'Waiting ', photo:'r1.png', cert:''},
  {rank:'🥇 Winner', rankClass:'rank-1', name:'নাম আসবে', cap:'Waiting ', photo:'winner.png', cert:''},
  {rank:'🥉 2nd Runner-up', rankClass:'', name:'নাম আসবে', cap:'Waiting ', photo:'r2.png', cert:''},
];
const winnersGrid = document.getElementById('winnersGrid');
winners.forEach((w,i)=>{
  const card = document.createElement('div');
  card.className = `winner-card glass ${w.rankClass}`;
  const photoInner = w.photo
    ? `<img src="${w.photo}" alt="${w.name}" loading="lazy">`
    : `<div class="ph" style="height:100%; background:linear-gradient(160deg, ${tones[i%tones.length]}, #0a0705); display:flex; align-items:center; justify-content:center; color:var(--cream-dim); font-size:0.68rem; text-align:center; padding:10px;">Add winning photo<br>(see winners[] in the script)</div>`;
  const certInner = w.cert
    ? `<span class="cert-label">Certificate</span><img src="${w.cert}" alt="Certificate — ${w.name}">`
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
const tracks = [
  {name:'Dhaker Taley', artist:'Traditional • Community Archive', dur:'3:12', src:'sounds/dhaker-taley.mp3', cat:'Dhak'},
  {name:'Elo Je Maa', artist:'Field Recording', dur:'4:00', src:'sounds/elo-je-maa.mp3', cat:'Traditional Songs'},
  {name:'Amar DUGGA', artist:'Temple Recording', dur:'3:45', src:'sounds/amar_dugga.mp3', cat:'Traditional Songs'},
    {name:'Bolo Durga', artist:'Temple Recording', dur:'3:12', src:'sounds/BoloD.mp3', cat:'Traditional Songs'},
  {name:'Sandhya Aarti', artist:'Traditional', dur:'9:00', src:'sounds/sandhya-aarti.mp3', cat:'Aarti'},
  {name:'Dugga Elo', artist:'Traditional', dur:'2:30', src:'sounds/duggaelo.mp3', cat:'Aarti'},
  {name:'Dhak Baja Kashor Baja', artist:'Traditional', dur:'4:22', src:'sounds/dhakBajaKhashorBaja.mp3', cat:'Aarti'},  
  {name:'Rupang Dehi', artist:'Traditional', dur:'4:30', src:'sounds/Rupang-Dehi.mp3', cat:'Aarti'},

  {name:'Chandi Path', artist:'Birendra Krishna Bhadra', dur:'30:15', src:'sounds/chandi-path.mp3', cat:'Chandi Path'},
];

const soundList      = document.getElementById('soundList');
const miniPlayer      = document.getElementById('miniPlayer');
const miniPlayBtn     = document.getElementById('miniPlayBtn');
const miniPrevBtn     = document.getElementById('miniPrevBtn');
const miniNextBtn     = document.getElementById('miniNextBtn');
const miniTrackName   = document.getElementById('miniTrackName');
const miniTrackArtist = document.getElementById('miniTrackArtist');
const miniBar         = document.getElementById('miniBar');
const miniBarFill     = miniBar.querySelector('i');
const mpCurrentTime   = document.getElementById('mpCurrentTime');
const mpDuration      = document.getElementById('mpDuration');
const mpCatLabel      = document.getElementById('mpCatLabel');
const miniShuffleBtn  = document.getElementById('miniShuffle');
const miniRepeatBtn   = document.getElementById('miniRepeat');
const miniListToggle  = document.getElementById('miniListToggle');
const playlistOverlay = document.getElementById('playlistOverlay');
const playlistRows    = document.getElementById('playlistRows');
const mahalayaAudio = new Audio('sounds/chandi-path.mp3');

const audioPlayer = new Audio();       // <-- eita hocche actual audio engine, video-tag-er moto e kaj kore
let currentTrackIndex = null;
let shuffleOn = false;
let repeatOn = false;
const rows = [];
const plRows = [];

function fmtTime(sec){
  if(!isFinite(sec) || sec < 0) sec = 0;
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}
function resetAllIcons(){
  rows.forEach(r => r.querySelector('.play').textContent = '▶');
  plRows.forEach(r => r.el.classList.remove('playing'));
}
function loadTrack(i){
  currentTrackIndex = i;
  audioPlayer.src = tracks[i].src;
  miniTrackName.textContent   = tracks[i].name;
  miniTrackArtist.textContent = tracks[i].artist;
  mpCatLabel.textContent      = tracks[i].cat || 'Puja Sounds';
  miniBarFill.style.width = '0%';
  mpCurrentTime.textContent = '0:00';
  mpDuration.textContent = tracks[i].dur || '0:00';
  miniPlayer.classList.add('show');
  resetAllIcons();
  if(plRows[i]) plRows[i].el.classList.add('playing');
}
function playTrack(i){
  if(currentTrackIndex !== i) loadTrack(i);
  audioPlayer.play();
}
function pickNextIndex(dir){
  if(currentTrackIndex === null) return 0;
  if(shuffleOn){
    if(tracks.length === 1) return 0;
    let i;
    do{ i = Math.floor(Math.random() * tracks.length); } while(i === currentTrackIndex);
    return i;
  }
  return (currentTrackIndex + dir + tracks.length) % tracks.length;
}

tracks.forEach((t, i)=>{
  const row = document.createElement('div');
  row.className = 'sound-row';
  row.innerHTML = `<div class="play">▶</div><div class="meta"><strong>${t.name}</strong><span>${t.artist}</span></div><div class="dur">${t.dur}</div>`;
  row.onclick = ()=>{
    if(currentTrackIndex === i && !audioPlayer.paused){
      audioPlayer.pause();
    } else {
      playTrack(i);
    }
  };
  soundList.appendChild(row);
  rows.push(row);

  const plRow = document.createElement('div');
  plRow.className = 'playlist-row';
  plRow.innerHTML = `<span class="pl-index">${String(i+1).padStart(2,'0')}</span><div class="pl-art"><i class="fa-solid fa-music"></i></div><div class="pl-meta"><strong>${t.name}</strong><span>${t.artist}</span></div><span class="pl-dur">${t.dur}</span>`;
  plRow.onclick = ()=>{
    if(currentTrackIndex === i && !audioPlayer.paused){
      audioPlayer.pause();
    } else {
      playTrack(i);
    }
  };
  playlistRows.appendChild(plRow);
  plRows.push({el: plRow});
});

// Play/pause hole icon (▶ / ❚❚) row-e ebong mini-player dutoi update hobe
audioPlayer.addEventListener('play', ()=>{
  resetAllIcons();
  if(currentTrackIndex !== null){
    rows[currentTrackIndex].querySelector('.play').textContent = '❚❚';
    if(plRows[currentTrackIndex]) plRows[currentTrackIndex].el.classList.add('playing');
  }
  miniPlayBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
});
audioPlayer.addEventListener('pause', ()=>{
  if(currentTrackIndex !== null) rows[currentTrackIndex].querySelector('.play').textContent = '▶';
  miniPlayBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
});
audioPlayer.addEventListener('ended', ()=>{
  if(currentTrackIndex !== null) rows[currentTrackIndex].querySelector('.play').textContent = '▶';
  miniPlayBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
  miniBarFill.style.width = '0%';
  if(repeatOn){
    playTrack(currentTrackIndex);
  } else {
    playTrack(pickNextIndex(1));
  }
});
audioPlayer.addEventListener('loadedmetadata', ()=>{
  mpDuration.textContent = fmtTime(audioPlayer.duration);
});
// Progress bar live update — video player-er progress bar-er moto e
audioPlayer.addEventListener('timeupdate', ()=>{
  if(audioPlayer.duration){
    miniBarFill.style.width = (audioPlayer.currentTime / audioPlayer.duration * 100) + '%';
    mpCurrentTime.textContent = fmtTime(audioPlayer.currentTime);
  }
});
// Bar-e click korle sei jaigay seek kore — video player-e jemon hoy
miniBar.addEventListener('click', (e)=>{
  if(!audioPlayer.duration) return;
  const rect = miniBar.getBoundingClientRect();
  audioPlayer.currentTime = ((e.clientX - rect.left) / rect.width) * audioPlayer.duration;
});

miniPlayBtn.onclick = ()=>{
  if(!currentTrackIndex && currentTrackIndex !== 0) return;
  audioPlayer.paused ? audioPlayer.play() : audioPlayer.pause();
};
miniPrevBtn.onclick = ()=>{
  if(currentTrackIndex === null) return;
  playTrack(pickNextIndex(-1));
};
miniNextBtn.onclick = ()=>{
  if(currentTrackIndex === null) return;
  playTrack(pickNextIndex(1));
};
miniShuffleBtn.onclick = ()=>{
  shuffleOn = !shuffleOn;
  miniShuffleBtn.classList.toggle('active', shuffleOn);
};
miniRepeatBtn.onclick = ()=>{
  repeatOn = !repeatOn;
  miniRepeatBtn.classList.toggle('active', repeatOn);
};
miniListToggle.onclick = ()=>{
  playlistOverlay.classList.add('open');
  miniListToggle.classList.add('active');
};
document.getElementById('playlistClose').onclick = ()=>{
  playlistOverlay.classList.remove('open');
  miniListToggle.classList.remove('active');
};
playlistOverlay.addEventListener('click', (e)=>{
  if(e.target === playlistOverlay){
    playlistOverlay.classList.remove('open');
    miniListToggle.classList.remove('active');
  }
});
document.getElementById('miniClose').onclick = ()=>{
  audioPlayer.pause();
  miniPlayer.classList.remove('show');
  playlistOverlay.classList.remove('open');
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
    event: 'Panchami-Shasthi Transition',
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
    event: 'Maha Navami&Homa',
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
  const {formEl, msg, captchaAnsRef, resetCaptcha, btn} = pendingSubmit;
  pendingSubmit = null;
  msg.textContent = 'Thank you — submitted for review.'; msg.className = 'form-msg ok';
  formEl.reset();
  formEl.querySelectorAll('[data-disabled-by-submit]').forEach(el=>{ el.disabled = false; delete el.dataset.disabledBySubmit; });
  btn.disabled = false;
  captchaAnsRef.val = resetCaptcha();
  setTimeout(()=>{ closeModal(formEl.closest('.modal-overlay').id); msg.textContent=''; }, 1400);
});

function handleSubmit(formEl, msgId, captchaAnsRef, kind, resetCaptcha){
  formEl.addEventListener('submit', (e)=>{
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
    pendingSubmit = {formEl, msg, captchaAnsRef, resetCaptcha, btn};
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
    audioPlayer.pause();                 // mini-player e kichu bajle thamiye dao
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
audioPlayer.addEventListener('play', ()=> mahalayaAudio.pause());
