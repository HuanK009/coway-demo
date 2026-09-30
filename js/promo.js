/* Coway VN — Khuyến mãi & sự kiện: lọc theo loại, ẩn chương trình đã kết thúc, sắp xếp, đăng ký nhận tin */
(function(){
  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function init(){
    const grid = $('#pmGrid'); if(!grid) return;
    const cards = $$('.pm-card', grid);
    const chips = $$('[data-filter]');
    const sw = $('#hideEnded');
    const empty = $('#pmEmpty');
    const news = $('.pm-news', grid);
    const status = $('#pmStatus');
    const state = { type:'all', hideEnded:false, sort:'new' };
    const TYPE_LABEL = { all:'', promo:'khuyến mãi', event:'sự kiện' };

    function render(animate){
      // Đếm lại theo trạng thái công tắc (số trên chip luôn khớp danh sách thật)
      const pool = cards.filter(c => !(state.hideEnded && c.hasAttribute('data-ended')));
      $$('[data-count]').forEach(el=>{
        const t = el.dataset.count;
        el.textContent = t==='all' ? pool.length : pool.filter(c=>c.dataset.type===t).length;
      });
      // Sắp xếp theo ngày
      const sorted = cards.slice().sort((a,b)=> state.sort==='new' ? b.dataset.date.localeCompare(a.dataset.date) : a.dataset.date.localeCompare(b.dataset.date));
      sorted.forEach(c => grid.insertBefore(c, empty));
      // Lọc
      let shown = 0;
      sorted.forEach(c=>{
        const ok = pool.includes(c) && (state.type==='all' || c.dataset.type===state.type);
        const was = !c.hidden;
        c.hidden = !ok;
        if(ok){ shown++; if(animate && !reduce){ c.classList.remove('is-in'); void c.offsetWidth; c.classList.add('is-in'); } }
        else if(was) c.classList.remove('is-in');
      });
      empty.hidden = shown>0;
      grid.appendChild(news);
      const lbl = TYPE_LABEL[state.type];
      status.textContent = shown
        ? `Đang hiển thị ${shown} chương trình${lbl?' '+lbl:''}${state.hideEnded?', đã ẩn chương trình đã kết thúc':''}.`
        : 'Không có chương trình phù hợp.';
    }

    chips.forEach(ch => ch.addEventListener('click', ()=>{
      state.type = ch.dataset.filter;
      chips.forEach(c=>{ const on = c===ch; c.classList.toggle('is-active', on); c.setAttribute('aria-pressed', on); });
      render(true);
    }));

    sw.addEventListener('click', ()=>{
      state.hideEnded = sw.getAttribute('aria-checked')!=='true';
      sw.setAttribute('aria-checked', state.hideEnded);
      render(true);
    });

    $('#pmReset').addEventListener('click', ()=>{
      state.type='all'; state.hideEnded=false; sw.setAttribute('aria-checked','false');
      chips.forEach(c=>{ const on = c.dataset.filter==='all'; c.classList.toggle('is-active', on); c.setAttribute('aria-pressed', on); });
      render(true); chips[0].focus();
    });

    /* Sắp xếp — nút mở danh sách chọn (listbox), hỗ trợ bàn phím */
    const sBtn = $('#sortBtn'), sList = $('#sortList'), sLbl = $('#sortLabel');
    const opts = $$('[role="option"]', sList);
    let fi = 0;
    const focusOpt = i => { fi = (i+opts.length)%opts.length; opts.forEach((o,k)=>o.classList.toggle('is-focus', k===fi)); sList.setAttribute('aria-activedescendant', opts[fi].id); };
    const openMenu = () => { sList.hidden=false; sBtn.setAttribute('aria-expanded','true'); focusOpt(opts.findIndex(o=>o.getAttribute('aria-selected')==='true')); sList.focus(); };
    const closeMenu = (back) => { sList.hidden=true; sBtn.setAttribute('aria-expanded','false'); if(back) sBtn.focus(); };
    const choose = o => {
      opts.forEach(x=>x.setAttribute('aria-selected', x===o));
      state.sort = o.dataset.sort; sLbl.textContent = o.textContent; sBtn.setAttribute('aria-label','Sắp xếp: '+o.textContent);
      closeMenu(true); render(true);
    };
    sBtn.addEventListener('click', ()=> sList.hidden ? openMenu() : closeMenu());
    sBtn.addEventListener('keydown', e=>{ if(e.key==='ArrowDown'||e.key==='ArrowUp'){ e.preventDefault(); openMenu(); } });
    opts.forEach((o,i)=>{ o.addEventListener('click', ()=>choose(o)); o.addEventListener('mousemove', ()=>focusOpt(i)); });
    sList.addEventListener('keydown', e=>{
      if(e.key==='ArrowDown'){ e.preventDefault(); focusOpt(fi+1); }
      else if(e.key==='ArrowUp'){ e.preventDefault(); focusOpt(fi-1); }
      else if(e.key==='Home'){ e.preventDefault(); focusOpt(0); }
      else if(e.key==='End'){ e.preventDefault(); focusOpt(opts.length-1); }
      else if(e.key==='Enter'||e.key===' '){ e.preventDefault(); choose(opts[fi]); }
      else if(e.key==='Escape'||e.key==='Tab'){ closeMenu(e.key==='Escape'); }
    });
    document.addEventListener('click', e=>{ if(!sList.hidden && !e.target.closest('.pm-sort')) closeMenu(); });

    /* Đăng ký nhận tin — kiểm tra email */
    const form = $('#pmNews'), input = $('#pmEmail'), msg = $('#pmEmailMsg'), done = $('#pmNewsDone');
    const RE = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/;
    const setErr = t => { msg.textContent = t; msg.classList.toggle('on', !!t); input.setAttribute('aria-invalid', t?'true':'false'); };
    form.addEventListener('submit', e=>{
      e.preventDefault();
      const v = input.value.trim();
      if(!v){ setErr('Vui lòng nhập email của bạn.'); input.focus(); return; }
      if(!RE.test(v)){ setErr('Email chưa đúng định dạng, ví dụ: ten@gmail.com'); input.focus(); return; }
      setErr('');
      $('#pmDoneEmail').textContent = v;
      form.hidden = true; done.hidden = false; done.focus();
      window.cowayToast && window.cowayToast('Đã đăng ký nhận tin khuyến mãi');
    });
    input.addEventListener('input', ()=>{ if(input.getAttribute('aria-invalid')==='true' && RE.test(input.value.trim())) setErr(''); });
    $('#pmAgain').addEventListener('click', ()=>{ done.hidden = true; form.hidden = false; input.value=''; input.focus(); });

    render(false);
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
