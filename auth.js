/* Cổng đăng nhập cho bộ lộ trình. Gắn vào <head> mỗi trang framework.
   Chưa đăng nhập -> chuyển sang login.html. Đăng nhập rồi -> hiện thanh user. */
(function () {
  if (!window.SUPA || SUPA.URL.indexOf('YOUR-PROJECT') >= 0) return;
  var sb = window.supabase.createClient(SUPA.URL, SUPA.ANON_KEY);
  window.SB = sb;
  var de = document.documentElement;
  de.style.visibility = 'hidden';
  var LV = { c0: 'Thử việc (Hội nhập)', c1: 'Nhân viên', c2: 'Chuyên gia', c3: 'Trưởng phòng', c4: 'Giám đốc Trung tâm' };
  function esc(s){ return String(s==null?'':s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];}); }
  function gotoLogin(){ var f=location.pathname.split('/').pop()||'index.html'; location.replace('login.html?next='+encodeURIComponent(f+location.search+location.hash)); }

  sb.auth.getSession().then(function(r){
    var s = r.data.session;
    if (!s) { gotoLogin(); return; }
    window.CLF_USER = s.user;
    Promise.all([
      sb.from('profiles').select('role,level').eq('id', s.user.id).single(),
      sb.from('progress').select('item_key,done').eq('user_id', s.user.id)
    ]).then(function(res){
      window.CLF_PROFILE = (res[0] && res[0].data) || {};
      var pg = window.CLF_PROGRESS || (window.CLF_PROGRESS = {});
      (res[1] && res[1].data || []).forEach(function(row){ pg[row.item_key] = (row.done === true); });
      window.CLF_READY = true;
      de.style.visibility = 'visible';
      injectBar();
      document.dispatchEvent(new Event('clf-ready'));
    });
  });

  function injectBar(){
    if (document.getElementById('clf-userbar')) return;
    var p = window.CLF_PROFILE || {}, isM = p.role === 'manager';
    var lvl = p.level ? (LV[p.level] || p.level) : '(chưa gán cấp)';
    var bar = document.createElement('div');
    bar.id = 'clf-userbar';
    bar.style.cssText = 'background:#0b1020;color:#cfe0ff;font:13px/1.4 Inter,system-ui,sans-serif;padding:8px 16px;display:flex;gap:14px;align-items:center;flex-wrap:wrap';
    bar.innerHTML =
      '<span>👤 <b style="color:#fff">' + esc(window.CLF_USER.email) + '</b></span>' +
      '<span>Cấp: <b style="color:#16D865">' + esc(lvl) + '</b></span>' +
      '<span style="margin-left:auto"></span>' +
      '<a href="index.html" style="color:#9ECCFF;text-decoration:none">Trang chủ</a>' +
      '<a href="welcome.html" style="color:#9ECCFF;text-decoration:none">Hội nhập</a>' +
      (isM ? '<a href="dashboard.html" style="color:#9ECCFF;text-decoration:none">Dashboard</a>' : '') +
      (isM ? '<a href="admin.html" style="color:#9ECCFF;text-decoration:none">Admin</a>' : '') +
      '<a id="clf-logout" style="color:#ff9b9b;text-decoration:none;cursor:pointer">Đăng xuất</a>';
    document.body.insertBefore(bar, document.body.firstChild);
    var lo = document.getElementById('clf-logout');
    if (lo) lo.onclick = function(){ sb.auth.signOut().then(function(){ location.replace('login.html'); }); };
  }
})();
