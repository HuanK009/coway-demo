/* Coway VN — header, footer, card sản phẩm và tương tác dùng chung */
(function(){
  const A = 'assets/shared/';
  const ROUTES = {
    home:'index.html', water:'may-loc-nuoc.html', detail:'villaem-3.html', promo:'khuyen-mai.html', blog:'blog.html'
  };
  window.COWAY_ROUTES = ROUTES;

  /* Dữ liệu thật từ cowayvina.com.vn (lấy 23/09/2026) */
  window.COWAY_PRODUCTS = {
    villaem3:{name:'Villaem 3', desc:'4 chế độ nước · Khử trùng UV-C', price:27500000, rent:750000, img:'assets/products/p-villaem3.png', href:ROUTES.detail, badge:'Mới', gift:true},
    ais:{name:'AIS - làm đá', desc:'Công nghệ Dual UV · Khoang chứa đá', price:38000000, rent:930000, img:'assets/products/p-ais.png', badge:'Làm đá', gift:true},
    core:{name:'Core', desc:'Bình chứa 21 L · Lọc 5 bước', price:29700000, rent:850000, img:'assets/products/p-core.png', gift:true},
    harry:{name:'Harry', desc:'Thiết kế siêu mỏng · 3 chế độ', price:25300000, rent:700000, img:'assets/products/p-harry.png', imgW:166, imgH:296}
  };
  const fmt = n => n.toLocaleString('vi-VN').replace(/,/g,'.') + '₫';
  window.cowayFmt = fmt;

  function header(active, announce){
    const nav = [
      ['water','Máy lọc nước',ROUTES.water,true],
      ['air','Máy lọc không khí','#',true],
      ['filter','Lõi lọc','#',false],
      ['rent','Thuê máy','#',false],
      ['service','Dịch vụ','#',true],
      ['promo','Khuyến mãi',ROUTES.promo,false],
      ['blog','Blog',ROUTES.blog,false]
    ];
    return `
    ${announce!==false?`<div class="hdr-announce" id="hdrAnnounce">
      <span class="spacer" aria-hidden="true"></span>
      <div class="msg"><img src="${A}ic-heart.svg" alt=""><span>Tặng 1 năm Heart Service trị giá 3.540.000₫ khi mua máy lọc nước Villaem 3</span>
        <a href="${ROUTES.detail}">Xem ngay <img src="${A}ic-arrow.svg" alt=""></a></div>
      <button class="close" type="button" aria-label="Đóng thông báo" data-close-announce><img src="${A}ic-x.svg" alt=""></button>
    </div>`:''}
    <div class="hdr-utility">
      <div class="it"><img src="${A}ic-phone-sm.svg" alt="">Hotline miễn phí 1800 556 892</div>
      <div class="grp">
        <a class="it" href="#" data-soon><img src="${A}ic-card.svg" alt="">Tra cứu &amp; thanh toán</a>
        <a class="it" href="#" data-soon><img src="${A}ic-pin.svg" alt="">Tìm cửa hàng</a>
        <a class="it" href="#" data-soon><img src="${A}ic-globe.svg" alt="">VI / EN</a>
      </div>
    </div>
    <div class="hdr-main">
      <a class="logo" href="${ROUTES.home}" aria-label="Coway — Trang chủ"><img src="${A}logo-blue.svg" alt="Coway"></a>
      <nav class="hdr-nav" id="hdrNav" aria-label="Menu chính">
        ${nav.map(([k,l,h,chev])=>`<a href="${h}" ${h==='#'?'data-soon':''} class="${k===active?'is-active':''}" ${k===active?'aria-current="page"':''}>${l}${chev?`<img src="${A}ic-chev.svg" alt="">`:''}</a>`).join('')}
      </nav>
      <div class="hdr-actions">
        <button class="icon-btn" type="button" aria-label="Tìm kiếm" data-soon><img src="${A}ic-search.svg" alt=""></button>
        <button class="icon-btn" type="button" aria-label="Tài khoản" data-soon><img src="${A}ic-user.svg" alt=""></button>
        <button class="icon-btn" type="button" aria-label="Giỏ hàng" id="cartBtn" data-soon><img src="${A}ic-bag.svg" alt=""><span class="count" id="cartCount">0</span></button>
        <a class="btn btn--primary" href="${ROUTES.home}#tu-van">Đăng ký tư vấn</a>
        <button class="icon-btn hdr-burger" type="button" aria-label="Mở menu" aria-expanded="false" aria-controls="hdrNav" id="burger">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M3 6h14M3 10h14M3 14h14" stroke="#0B1F2E" stroke-width="1.6" stroke-linecap="round"/></svg>
        </button>
      </div>
    </div>`;
  }

  function footer(){
    const col = (t, items) => `<div class="ftr-col"><h4>${t}</h4>${items.map(([l,h])=>`<a href="${h||'#'}" ${h?'':'data-soon'}>${l}</a>`).join('')}</div>`;
    return `
    <div class="ftr-top">
      <div class="ftr-brand">
        <img class="logo" src="${A}logo-white.svg" alt="Coway">
        <p>Coway Vina — đại diện chính thức của Coway Hàn Quốc tại Việt Nam.</p>
        <div class="ftr-contact">
          <div><img src="${A}ic-phone-footer.svg" alt="">1800 556 892</div>
          <div><img src="${A}ic-mail.svg" alt="">cs@cowayvina.com.vn</div>
          <div><img src="${A}ic-mail.svg" alt="">info@cowayvina.com.vn</div>
        </div>
      </div>
      <div class="ftr-cols">
        ${col('Sản phẩm',[['Máy lọc nước',ROUTES.water],['Máy lọc không khí'],['Lõi lọc &amp; màng lọc'],['So sánh sản phẩm',ROUTES.water],['E-catalogue']])}
        ${col('Dịch vụ',[['Dịch vụ cho thuê'],['Gói dịch vụ'],['Heart Service'],['Giải pháp doanh nghiệp'],['Tra cứu thanh toán']])}
        ${col('Về Coway',[['Giới thiệu'],['Lịch sử hình thành'],['Nghiên cứu &amp; phát triển'],['Cody'],['Hoạt động cộng đồng'],['Tuyển dụng']])}
        ${col('Hỗ trợ',[['Hướng dẫn mua hàng'],['Giao hàng &amp; đổi trả'],['Chính sách bảo hành'],['Câu hỏi thường gặp'],['Hệ thống cửa hàng'],['Liên hệ']])}
      </div>
    </div>
    <div class="ftr-line"></div>
    <div class="ftr-bottom">
      <span>© 2026 Coway Vina. Bảo lưu mọi quyền.</span>
      <div class="ftr-social">
        <a href="#" data-soon aria-label="Facebook"><img src="${A}s-fb.svg" alt=""></a>
        <a href="#" data-soon aria-label="YouTube"><img src="${A}s-yt.svg" alt=""></a>
        <a href="#" data-soon aria-label="Instagram"><img src="${A}s-ig.svg" alt=""></a>
        <span class="lang"><img src="${A}ic-globe-footer.svg" alt="">Tiếng Việt</span>
      </div>
    </div>`;
  }

  /* Card / Sản phẩm — opts: {compare:bool, gift:bool, badge:string|false} */
  window.cowayCard = function(key, opts={}){
    const p = window.COWAY_PRODUCTS[key]; if(!p) return '';
    const badge = opts.badge!==undefined ? opts.badge : p.badge;
    const gift = opts.gift!==undefined ? opts.gift : p.gift;
    const href = p.href || ROUTES.detail;
    const size = p.imgW ? `style="width:${p.imgW}px;height:${p.imgH}px"` : '';
    return `<article class="p-card" data-key="${key}">
      <a class="media" href="${href}" aria-label="${p.name}">
        ${badge?`<span class="badge ${opts.badgeClass||''}">${badge}</span>`:''}
        <img class="shot" src="${p.img}" alt="Máy lọc nước ${p.name}" ${size} loading="lazy">
        ${gift?`<span class="gift"><img src="${A}ic-star.svg" alt="">Tặng 1 năm Heart Service</span>`:''}
      </a>
      <button class="wish" type="button" aria-pressed="false" aria-label="Yêu thích ${p.name}" data-wish><img src="${A}ic-heart-outline.svg" alt=""></button>
      <a class="info" href="${href}"><h3 class="name">${p.name}</h3><p class="desc">${p.desc}</p></a>
      <div class="price-row">
        <div class="price"><b>${fmt(p.price)}</b><span>hoặc thuê ${fmt(p.rent)}/tháng</span></div>
        <button class="cart" type="button" aria-label="Thêm ${p.name} vào giỏ" data-add-cart="${p.name}"><img src="${A}ic-bag-white.svg" alt=""></button>
      </div>
      ${opts.compare?`<label class="cmp"><input type="checkbox" data-compare="${key}"> So sánh</label>`:''}
    </article>`;
  };

  /* Toast */
  let toastEl, toastT;
  window.cowayToast = function(msg){
    if(!toastEl){toastEl=document.createElement('div');toastEl.className='toast';toastEl.setAttribute('role','status');document.body.appendChild(toastEl);}
    toastEl.textContent=msg; toastEl.classList.add('on'); clearTimeout(toastT); toastT=setTimeout(()=>toastEl.classList.remove('on'),2400);
  };

  let cart = 0;
  function mount(){
    const h = document.querySelector('[data-header]');
    if(h){ h.classList.add('site-header'); h.innerHTML = header(h.dataset.active, h.dataset.announce!=='off'); }
    const f = document.querySelector('[data-footer]');
    if(f){ f.classList.add('site-footer'); f.innerHTML = footer(); }
    document.querySelectorAll('[data-card]').forEach(el=>{
      el.outerHTML = window.cowayCard(el.dataset.card, {compare:el.hasAttribute('data-compare-on'), badge: el.dataset.badge===undefined?undefined:(el.dataset.badge||false), gift: el.dataset.gift===undefined?undefined:el.dataset.gift==='1'});
    });
  }

  document.addEventListener('click', e=>{
    const soon = e.target.closest('[data-soon]');
    if(soon){ e.preventDefault(); window.cowayToast('Trang này thuộc giai đoạn thiết kế tiếp theo'); return; }
    const c = e.target.closest('[data-close-announce]');
    if(c){ document.getElementById('hdrAnnounce')?.remove(); return; }
    const w = e.target.closest('[data-wish]');
    if(w){ e.preventDefault(); const on = w.getAttribute('aria-pressed')!=='true'; w.setAttribute('aria-pressed',on); window.cowayToast(on?'Đã thêm vào danh sách yêu thích':'Đã bỏ khỏi danh sách yêu thích'); return; }
    const a = e.target.closest('[data-add-cart]');
    if(a){ e.preventDefault(); cart++; const n=document.getElementById('cartCount'); if(n){n.textContent=cart;n.classList.add('on');} window.cowayToast('Đã thêm '+a.dataset.addCart+' vào giỏ hàng'); return; }
    const b = e.target.closest('#burger');
    if(b){ const nav=document.getElementById('hdrNav'); const o=nav.classList.toggle('open'); b.setAttribute('aria-expanded',o); }
  });

  function init(){
    mount();
    const hdr = document.querySelector('.site-header');
    const main = hdr && hdr.querySelector('.hdr-main');
    const setTop = ()=>{ if(hdr&&main) hdr.style.top = 'calc(env(safe-area-inset-top, 0px) - '+main.offsetTop+'px)'; };
    setTop(); window.addEventListener('resize', setTop);
    document.addEventListener('click', e=>{ if(e.target.closest('[data-close-announce]')) requestAnimationFrame(setTop); });
    const onScroll = ()=> hdr && hdr.classList.toggle('scrolled', window.scrollY>main.offsetTop+8);
    window.addEventListener('scroll', onScroll, {passive:true}); onScroll();
    const io = 'IntersectionObserver' in window ? new IntersectionObserver(es=>es.forEach(en=>{ if(en.isIntersecting){ en.target.classList.add('in'); io.unobserve(en.target);} }),{rootMargin:'0px 0px -8% 0px'}) : null;
    document.querySelectorAll('.reveal').forEach(el=> io ? io.observe(el) : el.classList.add('in'));
    document.dispatchEvent(new Event('coway:ready'));
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
