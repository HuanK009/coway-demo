/* Blog — lọc theo chuyên mục, tìm theo tiêu đề (không phân biệt dấu), phân trang */
(function(){
  const IMG = 'assets/blog/';
  const CATS = {
    'suc-khoe':'Sức khoẻ', 'chat-luong-nuoc':'Chất lượng nước', 'dich-vu':'Dịch vụ',
    'cong-dong':'Cộng đồng', 'tuyen-dung':'Tuyển dụng'
  };
  /* Ảnh dùng lại theo chủ đề (bản trình bày chỉ có 7 ảnh trong Figma) */
  const PIC = {
    tuyen:'post-tuyen-dung.png', mohoi:'post-mo-hoi.png', ph:'post-do-ph.png', detox:'post-detox.png',
    xanh:'post-song-xanh.png', nhi:'post-benh-vien-nhi.png', svc:'featured.png'
  };
  const ALT = {
    tuyen:'Góc tuyển dụng Coway Vina', mohoi:'Người đàn ông nghỉ ngơi sau khi tập, khăn quàng cổ',
    ph:'Rót nước từ máy lọc nước Coway vào ly', detox:'Gian hàng Coway tại sự kiện',
    xanh:'Đội ngũ Coway Vina tại gian hàng Heart Service', nhi:'Nhân viên Coway giới thiệu lõi lọc tại sự kiện',
    svc:'Các mẫu máy lọc nước Coway trưng bày trên kệ'
  };

  // [id, chuyên mục, ngày, tiêu đề, tóm tắt, tác giả, ảnh]
  const RAW = [
    ['thue-may','dich-vu','18/09/2026','Dịch vụ thuê máy lọc nước Coway Vina','Nhu cầu sử dụng nước tinh khiết đạt chuẩn ngày càng thiết yếu. Thuê máy là giải pháp tài chính linh hoạt, đi kèm gói chăm sóc trọn vẹn trong suốt hợp đồng.','Tran Manh Tuan','svc',true],
    ['phien-dich','tuyen-dung','10/09/2026','[Tuyển dụng] Phiên dịch viên tiếng Hàn — Ban Giám đốc','Hỗ trợ Ban Giám đốc tại văn phòng TP. Hồ Chí Minh.','Vũ Phương My','tuyen'],
    ['mo-hoi','suc-khoe','02/09/2026','Ra nhiều mồ hôi nên uống gì? Top đồ uống bù nước & điện giải tốt nhất','Khi cơ thể đổ mồ hôi nhiều do vận động, tập thể dục hay thời tiết nắng nóng…','Admin','mohoi'],
    ['do-ph','chat-luong-nuoc','01/09/2026','Độ pH của nước là gì? Tiêu chuẩn an toàn & cách đo tại nhà','Độ pH của nước là một trong những chỉ số thường được nhắc đến khi nói về nước uống.','Admin','ph'],
    ['detox','suc-khoe','30/08/2026','Nước detox giảm cân: công thức dễ làm, uống đúng cách','Công thức nước detox đơn giản và cách uống đúng để hỗ trợ kiểm soát cân nặng.','Admin','detox'],
    ['song-xanh','cong-dong','11/06/2026','Coway Vina khởi động hành trình sống xanh cùng biển cả','Với tinh thần “We bring wellness”, Coway Vina mở rộng hoạt động vì môi trường và cộng đồng.','Admin','xanh'],
    ['benh-vien-nhi','cong-dong','05/06/2026','Coway Vina tặng Bệnh viện Nhi Trung ương 28 máy lọc nước và máy lọc không khí','Đại diện Công ty TNHH Coway Vina trao tặng thiết bị cho Bệnh viện Nhi Trung ương Hà Nội.','Admin','nhi'],
    ['uong-bao-nhieu','suc-khoe','28/05/2026','Mỗi ngày nên uống bao nhiêu nước là đủ?','Nhu cầu nước khác nhau theo cân nặng, độ tuổi và mức vận động — cách tính đơn giản cho cả gia đình.','Admin','mohoi'],
    ['tds','chat-luong-nuoc','20/05/2026','Chỉ số TDS trong nước là gì? Bao nhiêu thì an toàn để uống','TDS cho biết tổng chất rắn hoà tan trong nước và là một chỉ số dễ đo tại nhà.','Admin','ph'],
    ['lich-thay-loi','dich-vu','14/05/2026','Lịch thay lõi lọc máy lọc nước Coway: bao lâu một lần?','Mỗi lõi lọc có tuổi thọ khác nhau; thay đúng hạn giúp nước luôn sạch và máy bền hơn.','Tran Manh Tuan','svc'],
    ['ky-thuat-vien','tuyen-dung','08/05/2026','[Tuyển dụng] Kỹ thuật viên lắp đặt & bảo trì — Hà Nội','Lắp đặt, bảo dưỡng định kỳ máy lọc nước và máy lọc không khí cho khách hàng.','Vũ Phương My','tuyen'],
    ['nuoc-ion-kiem','chat-luong-nuoc','29/04/2026','Nước ion kiềm và nước tinh khiết: khác nhau thế nào?','So sánh hai loại nước phổ biến để chọn đúng nhu cầu uống hằng ngày của gia đình.','Admin','ph'],
    ['tre-em','suc-khoe','22/04/2026','Tập cho trẻ thói quen uống nước: 6 mẹo cha mẹ nên biết','Trẻ nhỏ dễ quên uống nước khi mải chơi — vài mẹo nhỏ giúp con uống đủ mỗi ngày.','Admin','mohoi'],
    ['heart-service','dich-vu','15/04/2026','Heart Service là gì? Quyền lợi khi dùng dịch vụ chăm sóc của Coway','Chuyên viên Cody đến tận nhà vệ sinh, kiểm tra và thay lõi định kỳ cho máy của bạn.','Tran Manh Tuan','svc'],
    ['ngay-nuoc','cong-dong','22/03/2026','Coway Vina hưởng ứng Ngày Nước Thế giới 2026','Chuỗi hoạt động lan toả thông điệp sử dụng nước sạch và tiết kiệm tài nguyên nước.','Admin','xanh'],
    ['nuoc-may','chat-luong-nuoc','16/03/2026','Nước máy có uống trực tiếp được không?','Những rủi ro thường gặp của nước máy tại đô thị và cách xử lý an toàn tại nhà.','Admin','ph'],
    ['nuoc-am','suc-khoe','09/03/2026','Uống nước ấm buổi sáng có tác dụng gì?','Một cốc nước ấm sau khi thức dậy giúp cơ thể khởi động nhẹ nhàng cho ngày mới.','Admin','detox'],
    ['tu-van-vien','tuyen-dung','02/03/2026','[Tuyển dụng] Chuyên viên tư vấn bán hàng — TP. Hồ Chí Minh','Tư vấn giải pháp nước sạch và không khí sạch cho khách hàng hộ gia đình.','Vũ Phương My','tuyen'],
    ['mua-hay-thue','dich-vu','24/02/2026','Nên mua đứt hay thuê máy lọc nước? So sánh chi phí 3 năm','Bảng so sánh chi phí sở hữu giữa mua đứt và thuê theo hợp đồng 36 tháng.','Tran Manh Tuan','svc'],
    ['truong-hoc','cong-dong','12/02/2026','Coway Vina mang nước sạch đến 10 trường tiểu học vùng cao','Chương trình trao tặng máy lọc nước cho học sinh các tỉnh miền núi phía Bắc.','Admin','nhi'],
    ['nuoc-cung','chat-luong-nuoc','05/02/2026','Nước cứng là gì? Dấu hiệu nhận biết và cách làm mềm nước','Cặn trắng trong ấm đun là dấu hiệu thường gặp của nước có độ cứng cao.','Admin','ph'],
    ['nang-nong','suc-khoe','28/01/2026','Bù nước đúng cách trong những ngày nắng nóng','Uống từng ngụm nhỏ, chia đều trong ngày và bổ sung điện giải khi cần.','Admin','mohoi'],
    ['ve-sinh-may','dich-vu','20/01/2026','Hướng dẫn vệ sinh máy lọc nước tại nhà đúng cách','Các bước vệ sinh vòi, khay hứng và bề mặt máy giữa hai kỳ bảo dưỡng.','Admin','svc'],
    ['tet-sach','cong-dong','14/01/2026','Tết sạch — Tết khoẻ cùng Coway Vina','Chương trình đồng hành cùng gia đình Việt đón Tết với nước sạch và không khí trong lành.','Admin','xanh'],
    ['ke-toan','tuyen-dung','06/01/2026','[Tuyển dụng] Trưởng nhóm Kế toán quản trị','Quản lý báo cáo tài chính nội bộ và phối hợp với trụ sở Coway tại Hàn Quốc.','Vũ Phương My','tuyen'],
    ['clo','chat-luong-nuoc','28/12/2025','Mùi clo trong nước máy: có hại không và xử lý thế nào?','Clo giúp khử trùng nhưng để lại mùi khó chịu — lõi than hoạt tính xử lý hiệu quả.','Admin','ph'],
    ['da-dep','suc-khoe','18/12/2025','Uống đủ nước có giúp da đẹp hơn?','Mối liên hệ giữa lượng nước uống hằng ngày và độ ẩm của làn da.','Admin','detox'],
    ['cody','dich-vu','10/12/2025','Cody là ai? Gặp gỡ đội ngũ chăm sóc khách hàng của Coway','Cody là chuyên viên được đào tạo bài bản, đồng hành cùng khách hàng suốt quá trình sử dụng.','Tran Manh Tuan','svc'],
    ['hien-mau','cong-dong','02/12/2025','Nhân viên Coway Vina tham gia hiến máu tình nguyện','Hơn 120 nhân viên tham gia ngày hội hiến máu do công ty tổ chức.','Admin','nhi'],
    ['kim-loai','chat-luong-nuoc','22/11/2025','Kim loại nặng trong nước: nguồn gốc và cách loại bỏ','Chì, asen, thuỷ ngân có thể tồn tại trong nước giếng và đường ống cũ.','Admin','ph'],
    ['nguoi-gia','suc-khoe','14/11/2025','Người cao tuổi cần uống nước như thế nào?','Cảm giác khát giảm dần theo tuổi — cách nhắc ông bà uống đủ nước mỗi ngày.','Admin','mohoi'],
    ['doanh-nghiep','dich-vu','05/11/2025','Giải pháp nước sạch cho văn phòng và doanh nghiệp','Máy lọc nước công suất lớn, hợp đồng thuê linh hoạt và bảo dưỡng tại chỗ.','Tran Manh Tuan','svc'],
    ['marketing','tuyen-dung','28/10/2025','[Tuyển dụng] Chuyên viên Marketing kỹ thuật số','Xây dựng nội dung và vận hành các kênh truyền thông số của Coway Vina.','Vũ Phương My','tuyen'],
    ['trong-cay','cong-dong','18/10/2025','Coway Vina trồng 5.000 cây xanh tại Cần Giờ','Hoạt động thường niên góp phần phục hồi rừng ngập mặn ven biển.','Admin','xanh'],
    ['nuoc-dong-chai','chat-luong-nuoc','08/10/2025','Nước đóng bình và nước lọc tại nhà: lựa chọn nào tiết kiệm hơn?','Tính chi phí mỗi lít nước và lượng rác nhựa thải ra trong một năm.','Admin','ph'],
    ['uong-truoc-an','suc-khoe','30/09/2025','Có nên uống nước trước bữa ăn?','Thời điểm uống nước hợp lý giúp tiêu hoá tốt và kiểm soát khẩu phần.','Admin','detox']
  ];
  const POSTS = RAW.map(([id,cat,date,title,desc,author,pic,featured])=>({id,cat,date,title,desc,author,pic,featured:!!featured}));
  const PER_PAGE = 6;

  const norm = s => s.normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/đ/g,'d').replace(/Đ/g,'D').toLowerCase().replace(/\s+/g,' ').trim();
  const esc = s => s.replace(/[&<>"]/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  POSTS.forEach(p=>p.key=norm(p.title));

  /* Tô đậm phần khớp — so trên chuỗi đã bỏ dấu nhưng giữ đúng vị trí ký tự gốc */
  function highlight(title, q){
    if(!q) return esc(title);
    const chars=[...title]; const map=[]; let flat='';
    chars.forEach((ch,i)=>{ const n=norm(ch)||ch.toLowerCase(); for(const c of n){ flat+=c; map.push(i);} });
    const at = flat.indexOf(q); if(at<0) return esc(title);
    const s = map[at], e = map[at+q.length-1];
    return esc(chars.slice(0,s).join(''))+'<mark>'+esc(chars.slice(s,e+1).join(''))+'</mark>'+esc(chars.slice(e+1).join(''));
  }

  const st = {cat:'all', q:'', page:1};
  let $list,$pager,$info,$title,$feature,$banner,$empty,$emptyMsg,$input,$tabs;

  function filtered(){
    const browsing = st.cat==='all' && !st.q;
    return POSTS.filter(p=>{
      if(browsing && p.featured) return false; // bài nổi bật đã hiện ở trên
      if(st.cat!=='all' && p.cat!==st.cat) return false;
      if(st.q && !p.key.includes(st.q)) return false;
      return true;
    });
  }

  function card(p){
    const href='#';
    return `<article class="b-card">
      <a class="b-card__media" href="${href}" data-soon tabindex="-1" aria-hidden="true"><img src="${IMG+PIC[p.pic]}" alt="${ALT[p.pic]}" width="421" height="280" loading="lazy"></a>
      <div class="b-meta"><span class="b-chip">${CATS[p.cat]}</span>${p.featured?'<span class="b-meta__tag">Nổi bật</span>':''}<span class="b-date"><img src="${IMG}ic-calendar.svg" alt="" width="16" height="16"><time datetime="${p.date.split('/').reverse().join('-')}">${p.date}</time></span></div>
      <h3 class="b-card__title"><a href="${href}" data-soon>${highlight(p.title, st.q)}</a></h3>
      <p class="b-card__desc">${esc(p.desc)}</p>
      <p class="b-card__by">Tác giả: ${esc(p.author)}</p>
    </article>`;
  }

  function pageList(cur,total){
    if(total<=5) return Array.from({length:total},(_,i)=>i+1);
    if(cur<=3) return [1,2,3,'…',total];
    if(cur>=total-2) return [1,'…',total-2,total-1,total];
    return [1,'…',cur,'…',total];
  }

  function render(scroll, quiet){
    const items = filtered();
    const pages = Math.max(1, Math.ceil(items.length/PER_PAGE));
    st.page = Math.min(Math.max(1,st.page), pages);
    const slice = items.slice((st.page-1)*PER_PAGE, st.page*PER_PAGE);
    const browsing = st.cat==='all' && !st.q;

    $feature.hidden = !browsing;
    $title.textContent = st.q ? `Kết quả cho “${$input.value.trim()}”` : (st.cat==='all' ? 'Bài viết mới' : CATS[st.cat]);
    $info.textContent = items.length ? `Trang ${st.page} / ${pages}` : '0 bài viết';

    if(!items.length){
      $list.hidden = true; $list.innerHTML=''; $banner.hidden = true; $pager.hidden = true; $empty.hidden = false;
      const where = st.cat!=='all' ? ` trong chuyên mục “${CATS[st.cat]}”` : '';
      $emptyMsg.textContent = st.q ? `Không tìm thấy bài viết nào có tiêu đề chứa “${$input.value.trim()}”${where}. Thử từ khoá khác hoặc xem tất cả bài viết.` : `Chuyên mục này chưa có bài viết.`;
      return;
    }
    $empty.hidden = true; $list.hidden = false; $banner.hidden = false;
    $list.classList.toggle('anim', !quiet);
    $list.innerHTML = slice.map(card).join('');
    // banner nằm sau hàng đầu tiên (3 bài), hoặc cuối danh sách nếu ít hơn
    const cards = $list.children;
    const cut = (twoCol.matches && !oneCol.matches) ? 4 : 3; // luôn chèn sau một hàng trọn vẹn
    if(cards.length>cut) $list.insertBefore($banner, cards[cut]); else $list.appendChild($banner);

    // phân trang
    $pager.hidden = pages<=1;
    $pager.innerHTML = `<button type="button" data-page="${st.page-1}" aria-label="Trang trước" ${st.page===1?'disabled':''}><img src="${IMG}ic-chev-l.svg" alt="" width="16" height="16"></button>`
      + pageList(st.page,pages).map(n=> n==='…' ? '<span class="gap" aria-hidden="true">…</span>'
        : `<button type="button" data-page="${n}" ${n===st.page?'aria-current="page"':''} aria-label="Trang ${n}">${n}</button>`).join('')
      + `<button type="button" data-page="${st.page+1}" aria-label="Trang sau" ${st.page===pages?'disabled':''}><img src="${IMG}ic-chev-r.svg" alt="" width="16" height="16"></button>`;

    if(scroll){
      const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
      document.querySelector('.b-posts').scrollIntoView({behavior: reduce?'auto':'smooth', block:'start'});
    }
  }

  function setCat(cat, focus){
    st.cat = cat; st.page = 1;
    $tabs.forEach(t=>{ const on=t.dataset.cat===cat; t.setAttribute('aria-selected',on); t.tabIndex = on?0:-1; if(on&&focus) t.focus(); });
    render(false);
  }

  let deb;
  const twoCol = matchMedia('(max-width:1024px)'), oneCol = matchMedia('(max-width:640px)');
  function init(){
    $list=document.getElementById('blogList'); $pager=document.getElementById('blogPager'); $info=document.getElementById('pageInfo');
    $title=document.getElementById('listTitle'); $feature=document.getElementById('blogFeature'); $banner=document.getElementById('blogBanner');
    $empty=document.getElementById('blogEmpty'); $emptyMsg=document.getElementById('emptyMsg'); $input=document.getElementById('blogQ');
    $tabs=[...document.querySelectorAll('#blogTabs [role=tab]')];

    $tabs.forEach((t,i)=>{
      t.addEventListener('click',()=>setCat(t.dataset.cat));
      t.addEventListener('keydown',e=>{
        let j=null;
        if(e.key==='ArrowRight') j=(i+1)%$tabs.length; else if(e.key==='ArrowLeft') j=(i-1+$tabs.length)%$tabs.length;
        else if(e.key==='Home') j=0; else if(e.key==='End') j=$tabs.length-1;
        if(j!==null){ e.preventDefault(); setCat($tabs[j].dataset.cat, true); }
      });
    });

    const applyQ = ()=>{ st.q = norm($input.value); st.page=1; render(false); };
    $input.addEventListener('input', ()=>{ clearTimeout(deb); deb=setTimeout(applyQ,180); });
    $input.addEventListener('keydown', e=>{ if(e.key==='Escape' && $input.value){ $input.value=''; applyQ(); } });
    document.getElementById('blogSearch').addEventListener('submit', e=>{
      e.preventDefault(); clearTimeout(deb); applyQ();
      if(st.q) document.querySelector('.b-posts').scrollIntoView({behavior: matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});
    });
    document.getElementById('emptyReset').addEventListener('click', ()=>{ $input.value=''; st.q=''; setCat('all'); });

    $pager.addEventListener('click', e=>{
      const b=e.target.closest('button[data-page]'); if(!b||b.disabled) return;
      st.page=+b.dataset.page; render(true);
    });

    let lastCut=null; const re=()=>{ const c=(twoCol.matches&&!oneCol.matches)?4:3; if(c!==lastCut){ lastCut=c; render(false,true); } }; twoCol.addEventListener('change',re); oneCol.addEventListener('change',re);
    lastCut=(twoCol.matches&&!oneCol.matches)?4:3;
    render(false,true);
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
