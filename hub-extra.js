// FNBHCM HUB — Chương trình & chính sách + Nhiệm vụ đổi quà
(function () {
  var SB, ME = "", GD = false, PEOPLE = null;
  function $(id) { return document.getElementById(id); }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function toast(m, ms) { var t = $("hub-toast"); if (!t) { t = document.createElement("div"); t.id = "hub-toast"; t.className = "hub-toast"; document.body.appendChild(t); } t.textContent = m; t.classList.add("show"); clearTimeout(t._t); t._t = setTimeout(function () { t.classList.remove("show"); }, ms || 3600); }
  function today() { var d = new Date(); return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); }
  function dleft(e) { return Math.ceil((Date.parse(e + "T23:59:59+07:00") - Date.now()) / 864e5); }
  function dm(s) { if (!s) return ""; var p = s.split("-"); return p[2] + "/" + p[1]; }

  var css = document.createElement("style");
  css.textContent = [
    ".pg-tabs{display:flex;gap:4px;background:#F6EFDE;border-radius:10px;padding:3px;margin:6px 0 10px;overflow-x:auto}",
    ".pg-tabs button{flex:1;white-space:nowrap;border:0;background:transparent;border-radius:8px;padding:7px 10px;font-size:13px;font-weight:700;color:#6B6150;cursor:pointer;font-family:inherit}",
    ".pg-tabs button.on{background:#fff;color:#17130D;box-shadow:0 1px 3px rgba(0,0,0,.1)}",
    ".pg-list{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:10px}",
    ".pg-it{border:1px solid #F1E7D2;border-radius:12px;padding:10px;background:#FFFCF5;display:flex;gap:10px;align-items:flex-start}",
    ".pg-it img.th{width:72px;height:72px;border-radius:9px;object-fit:cover;flex:none;cursor:zoom-in;background:#fff}",
    ".pg-it .tt{font-weight:800;color:#17130D;font-size:14px;line-height:1.3}",
    ".pg-it .sm{font-size:12.5px;color:#5B5140;margin-top:3px;line-height:1.45}",
    ".pg-chips{display:flex;gap:5px;flex-wrap:wrap;margin-top:6px;align-items:center}",
    ".pg-chip{font-size:11px;font-weight:700;border-radius:20px;padding:2px 8px;background:#F6EFDE;color:#6B5A2E}",
    ".pg-chip.new{background:#16D865;color:#fff}.pg-chip.hot{background:#FDE2E1;color:#C0262D}",
    ".pg-more{font-size:12px;color:#8a6a1e;cursor:pointer;font-weight:700;background:none;border:0;padding:0;font-family:inherit}",
    ".pg-body{white-space:pre-wrap;font-size:12.5px;color:#3a3326;margin-top:6px;border-top:1px dashed #E8DCC0;padding-top:6px;display:none}",
    ".pg-body.on{display:block}.pg-body img{max-width:100%;border-radius:10px;margin-top:6px}",
    ".pg-adm{display:flex;gap:4px;margin-left:auto}.pg-adm button{border:1px solid #ECE4D5;background:#fff;border-radius:7px;font-size:11px;padding:2px 6px;cursor:pointer}",
    ".pr-search{width:100%;border:1.5px solid #ddd3bf;border-radius:9px;padding:7px 10px;font-family:inherit;font-size:13px;margin-bottom:8px}",
    ".pr-tbl{width:100%;border-collapse:collapse;font-size:13px}.pr-tbl th{text-align:left;font-size:11.5px;color:#8a7a55;padding:6px;border-bottom:1px solid #EFE6D3}",
    ".pr-tbl td{padding:7px 6px;border-bottom:1px solid #F4EEE2;vertical-align:top}.pr-tbl .g td{background:#FBF3E2;font-weight:800;color:#6B5A2E;font-size:12px}",
    ".pr-tbl .pz{font-weight:800;color:#B8872F;white-space:nowrap}.pr-tbl .pm{color:#0a7a3a;font-size:12px}",
    "@media(max-width:720px){.pr-tbl .nt{display:none}}",
    ".pg-form{display:none;background:#FFFCF5;border:1px dashed #E7C877;border-radius:12px;padding:10px;margin-bottom:10px}",
    ".pg-form.on{display:block}.pg-form input,.pg-form textarea,.pg-form select{width:100%;border:1.5px solid #ddd3bf;border-radius:8px;padding:6px 8px;font-family:inherit;font-size:13px;margin-bottom:6px;box-sizing:border-box}",
    ".pg-form .r2{display:grid;grid-template-columns:1fr 1fr;gap:6px}",
    ".q-bal{display:flex;align-items:center;gap:12px;background:linear-gradient(135deg,#17130D,#3a2f1c);color:#fff;border-radius:12px;padding:12px 14px;margin:6px 0 10px}",
    ".q-bal .n{font-size:30px;font-weight:900;color:#F0D48A;line-height:1}.q-bal .l{font-size:12px;opacity:.85}",
    ".q-bal button{margin-left:auto;border:1px solid #F0D48A;background:transparent;color:#F0D48A;border-radius:9px;padding:6px 10px;font-weight:700;cursor:pointer;font-family:inherit;font-size:12.5px}",
    ".q-task{display:flex;gap:8px;align-items:center;font-size:13px;padding:7px 10px;border:1px solid #F1E7D2;border-radius:10px;background:#FFFCF5;margin-bottom:8px}",
    ".q-rw{display:grid;grid-template-columns:1fr 1fr;gap:8px}",
    ".q-r{border:1px solid #F1E7D2;border-radius:12px;padding:10px;background:#fff;text-align:center}",
    ".q-r .ic{font-size:26px}.q-r .nm{font-weight:800;color:#17130D;font-size:13.5px}.q-r .ct{font-size:12px;color:#8a6a1e;font-weight:700}",
    ".q-r .bar{height:6px;background:#F6EFDE;border-radius:4px;overflow:hidden;margin:6px 0}.q-r .bar i{display:block;height:100%;background:linear-gradient(90deg,#C8912E,#F0D48A)}",
    ".q-r button{width:100%;border:0;border-radius:8px;padding:6px;font-weight:800;cursor:pointer;font-family:inherit;font-size:12.5px;background:linear-gradient(135deg,#F0D48A,#D4A94C);color:#17130D}",
    ".q-r button:disabled{background:#EEE8DB;color:#a59c88;cursor:not-allowed}",
    "#hub-whale{display:none;position:fixed;inset:0;z-index:9998;background:rgba(10,8,4,.55);align-items:center;justify-content:center;padding:16px}#hub-whale.on{display:flex}#hub-whale>.hubcard{width:min(560px,94vw);max-height:86vh;overflow:auto;margin:0!important;position:relative}#hub-whale .wh-x{border:0;background:none;font-size:18px;cursor:pointer;color:#8a7a55;margin-left:6px}",
    ".q-sub{font-size:12.5px;font-weight:800;color:#17130D;margin:12px 0 6px}",
    ".q-row{display:flex;justify-content:space-between;gap:8px;font-size:12.5px;padding:5px 0;border-top:1px solid #F4EEE2}",
    ".q-row .c{font-family:monospace;font-weight:800;color:#8a6a1e}",
    ".q-st{font-size:11px;font-weight:700;border-radius:20px;padding:1px 7px}.q-st.cho_trao{background:#FFF3D6;color:#9a6a00}.q-st.da_trao{background:#DDF7E7;color:#0a7a3a}.q-st.huy{background:#eee;color:#888}",
    "#qtf{display:none;background:#FFFCF5;border:1px dashed #E7C877;border-radius:10px;padding:10px;margin-bottom:10px}#qtf.on{display:block}",
    "#qtf select,#qtf input{width:100%;box-sizing:border-box;border:1.5px solid #ddd3bf;border-radius:8px;padding:6px 8px;font-family:inherit;font-size:13px;margin-bottom:6px}",
    ".q-go{border:0;border-radius:8px;padding:4px 12px;font-weight:800;cursor:pointer;font-family:inherit;font-size:12px;background:linear-gradient(135deg,#F0D48A,#D4A94C);color:#17130D;margin-left:8px;min-width:62px}.q-go:disabled{background:#EEE8DB;color:#a59c88;cursor:not-allowed}",
    ".q-cols{display:grid;grid-template-columns:1fr 1.25fr;gap:18px;align-items:start}@media(max-width:820px){.q-cols{grid-template-columns:1fr}}.q-cols .q-sub:first-child{margin-top:4px}",
    ".lb-top{display:flex;align-items:baseline;gap:10px;margin:14px 0 6px}.lb-top b{font-size:15px;color:#17130D}",
    ".lb-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}@media(max-width:900px){.lb-grid{grid-template-columns:1fr}}",
    ".lb-card{padding:12px 14px}.lb-h{font-weight:800;color:#17130D;font-size:14px;margin-bottom:6px}",
    ".lb-row{display:flex;align-items:center;gap:8px;font-size:13px;padding:5px 0;border-top:1px solid #F4EEE2}.lb-row:first-of-type{border-top:0}",
    ".lb-row.t{font-weight:700}.lb-n{width:22px;text-align:center;flex:none;color:#8a7a55;font-size:12.5px}.lb-row.t .lb-n{font-size:15px}",
    ".lb-nm{flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.lb-nm i{font-style:normal;font-weight:500;color:#9a8f78;font-size:11.5px}",
    ".lb-row b{white-space:nowrap;color:#B8872F;text-align:right}.lb-row b small{display:block;font-size:10.5px;color:#9a8f78;font-weight:500}",
    "@keyframes lbflow{0%{background-position:0% 50%}100%{background-position:200% 50%}}",
    "@keyframes lbfire{0%,100%{box-shadow:0 0 6px rgba(255,110,0,.45),0 0 14px rgba(255,60,0,.25)}50%{box-shadow:0 0 14px rgba(255,170,0,.95),0 0 26px rgba(255,80,0,.55)}}",
    "@keyframes lbglowS{0%,100%{box-shadow:0 0 5px rgba(70,120,200,.45)}50%{box-shadow:0 0 14px rgba(90,150,235,.85)}}",
    "@keyframes lbglowB{0%,100%{box-shadow:0 0 4px rgba(205,130,60,.5)}50%{box-shadow:0 0 12px rgba(235,170,105,.95)}}",
    "@keyframes lbshine{0%{left:-60%}60%,100%{left:130%}}",
    "@keyframes lbtw{0%,100%{opacity:0;transform:scale(.4) rotate(0)}50%{opacity:1;transform:scale(1.15) rotate(90deg)}}",
    "@keyframes lbflick{0%,100%{transform:translateY(0) scale(1)}50%{transform:translateY(-2px) scale(1.12)}}",
    ".lb-row.r1,.lb-row.r2,.lb-row.r3{position:relative;overflow:hidden;border-top:0!important;border-radius:10px;padding:7px 10px;margin:4px 0;background-size:200% 100%}",
    ".lb-row.r1{background-image:linear-gradient(90deg,rgba(255,61,0,.16),rgba(255,150,0,.2),rgba(255,215,80,.26),rgba(255,150,0,.2),rgba(255,61,0,.16));border:1.5px solid rgba(255,120,0,.55);animation:lbflow 2.4s linear infinite,lbfire 1.4s ease-in-out infinite}",
    ".lb-row.r2{background-image:linear-gradient(90deg,rgba(62,111,181,.12),rgba(170,200,240,.34),rgba(62,111,181,.12));border:1.5px solid rgba(62,111,181,.55);animation:lbflow 3s linear infinite,lbglowS 1.8s ease-in-out infinite}",
    ".lb-row.r3{background-image:linear-gradient(90deg,rgba(185,114,63,.13),rgba(240,180,120,.3),rgba(185,114,63,.13));border:1.5px solid rgba(185,114,63,.5);animation:lbflow 3s linear infinite,lbglowB 1.8s ease-in-out infinite}",
    ".lb-row.r1::after,.lb-row.r2::after,.lb-row.r3::after{content:'';position:absolute;top:0;bottom:0;left:-60%;width:40%;background:linear-gradient(100deg,transparent,rgba(255,255,255,.55),transparent);transform:skewX(-20deg);animation:lbshine 2.8s ease-in-out infinite;pointer-events:none;z-index:1}",
    ".lb-row.r1>span,.lb-row.r1>b,.lb-row.r2>span,.lb-row.r2>b,.lb-row.r3>span,.lb-row.r3>b{position:relative;z-index:2}.lb-row.r1 b small,.lb-row.r2 b small,.lb-row.r3 b small{color:inherit;opacity:.75}",
    ".lb-row.r2::after{animation-delay:.5s}.lb-row.r3::after{animation-delay:1s}",
    ".lb-row.r1 .lb-n{animation:lbflick 1s ease-in-out infinite}",
    ".lb-row.r1 .lb-nm::after{content:' 🔥';display:inline-block;animation:lbflick .9s ease-in-out infinite}",
    ".lb-sp{position:absolute;font-style:normal;pointer-events:none;color:#FFD54A;font-size:11px;text-shadow:0 0 6px #fff;animation:lbtw 1.8s ease-in-out infinite}",
    ".lb-sp.s1{top:2px;left:30%}.lb-sp.s2{bottom:1px;right:34%;animation-delay:.9s;font-size:9px}",
    ".lb-row.r2 .lb-sp{color:#7FA8E0}.lb-row.r3 .lb-sp{color:#F2B27A}",
    "@media(prefers-reduced-motion:reduce){.lb-row.r1,.lb-row.r2,.lb-row.r3,.lb-row::after,.lb-sp,.lb-n,.lb-nm::after{animation:none!important}}",
    ".lb-card{display:flex;flex-direction:column}.lb-cnt{font-size:11px;font-weight:600;color:#9a8f78;margin-left:4px}",
    ".lb-pg{margin-top:auto;padding-top:10px;display:flex;align-items:center;justify-content:center;gap:10px;font-size:12.5px;color:#6B6150}",
    ".lb-pg button{width:32px;height:30px;border-radius:9px;border:1px solid #ECE4D5;background:#fff;cursor:pointer;font-size:12px;color:#17130D}.lb-pg button:disabled{opacity:.35;cursor:default}.lb-pg button:not(:disabled):hover{background:#F6EFDE}",
    ".q-lead{border:1.5px solid #E7C877;background:linear-gradient(135deg,#FFF8E6,#FFFDF7);border-radius:12px;padding:10px 12px;margin:6px 0 4px}",
    ".q-lead-st{display:flex;justify-content:space-between;font-size:12px;color:#6B6150;margin-top:6px}",
    ".q-lead-act{display:flex;align-items:center;gap:8px;margin-top:8px}.q-lead-act input{width:64px;border:1.5px solid #ddd3bf;border-radius:8px;padding:5px 6px;font-family:inherit;font-size:13px}.q-lead-act .q-go{margin-left:auto}",
    ".q-req{display:flex;align-items:center;gap:8px;padding:6px 0;border-top:1px solid #F4EEE2;font-size:12.5px}.q-req-l{flex:1;min-width:0;line-height:1.35}.q-req-l a{text-decoration:none}",
    ".q-req-r{display:flex;gap:4px;flex:none}.q-req-r button{border:1px solid #ECE4D5;background:#fff;border-radius:7px;font-size:11.5px;padding:3px 8px;cursor:pointer;font-family:inherit}.q-req-r .q-ok{background:#16A34A;border-color:#16A34A;color:#fff;font-weight:700}.q-req-r .q-no{color:#C0262D}",
    "#hub-quest .q-row{padding:4px 0;font-size:12.5px}#hub-quest .q-sub{margin:10px 0 4px}#hub-quest .q-lead{padding:8px 10px;margin:4px 0}#hub-quest .q-go{padding:3px 10px;min-width:54px}",
    ".q-grid{display:grid;grid-template-columns:1fr 1fr;column-gap:14px}.q-grid.one{grid-template-columns:1fr}@media(max-width:1100px){.q-grid{grid-template-columns:1fr}}",
    ".q-grid .q-row{border-top:1px solid #F4EEE2}",
    ".q-adm button{border:1px solid #ECE4D5;background:#fff;border-radius:7px;font-size:11px;padding:2px 7px;cursor:pointer;margin-left:3px}"
  ].join("\n");
  document.head.appendChild(css);

  // ================= CHƯƠNG TRÌNH & CHÍNH SÁCH =================
  var ANN = [], PRICE = [], TAB = "cty";
  function loadPrograms() {
    Promise.all([
      SB.from("announcements").select("*").eq("active", true).order("end_date", { ascending: true, nullsFirst: false }),
      SB.from("price_items").select("*").eq("active", true).order("sort")
    ]).then(function (r) { var t = today(); ANN = (r[0].data || []).filter(function (a) { return !a.end_date || a.end_date >= t; }); PRICE = r[1].data || []; drawPrograms(); });
  }
  function annItem(a) {
    var isNew = Date.now() - Date.parse(a.created_at) < 7 * 864e5, dl = a.end_date ? dleft(a.end_date) : null;
    var IM = (a.image || "").split(",").map(function (x) { return x.trim(); }).filter(Boolean);
    var img = IM.length ? '<img class="th" src="' + esc(IM[0]) + '" alt="" data-zoom="' + esc(IM[0]) + '">' : "";
    return '<div class="pg-it">' + img + '<div style="flex:1;min-width:0"><div style="display:flex;gap:6px;align-items:flex-start"><div class="tt">' + esc(a.title) + "</div>"
      + (GD ? '<span class="pg-adm"><button data-ed="' + a.id + '">✎</button><button data-del="' + a.id + '">✕</button></span>' : "") + "</div>"
      + (a.summary ? '<div class="sm">' + esc(a.summary) + "</div>" : "")
      + '<div class="pg-chips">' + (isNew ? '<span class="pg-chip new">🆕 Mới</span>' : "")
      + (a.end_date ? '<span class="pg-chip' + (dl <= 3 ? " hot" : "") + '">⏳ ' + (a.start_date ? dm(a.start_date) + " – " : "đến ") + dm(a.end_date) + " · còn " + dl + " ngày</span>" : "")
      + ((a.body || a.link || a.image) ? '<button class="pg-more" data-more="' + a.id + '">Chi tiết ▾</button>' : "") + "</div>"
      + '<div class="pg-body" id="pgb' + a.id + '">' + esc(a.body || "") + IM.map(function (u) { return '<img src="' + esc(u) + '" alt="">'; }).join("")
      + (a.link ? '<div style="margin-top:6px"><a href="' + esc(a.link) + '" target="_blank" rel="noopener" style="font-weight:700">Xem nguồn chi tiết ↗</a></div>' : "") + "</div>"
      + "</div></div>";
  }
  function priceTable(q) {
    q = (q || "").toLowerCase();
    var rows = PRICE.filter(function (p) { return !q || (p.name + " " + (p.promo || "") + " " + (p.grp || "")).toLowerCase().indexOf(q) >= 0; });
    var g = null, h = "";
    rows.forEach(function (p) {
      if (p.grp !== g) { g = p.grp; h += '<tr class="g"><td colspan="' + (GD ? 5 : 4) + '">' + esc(g || "Khác") + "</td></tr>"; }
      h += "<tr><td><b>" + esc(p.name) + "</b></td><td class=\"pz\">" + esc(p.price || "") + '</td><td class="pm">' + esc(p.promo || "") + '</td><td class="nt muted" style="font-size:12px">' + esc(p.note || "") + "</td>"
        + (GD ? '<td class="pg-adm"><button data-ped="' + p.id + '">✎</button><button data-pdel="' + p.id + '">✕</button></td>' : "") + "</tr>";
    });
    return '<table class="pr-tbl"><tr><th>Gói / thiết bị</th><th>Giá niêm yết</th><th>Ưu đãi hiện hành</th><th class="nt">Ghi chú</th>' + (GD ? "<th></th>" : "") + "</tr>" + (h || '<tr><td colspan="4" class="muted">Không có kết quả.</td></tr>') + "</table>";
  }
  function drawPrograms() {
    var el = $("hub-programs"); if (!el) return;
    var cty = ANN.filter(function (a) { return a.scope === "cty"; }), kv = ANN.filter(function (a) { return a.scope === "kv"; });
    var tabs = '<div class="pg-tabs"><button data-t="cty" class="' + (TAB === "cty" ? "on" : "") + '">🏢 Công ty (' + cty.length + ')</button><button data-t="kv" class="' + (TAB === "kv" ? "on" : "") + '">📍 Khu vực/trung tâm (' + kv.length + ')</button><button data-t="gia" class="' + (TAB === "gia" ? "on" : "") + '">💰 Chính sách giá</button></div>';
    var form = "";
    if (GD) {
      form = TAB === "gia"
        ? '<div class="pg-form" id="pgf"><input type="hidden" id="pf-id"><div class="r2"><input id="pf-grp" placeholder="Nhóm (VD: Phần mềm FnB)"><input id="pf-name" placeholder="Tên gói / thiết bị"></div><div class="r2"><input id="pf-price" placeholder="Giá niêm yết"><input id="pf-sort" type="number" placeholder="Thứ tự"></div><input id="pf-promo" placeholder="Ưu đãi hiện hành"><input id="pf-note" placeholder="Ghi chú"><button class="hubbtn" id="pf-save">Lưu</button> <button class="hubbtn ghost" id="pf-cancel">Huỷ</button></div>'
        : '<div class="pg-form" id="pgf"><input type="hidden" id="af-id"><select id="af-scope"><option value="cty">🏢 Chương trình công ty</option><option value="kv">📍 Chương trình khu vực/trung tâm</option></select><input id="af-title" placeholder="Tên chương trình"><input id="af-sum" placeholder="Tóm tắt 1 dòng (hiện ngoài)"><textarea id="af-body" rows="4" placeholder="Nội dung chi tiết (mỗi ý 1 dòng)"></textarea><div class="r2"><input id="af-start" type="date" title="Bắt đầu"><input id="af-end" type="date" title="Kết thúc"></div><input id="af-img" placeholder="Link ảnh (tuỳ chọn)"><input id="af-link" placeholder="Link nguồn chi tiết (tuỳ chọn)"><button class="hubbtn" id="af-save">Đăng</button> <button class="hubbtn ghost" id="af-cancel">Huỷ</button></div>';
    }
    var body;
    if (TAB === "gia") body = '<input class="pr-search" id="prq" placeholder="🔎 Tìm gói, thiết bị, ưu đãi…"><div id="prt" style="overflow-x:auto">' + priceTable("") + '</div><div style="margin-top:8px;font-size:12.5px"><a href="https://onesapo.github.io/banggia/" target="_blank" rel="noopener" style="font-weight:700">🧮 Mở công cụ báo giá đầy đủ ↗</a></div>';
    else { var L = TAB === "cty" ? cty : kv; body = L.length ? '<div class="pg-list">' + L.map(annItem).join("") + "</div>" : '<div class="hubmuted">Chưa có chương trình ' + (TAB === "kv" ? "khu vực/trung tâm" : "công ty") + " nào đang chạy.</div>"; }
    el.innerHTML = '<div class="hubcard" style="margin-top:12px"><div style="display:flex;align-items:center;gap:8px"><h3 style="margin:0">📢 Chính sách chương trình</h3>' + (GD ? '<button class="hubbtn" id="pg-add" style="margin-left:auto">＋ ' + (TAB === "gia" ? "Thêm dòng giá" : "Đăng chương trình") + "</button>" : "") + "</div>" + tabs + form + body + "</div>";
    // seen
    try { var seen = JSON.parse(localStorage.getItem("hubAnnSeen") || "[]"); ANN.forEach(function (a) { if (seen.indexOf(a.id) < 0) seen.push(a.id); }); localStorage.setItem("hubAnnSeen", JSON.stringify(seen.slice(-200))); } catch (e) {}
    el.querySelectorAll(".pg-tabs button").forEach(function (b) { b.onclick = function () { TAB = b.getAttribute("data-t"); drawPrograms(); }; });
    el.querySelectorAll("[data-more]").forEach(function (b) { b.onclick = function () { var x = $("pgb" + b.getAttribute("data-more")); x.classList.toggle("on"); b.textContent = x.classList.contains("on") ? "Thu gọn ▴" : "Chi tiết ▾"; }; });
    el.querySelectorAll("[data-zoom]").forEach(function (im) { im.onclick = function () { var id = im.closest(".pg-it").querySelector("[data-more]"); if (id) id.click(); }; });
    var q = $("prq"); if (q) q.oninput = function () { $("prt").innerHTML = priceTable(q.value); bindPriceAdm(); };
    if (GD) bindProgAdm();
  }
  function bindPriceAdm() {
    document.querySelectorAll("[data-pdel]").forEach(function (b) { b.onclick = function () { if (!confirm("Xoá dòng giá này?")) return; SB.from("price_items").update({ active: false }).eq("id", +b.getAttribute("data-pdel")).then(function (r) { if (r.error) return toast("Lỗi: " + r.error.message); loadPrograms(); }); }; });
    document.querySelectorAll("[data-ped]").forEach(function (b) { b.onclick = function () { var p = PRICE.filter(function (x) { return x.id === +b.getAttribute("data-ped"); })[0]; if (!p) return; $("pgf").classList.add("on"); $("pf-id").value = p.id; $("pf-grp").value = p.grp || ""; $("pf-name").value = p.name || ""; $("pf-price").value = p.price || ""; $("pf-sort").value = p.sort || 0; $("pf-promo").value = p.promo || ""; $("pf-note").value = p.note || ""; window.scrollTo({ top: $("pgf").getBoundingClientRect().top + scrollY - 90, behavior: "smooth" }); }; });
  }
  function bindProgAdm() {
    var f = $("pgf"); $("pg-add").onclick = function () { f.classList.toggle("on"); };
    if (TAB === "gia") {
      $("pf-cancel").onclick = function () { f.classList.remove("on"); };
      $("pf-save").onclick = function () {
        var row = { grp: $("pf-grp").value.trim(), name: $("pf-name").value.trim(), price: $("pf-price").value.trim(), promo: $("pf-promo").value.trim() || null, note: $("pf-note").value.trim() || null, sort: parseInt($("pf-sort").value, 10) || 0 };
        if (!row.name) return toast("Nhập tên gói / thiết bị");
        var id = $("pf-id").value; (id ? SB.from("price_items").update(row).eq("id", +id) : SB.from("price_items").insert(row)).then(function (r) { if (r.error) return toast("Lỗi: " + r.error.message); toast("Đã lưu"); loadPrograms(); });
      };
      bindPriceAdm();
    } else {
      $("af-scope").value = TAB;
      $("af-cancel").onclick = function () { f.classList.remove("on"); };
      $("af-save").onclick = function () {
        var row = { scope: $("af-scope").value, title: $("af-title").value.trim(), summary: $("af-sum").value.trim() || null, body: $("af-body").value.trim() || null, start_date: $("af-start").value || null, end_date: $("af-end").value || null, image: $("af-img").value.trim() || null, link: $("af-link").value.trim() || null, created_by: ME };
        if (!row.title) return toast("Nhập tên chương trình");
        var id = $("af-id").value; (id ? SB.from("announcements").update(row).eq("id", +id) : SB.from("announcements").insert(row)).then(function (r) { if (r.error) return toast("Lỗi: " + r.error.message); toast(id ? "Đã cập nhật" : "Đã đăng — sale sẽ thấy chuông báo"); TAB = row.scope; loadPrograms(); });
      };
      document.querySelectorAll("[data-del]").forEach(function (b) { b.onclick = function () { if (!confirm("Gỡ chương trình này?")) return; SB.from("announcements").update({ active: false }).eq("id", +b.getAttribute("data-del")).then(function () { loadPrograms(); }); }; });
      document.querySelectorAll("[data-ed]").forEach(function (b) { b.onclick = function () { var a = ANN.filter(function (x) { return x.id === +b.getAttribute("data-ed"); })[0]; if (!a) return; f.classList.add("on"); $("af-id").value = a.id; $("af-scope").value = a.scope; $("af-title").value = a.title || ""; $("af-sum").value = a.summary || ""; $("af-body").value = a.body || ""; $("af-start").value = a.start_date || ""; $("af-end").value = a.end_date || ""; $("af-img").value = a.image || ""; $("af-link").value = a.link || ""; $("af-save").textContent = "Lưu thay đổi"; }; });
    }
  }

  // ================= NHIỆM VỤ & ĐỔI QUÀ =================
  function loadQuest() {
    var el = $("hub-challenge"); if (!el) return;
    el.innerHTML = '<div class="hubcard"><h3>🎁 Nhiệm vụ &amp; Đổi quà</h3><div class="hubmuted">Đang tải…</div></div>';
    Promise.all([
      SB.rpc("quest_board"),
      SB.from("rewards").select("*").eq("active", true).order("sort"),
      SB.from("redemptions").select("*").order("created_at", { ascending: false }).limit(GD ? 30 : 10),
      SB.from("point_ledger").select("*").order("created_at", { ascending: false }).limit(10),
      SB.rpc("reward_left"),
      SB.rpc("quest_available", { p_email: ME }),
      SB.rpc("my_reward_used")
    ]).then(function (r) { LEFT = {}; (r[4].data || []).forEach(function (x) { LEFT[x.id] = x.left_n; }); AVAIL = Number(r[5].data) || 0; USED = {}; ((r[6] && r[6].data) || []).forEach(function (x) { USED[x.reward_id] = x.used; }); drawQuest(r[0].data || [], r[1].data || [], r[2].data || [], r[3].data || []); });
  }
  var LEFT = {}, AVAIL = 0, USED = {};
  function drawQuest(board, rewards, reds, ledger) {
    var el = $("hub-challenge");
    var me = board.filter(function (x) { return (x.email || "").toLowerCase() === ME; })[0] || { earned: 0, balance: 0 };
    var bal = AVAIL, pendPts = (me.balance || 0) - AVAIL;
    var h = '', rw = '';
    if (!GD) {
      h += '<div class="q-bal"><div><div class="l">Điểm khả dụng</div><div class="n">' + bal + '</div><div class="l">Đã kiếm ' + (me.earned || 0) + (pendPts > 0 ? " · đang chờ đổi " + pendPts : "") + '</div></div><button id="q-give">🔁 Tặng điểm</button></div>'
        + '<div id="qtf"><select id="qt-to"><option value="">Tặng cho…</option></select><input id="qt-n" type="number" min="1" placeholder="Số điểm"><input id="qt-note" placeholder="Lời nhắn (tuỳ chọn)"><button class="hubbtn" id="qt-ok">Tặng</button> <button class="hubbtn ghost" id="qt-x">Huỷ</button></div>';
    }
    h += '<div class="q-task"><span style="font-size:18px">📍</span><div style="flex:1"><b>Nhiệm vụ: Gắn cờ quán trên bản đồ</b><div class="hubmuted" style="font-size:12px">Mỗi cờ = +1 điểm</div></div><a class="hubbtn" href="map.html" style="text-decoration:none">Gắn cờ →</a></div>';
    var groups = [["📇 Lead công ty", function (w) { return w.per_user_max != null; }], ["💎 Voucher đặc biệt", function (w) { return w.per_user_max == null && /đặc biệt/i.test(w.name); }], ["🖥️ Thiết bị & gói", function (w) { return w.per_user_max == null && !/đặc biệt|1 năm/i.test(w.name) && /^(S\d|Pro\b)|gói/i.test(w.name); }], ["🎟️ Voucher 1 năm", function (w) { return w.per_user_max == null && /1 năm/i.test(w.name); }],
      ["📦 Khác", function (w) { return w.per_user_max == null && !/đặc biệt|1 năm/i.test(w.name) && !/^(S\d|Pro\b)|gói/i.test(w.name); }]];
    rw += '<div class="q-sub">🛍️ Đổi quà <span class="hubmuted" style="font-weight:400;font-size:11.5px">· bấm Đổi → GĐTT liên hệ gửi voucher & trừ điểm</span></div>';
    groups.forEach(function (g) {
      var L = rewards.filter(g[1]); if (!L.length) return;
      rw += '<div style="font-size:11.5px;font-weight:800;color:#8a6a1e;margin:8px 0 2px">' + g[0] + "</div>";
      rw += '<div class="q-grid' + (L.some(function (w) { return w.per_user_max != null; }) ? " one" : "") + '">' + L.map(function (w) {
        var left = LEFT[w.id], out = left != null && left <= 0, short = bal < w.cost;
        if (w.per_user_max != null) {
          var used = USED[w.id] || 0, room = Math.max(0, w.per_user_max - used), mx = Math.max(0, Math.min(room, left != null ? left : room, Math.floor(bal / w.cost)));
          return '<div class="q-lead"><div style="display:flex;align-items:center;gap:8px"><span style="flex:1"><b>' + esc(w.icon || "📇") + " " + esc(w.name) + '</b><div class="hubmuted" style="font-size:11.5px">' + esc(w.descr || "") + "</div></span><b style=\"color:#B8872F;white-space:nowrap\">" + w.cost + ' điểm/slot</b></div>'
            + '<div class="q-lead-st"><span>Còn <b>' + Math.max(0, left != null ? left : 0) + "</b>/" + (w.total || w.stock || "∞") + " slot</span><span>Bạn đã đổi <b>" + used + "</b>/" + w.per_user_max + "</span></div>"
            + (GD ? '<div class="q-adm" style="margin-top:6px"><button data-rwcost="' + w.id + '" data-ct="' + w.cost + '" data-nm="' + esc(w.name) + '">✏️ Điểm</button> <button data-rwoff="' + w.id + '">Ẩn</button></div>'
              : '<div class="q-lead-act"><input type="number" min="1" max="' + Math.max(1, mx) + '" value="' + (mx ? 1 : 0) + '" id="qty-' + w.id + '"' + (mx ? "" : " disabled") + '><span class="hubmuted" style="font-size:11.5px">slot = <b id="qtyl-' + w.id + '">' + (mx ? 4 : 0) + "</b> lead</span>"
                + '<button class="q-go" data-rdq="' + w.id + '" data-nm="' + esc(w.name) + '" data-ct="' + w.cost + '" data-mx="' + mx + '"' + (mx ? "" : " disabled") + ">" + (out ? "Hết slot" : room <= 0 ? "Đã đủ " + w.per_user_max : short ? "Thiếu điểm" : "Đổi") + "</button></div>")
            + "</div>";
        }
        var nm = esc(w.name.replace(/^Voucher đặc biệt — /, ""));
        return '<div class="q-row" style="align-items:center"><span style="flex:1"><b>' + esc(w.icon || "🎁") + " " + nm + '</b> <span class="hubmuted" style="font-size:11.5px">' + (left != null ? "· còn " + Math.max(0, left) : "") + '</span></span><b style="color:#B8872F;white-space:nowrap">' + w.cost + " điểm</b>"
          + (GD ? '<span class="q-adm"><button data-rwcost="' + w.id + '" data-ct="' + w.cost + '" data-nm="' + esc(w.name) + '">✏️ Điểm</button> <button data-rwoff="' + w.id + '">Ẩn</button></span>'
            : '<button class="q-go" data-rd="' + w.id + '" data-nm="' + esc(w.name) + '" data-ct="' + w.cost + '"' + (out || short ? " disabled" : "") + ">" + (out ? "Hết" : short ? "Thiếu " + (w.cost - bal) : "Đổi") + "</button>")
          + "</div>";
      }).join("") + "</div>";
    });
    if (GD) rw += '<div style="margin-top:8px"><button class="hubbtn ghost" id="rw-add">＋ Thêm phần thưởng</button></div><div class="pg-form" id="rwf"><div class="r2"><input id="rw-icon" placeholder="Icon (VD 🎟️)"><input id="rw-cost" type="number" placeholder="Số điểm"></div><input id="rw-name" placeholder="Tên phần thưởng"><input id="rw-desc" placeholder="Mô tả"><input id="rw-stock" type="number" placeholder="Số lượng (bỏ trống = không giới hạn)"><button class="hubbtn" id="rw-save">Lưu</button></div>';
    // Lịch sử / quản lý
    if (GD) {
      var pend = reds.filter(function (x) { return x.status === "cho_trao"; });
      var REQ = reds.slice().sort(function (a, b) { return (a.status === "cho_trao" ? 0 : 1) - (b.status === "cho_trao" ? 0 : 1); }).map(function (x) {
        var nm = esc(x.reward_name).replace("Lead công ty tháng trước bất kỳ", "Lead"), lk = x.link ? ' <a href="' + esc(/^https?:/i.test(x.link) ? x.link : "https://" + x.link) + '" target="_blank" rel="noopener" title="Link add voucher">🔗</a>' : "";
        return '<div class="q-req"><div class="q-req-l"><b>' + esc(x.full_name || x.email) + '</b> · ' + nm + ' <span class="c">' + esc(x.code) + "</span>" + lk + '</div><div class="q-req-r">'
          + (x.status === "cho_trao" ? '<button class="q-ok" data-mk="' + x.id + '" data-s="da_trao" title="Đã gửi & trừ điểm">✓ Gửi</button><button class="q-no" data-mk="' + x.id + '" data-s="huy" title="Từ chối">✕</button>' : '<span class="q-st ' + x.status + '">' + ({ da_trao: "Đã gửi", huy: "Từ chối" }[x.status] || x.status) + "</span>") + "</div></div>";
      });
      h += '<div class="q-sub">📦 Yêu cầu đổi quà ' + (pend.length ? "(" + pend.length + " chờ xử lý)" : "") + '</div><div id="q-req-box"></div>';
      window._QREQ = REQ;
    } else if (reds.length || ledger.length) {
      h += '<details style="margin-top:10px"><summary style="cursor:pointer;font-size:12.5px;font-weight:700;color:#8a6a1e">📜 Lịch sử của bạn</summary>'
        + reds.map(function (x) { return '<div class="q-row"><span>' + esc(x.reward_name) + ' <span class="c">' + esc(x.code) + '</span></span><span class="q-st ' + x.status + '">' + ({ cho_trao: "Chờ GĐTT gửi", da_trao: "Đã nhận", huy: "Từ chối" }[x.status] || x.status) + "</span></div>"; }).join("")
        + ledger.filter(function (l) { return l.kind !== "redeem"; }).map(function (l) { var nm = (PEOPLE || []).filter(function (p) { return p.email.toLowerCase() === (l.ref_email || ""); })[0]; return '<div class="q-row"><span>' + (l.kind === "transfer_in" ? "Nhận từ " : l.kind === "transfer_out" ? "Tặng cho " : "Điều chỉnh ") + esc(nm ? nm.full_name : (l.ref_email || "")) + (l.note ? ' <span class="hubmuted">“' + esc(l.note) + "”</span>" : "") + '</span><b style="color:' + (l.delta > 0 ? "#0a7a3a" : "#C0262D") + '">' + (l.delta > 0 ? "+" : "") + l.delta + "</b></div>"; }).join("")
        + "</details>";
    }
    // Bảng điểm
    window._QBD = board.map(function (x, i) { return '<div class="q-row"><span>' + (i + 1) + ". " + esc(x.full_name || x.email) + '</span><b style="color:#B8872F">' + x.balance + " điểm</b></div>"; });
    h += '<div class="q-sub">🏅 Bảng điểm</div><div id="q-bd-box"></div>';
    h = '<div class="hubcard" id="hub-quest"><h3>🎁 Nhiệm vụ &amp; Đổi quà</h3><div class="q-cols"><div>' + h + '</div><div>' + rw + '</div></div></div>';
    el.innerHTML = h;
    qPager("q-req-box", window._QREQ || [], 6, "_qReqPg", function () { bindQuest(bal); });
    qPager("q-bd-box", window._QBD || [], 5, "_qBdPg");
    bindQuest(bal);
  }
  function qPager(id, items, per, key, after) {
    var box = $(id); if (!box) return;
    var pages = Math.max(1, Math.ceil(items.length / per)); window[key] = Math.min(window[key] || 0, pages - 1);
    var draw = function () {
      var p = window[key];
      box.innerHTML = (items.length ? items.slice(p * per, p * per + per).join("") : '<div class="hubmuted" style="font-size:12.5px">Chưa có dữ liệu.</div>')
        + (pages > 1 ? '<div class="lb-pg"><button data-d="-1"' + (p === 0 ? " disabled" : "") + '>◀</button><span>' + (p + 1) + "/" + pages + '</span><button data-d="1"' + (p >= pages - 1 ? " disabled" : "") + ">▶</button></div>" : "");
      [].forEach.call(box.querySelectorAll(".lb-pg button"), function (b) { b.onclick = function () { window[key] += +b.dataset.d; draw(); if (after) after(); }; });
    };
    draw();
  }
  function bindQuest(bal) {
    document.querySelectorAll("[data-rdq]").forEach(function (b) {
      var id = b.dataset.rdq, inp = $("qty-" + id), lab = $("qtyl-" + id), mx = +b.dataset.mx;
      if (inp) inp.oninput = function () { var v = Math.max(1, Math.min(mx, parseInt(inp.value, 10) || 1)); if (lab) lab.textContent = v * 4; };
      b.onclick = function () {
        var q = Math.max(1, Math.min(mx, parseInt(inp && inp.value, 10) || 1)); if (inp) inp.value = q;
        if (!confirm("Đổi " + q + " slot “" + b.dataset.nm + "” (= " + q * 4 + " lead, " + q * b.dataset.ct + " điểm)?\nGĐTT sẽ liên hệ gửi lead và trừ điểm.")) return;
        b.disabled = true; SB.rpc("redeem_reward", { p_reward: +id, p_qty: q }).then(function (r) {
          if (r.error) { b.disabled = false; return toast("Lỗi: " + r.error.message); }
          if (window.confetti) window.confetti({ particleCount: 140, spread: 80, origin: { y: 0.6 }, colors: ["#C8912E", "#F0D48A", "#FF7A00", "#16D865"] });
          toast("✅ Đã gửi yêu cầu " + q + " slot (mã " + r.data + "). GĐTT sẽ liên hệ gửi lead và trừ điểm.", 6500); loadQuest();
        });
      };
    });
    document.querySelectorAll("[data-rd]").forEach(function (b) { b.onclick = function () {
      var link = prompt("Đổi “" + b.dataset.nm + "” (" + b.dataset.ct + " điểm)\n\nDán LINK đơn hàng / báo giá / khách hàng để GĐTT add voucher vào:", "");
      if (link === null) return;
      link = link.trim(); if (link.length < 5) { toast("Cần dán link để GĐTT add voucher nhé"); return; }
      b.disabled = true; SB.rpc("redeem_reward", { p_reward: +b.dataset.rd, p_qty: 1, p_link: link }).then(function (r) {
        if (r.error) { b.disabled = false; return toast("Lỗi: " + r.error.message); }
        if (window.confetti) window.confetti({ particleCount: 140, spread: 80, origin: { y: 0.6 }, colors: ["#C8912E", "#F0D48A", "#FF7A00", "#16D865"] });
        toast("✅ Đã gửi yêu cầu (mã " + r.data + "). GĐTT sẽ liên hệ gửi voucher và trừ điểm.", 6500); loadQuest();
      });
    }; });
    var g = $("q-give"); if (g) {
      g.onclick = function () { $("qtf").classList.toggle("on"); fillPeople(); };
      $("qt-x").onclick = function () { $("qtf").classList.remove("on"); };
      $("qt-ok").onclick = function () {
        var to = $("qt-to").value, n = parseInt($("qt-n").value, 10) || 0;
        if (!to || n <= 0) return toast("Chọn người nhận và số điểm");
        if (n > bal) return toast("Bạn chỉ có " + bal + " điểm");
        if (!confirm("Tặng " + n + " điểm cho " + $("qt-to").selectedOptions[0].text + "?")) return;
        SB.rpc("transfer_points", { p_to: to, p_amount: n, p_note: $("qt-note").value.trim() || null }).then(function (r) { if (r.error) return toast("Lỗi: " + r.error.message); toast("Đã tặng " + n + " điểm 💛"); loadQuest(); });
      };
    }
    document.querySelectorAll("[data-mk]").forEach(function (b) { b.onclick = function () {
      if (!confirm(b.dataset.s === "huy" ? "Từ chối yêu cầu này?" : "Xác nhận đã gửi voucher và trừ điểm?")) return;
      SB.rpc("mark_redemption", { p_id: +b.dataset.mk, p_status: b.dataset.s }).then(function (r) { if (r.error) return toast("Lỗi: " + r.error.message); loadQuest(); });
    }; });
    var ra = $("rw-add"); if (ra) {
      ra.onclick = function () { $("rwf").classList.toggle("on"); };
      $("rw-save").onclick = function () {
        var row = { icon: $("rw-icon").value.trim() || "🎁", name: $("rw-name").value.trim(), descr: $("rw-desc").value.trim() || null, cost: parseInt($("rw-cost").value, 10) || 0, sort: 10, stock: $("rw-stock").value === "" ? null : parseInt($("rw-stock").value, 10) };
        if (!row.name || row.cost <= 0) return toast("Nhập tên và số điểm");
        SB.from("rewards").insert(row).then(function (r) { if (r.error) return toast("Lỗi: " + r.error.message); toast("Đã thêm phần thưởng"); loadQuest(); });
      };
    }
    document.querySelectorAll("[data-rwcost]").forEach(function (b) { b.onclick = function () { var v = prompt("Số điểm mới cho: " + b.dataset.nm, b.dataset.ct); if (v == null) return; v = parseInt(v, 10); if (!(v > 0)) return toast("Nhập số điểm > 0"); SB.from("rewards").update({ cost: v }).eq("id", +b.dataset.rwcost).then(function (r) { if (r.error) return toast("Lỗi: " + r.error.message); toast("Đã đổi thành " + v + " điểm"); loadQuest(); }); }; });
    document.querySelectorAll("[data-rwoff]").forEach(function (b) { b.onclick = function () { if (!confirm("Ẩn phần thưởng này?")) return; SB.from("rewards").update({ active: false }).eq("id", +b.dataset.rwoff).then(function () { loadQuest(); }); }; });
  }
  function fillPeople() {
    var s = $("qt-to"); if (!s) return;
    var go = function () { s.innerHTML = '<option value="">Tặng cho…</option>' + PEOPLE.filter(function (p) { return p.email.toLowerCase() !== ME; }).map(function (p) { return '<option value="' + esc(p.email) + '">' + esc(p.full_name || p.email) + " · " + esc((p.dept || "").replace("Phòng ", "")) + "</option>"; }).join(""); };
    if (PEOPLE) go(); else SB.from("role_assignments").select("email,full_name,dept").like("dept", "Phòng%").order("full_name").then(function (r) { PEOPLE = r.data || []; go(); });
  }

  // ================= THÔNG ĐIỆP MỖI NGÀY (không trùng ai trong ngày, 500 ngày không lặp) =================
  function dailyQuote() {
    var Q = window.HUB_QUOTES || [], el = $("hello-msg"); if (!Q.length || !el) return;
    var vn = new Date(Date.now() + 7 * 3600e3), day = Math.floor((Date.UTC(vn.getUTCFullYear(), vn.getUTCMonth(), vn.getUTCDate()) - Date.UTC(2026, 0, 1)) / 864e5);
    SB.from("role_assignments").select("email,created_at,full_name").order("created_at", { ascending: true }).order("email", { ascending: true }).then(function (r) {
      var L = (r.data || []).map(function (x) { return (x.email || "").toLowerCase(); }), slot = L.indexOf(ME); if (slot < 0) slot = L.length;
      var meR = (r.data || [])[slot], h1 = $("hello"); if (h1 && meR && meR.full_name && h1.textContent.indexOf("bạn") >= 0) { var w = meR.full_name.trim().split(/\s+/); h1.textContent = "Chào " + (w.length > 2 ? w[w.length - 1] : w.join(" ")) + " 👋"; }
      var q = Q[(((day + slot * 11) % Q.length) + Q.length) % Q.length];
      var au = q[1] && !/khuyết danh/i.test(q[1]) ? ' <span style="white-space:nowrap;color:#8a6a1e;font-weight:600">– ' + esc(q[1]) + "</span>" : "";
      el.innerHTML = '<span style="color:#8a6a1e;font-weight:700">💬 Thông điệp hôm nay của bạn:</span> <i>“' + esc(q[0]) + "”</i>" + au;
    });
  }
  // ================= DẢI TÓM TẮT CÁ NHÂN =================
  function renderMe() {
    var P = window.CLF_PROFILE || {}, nm = (P.full_name || (window.CLF_USER || {}).email || "").trim();
    var h1 = $("hello"); if (h1 && nm && nm.indexOf("@") < 0) h1.textContent = "Chào " + nm.split(/\s+/).slice(-1)[0] + " 👋";
    dailyQuote();
    var el = $("hub-me"); if (!el) return; if (GD) { var rw1 = $("hub-row1"); if (rw1) rw1.style.gridTemplateColumns = "1fr"; el.style.display = "none"; return; }
    function sm(n) { n = Number(n) || 0; return n >= 1e9 ? (Math.round(n / 1e7) / 100 + " tỷ").replace(".", ",") : Math.round(n / 1e6) + "tr"; }
    Promise.all([SB.rpc("profile_ranks", { p_email: ME }), SB.rpc("my_chuan")]).then(function (r) {
      var x = (r[0].data || [])[0], c = (r[1].data || [])[0] || {};
      if (!x || !x.period) return;
      var m = Number(x.mine) || 0, ch = Number(c.chuan) || 0, pc = ch ? Math.round(m / ch * 100) : 0, mon = "T" + parseInt(String(x.period).split("-")[1], 10);
      var box = function (l, v, s) { return '<div style="background:#FFFCF5;border:1px solid #F1E7D2;border-radius:10px;padding:9px 11px"><div style="font-size:11.5px;color:var(--gray);font-weight:600">' + l + '</div><div style="font-size:20px;font-weight:800;color:#B8872F;line-height:1.25">' + v + "</div>" + (s ? '<div style="font-size:11px;color:var(--gray)">' + s + "</div>" : "") + "</div>"; };
      el.innerHTML = '<div class="hubcard" style="height:100%;box-sizing:border-box"><div style="display:flex;align-items:center;gap:8px;margin-bottom:10px"><h3 style="margin:0">📊 Doanh thu của bạn · ' + mon + '</h3><a href="profile.html" style="margin-left:auto;font-size:12.5px;font-weight:700;text-decoration:none">Hồ sơ chi tiết →</a></div>'
        + '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">'
        + box("Doanh thu", sm(m), ch ? "chuẩn " + sm(ch) : "")
        + box("% chuẩn", pc + "%", pc >= 100 ? "🔥 vượt chuẩn" : (ch ? "còn thiếu " + sm(Math.max(0, ch - m)) : ""))
        + box("Hạng phòng", m > 0 ? "#" + x.dept_rnk + "/" + x.dept_n : "—", x.dept ? esc(x.dept.replace("Phòng ", "")) : "")
        + box("Hạng trung tâm", m > 0 ? "#" + x.tt_rnk + "/" + x.tt_n : "—", m > 0 && x.tt_rnk > 1 ? "thiếu " + sm(x.tt_gap) + " lên #" + (x.tt_rnk - 1) : "")
        + "</div></div>";
    });
  }
  // ================= 3 BẢNG XẾP HẠNG (từ lịch Bảng Danh Vọng mỗi sáng) =================
  function renderLB() {
    var el = $("hub-lb"); if (!el) return;
    function m1(v) { v = Number(v) || 0; return (Math.round(v / 1e5) / 10).toString().replace(".", ",") + "M"; }
    var MED = ["🥇", "🥈", "🥉"], COL = ["#C2410C", "#24467A", "#9A4E1C"];
    SB.from("leaderboard_daily").select("snap_date").order("snap_date", { ascending: false }).limit(1).then(function (r) {
      var d = r.data && r.data[0] && r.data[0].snap_date;
      if (!d) { el.innerHTML = '<div class="hubcard" style="margin-top:12px"><div class="hubmuted">🏆 Bảng Danh Vọng sẽ tự cập nhật lên đây mỗi sáng (Thứ 2–Thứ 7).</div></div>'; return; }
      SB.from("leaderboard_daily").select("*").eq("snap_date", d).order("rank").then(function (q) {
        var rows = q.data || [], dd = d.split("-"), PG = { phong: 0, sale: 0, khac: 0 }, PER = 10;
        var FMT = {
          phong: function (x) { return (x.pct != null ? String(x.pct).replace(".", ",") + "%" : m1(x.value)) + '<small>' + m1(x.value) + "</small>"; },
          sale: function (x) { return m1(x.value); }, khac: function (x) { return m1(x.value); }
        };
        var TITLE = { phong: "🏅 Top phòng kinh doanh", sale: "👑 Top sale", khac: "💼 Top doanh thu khác" };
        function rowHtml(x, kind) {
          var k = x.rank - 1, top = k < 3, c = top ? ' style="color:' + COL[k] + '"' : "";
          return '<div class="lb-row' + (top ? " t r" + (k + 1) : "") + '"><span class="lb-n">' + (top ? MED[k] : x.rank) + '</span>' + (top ? '<i class="lb-sp s1">✦</i><i class="lb-sp s2">✧</i>' : '') + '<span class="lb-nm"' + c + ">" + esc(x.name) + (x.dept && kind !== "phong" ? ' <i>' + esc(x.dept) + "</i>" : "") + '</span><b' + c + ">" + FMT[kind](x) + "</b></div>";
        }
        function draw(kind) {
          var box = $("lb-" + kind); if (!box) return;
          var L = rows.filter(function (x) { return x.kind === kind; }), pages = Math.max(1, Math.ceil(L.length / PER));
          if (PG[kind] >= pages) PG[kind] = pages - 1;
          var part = L.slice(PG[kind] * PER, PG[kind] * PER + PER);
          box.innerHTML = '<div class="lb-h">' + TITLE[kind] + (L.length > PER ? ' <span class="lb-cnt">' + L.length + " người</span>" : "") + "</div>"
            + (part.length ? part.map(function (x) { return rowHtml(x, kind); }).join("") : '<div class="hubmuted">Chưa có dữ liệu.</div>')
            + (pages > 1 ? '<div class="lb-pg"><button data-k="' + kind + '" data-d="-1"' + (PG[kind] === 0 ? " disabled" : "") + '>◀</button><span>Trang ' + (PG[kind] + 1) + "/" + pages + '</span><button data-k="' + kind + '" data-d="1"' + (PG[kind] >= pages - 1 ? " disabled" : "") + ">▶</button></div>" : "");
          [].forEach.call(box.querySelectorAll(".lb-pg button"), function (b) { b.onclick = function () { PG[kind] += +b.dataset.d; draw(kind); }; });
        }
        el.innerHTML = '<div class="lb-top"><b>🏆 Bảng Danh Vọng</b><span class="hubmuted">Cập nhật ' + dd[2] + "/" + dd[1] + " · tháng " + parseInt(dd[1], 10) + "</span></div>"
          + '<div class="lb-grid"><div class="hubcard lb-card" id="lb-phong"></div><div class="hubcard lb-card" id="lb-sale"></div><div class="hubcard lb-card" id="lb-khac"></div></div>';
        draw("phong"); draw("sale"); draw("khac");
      });
    });
  }

  // ================= 🐋 KÌNH NGƯ SÁT THỦ (sale tự gửi yêu cầu ghi nhận, GĐTT duyệt) =================
  var WMIN = 10e6;
  function wm(n) { n = Number(n) || 0; return n >= 1e9 ? (Math.round(n / 1e7) / 100 + "").replace(".", ",") + " tỷ" : (Math.round(n / 1e5) / 10 + "").replace(".", ",") + "tr"; }
  window.openWhale = function () { var el = $("hub-whale"); if (el) el.classList.add("on"); };
  function renderWhale() {
    var el = $("hub-whale"); if (!el) return;
    var now = new Date(), per = now.getFullYear() + "-" + String(now.getMonth() + 1).padStart(2, "0");
    var d0 = per + "-01", d1 = new Date(now.getFullYear(), now.getMonth() + 1, 1); d1 = d1.getFullYear() + "-" + String(d1.getMonth() + 1).padStart(2, "0") + "-01";
    Promise.all([
      SB.from("whales").select("*").eq("status", "da_duyet").gte("deal_date", d0).lt("deal_date", d1),
      SB.from("whales").select("*").ilike("email", ME).order("created_at", { ascending: false }).limit(10),
      GD ? SB.from("whales").select("*").eq("status", "cho_duyet").order("created_at") : Promise.resolve({ data: [] })
    ]).then(function (r) {
      var ok = r[0].data || [], mine = r[1].data || [], pend = r[2].data || [];
      var ST = { cho_duyet: ["⏳ Chờ duyệt", "#B8872F"], da_duyet: ["✅ Đã ghi nhận", "#16A34A"], tu_choi: ["✕ Từ chối", "#C0262D"] };
      var my = mine.length ? '<div class="q-sub" style="margin-top:10px">📄 Yêu cầu của tôi</div>' + mine.map(function (w) {
        return '<div class="q-req"><div class="q-req-l"><b>' + Number(w.amount).toLocaleString("vi-VN") + "đ</b> · " + esc(w.deal_date) + ' <span style="color:' + ST[w.status][1] + ';font-weight:700">' + ST[w.status][0] + "</span></div>"
          + (w.status === "cho_duyet" ? '<div class="q-req-r"><button data-whdel="' + w.id + '">Huỷ</button></div>' : "") + "</div>";
      }).join("") : "";
      var gd = GD ? '<div class="q-sub" style="margin-top:10px">📥 Chờ anh duyệt (' + pend.length + ")</div>" + (pend.map(function (w) {
        return '<div class="q-req"><div class="q-req-l"><b>' + esc(w.full_name || w.email) + "</b> " + (w.dept ? '<span class="hubmuted">' + esc(w.dept) + "</span>" : "") + "<br><b>" + Number(w.amount).toLocaleString("vi-VN") + "đ</b> · " + esc(w.deal_date)
          + (/^https?:/.test(w.link || "") ? ' · <a href="' + esc(w.link) + '" target="_blank" rel="noopener">🔗 Link</a>' : "") + (w.note ? '<br><span class="hubmuted">📝 ' + esc(w.note) + "</span>" : "") + '</div><div class="q-req-r"><button class="q-ok" data-whok="' + w.id + '">✓ Duyệt</button><button class="q-no" data-whno="' + w.id + '">✕</button></div></div>';
      }).join("") || '<div class="hubmuted" style="font-size:12.5px">Không có yêu cầu chờ duyệt.</div>') : "";
      var today = new Date(Date.now() + 7 * 3600e3).toISOString().slice(0, 10);
      el.innerHTML = '<div class="hubcard" style="margin-top:12px"><h3>🐋 Ghi nhận Kình Ngư Sát Thủ<span class="hs"><button class="wh-x" id="wh-x" aria-label="Đóng">✕</button></span></h3>'
        + '<div class="hubmuted" style="font-size:12px;margin-bottom:6px">Chốt được bill từ ' + wm(WMIN) + ' trở lên (chưa thuế)? Nhập số tiền gửi yêu cầu — GĐTT duyệt xong bill sẽ lên thẻ <b>Kình Ngư Sát Thủ</b> ở Bảng Phong Thần, xếp hạng theo từng bill.</div>'
        + '<div class="pg-form on" id="whf"><input id="wh-amt" inputmode="numeric" placeholder="Số tiền bill chưa thuế (đ) — VD: 46.750.000" style="font-size:15px;font-weight:700">'
        + '<button class="hubbtn" id="wh-save">Gửi yêu cầu</button></div>'
        + my + gd + "</div>";
      $("wh-x").onclick = function () { el.classList.remove("on"); };
      el.onclick = function (e) { if (e.target === el) el.classList.remove("on"); };
      window.WH_PEND = GD ? pend.length : 0;
      document.querySelectorAll(".wh-mini").forEach(function (b) { b.innerHTML = "🐋 Gửi ghi nhận" + (window.WH_PEND ? "<i>" + window.WH_PEND + "</i>" : ""); });
      $("wh-amt").oninput = function () { var v = this.value.replace(/\D/g, ""); this.value = v ? Number(v).toLocaleString("vi-VN") : ""; };
      $("wh-save").onclick = function () {
        var row = { email: ME, customer: "Bill", amount: Number($("wh-amt").value.replace(/\D/g, "")), contracts: 1, deal_date: today, link: "" };
        if (!(row.amount >= WMIN)) return toast("Chỉ ghi nhận bill từ " + wm(WMIN) + " trở lên");
        this.disabled = true; var b = this;
        SB.from("whales").insert(row).then(function (x) { b.disabled = false; if (x.error) return toast("Lỗi: " + x.error.message); toast("🐋 Đã gửi — chờ GĐTT duyệt"); renderWhale(true); });
      };
      el.querySelectorAll("[data-whdel]").forEach(function (b) { b.onclick = function () { if (!confirm("Huỷ yêu cầu này?")) return; SB.from("whales").delete().eq("id", +b.dataset.whdel).then(renderWhale); }; });
      el.querySelectorAll("[data-whok],[data-whno]").forEach(function (b) { b.onclick = function () { var ok = !!b.dataset.whok; SB.from("whales").update({ status: ok ? "da_duyet" : "tu_choi", reviewed_at: new Date().toISOString() }).eq("id", +(b.dataset.whok || b.dataset.whno)).then(function (x) { if (x.error) return toast("Lỗi: " + x.error.message); toast(ok ? "✅ Đã ghi nhận — tải lại trang để thấy trên Bảng Phong Thần" : "Đã từ chối"); renderWhale(); }); }; });
    });
  }
  // ================= POPUP SỰ KIỆN (lần đầu vào) =================
  function eventPopup(force) {
    var EV = window.HUB_EVENT; if (!EV) return;
    var KEY = EV.key, END = Date.parse(EV.end);
    if (Date.now() > END) { var f0 = $("hp-fab"); if (f0) f0.remove(); return; }
    if (!$("hp-style")) {
      var st = document.createElement("style"); st.id = "hp-style";
      st.textContent = "@keyframes hpIn{from{opacity:0;transform:scale(.85) translateY(20px)}to{opacity:1;transform:none}}@keyframes hpGlow{0%,100%{box-shadow:0 0 30px rgba(255,180,40,.45),0 20px 60px rgba(0,0,0,.6)}50%{box-shadow:0 0 60px rgba(255,200,60,.85),0 20px 60px rgba(0,0,0,.6)}}"
        + "@keyframes hpBob{0%,100%{transform:translateY(0) rotate(0)}25%{transform:translateY(-4px) rotate(-8deg)}75%{transform:translateY(-4px) rotate(8deg)}}@keyframes hpRing{0%,100%{box-shadow:0 0 0 0 rgba(255,190,60,.55),0 6px 18px rgba(0,0,0,.25)}50%{box-shadow:0 0 0 10px rgba(255,190,60,0),0 6px 18px rgba(0,0,0,.25)}}"
        + ".hp-ov{position:fixed;inset:0;z-index:9999;background:rgba(10,8,4,.72);backdrop-filter:blur(3px);display:flex;align-items:center;justify-content:center;padding:16px}"
        + ".hp-card{position:relative;width:min(440px,92vw);border-radius:18px;overflow:hidden;background:#110d06;border:2px solid #E7C877;animation:hpIn .45s cubic-bezier(.2,.9,.3,1.2),hpGlow 2.2s ease-in-out .45s infinite}"
        + ".hp-card img{display:block;width:100%;height:auto;cursor:pointer}"
        + ".hp-x{position:absolute;top:8px;right:8px;width:34px;height:34px;border-radius:50%;border:1px solid rgba(255,255,255,.5);background:rgba(0,0,0,.55);color:#fff;font-size:18px;line-height:1;cursor:pointer;display:flex;align-items:center;justify-content:center}"
        + ".hp-x:hover{background:rgba(0,0,0,.8)}"
        + ".hp-bar{display:flex;gap:8px;align-items:center;justify-content:space-between;padding:10px 12px;background:linear-gradient(180deg,#1b1408,#0d0a05)}"
        + ".hp-no{background:none;border:0;color:#cdbf9c;font-size:12.5px;cursor:pointer;font-family:inherit;text-decoration:underline}"
        + ".hp-go{border:0;border-radius:10px;padding:9px 14px;font-weight:800;font-size:13.5px;cursor:pointer;font-family:inherit;background:linear-gradient(135deg,#FFE08A,#D4A94C);color:#17130D}"
        + "#hp-fab{position:fixed;right:20px;bottom:20px;z-index:60;display:flex;align-items:center;gap:8px;padding:10px 16px 10px 12px;border-radius:30px;border:2px solid #fff;background:linear-gradient(135deg,#FFE08A,#D4A94C 55%,#B8872F);color:#17130D;font-family:inherit;font-weight:800;font-size:14px;cursor:pointer;animation:hpRing 1.8s ease-out infinite}"
        + "#hp-fab span{display:inline-block;font-size:24px;animation:hpBob 1.6s ease-in-out infinite}"
        + "#hp-fab i{position:absolute;top:-4px;right:-2px;width:14px;height:14px;border-radius:50%;background:#E5484D;border:2px solid #fff}"
        + "#hp-fab b{font-weight:800;white-space:nowrap}"
        + "#hp-fab:hover{transform:translateY(-2px)}@media(max-width:720px){#hp-fab{right:12px;bottom:70px;padding:8px 12px 8px 10px;font-size:12.5px}#hp-fab span{font-size:20px}}";
      document.head.appendChild(st);
    }
    var fab = $("hp-fab");
    if (!fab) {
      fab = document.createElement("button"); fab.id = "hp-fab"; fab.type = "button"; fab.setAttribute("aria-label", "Xem sự kiện");
      fab.innerHTML = "<span>🎁</span><b>Xem sự kiện</b><i></i>"; fab.title = EV.title || "";
      fab.onclick = function () { eventPopup(true); };
      document.body.appendChild(fab);
    }
    var off = false; try { off = localStorage.getItem(KEY) === "off"; } catch (e) {}
    if (!force && (off || window._hpShown)) { fab.style.display = ""; return; }
    if (document.querySelector(".hp-ov")) return;
    window._hpShown = 1; fab.style.display = "none";
    var ov = document.createElement("div"); ov.className = "hp-ov";
    ov.innerHTML = '<div class="hp-card" role="dialog" aria-label="Sự kiện"><button class="hp-x" aria-label="Đóng">✕</button>'
      + '<img src="' + esc(EV.img) + '" alt="' + esc(EV.alt || EV.title || "") + '">'
      + '<div class="hp-bar"><button class="hp-no">' + (off ? "Đã tắt tự hiện" : "Không hiện lại lần sau") + '</button>' + (EV.target ? '<button class="hp-go">' + esc(EV.cta || "Xem ngay →") + "</button>" : "") + "</div></div>";
    document.body.appendChild(ov);
    var close = function () { ov.remove(); fab.style.display = ""; if (location.hash === "#event") history.replaceState(null, "", location.pathname + location.search); };
    var go = function () { close(); var t = EV.target ? $(EV.target) : null; if (t) window.scrollTo({ top: t.getBoundingClientRect().top + scrollY - 80, behavior: "smooth" }); };
    ov.querySelector(".hp-x").onclick = close; if (!ov.querySelector(".hp-go")) ov.querySelector(".hp-bar").insertAdjacentHTML("beforeend", '<button class="hp-go">Đã hiểu</button>');
    ov.querySelector(".hp-no").onclick = function () { try { localStorage.setItem(KEY, "off"); } catch (e) {} close(); };
    ov.querySelector(".hp-go").onclick = go; ov.querySelector("img").onclick = go;
    ov.addEventListener("click", function (e) { if (e.target === ov) close(); });
    document.addEventListener("keydown", function k(e) { if (e.key === "Escape") { close(); document.removeEventListener("keydown", k); } });
  }
  function start() {
    SB = window.SB; if (!SB) return;
    ME = ((window.CLF_USER || {}).email || "").toLowerCase(); GD = (window.CLF_PROFILE || {}).level === "c4";
    SB.from("role_assignments").select("email,full_name,dept").like("dept", "Phòng%").order("full_name").then(function (r) { PEOPLE = r.data || []; });
    loadPrograms(); loadQuest(); renderMe(); renderLB(); renderWhale(); (window.hubEvent ? window.hubEvent() : Promise.resolve()).then(function () { setTimeout(function () { eventPopup(location.hash === "#event"); }, 700); }); window.addEventListener("hashchange", function () { if (location.hash === "#event") eventPopup(true); });
    if (location.hash === "#hub-whale") setTimeout(window.openWhale, 1200);
    if (location.hash === "#hub-programs" || location.hash === "#hub-challenge") setTimeout(function () { var t = $(location.hash.slice(1)); if (t) t.scrollIntoView({ behavior: "smooth", block: "start" }); }, 900);
  }
  if (window.CLF_READY) start(); else document.addEventListener("clf-ready", start);
})();
