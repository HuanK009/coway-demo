/* Chi tiết sản phẩm — Villaem 3: gallery, màu, hình thức sở hữu, Heart Service, số lượng, thanh dính, thang nhiệt, hỏi đáp */
(function(){
  /* Sản phẩm liên quan: thêm Ombak (chưa có trong dữ liệu dùng chung). Chạy trước khi shared.js dựng card (DOMContentLoaded). */
  if(window.COWAY_PRODUCTS && !window.COWAY_PRODUCTS.ombak){
    window.COWAY_PRODUCTS.ombak = {name:'Ombak', desc:'Khử trùng UV · Bình nóng 3,4 L', price:29700000, rent:800000, img:'assets/products/p-image31.png', imgW:360, imgH:360, href:'#', gift:false};
  }

  const fmt = n => window.cowayFmt ? window.cowayFmt(n) : n.toLocaleString('vi-VN')+'₫';
  const $ = s => document.querySelector(s);
  const $$ = s => Array.from(document.querySelectorAll(s));
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const P = {name:'Villaem 3', buy:27500000, rent:750000};
  const COLORS = {trang:'Trắng', xam:'Xám'};
  const PLANS = {1:{name:'Heart Service 1 năm', price:2478000}, 2:{name:'Heart Service 2 năm', price:4956000}};
  const S = {mode:'buy', color:'trang', qty:1, plan:null, img:2};

  const COPY = {
    buy:{cta:'Mua ngay', sn:'Mua ngay', giftK:'QUÀ TẶNG KÈM', giftV:'Gói Heart Service 1 năm, trị giá 3.540.000₫',
      t2:'Đổi sản phẩm trong 7 ngày làm việc nếu chưa lắp đặt, chưa sử dụng', t3:'Bảo hành chính hãng — Cody chăm sóc tận nhà',
      hs:'Đang tặng kèm 1 năm khi mua máy. Gia hạn sau đó theo gói bên cạnh.'},
    rent:{cta:'Đăng ký thuê', sn:'Thuê ngay', giftK:'ĐÃ BAO GỒM KHI THUÊ', giftV:'Cody thay lõi lọc miễn phí 2 tháng/lần',
      t2:'Hợp đồng thuê 36 tháng, phí thuê 750.000₫/tháng', t3:'Cody thay lõi và bảo dưỡng tận nhà 2 tháng/lần trong suốt hợp đồng',
      hs:'Khi thuê máy, dịch vụ chăm sóc định kỳ đã bao gồm trong phí thuê — không cần mua thêm gói.'}
  };

  function swap(el, txt){ if(!el || el.textContent===txt) return; el.textContent=txt; if(!reduce){ el.classList.remove('is-swap'); void el.offsetWidth; el.classList.add('is-swap'); } }

  function render(){
    const c = COPY[S.mode];
    const unit = S.mode==='buy' ? P.buy : P.rent;
    const planP = (S.mode==='buy' && S.plan) ? PLANS[S.plan].price : 0;
    const total = unit*S.qty + planP;
    // Nút & nội dung điều khoản
    swap($('#buyNow'), c.cta);
    swap($('#snBuy'), c.sn);
    swap($('#giftK'), c.giftK); swap($('#giftV'), c.giftV);
    swap($('[data-term="2"]'), c.t2); swap($('[data-term="3"]'), c.t3);
    swap($('#hsNote'), c.hs);
    $$('.plan').forEach(b=>{ b.disabled = S.mode==='rent'; b.setAttribute('aria-pressed', String(S.mode==='buy' && S.plan===b.dataset.plan)); });
    // Thanh dính: tên + màu + giá theo hình thức
    $('#snName').textContent = `${P.name} · ${COLORS[S.color]}`;
    $('#snPrice').textContent = S.mode==='buy' ? fmt(total) : fmt(unit*S.qty)+'/tháng';
    // Tạm tính — chỉ hiện khi có thêm số lượng hoặc gói
    const sum = $('#sum');
    if(S.qty>1 || planP){
      const rows = [`<div><span>${P.name} (${COLORS[S.color]}) × ${S.qty}</span><span>${S.mode==='buy'?fmt(unit*S.qty):fmt(unit*S.qty)+'/tháng'}</span></div>`];
      if(planP) rows.push(`<div><span>${PLANS[S.plan].name}<button type="button" data-rm-plan>Bỏ</button></span><span>${fmt(planP)}</span></div>`);
      $('#sumRows').innerHTML = rows.join('');
      $('#sumLbl').textContent = S.mode==='buy' ? 'Tạm tính' : 'Phí thuê mỗi tháng';
      $('#sumTotal').textContent = S.mode==='buy' ? fmt(total) : fmt(total)+'/tháng';
      sum.hidden = false;
    } else sum.hidden = true;
    $('#qtyVal').textContent = S.qty;
    $('#qtyMinus').disabled = S.qty<=1;
    $('#qtyPlus').disabled = S.qty>=10;
  }

  /* ---- Gallery ---- */
  const thumbs = $$('.thumb');
  const mainImg = $('#galImg'), main = $('#galMain');
  function show(i, fromColor){
    const n = thumbs.length; i = (i+n)%n; S.img = i;
    const t = thumbs[i];
    thumbs.forEach((b,k)=> b.setAttribute('aria-current', String(k===i)));
    const src = t.querySelector('img').getAttribute('src');
    const apply = ()=>{ mainImg.src = src; mainImg.alt = t.dataset.alt; mainImg.classList.remove('is-fade'); };
    if(reduce || mainImg.getAttribute('src')===src) apply(); else { mainImg.classList.add('is-fade'); setTimeout(apply,180); }
    const isVideo = t.hasAttribute('data-video');
    main.dataset.theme = isVideo ? 'dark' : 'light';
    $('#playBtn').hidden = !isVideo;
    $('#galCount').textContent = `${i+1} / ${n}`;
    if(!fromColor && t.dataset.color && t.dataset.color!==S.color) setColor(t.dataset.color, true);
  }
  function setColor(c, fromGallery){
    S.color = c;
    $$('.sw').forEach(b=> b.setAttribute('aria-checked', String(b.dataset.color===c)));
    $('#colorName').textContent = COLORS[c];
    if(!fromGallery){ const first = thumbs.findIndex(t=>t.dataset.color===c); if(first>-1) show(first, true); }
    render();
  }
  thumbs.forEach((b,i)=> b.addEventListener('click', ()=>show(i)));
  $('#galPrev').addEventListener('click', ()=>show(S.img-1));
  $('#galNext').addEventListener('click', ()=>show(S.img+1));
  main.setAttribute('tabindex','0'); main.setAttribute('aria-label','Ảnh sản phẩm — dùng phím mũi tên trái/phải để chuyển ảnh');
  main.addEventListener('keydown', e=>{ if(e.target!==main) return; if(e.key==='ArrowLeft'){e.preventDefault();show(S.img-1);} if(e.key==='ArrowRight'){e.preventDefault();show(S.img+1);} });
  // Vuốt trên màn cảm ứng
  let sx=null; main.addEventListener('touchstart', e=>{sx=e.touches[0].clientX;}, {passive:true});
  main.addEventListener('touchend', e=>{ if(sx===null) return; const dx=e.changedTouches[0].clientX-sx; if(Math.abs(dx)>40) show(S.img+(dx<0?1:-1)); sx=null; });
  $('#playBtn').addEventListener('click', ()=> window.cowayToast('Video giới thiệu Villaem 3 sẽ có ở giai đoạn thiết kế tiếp theo'));
  $('#shareBtn').addEventListener('click', async ()=>{
    const url = location.href.split('#')[0];
    try{ await navigator.clipboard.writeText(url); window.cowayToast('Đã sao chép liên kết sản phẩm'); }
    catch(err){ if(err && err.name!=='AbortError') window.cowayToast('Không sao chép được liên kết — hãy sao chép từ thanh địa chỉ'); }
  });

  /* ---- Radio nhóm: bàn phím mũi tên ---- */
  function radioGroup(sel, onPick){
    const items = $$(sel);
    items.forEach((b,i)=>{
      b.addEventListener('click', ()=>onPick(b));
      b.addEventListener('keydown', e=>{
        const d = (e.key==='ArrowRight'||e.key==='ArrowDown') ? 1 : (e.key==='ArrowLeft'||e.key==='ArrowUp') ? -1 : 0;
        if(!d) return; e.preventDefault(); const nb = items[(i+d+items.length)%items.length]; nb.focus(); onPick(nb);
      });
    });
    const sync = ()=> items.forEach(b=> b.tabIndex = b.getAttribute('aria-checked')==='true' ? 0 : -1);
    sync(); return sync;
  }
  const syncSw = radioGroup('.sw', b=>{ setColor(b.dataset.color); syncSw(); });
  const syncOpt = radioGroup('.opt', b=>{
    S.mode = b.dataset.mode;
    $$('.opt').forEach(o=> o.setAttribute('aria-checked', String(o===b)));
    syncOpt(); render();
  });
  const syncScale = radioGroup('.pd-scale button', b=>{ $$('.pd-scale button').forEach(o=>o.setAttribute('aria-checked', String(o===b))); syncScale(); });
  const syncMl = radioGroup('.bc-ml button', b=>{ $$('.bc-ml button').forEach(o=>o.setAttribute('aria-checked', String(o===b))); syncMl(); });
  $$('.bc-ml button')[0].tabIndex = 0;

  /* ---- Số lượng ---- */
  $('#qtyMinus').addEventListener('click', ()=>{ if(S.qty>1){S.qty--; render();} });
  $('#qtyPlus').addEventListener('click', ()=>{ if(S.qty<10){S.qty++; render();} else window.cowayToast('Tối đa 10 máy mỗi đơn — liên hệ 1800 556 892 để đặt số lượng lớn'); });

  /* ---- Heart Service ---- */
  $$('.plan').forEach(b=> b.addEventListener('click', ()=>{
    if(S.mode!=='buy') return;
    const was = S.plan===b.dataset.plan;
    S.plan = was ? null : b.dataset.plan;
    render();
    window.cowayToast(was ? 'Đã bỏ gói Heart Service khỏi đơn' : `Đã thêm ${PLANS[S.plan].name} — tạm tính ${fmt(P.buy*S.qty+PLANS[S.plan].price)}`);
  }));
  document.addEventListener('click', e=>{ if(e.target.closest('[data-rm-plan]')){ S.plan=null; render(); } });

  /* ---- Mua / giỏ hàng: dùng cơ chế data-add-cart của shared.js ---- */
  function label(){ return `${P.name} (${COLORS[S.color]}) × ${S.qty}` + (S.mode==='buy' && S.plan ? ` + ${PLANS[S.plan].name}` : '') + (S.mode==='rent' ? ' — gói thuê 36 tháng' : ''); }
  // Cập nhật nhãn trước khi shared.js xử lý click (pha capture)
  ['#addCart','#buyNow'].forEach(id=> $(id).addEventListener('click', ()=>{ $(id).dataset.addCart = label(); }, true));
  $('#buyNow').addEventListener('click', ()=>{
    setTimeout(()=> window.cowayToast(S.mode==='buy'
      ? `Đã thêm ${label()} — bước thanh toán thuộc giai đoạn thiết kế tiếp theo`
      : `Đã ghi nhận yêu cầu thuê ${P.name} (${COLORS[S.color]}) — Coway sẽ liên hệ để hoàn tất hợp đồng`), 0);
  });
  $('#snBuy').addEventListener('click', ()=>{
    const box = $('#buyBox'); const r = box.getBoundingClientRect();
    const hdr = parseFloat(getComputedStyle(document.querySelector('.pd')).getPropertyValue('--hdr-h'))||0;
    window.scrollTo({top: window.scrollY + r.top - hdr - 24, behavior: reduce?'auto':'smooth'});
    setTimeout(()=> $('#buyNow').focus({preventScroll:true}), reduce?0:500);
  });

  /* ---- Thanh dính: chiều cao header + mục đang xem ---- */
  const pd = document.querySelector('.pd'), sub = $('#subnav');
  function measure(){
    const h = document.querySelector('.site-header'), m = h && h.querySelector('.hdr-main');
    if(h && m) pd.style.setProperty('--hdr-h', (h.offsetHeight - m.offsetTop) + 'px');
    pd.style.setProperty('--sub-h', sub.offsetHeight + 'px');
  }
  const links = $$('.pd-subnav__tabs a');
  const secs = links.map(a=> document.querySelector(a.getAttribute('href')));
  let tick = false;
  function spy(){
    tick = false;
    const line = (parseFloat(pd.style.getPropertyValue('--hdr-h'))||83) + sub.offsetHeight + 40;
    let cur = 0;
    secs.forEach((s,i)=>{ if(s && s.getBoundingClientRect().top <= line) cur = i; });
    if(window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) cur = secs.length-1 >= 0 && secs[secs.length-1].getBoundingClientRect().top < window.innerHeight ? secs.length-1 : cur;
    links.forEach((a,i)=>{ const on = i===cur; a.classList.toggle('is-on', on); on ? a.setAttribute('aria-current','true') : a.removeAttribute('aria-current'); });
    const on = links[cur]; const tabs = on.parentElement;
    if(tabs.scrollWidth > tabs.clientWidth){ const l = on.offsetLeft - tabs.offsetLeft - 16; if(Math.abs(tabs.scrollLeft - l) > 40) tabs.scrollTo({left:l, behavior: reduce?'auto':'smooth'}); }
    sub.classList.toggle('is-stuck', sub.getBoundingClientRect().top <= (parseFloat(pd.style.getPropertyValue('--hdr-h'))||83) + 1);
  }
  window.addEventListener('scroll', ()=>{ if(!tick){ tick=true; requestAnimationFrame(spy);} }, {passive:true});
  window.addEventListener('resize', ()=>{ measure(); spy(); });
  document.addEventListener('click', e=>{ if(e.target.closest('[data-close-announce]')) requestAnimationFrame(measure); });

  /* ---- Hỏi đáp ---- */
  $$('.acc__it button').forEach(b=> b.addEventListener('click', ()=>{
    const it = b.closest('.acc__it'); const open = !it.classList.contains('is-open');
    it.classList.toggle('is-open', open); b.setAttribute('aria-expanded', String(open));
  }));

  document.addEventListener('coway:ready', ()=>{
    // Trang chi tiết của các máy liên quan chưa thiết kế → báo "giai đoạn tiếp theo"
    $$('.pd-rel .p-card a.media, .pd-rel .p-card a.info').forEach(a=>{ a.setAttribute('href','#'); a.setAttribute('data-soon',''); });
    measure(); spy();
  });
  if(document.readyState!=='loading'){ measure(); }
  show(S.img, true); render();
})();
