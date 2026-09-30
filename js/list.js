/* Coway VN — Danh sách sản phẩm · Máy lọc nước
   Chip lọc theo nhu cầu (chọn nhiều, máy phải đáp ứng TẤT CẢ nhu cầu đã chọn), công tắc Mua đứt / Thuê,
   sắp xếp, so sánh tối đa 3 máy (thanh dính đáy + bảng so sánh dạng hộp thoại), accordion hỏi đáp. */
(function(){
  const fmt = n => window.cowayFmt ? window.cowayFmt(n) : n.toLocaleString('vi-VN').replace(/,/g,'.') + '₫';
  const A = 'assets/shared/';
  const MAX = 3;

  /* Dữ liệu trang (tên, mô tả theo Figma khung 64:3261; giá theo dữ liệu thật trong BRIEF) */
  const P = {
    villaem3:{name:'Villaem 3', desc:'4 chế độ nước · Khử trùng UV-C', price:27500000, rent:750000, img:'assets/products/p-villaem3.png', w:288, h:288, badge:'Mới', gift:true, href:'villaem-3.html',
      needs:['warm','uv'], spec:{modes:'4 · Nóng, Ấm, Thường, Lạnh', cap:'11,4 L', ice:null, hl:'6 mức nhiệt 40–95°C'}},
    ais:{name:'AIS — Làm đá', desc:'Làm đá từ nước RO · Dual UV', price:38000000, rent:930000, img:'assets/products/p-ais.png', w:278, h:278, badge:'Làm đá', gift:true,
      needs:['ice','uv'], spec:{modes:'4 · Nóng, Lạnh, Thường, Đá', cap:'', ice:'Có, từ nước RO', hl:'Dual UV cho vòi và khoang đá'}},
    core:{name:'Core', desc:'Bình chứa 21 L · Lọc 5 bước', price:29700000, rent:850000, img:'assets/products/p-core.png', w:278, h:278, gift:true,
      needs:['big'], spec:{modes:'3 · Nóng, Lạnh, Thường', cap:'21 L', ice:null, hl:'Bình lớn cho nhu cầu dùng nhiều'}},
    ombak:{name:'Ombak', desc:'Khử trùng UV · Bình nóng 3,4 L', price:29700000, rent:800000, img:'assets/products/p-image31.png', w:360, h:360,
      needs:['big','uv'], spec:{modes:'3 · Nóng, Lạnh, Thường', cap:'13,5 L', ice:null, hl:'50 tuỳ chọn lấy nước'}},
    harry:{name:'Harry', desc:'Thiết kế siêu mỏng · 3 chế độ nước', price:25300000, rent:700000, img:'assets/products/p-harry.png', w:166, h:296,
      needs:['slim'], spec:{modes:'3 · Nóng, Lạnh, Thường', cap:'12 L', ice:null, hl:'Thân siêu mỏng'}}
  };
  const ORDER = ['villaem3','ais','core','ombak','harry'];

  /* Đưa Ombak vào dữ liệu dùng chung để các trang khác có thể dùng lại */
  if(window.COWAY_PRODUCTS && !window.COWAY_PRODUCTS.ombak){
    window.COWAY_PRODUCTS.ombak = {name:'Ombak', desc:P.ombak.desc, price:P.ombak.price, rent:P.ombak.rent, img:P.ombak.img};
  }

  const state = {needs:new Set(), mode:'buy', sort:'featured', cmp:['villaem3','core']};
  const $ = s => document.querySelector(s);

  function priceHTML(p){
    return state.mode==='buy'
      ? `<b>${fmt(p.price)}</b><span>hoặc thuê ${fmt(p.rent)}/tháng</span>`
      : `<b>${fmt(p.rent)}<small>/tháng</small></b><span>hợp đồng 36 tháng</span>`;
  }

  function cardEl(key){
    const p = P[key];
    const href = p.href || '#';
    const soon = p.href ? '' : 'data-soon';
    const el = document.createElement('article');
    el.className = 'p-card lp-card';
    el.dataset.key = key;
    el.innerHTML = `
      <a class="media" href="${href}" ${soon} aria-label="${p.name}">
        ${p.badge?`<span class="badge">${p.badge}</span>`:''}
        <img class="shot" src="${p.img}" alt="Máy lọc nước ${p.name}" style="width:${p.w}px;height:${p.h}px" loading="lazy">
        ${p.gift?`<span class="gift"><img src="${A}ic-star.svg" alt="">Tặng 1 năm Heart Service</span>`:''}
      </a>
      <button class="wish" type="button" aria-pressed="false" aria-label="Yêu thích ${p.name}" data-wish><img src="${A}ic-heart-outline.svg" alt=""></button>
      <a class="info" href="${href}" ${soon}><h3 class="name">${p.name}</h3><p class="desc">${p.desc}</p></a>
      <div class="price-row">
        <div class="price" data-price="${key}">${priceHTML(p)}</div>
        <button class="cart" type="button" aria-label="Thêm ${p.name} vào giỏ" data-add-cart="${p.name}"><img src="${A}ic-bag-white.svg" alt=""></button>
      </div>
      <label class="lp-cmp-chk"><input type="checkbox" data-compare="${key}"><span>So sánh</span></label>`;
    return el;
  }

  /* ---------- Lưới ---------- */
  let cards = {}, tile, empty;
  function visibleKeys(){
    let keys = ORDER.filter(k => [...state.needs].every(n => P[k].needs.includes(n)));
    if(state.sort!=='featured'){
      const f = state.mode==='buy' ? 'price' : 'rent';
      keys = keys.slice().sort((a,b)=> state.sort==='asc' ? P[a][f]-P[b][f] : P[b][f]-P[a][f]);
    }
    return keys;
  }
  function renderGrid(animate){
    const grid = $('#grid');
    const keys = visibleKeys();
    const items = keys.map(k=>cards[k]);
    if(!keys.length) items.push(empty);
    items.push(tile);
    grid.textContent = '';
    for(let i=0;i<items.length;i+=3){
      const row = document.createElement('div'); row.className='lp-row';
      items.slice(i,i+3).forEach(el=>row.appendChild(el));
      const slots = [...row.children].reduce((s,el)=>s+(el===empty?2:1),0);
      for(let j=slots;j<3;j++){ const sp=document.createElement('div'); sp.className='lp-slot'; sp.setAttribute('aria-hidden','true'); row.appendChild(sp); }
      grid.appendChild(row);
    }
    if(animate) items.forEach((el,i)=>{ el.classList.remove('lp-in'); void el.offsetWidth; el.style.animationDelay=(i*40)+'ms'; el.classList.add('lp-in'); });
    $('#count').textContent = keys.length ? `Hiển thị ${keys.length} sản phẩm` : 'Không có sản phẩm phù hợp';
  }

  function buildEmpty(){
    const el = document.createElement('div');
    el.className = 'lp-empty';
    el.innerHTML = `<div><p class="t">Chưa có máy đáp ứng đủ các nhu cầu đã chọn</p>
      <p class="s">Thử bỏ bớt một nhu cầu, hoặc gọi 1800 556 892 để chuyên viên gợi ý máy phù hợp.</p></div>
      <button type="button" class="btn btn--primary" data-reset-needs>Xem tất cả máy</button>`;
    return el;
  }

  /* ---------- Chip lọc ---------- */
  function syncChips(){
    document.querySelectorAll('#needs .lp-chip').forEach(c=>{
      const n = c.dataset.need;
      c.setAttribute('aria-pressed', n==='all' ? String(state.needs.size===0) : String(state.needs.has(n)));
    });
  }
  function onChip(btn){
    const n = btn.dataset.need;
    if(n==='all') state.needs.clear();
    else state.needs.has(n) ? state.needs.delete(n) : state.needs.add(n);
    syncChips(); renderGrid(true);
  }

  /* ---------- Mua đứt / Thuê ---------- */
  function setMode(mode, focus){
    state.mode = mode;
    document.querySelectorAll('#priceMode [role=radio]').forEach(b=>{
      const on = b.dataset.mode===mode; b.setAttribute('aria-checked',on); b.tabIndex = on?0:-1; if(on&&focus) b.focus();
    });
    document.querySelectorAll('[data-price]').forEach(el=>{ el.innerHTML = priceHTML(P[el.dataset.price]); el.classList.remove('lp-flip'); void el.offsetWidth; el.classList.add('lp-flip'); });
    document.querySelectorAll('.lp-table tr[data-row]').forEach(tr=> tr.classList.toggle('is-mode', tr.dataset.row===mode));
    if(state.sort!=='featured') renderGrid(true);
  }

  /* ---------- Sắp xếp ---------- */
  const SORT_LABEL = {featured:'Nổi bật', asc:'Giá thấp đến cao', desc:'Giá cao đến thấp'};
  function openSort(open){
    const btn=$('#sortBtn'), list=$('#sortList');
    btn.setAttribute('aria-expanded',open); list.hidden=!open;
    if(open){ const sel=list.querySelector('[aria-selected=true]'); list.querySelectorAll('[role=option]').forEach(o=>o.tabIndex=-1); sel.tabIndex=0; sel.focus(); }
  }
  function pickSort(opt){
    state.sort = opt.dataset.sort;
    document.querySelectorAll('#sortList [role=option]').forEach(o=>o.setAttribute('aria-selected', o===opt));
    $('#sortLabel').textContent = SORT_LABEL[state.sort];
    openSort(false); $('#sortBtn').focus(); renderGrid(true);
  }

  /* ---------- So sánh ---------- */
  function syncCompare(){
    document.querySelectorAll('[data-compare]').forEach(i=> i.checked = state.cmp.includes(i.dataset.compare));
    const wrap = $('#trayWrap'), list = $('#trayItems');
    wrap.hidden = state.cmp.length===0;
    $('#trayN').textContent = state.cmp.length;
    const left = MAX - state.cmp.length;
    list.innerHTML = state.cmp.map(k=>{ const p=P[k]; return `<li class="lp-tray__it">
        <span class="th"><img src="${p.img}" alt=""></span><span class="nm">${p.name}</span>
        <button type="button" class="x" data-uncompare="${k}" aria-label="Bỏ ${p.name} khỏi so sánh"><img src="assets/list/ic-x-sm.svg" alt="" width="14" height="14"></button></li>`; }).join('')
      + (left>0 ? `<li class="lp-tray__slot"><img src="assets/list/ic-plus-tray.svg" alt="" width="14" height="14">Thêm tối đa ${left} máy</li>` : '');
  }
  function toggleCompare(key, on, input){
    if(on){
      if(state.cmp.includes(key)) return;
      if(state.cmp.length>=MAX){ if(input) input.checked=false; window.cowayToast(`Chỉ so sánh tối đa ${MAX} máy — bỏ bớt một máy để thêm ${P[key].name}`); return; }
      state.cmp.push(key);
    } else state.cmp = state.cmp.filter(k=>k!==key);
    syncCompare();
  }

  /* ---------- Bảng so sánh (dùng cho mục So sánh nhanh và hộp thoại) ---------- */
  function tableHTML(keys, withCta){
    const muted = v => `<td><span class="mu">${v}</span></td>`;
    const cell = v => v ? `<td>${v}</td>` : null;
    const row = (label, fn, cls, attr) => `<tr ${cls?`class="${cls}"`:''} ${attr||''}><th scope="row">${label}</th>${keys.map(k=>fn(P[k])).join('')}</tr>`;
    return `<table class="lp-table" style="--cols:${keys.length}">
      <thead><tr><td class="corner"></td>${keys.map(k=>{const p=P[k];return `<th scope="col"><span class="th"><img src="${p.img}" alt=""></span><span class="nm">${p.name}</span></th>`;}).join('')}</tr></thead>
      <tbody>
        ${row('Chế độ nước', p=>`<td>${p.spec.modes}</td>`)}
        ${row('Dung tích bình', p=> cell(p.spec.cap) || muted('Đang cập nhật'))}
        ${row('Làm đá', p=> cell(p.spec.ice) || muted('—'))}
        ${row('Điểm nổi bật', p=>`<td>${p.spec.hl}</td>`)}
        ${row('Giá mua', p=>`<td class="pr">${fmt(p.price)}</td>`, 'money'+(state.mode==='buy'?' is-mode':''), 'data-row="buy"')}
        ${row('Thuê theo tháng', p=>`<td class="pr">${fmt(p.rent)}</td>`, 'money'+(state.mode==='rent'?' is-mode':''), 'data-row="rent"')}
        ${withCta ? row('', p=>`<td><a class="btn btn--ghost lp-table__cta" href="${p.href||'#'}" ${p.href?'':'data-soon'}>Xem chi tiết</a></td>`, 'cta') : ''}
      </tbody></table>`;
  }
  function openModal(){
    if(state.cmp.length<2){ window.cowayToast('Chọn ít nhất 2 máy để so sánh'); return; }
    $('#cmpModalTitle').textContent = `So sánh ${state.cmp.length} máy đã chọn`;
    $('#modalTable').innerHTML = tableHTML(state.cmp, true);
    const d = $('#cmpModal');
    if(typeof d.showModal==='function') d.showModal(); else d.setAttribute('open','');
    document.documentElement.classList.add('lp-lock');
  }
  function closeModal(){ const d=$('#cmpModal'); if(d.open) d.close(); }

  /* ---------- Accordion ---------- */
  function toggleFaq(btn){
    const open = btn.getAttribute('aria-expanded')!=='true';
    btn.setAttribute('aria-expanded', open);
    const panel = document.getElementById(btn.getAttribute('aria-controls'));
    panel.hidden = !open;
  }

  function init(){
    ORDER.forEach(k=> cards[k]=cardEl(k));
    tile = $('#tileTpl').content.firstElementChild.cloneNode(true);
    empty = buildEmpty();
    renderGrid(false);
    $('#quickTable').innerHTML = tableHTML(ORDER, false);
    syncCompare();

    document.addEventListener('click', e=>{
      const chip = e.target.closest('#needs .lp-chip'); if(chip){ onChip(chip); return; }
      if(e.target.closest('[data-reset-needs]')){ state.needs.clear(); syncChips(); renderGrid(true); $('#needs .lp-chip').focus(); return; }
      const m = e.target.closest('#priceMode [role=radio]'); if(m){ setMode(m.dataset.mode); return; }
      if(e.target.closest('#sortBtn')){ openSort($('#sortBtn').getAttribute('aria-expanded')!=='true'); return; }
      const opt = e.target.closest('#sortList [role=option]'); if(opt){ pickSort(opt); return; }
      if(!e.target.closest('#sort') && !$('#sortList').hidden) openSort(false);
      const un = e.target.closest('[data-uncompare]'); if(un){ toggleCompare(un.dataset.uncompare,false); return; }
      if(e.target.closest('#trayClear')){ state.cmp=[]; syncCompare(); window.cowayToast('Đã xoá tất cả máy khỏi so sánh'); return; }
      if(e.target.closest('#trayGo')){ openModal(); return; }
      if(e.target.closest('[data-close-modal]') || e.target===$('#cmpModal')){ closeModal(); return; }
      const fq = e.target.closest('#faq button[aria-expanded]'); if(fq){ toggleFaq(fq); return; }
    });
    document.addEventListener('change', e=>{
      const i = e.target.closest('[data-compare]'); if(i) toggleCompare(i.dataset.compare, i.checked, i);
    });
    $('#cmpModal').addEventListener('close', ()=> document.documentElement.classList.remove('lp-lock'));

    /* Bàn phím: công tắc giá (mũi tên) và danh sách sắp xếp */
    $('#priceMode').addEventListener('keydown', e=>{
      if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key)){ e.preventDefault(); setMode(state.mode==='buy'?'rent':'buy', true); }
    });
    $('#sortList').addEventListener('keydown', e=>{
      const opts=[...document.querySelectorAll('#sortList [role=option]')]; const i=opts.indexOf(document.activeElement);
      if(e.key==='ArrowDown'||e.key==='ArrowUp'){ e.preventDefault(); const n=opts[(i+(e.key==='ArrowDown'?1:opts.length-1))%opts.length]; opts.forEach(o=>o.tabIndex=-1); n.tabIndex=0; n.focus(); }
      else if(e.key==='Enter'||e.key===' '){ e.preventDefault(); if(i>=0) pickSort(opts[i]); }
      else if(e.key==='Escape'||e.key==='Tab'){ openSort(false); if(e.key==='Escape') $('#sortBtn').focus(); }
    });
    $('#sortBtn').addEventListener('keydown', e=>{ if(e.key==='ArrowDown'){ e.preventDefault(); openSort(true); } });
  }
  document.addEventListener('coway:ready', init);
})();
