/* =====================================================================
   চট্টলার পুজো — chat assistant (floating diya button)
   • Needs: data.js loaded first, style.css, and diya.png next to the pages.
   • No server / API: answers come from the site's own data (temples,
     historyTimeline, tracks, pujaEvents) using simple keyword matching,
     in Bengali and English. Add keywords in INTENTS below to teach it more.
   ===================================================================== */
(function(){
  if(window.__pjChat) return;
  window.__pjChat = true;

  const D = {
    temples: typeof temples !== 'undefined' ? temples : [],
    history: typeof historyTimeline !== 'undefined' ? historyTimeline : [],
    tracks:  typeof tracks !== 'undefined' ? tracks : [],
    events:  typeof pujaEvents !== 'undefined' ? pujaEvents : [],
  };
  const ICON = 'diya.png';
  const STORE = 'pj-chat-v1';

  /* ---------- helpers ---------- */
  const esc = (s)=> String(s).replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const toBn = (n)=> String(n).replace(/\d/g, d=> '০১২৩৪৫৬৭৮৯'[d]);
  const N = (s)=> String(s).normalize('NFC');
  const plain = (html)=>{ const d = document.createElement('div'); d.innerHTML = html; return N(d.textContent.replace(/\s+/g,' ').trim()); };
  const onIndex = /(^|\/)(index\.html)?$/.test(location.pathname);
  const link = (hash)=> (onIndex ? '' : 'index.html') + '#' + hash;
  const store = {
    get(){ try{ return JSON.parse(sessionStorage.getItem(STORE)) || {}; }catch(e){ return {}; } },
    set(v){ try{ sessionStorage.setItem(STORE, JSON.stringify(v)); }catch(e){} },
  };

  /* ---------- reply builders ---------- */
  const A = (label, href)=> `<a class="chat-act" href="${href}">${esc(label)}</a>`;
  const B = (label, act)=> `<button type="button" class="chat-act" data-act="${act}">${esc(label)}</button>`;
  const C = (label, ask)=> `<button type="button" class="chat-chip" data-chip="${esc(ask || label)}">${esc(label)}</button>`;
  const acts  = (...items)=> `<div class="chat-acts">${items.join('')}</div>`;
  const chips = (...items)=> `<div class="chat-chips">${items.join('')}</div>`;

  function menu(en){
    return `<p>${en ? 'Pick a topic or just type your question:' : 'নিচের যেকোনো একটি বেছে নিন, অথবা সরাসরি প্রশ্ন লিখুন:'}</p>` +
      chips(
        C(en ? 'Temples' : 'মন্দির সমূহ', 'মন্দির'),
        C(en ? 'When is Puja?' : 'পুজো কবে?', 'পুজো কবে'),
        C(en ? 'Puja songs' : 'পুজোর গান', 'গান'),
        C(en ? 'History' : 'ইতিহাস', 'ইতিহাস'),
        C(en ? 'Submit a photo' : 'ছবি জমা দিন', 'ছবি জমা দিন'),
        C('Reels', 'reels'),
        C(en ? 'Panjika' : 'পঞ্জিকা', 'পঞ্জিকা'),
        C(en ? 'Near me' : 'কাছের পুজো', 'কাছের পুজো')
      );
  }

  /* ---------- countdown ---------- */
  const fmtDate = (d, en)=> d.toLocaleDateString(en ? 'en-GB' : 'bn-BD', {weekday:'long', day:'numeric', month:'long', year:'numeric'});
  function leftText(ms, en){
    const days = Math.floor(ms / 864e5), hrs = Math.floor(ms % 864e5 / 36e5);
    return en ? `${days} days ${hrs} hours left` : `${toBn(days)} দিন ${toBn(hrs)} ঘণ্টা বাকি`;
  }
  function eventLine(ev, en){
    const t = new Date(ev.date), ms = t - new Date();
    const name = en ? ev.name : ev.bn;
    return ms > 0
      ? `<strong>${esc(name)}</strong> — ${esc(fmtDate(t, en))} · ${esc(leftText(ms, en))}`
      : `<strong>${esc(name)}</strong> — ${esc(fmtDate(t, en))} · ${en ? 'already passed' : 'এই তারিখ পেরিয়ে গেছে'}`;
  }
  const cdLink = ()=> acts(A('⏳ Countdown / কাউন্টডাউন', link('countdown')));
  const EVENT_KEYS = [
    ['Mahalaya',  ['মহালয়া','mahalaya','mohalaya']],
    ['Shashthi',  ['ষষ্ঠী','shashthi','sasthi','shosthi','sashti']],
    ['Saptami',   ['সপ্তমী','saptami','shoptomi']],
    ['Ashtami',   ['অষ্টমী','ashtami','oshtomi']],
    ['Navami',    ['নবমী','navami','nabami','nobomi']],
    ['Vijaya',    ['দশমী','বিজয়া','dashami','dashomi','vijaya','bijoya','bijaya']],
    ['Lakshmi',   ['লক্ষ্মী','লক্ষী','lakshmi','lokkhi','laxmi']],
    ['Kali',      ['কালী পূজা','কালীপূজা','কালী পুজো','কালীপুজো','kali puja','kalipuja','kali pujo']],
    ['Saraswati', ['সরস্বতী পূজা','সরস্বতী পুজো','saraswati puja','saraswati pujo']],
  ];
  const findEvent = (q)=>{
    for(const [frag, words] of EVENT_KEYS){
      if(words.some(w=> q.includes(N(w)))){
        const ev = D.events.find(e=> e.name.includes(frag) || (frag === 'Vijaya' && /vijaya/i.test(e.name)));
        if(ev) return ev;
      }
    }
    return null;
  };

  /* ---------- temples ---------- */
  const GENERIC = new Set(['মন্দির','আশ্রম','মঠ','কালী','পরিবারের','temple','mandir','the','of'].map(w=> w.normalize('NFC')));
  const T_ALIAS = {
    'চন্দ্রনাথ':['chandranath','chandranath'],
    'বুড়াকালী':['burakali','bura kali','buro kali','buda kali','বুড়া কালী'],
    'মেধস':['medhas','medhash','medhos'],
    'চটেশ্বরী':['chateshwari','chatteshwari','chotteshwari'],
    'গোলপাহাড়':['golpahar','gol pahar','mahashmashan'],
    'সরস্বতী জ্ঞান':['saraswati gyan','saraswati jnan','gyan mandir','jnan mandir'],
    'ইসকন':['iskcon','prabartak','probortok','krishna mandir'],
  };
  function findTemple(q){
    let best = null, bestScore = 0;
    D.temples.forEach(t=>{
      let score = 0;
      plain(t.name).split(/\s+/).forEach(tok=>{ if(tok.length >= 3 && !GENERIC.has(tok) && q.includes(tok)) score++; });
      Object.keys(T_ALIAS).forEach(k=>{
        if(plain(t.name).includes(N(k)) && T_ALIAS[k].some(a=> q.includes(N(a)))) score += 2;
      });
      if(score > bestScore){ best = t; bestScore = score; }
    });
    return best;
  }
  function excerpt(html, max){
    const text = plain(html);
    const parts = text.split('।');
    let out = '';
    for(const p of parts){
      if((out + p).length > max && out) break;
      out += p.trim() + '। ';
    }
    out = out.trim();
    return out.length > max + 80 ? out.slice(0, max) + '…' : out;
  }
  function templeReply(t, en){
    return `<p><strong>${esc(plain(t.name))}</strong><br><small>📍 ${esc(plain(t.loc))}</small></p>
      <p>${esc(excerpt(t.desc, 260))}</p>` +
      acts(A(en ? 'Read full history' : 'পুরো ইতিহাস পড়ুন', 'temples.html'));
  }

  /* ---------- intents ---------- */
  const has = (q, words)=> words.some(w=> q.includes(N(w)));
  const W = {
    thanks: ['ধন্যবাদ','thanks','thank you','thx','shukriya'],
    greet:  ['নমস্কার','হ্যালো','হাই','সুপ্রভাত','শুভ','hello','hi ','hey','namaskar','assalam'],
    help:   ['সাহায্য','কী করতে','কি করতে','কী পারো','কি পারো','help','what can you','who are you','তুমি কে','আপনি কে','কে তুমি'],
    start:  ['শুরু করুন','get started','menu','মেনু'],
    when:   ['কবে','কত দিন','কতদিন','বাকি','কখন','when','how many days','how long','countdown','kobe','koto din','kotodin','baki','next puja','পরের পুজো','পরবর্তী'],
    durga:  ['দুর্গা','durga','দুর্গোৎসব','sharod','শারদ'],
    temple: ['মন্দির','mandir','temple','মঠ','আশ্রম','ashram','temples','mondir'],
    history:['ইতিহাস','history','itihas','প্রথম দুর্গাপুজো','কাহিনি','কাহিনী','golpo','গল্প','উৎপত্তি','origin','মন্ত্র','শ্লোক','mantra','slok','shlok'],
    sound:  ['গান','শব্দ','ঢাক','শঙ্খ','আরতি','চণ্ডী','sound','song','music','dhak','shankh','aarti','arati','chandi','radio','gaan','audio','bajna','বাজনা'],
    photo:  ['ছবি','ফটো','photo','pujography','contest','প্রতিযোগিতা','chobi','picture','photograph','gallery','গ্যালারি','জমা'],
    update: ['আপডেট','খবর','সংবাদ','নিউজ','news','update','updates','facebook','ফেসবুক','fb post'],
    reel:   ['reel','রিল','ভিডিও','video'],
    panjika:['পঞ্জিকা','তিথি','panjika','tithi','calendar','ক্যালেন্ডার','সময়সূচি','schedule'],
    near:   ['কাছে','কাছের','nearby','near me','near','map','ম্যাপ','মণ্ডপ','pandal','mandap'],
    story:  ['গল্প জমা','story','নিজের গল্প','অভিজ্ঞতা','experience'],
  };

  function answer(raw){
    const q = ' ' + N(raw.toLowerCase().trim()) + ' ';
    const en = !/[\u0980-\u09FF]/.test(raw);
    const L = (bn, e)=> en ? e : bn;

    if(has(q, W.thanks)) return `<p>${L('আপনাকেও ধন্যবাদ 🙏 আর কিছু জানতে চাইলে বলুন।','You\'re welcome 🙏 Ask me anything else about the site.')}</p>`;

    if(has(q, W.start)) return menu(en);

    if(has(q, W.help)) return `<p>${L(
      'আমি এই সাইটের তথ্য থেকে উত্তর দেওয়া একটি সহজ সহায়ক (বট)। মন্দিরের ইতিহাস, পুজোর তারিখ ও কাউন্টডাউন, গান, ছবি জমা দেওয়া ও সাইটের বিভিন্ন অংশ খুঁজে পেতে সাহায্য করতে পারি।',
      'I\'m a simple assistant that answers from this site\'s own content: temple histories, puja dates and countdown, sounds, photo submission, and finding your way around.')}</p>` + menu(en);

    /* specific festival date / countdown */
    const ev = findEvent(q);
    if(ev) return `<p>${eventLine(ev, en)}</p>` + cdLink();

    /* "when is Durga Puja" */
    if(has(q, W.durga) && has(q, W.when)){
      const s = D.events.find(e=> /Shashthi/i.test(e.name)), e2 = D.events.find(e=> /Vijaya/i.test(e.name));
      if(s && e2){
        return `<p>${L('এবছরের দুর্গাপুজো:','This year\'s Durga Puja:')}</p>
          <p>${eventLine(s, en)}<br>${eventLine(e2, en)}</p>
          <p>${(()=>{ const m = D.events.find(x=> /Mahalaya/i.test(x.name)); return m ? eventLine(m, en) : ''; })()}</p>` + cdLink();
      }
    }

    /* generic "when / how long" → next upcoming events */
    if(has(q, W.when) && !has(q, W.temple) && !has(q, W.sound) && !has(q, W.photo)){
      const now = new Date();
      const up = D.events.filter(e=> new Date(e.date) > now).slice(0, 3);
      if(up.length) return `<p>${L('সামনের পুজো ও উৎসব:','Coming up:')}</p><p>${up.map(e=> eventLine(e, en)).join('<br>')}</p>` + cdLink();
    }

    /* a specific temple */
    const t = findTemple(q);
    if(t) return templeReply(t, en);

    /* story submit (before photo, since "জমা" overlaps) */
    if(has(q, W.story)){
      return `<p>${L('আপনার নিজের পুজোর গল্প আমাদের সঙ্গে ভাগ করে নিতে পারেন।','You can share your own puja story with us.')}</p>` +
        acts(onIndex ? B(L('✍️ গল্প জমা দিন','✍️ Share a story'), 'story') : A(L('✍️ গল্প জমা দিন','✍️ Share a story'), link('kahini')));
    }

    /* history */
    if(has(q, W.history)){
      const qTokens = q.split(/\s+/).filter(x=> x.length >= 3);
      let hit = null, hs = 0;
      D.history.forEach(h=>{
        const hay = (h.title + ' ' + h.text).toLowerCase();
        const sc = qTokens.filter(tok=> hay.includes(tok) && !has(tok, W.history)).length;
        if(sc > hs){ hit = h; hs = sc; }
      });
      if(hit) return `<p><strong>${esc(hit.title)}</strong></p><p>${esc(hit.text)}</p>` + acts(A(L('পুরো ইতিহাস ও কাহিনি','Full history & stories'), 'history.html'));
      return `<p>${L('চট্টগ্রামের পুজোর ইতিহাসের কিছু মুহূর্ত:','Some milestones of Chattogram\'s puja history:')}</p><ul>${D.history.slice(0,4).map(h=> `<li>${esc(h.title)}</li>`).join('')}</ul>` +
        acts(A(L('📜 ইতিহাস, কাহিনি ও শ্লোক','📜 History, stories & slok'), 'history.html'));
    }

    /* temple list */
    if(has(q, W.temple)){
      return `<p>${L('আমাদের সংগ্রহে থাকা মন্দির:','Temples on this site:')}</p><ul>${D.temples.map(x=> `<li>${esc(plain(x.name))}</li>`).join('')}</ul>
        <p><small>${L('কোনো মন্দিরের নাম লিখলে তার সংক্ষিপ্ত ইতিহাস বলে দেব।','Type a temple\'s name and I\'ll summarise its history.')}</small></p>` +
        acts(A(L('🛕 সব মন্দির দেখুন','🛕 See all temples'), 'temples.html'));
    }

    /* sounds */
    if(has(q, W.sound)){
      const names = D.tracks.map(x=> `<li>${esc(x.name)}${x.cat ? ' <small>· ' + esc(x.cat) + '</small>' : ''}</li>`).join('');
      return `<p>${L('পুজোর শব্দ ও গান:','Puja sounds & songs:')}</p><ul>${names}</ul>` +
        acts(A(L('🎵 শুনুন','🎵 Listen'), 'sounds.html'), A(L('হোমপেজে দেখুন','On the homepage'), link('sounds')));
    }

    /* photos */
    if(has(q, W.photo)){
      return `<p>${L('Pujography-তে আপনার তোলা পুজোর ছবি জমা দিতে পারেন। সবার ছবি একসঙ্গে দেখতেও পারেন।','Submit your own puja photographs to Pujography, or browse everyone\'s photos.')}</p>` +
        acts(A(L('📸 ছবি জমা দিন','📸 Submit a photo'), 'submit.html'), A(L('🖼️ সব ছবি','🖼️ All photos'), 'photos.html'));
    }

    if(has(q, W.update)) return `<p>${L('সাম্প্রতিক খবর ও Facebook পোস্ট এক জায়গায়:','Latest news and Facebook posts in one place:')}</p>` + acts(A(L('📰 সব আপডেট','📰 All updates'), 'updates.html'));

    if(has(q, W.reel)) return `<p>${L('পুজোর ছোট ছোট ভিডিও এক জায়গায়:','Short puja videos in one place:')}</p>` + acts(A('🎬 Reels', 'reels.html'));

    if(has(q, W.panjika)) return `<p>${L('দিনভিত্তিক পুজোর সময়সূচি ও তিথি পঞ্জিকা সেকশনে পাবেন।','Day-by-day puja schedule and tithi are in the Panjika section.')}</p>` + acts(A(L('📅 পঞ্জিকা','📅 Panjika'), link('panjika')));

    if(has(q, W.near)) return `<p>${L('কাছের পুজো খুঁজতে "Near Me" সেকশন ব্যবহার করুন।','Use the "Near Me" section to find pujas close to you.')}</p>` + acts(A(L('📍 কাছের পুজো','📍 Near me'), link('nearme')));

    if(has(q, W.greet)) return `<p>${L('নমস্কার 🙏 কীভাবে সাহায্য করতে পারি?','Namaskar 🙏 How can I help?')}</p>` + menu(en);

    /* last resort: loose search through temple + history text */
    const toks = q.split(/\s+/).filter(x=> x.length >= 3);
    if(toks.length){
      let bestT = null, ts = 0, bestH = null, hs2 = 0;
      D.temples.forEach(x=>{
        const hay = plain(x.name + ' ' + x.loc + ' ' + x.desc).toLowerCase();
        const sc = toks.filter(tok=> hay.includes(tok)).length;
        if(sc > ts){ bestT = x; ts = sc; }
      });
      D.history.forEach(h=>{
        const hay = N((h.era + ' ' + h.title + ' ' + h.text + ' ' + (h.place || '')).toLowerCase());
        const sc = toks.filter(tok=> hay.includes(tok)).length;
        if(sc > hs2){ bestH = h; hs2 = sc; }
      });
      if(bestH && hs2 >= ts && hs2 >= 1){
        return `<p>${L('এটি কি আপনি খুঁজছিলেন?','Is this what you were looking for?')}</p><p><strong>${esc(bestH.title)}</strong></p><p>${esc(bestH.text)}</p>` +
          acts(A(L('পুরো ইতিহাস ও কাহিনি','Full history & stories'), 'history.html'));
      }
      if(bestT && ts >= 1) return `<p>${L('এটি কি আপনি খুঁজছিলেন?','Is this what you were looking for?')}</p>` + templeReply(bestT, en);
    }
    return `<p>${L('দুঃখিত, এই প্রশ্নের উত্তর আমার কাছে নেই। আমি শুধু এই সাইটের তথ্য থেকে উত্তর দিতে পারি।','Sorry, I don\'t have an answer for that — I can only answer from this site\'s content.')}</p>` + menu(en);
  }

  window.pjChatAnswer = answer;   // handy for testing in the console: pjChatAnswer('মহালয়া কবে')

  /* ---------- build UI ---------- */
  const root = document.createElement('div');
  root.className = 'chat-root';
  root.innerHTML = `
    <button type="button" class="chat-fab" id="chatFab" aria-label="চ্যাট খুলুন / Open chat">
      <img src="${ICON}" alt="" draggable="false">
      <span class="chat-fab-hint" id="chatHint">কিছু জানতে চান? 🙏</span>
    </button>
    <section class="chat-panel" id="chatPanel" role="dialog" aria-label="চট্টলার পুজো সহায়ক" aria-hidden="true">
      <header class="chat-head">
        <img class="chat-av" src="${ICON}" alt="">
        <div class="chat-title"><strong>চট্টলার পুজো সহায়ক</strong><small>Puja Assistant</small></div>
        <button type="button" class="chat-hbtn" id="chatMin" aria-label="Minimize"><i class="fa-solid fa-minus"></i></button>
        <button type="button" class="chat-hbtn" id="chatClose" aria-label="Close and clear chat"><i class="fa-solid fa-xmark"></i></button>
      </header>
      <div class="chat-body" id="chatBody" aria-live="polite"></div>
      <form class="chat-input" id="chatForm" autocomplete="off">
        <button type="button" class="chat-mic" id="chatMic" aria-label="Voice input" hidden><i class="fa-solid fa-microphone"></i></button>
        <input type="text" id="chatText" placeholder="আপনার প্রশ্ন লিখুন… / Type a message" maxlength="200" aria-label="Message">
        <button type="submit" class="chat-send" aria-label="Send"><i class="fa-solid fa-arrow-up"></i></button>
      </form>
      <div class="chat-foot">চট্টলার পুজো · সাইটের তথ্য থেকে উত্তর দেয়</div>
    </section>`;
  document.body.appendChild(root);

  const $ = (id)=> document.getElementById(id);
  const fab = $('chatFab'), panel = $('chatPanel'), body = $('chatBody'), form = $('chatForm'), text = $('chatText'), hint = $('chatHint');
  const state = Object.assign({open:false, msgs:[]}, store.get());

  const save = ()=> store.set({open: state.open, msgs: state.msgs.slice(-40)});
  const scrollEnd = ()=>{ body.scrollTop = body.scrollHeight; };

  function addMsg(role, html, persist){
    const m = document.createElement('div');
    m.className = 'chat-msg ' + (role === 'u' ? 'user' : 'bot');
    m.innerHTML = html;
    body.appendChild(m);
    scrollEnd();
    if(persist !== false){ state.msgs.push({r: role, h: html}); save(); }
    return m;
  }
  function botSay(html){
    const typing = document.createElement('div');
    typing.className = 'chat-msg bot chat-typing';
    typing.innerHTML = '<span></span><span></span><span></span>';
    body.appendChild(typing); scrollEnd();
    setTimeout(()=>{ typing.remove(); addMsg('b', html); }, 420);
  }
  function send(raw){
    raw = (raw || '').trim();
    if(!raw) return;
    addMsg('u', esc(raw));
    botSay(answer(raw));
  }
  function welcome(){
    addMsg('b', `<p>নমস্কার 🙏 আমি চট্টলার পুজোর সহায়ক।</p><p>মন্দির, পুজোর তারিখ, গান, ইতিহাস বা ছবি — যা জানতে চান, জিজ্ঞাসা করুন।</p>` +
      `<div class="chat-chips right">${C('Get Started', 'get started')}</div>`);
  }

  function setOpen(v){
    state.open = v;
    root.classList.toggle('chat-open', v);
    panel.setAttribute('aria-hidden', v ? 'false' : 'true');
    if(v) stopHint(); else startHint();
    if(v){
      if(!state.msgs.length) welcome();
      setTimeout(()=>{ scrollEnd(); text.focus({preventScroll:true}); }, 60);
    }
    save();
  }
  /* the "কিছু জানতে চান?" bubble keeps fading in and out beside the diya while the chat is closed */
  const HINT_ON_MS = 5000, HINT_OFF_MS = 3500;
  let hintTimer = null;
  function stopHint(){ clearTimeout(hintTimer); hint.classList.remove('show'); }
  function startHint(){
    clearTimeout(hintTimer);
    const step = (visible)=>{
      if(state.open) return;
      hint.classList.toggle('show', visible);
      hintTimer = setTimeout(()=> step(!visible), visible ? HINT_ON_MS : HINT_OFF_MS);
    };
    hintTimer = setTimeout(()=> step(true), 1500);
  }

  /* restore previous conversation (same browser tab session) */
  state.msgs.forEach(m=> addMsg(m.r, m.h, false));
  if(state.open) setOpen(true);

  fab.addEventListener('click', ()=> setOpen(true));
  $('chatMin').addEventListener('click', ()=> setOpen(false));
  $('chatClose').addEventListener('click', ()=>{
    state.msgs = []; body.innerHTML = ''; setOpen(false);
  });
  document.addEventListener('keydown', (e)=>{ if(e.key === 'Escape' && state.open) setOpen(false); });

  form.addEventListener('submit', (e)=>{ e.preventDefault(); const v = text.value; text.value = ''; send(v); });

  body.addEventListener('click', (e)=>{
    const chip = e.target.closest('[data-chip]');
    if(chip){ send(chip.dataset.chip); return; }
    const act = e.target.closest('[data-act]');
    if(act){
      let trigger = null;
      if(act.dataset.act === 'photo') trigger = document.getElementById('openPhotoModal');
      if(act.dataset.act === 'story') trigger = document.querySelector('[data-open="story"]');
      if(trigger){ if(innerWidth < 600) setOpen(false); trigger.click(); }
      return;
    }
    const a = e.target.closest('a[href]');
    if(a && a.getAttribute('href').charAt(0) === '#' && innerWidth < 600) setOpen(false);   // same-page jump: get out of the way on phones
  });

  /* voice input (Chrome / Edge / Android) */
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if(SR){
    const mic = $('chatMic');
    mic.hidden = false;
    let rec = null, listening = false;
    mic.addEventListener('click', ()=>{
      if(listening && rec){ rec.stop(); return; }
      rec = new SR();
      rec.lang = 'bn-BD';
      rec.interimResults = false;
      rec.onstart = ()=>{ listening = true; mic.classList.add('on'); };
      rec.onend   = ()=>{ listening = false; mic.classList.remove('on'); };
      rec.onerror = ()=>{ listening = false; mic.classList.remove('on'); };
      rec.onresult = (ev)=>{ const said = ev.results[0][0].transcript; text.value = said; send(said); text.value = ''; };
      try{ rec.start(); }catch(err){}
    });
  }

  if(!state.open) startHint();
})();
