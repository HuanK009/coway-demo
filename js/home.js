/* Coway VN — Trang chủ: hero trượt, tab sản phẩm, accordion giải pháp, video giả lập, form gọi lại */
(function(){
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Hero trượt ---------- */
  function initHero(){
    const frame = document.getElementById('hero'); if(!frame) return;
    const slides = [...frame.querySelectorAll('.hero-slide')];
    const cur = frame.querySelector('.hp-cur');
    const fill = frame.querySelector('.hp-fill');
    const status = document.getElementById('heroStatus');
    const toggle = frame.querySelector('[data-hero="toggle"]');
    const DUR = 6000;
    let idx = 0, elapsed = 0, last = 0, userPaused = reduce, hover = false, raf = 0;

    function go(n, fromUser){
      idx = (n + slides.length) % slides.length;
      slides.forEach((s,i)=>{
        const on = i===idx;
        s.classList.toggle('is-active', on);
        s.toggleAttribute('inert', !on);
        if(on) s.removeAttribute('aria-hidden'); else s.setAttribute('aria-hidden','true');
      });
      cur.textContent = String(idx+1).padStart(2,'0');
      if(fromUser) status.textContent = 'Slide '+(idx+1)+' / '+slides.length;
      elapsed = 0; paint();
    }
    function paint(){ fill.style.transform = 'scaleX('+Math.min(elapsed/DUR,1)+')'; }
    function running(){ return !userPaused && !hover && !document.hidden; }
    function tick(t){
      if(!last) last = t;
      const dt = t - last; last = t;
      if(running()){ elapsed += dt; if(elapsed >= DUR) go(idx+1); else paint(); }
      raf = requestAnimationFrame(tick);
    }
    function setPaused(p){
      userPaused = p;
      toggle.setAttribute('aria-pressed', p);
      toggle.setAttribute('aria-label', p ? 'Tiếp tục tự chạy' : 'Tạm dừng tự chạy');
    }
    frame.addEventListener('click', e=>{
      const b = e.target.closest('[data-hero]'); if(!b) return;
      const a = b.dataset.hero;
      if(a==='prev') go(idx-1, true);
      else if(a==='next') go(idx+1, true);
      else setPaused(!userPaused);
    });
    frame.addEventListener('mouseenter', ()=>hover=true);
    frame.addEventListener('mouseleave', ()=>hover=false);
    frame.addEventListener('focusin', ()=>hover=true);
    frame.addEventListener('focusout', e=>{ if(!frame.contains(e.relatedTarget)) hover=false; });
    frame.addEventListener('keydown', e=>{
      if(e.target.matches('input,textarea')) return;
      if(e.key==='ArrowLeft'){ go(idx-1,true); } else if(e.key==='ArrowRight'){ go(idx+1,true); }
    });
    /* vuốt trên màn cảm ứng */
    let sx=null;
    frame.addEventListener('touchstart', e=>{ sx=e.touches[0].clientX; }, {passive:true});
    frame.addEventListener('touchend', e=>{ if(sx===null) return; const dx=e.changedTouches[0].clientX-sx; if(Math.abs(dx)>50) go(idx+(dx<0?1:-1),true); sx=null; });
    setPaused(userPaused);
    go(0);
    raf = requestAnimationFrame(tick);
  }

  /* ---------- Tab sản phẩm ---------- */
  function initTabs(){
    const list = document.querySelector('.seg[role="tablist"]'); if(!list) return;
    const tabs = [...list.querySelectorAll('[role="tab"]')];
    function select(t, focus){
      tabs.forEach(x=>{
        const on = x===t;
        x.setAttribute('aria-selected', on);
        x.tabIndex = on ? 0 : -1;
        document.getElementById(x.getAttribute('aria-controls')).hidden = !on;
      });
      if(focus) t.focus();
    }
    list.addEventListener('click', e=>{ const t=e.target.closest('[role="tab"]'); if(t) select(t); });
    list.addEventListener('keydown', e=>{
      const i = tabs.indexOf(document.activeElement); if(i<0) return;
      let n = null;
      if(e.key==='ArrowRight') n=(i+1)%tabs.length;
      else if(e.key==='ArrowLeft') n=(i-1+tabs.length)%tabs.length;
      else if(e.key==='Home') n=0; else if(e.key==='End') n=tabs.length-1;
      if(n!==null){ e.preventDefault(); select(tabs[n], true); }
    });
  }

  /* ---------- Accordion ngang — Giải pháp theo không gian ---------- */
  function initSolutions(){
    const wrap = document.getElementById('solCards'); if(!wrap) return;
    const cards = [...wrap.querySelectorAll('.sol-card')];
    let hoverT;
    function open(card){
      if(card.classList.contains('is-active')) return;
      cards.forEach(c=>{
        const on = c===card;
        c.classList.toggle('is-active', on);
        c.querySelector('.sol-trigger').setAttribute('aria-expanded', on);
        c.querySelector('.sol-body').toggleAttribute('inert', !on);
      });
    }
    cards.forEach(c=>{
      if(!c.classList.contains('is-active')) c.querySelector('.sol-body').setAttribute('inert','');
      const trg = c.querySelector('.sol-trigger');
      trg.addEventListener('click', ()=>{ open(c); c.querySelector('.sol-body a')?.focus({preventScroll:true}); });
      c.addEventListener('mouseenter', ()=>{
        if(!window.matchMedia('(hover:hover) and (min-width:1025px)').matches) return;
        clearTimeout(hoverT); hoverT = setTimeout(()=>open(c), 140);
      });
      c.addEventListener('mouseleave', ()=>clearTimeout(hoverT));
    });
  }

  /* ---------- Modal video giả lập ---------- */
  function initVideo(){
    const m = document.getElementById('vmodal'); if(!m) return;
    let opener = null;
    function close(){ m.hidden = true; document.body.classList.remove('no-scroll'); opener?.focus(); }
    document.addEventListener('click', e=>{
      const o = e.target.closest('[data-video]');
      if(o){ opener=o; m.hidden=false; document.body.classList.add('no-scroll'); m.querySelector('.vm-close').focus(); return; }
      if(e.target.closest('[data-vclose]')) close();
    });
    document.addEventListener('keydown', e=>{
      if(m.hidden) return;
      if(e.key==='Escape') close();
      if(e.key==='Tab'){ e.preventDefault(); m.querySelector('.vm-close').focus(); } /* chỉ có 1 phần tử tương tác */
    });
  }

  /* ---------- Form gọi lại ---------- */
  function initCallback(){
    const f = document.getElementById('ctaForm'); if(!f) return;
    const input = document.getElementById('ctaPhone');
    const msg = document.getElementById('ctaMsg');
    const done = document.getElementById('ctaDone');
    const num = document.getElementById('ctaNum');
    const clean = v => v.replace(/[\s.\-()]/g,'').replace(/^\+?84/,'0');
    const valid = v => /^0(3|5|7|8|9)\d{8}$/.test(v);
    const pretty = v => v.replace(/^(\d{4})(\d{3})(\d{3})$/,'$1 $2 $3');
    function err(t){ msg.textContent=t; f.classList.toggle('is-error', !!t); input.setAttribute('aria-invalid', !!t); }
    input.addEventListener('input', ()=>{
      input.value = input.value.replace(/[^\d\s.+\-()]/g,'');
      if(f.classList.contains('is-error') && valid(clean(input.value))) err('');
    });
    f.addEventListener('submit', e=>{
      e.preventDefault();
      const v = clean(input.value);
      if(!v){ err('Vui lòng nhập số điện thoại để chuyên viên gọi lại.'); input.focus(); return; }
      if(!/^\d+$/.test(v) || v.length!==10 || v[0]!=='0'){ err('Số điện thoại gồm 10 chữ số và bắt đầu bằng 0 (ví dụ 0912 345 678).'); input.focus(); return; }
      if(!valid(v)){ err('Đầu số chưa đúng — số di động Việt Nam bắt đầu bằng 03, 05, 07, 08 hoặc 09.'); input.focus(); return; }
      err('');
      num.textContent = pretty(v);
      f.hidden = true; done.hidden = false; done.focus();
    });
    document.getElementById('ctaAgain').addEventListener('click', ()=>{
      done.hidden = true; f.hidden = false; input.value=''; input.focus();
    });
  }

  function init(){ initHero(); initTabs(); initSolutions(); initVideo(); initCallback(); }
  document.addEventListener('coway:ready', init, {once:true});
})();
