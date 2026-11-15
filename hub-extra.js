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
    ".q-sub{font-size:12.5px;font-weight:800;color:#17130D;margin:12px 0 6px}",
    ".q-row{display:flex;justify-content:space-between;gap:8px;font-size:12.5px;padding:5px 0;border-top:1px solid #F4EEE2}",
    ".q-row .c{font-family:monospace;font-weight:800;color:#8a6a1e}",
    ".q-st{font-size:11px;font-weight:700;border-radius:20px;padding:1px 7px}.q-st.cho_trao{background:#FFF3D6;color:#9a6a00}.q-st.da_trao{background:#DDF7E7;color:#0a7a3a}.q-st.huy{background:#eee;color:#888}",
    "#qtf{display:none;background:#FFFCF5;border:1px dashed #E7C877;border-radius:10px;padding:10px;margin-bottom:10px}#qtf.on{display:block}",
    "#qtf select,#qtf input{width:100%;box-sizing:border-box;border:1.5px solid #ddd3bf;border-radius:8px;padding:6px 8px;font-family:inherit;font-size:13px;margin-bottom:6px}",
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
    var img = a.image ? '<img class="th" src="' + esc(a.image) + '" alt="" data-zoom="' + esc(a.image) + '">' : "";
    return '<div class="pg-it">' + img + '<div style="flex:1;min-width:0"><div style="display:flex;gap:6px;align-items:flex-start"><div class="tt">' + esc(a.title) + "</div>"
      + (GD ? '<span class="pg-adm"><button data-ed="' + a.id + '">✎</button><button data-del="' + a.id + '">✕</button></span>' : "") + "</div>"
      + (a.summary ? '<div class="sm">' + esc(a.summary) + "</div>" : "")
      + '<div class="pg-chips">' + (isNew ? '<span class="pg-chip new">🆕 Mới</span>' : "")
      + (a.end_date ? '<span class="pg-chip' + (dl <= 3 ? " hot" : "") + '">⏳ ' + (a.start_date ? dm(a.start_date) + " – " : "đến ") + dm(a.end_date) + " · còn " + dl + " ngày</span>" : "")
      + ((a.body || a.link || a.image) ? '<button class="pg-more" data-more="' + a.id + '">Chi tiết ▾</button>' : "") + "</div>"
      + '<div class="pg-body" id="pgb' + a.id + '">' + esc(a.body || "") + (a.image ? '<img src="' + esc(a.image) + '" alt="">' : "")
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
    var tabs = '<div class="pg-tabs"><button data-t="cty" class="' + (TAB === "cty" ? "on" : "") + '">🏢 Công ty (' + cty.length + ')</button><button data-t="kv" class="' + (TAB === "kv" ? "on" : "") + '">📍 Khu vực (' + kv.length + ')</button><button data-t="gia" class="' + (TAB === "gia" ? "on" : "") + '">💰 Chính sách giá</button></div>';
    var form = "";
    if (GD) {
      form = TAB === "gia"
        ? '<div class="pg-form" id="pgf"><input type="hidden" id="pf-id"><div class="r2"><input id="pf-grp" placeholder="Nhóm (VD: Phần mềm FnB)"><input id="pf-name" placeholder="Tên gói / thiết bị"></div><div class="r2"><input id="pf-price" placeholder="Giá niêm yết"><input id="pf-sort" type="number" placeholder="Thứ tự"></div><input id="pf-promo" placeholder="Ưu đãi hiện hành"><input id="pf-note" placeholder="Ghi chú"><button class="hubbtn" id="pf-save">Lưu</button> <button class="hubbtn ghost" id="pf-cancel">Huỷ</button></div>'
        : '<div class="pg-form" id="pgf"><input type="hidden" id="af-id"><select id="af-scope"><option value="cty">🏢 Chương trình công ty</option><option value="kv">📍 Chương trình khu vực</option></select><input id="af-title" placeholder="Tên chương trình"><input id="af-sum" placeholder="Tóm tắt 1 dòng (hiện ngoài)"><textarea id="af-body" rows="4" placeholder="Nội dung chi tiết (mỗi ý 1 dòng)"></textarea><div class="r2"><input id="af-start" type="date" title="Bắt đầu"><input id="af-end" type="date" title="Kết thúc"></div><input id="af-img" placeholder="Link ảnh (tuỳ chọn)"><input id="af-link" placeholder="Link nguồn chi tiết (tuỳ chọn)"><button class="hubbtn" id="af-save">Đăng</button> <button class="hubbtn ghost" id="af-cancel">Huỷ</button></div>';
    }
    var body;
    if (TAB === "gia") body = '<input class="pr-search" id="prq" placeholder="🔎 Tìm gói, thiết bị, ưu đãi…"><div id="prt" style="overflow-x:auto">' + priceTable("") + '</div><div style="margin-top:8px;font-size:12.5px"><a href="https://onesapo.github.io/banggia/" target="_blank" rel="noopener" style="font-weight:700">🧮 Mở công cụ báo giá đầy đủ ↗</a></div>';
    else { var L = TAB === "cty" ? cty : kv; body = L.length ? '<div class="pg-list">' + L.map(annItem).join("") + "</div>" : '<div class="hubmuted">Chưa có chương trình ' + (TAB === "kv" ? "khu vực" : "công ty") + " nào đang chạy.</div>"; }
    el.innerHTML = '<div class="hubcard" style="margin-top:12px"><div style="display:flex;align-items:center;gap:8px"><h3 style="margin:0">📢 Chương trình &amp; chính sách</h3>' + (GD ? '<button class="hubbtn" id="pg-add" style="margin-left:auto">＋ ' + (TAB === "gia" ? "Thêm dòng giá" : "Đăng chương trình") + "</button>" : "") + "</div>" + tabs + form + body + "</div>";
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
      SB.from("point_ledger").select("*").order("created_at", { ascending: false }).limit(10)
    ]).then(function (r) { drawQuest(r[0].data || [], r[1].data || [], r[2].data || [], r[3].data || []); });
  }
  function drawQuest(board, rewards, reds, ledger) {
    var el = $("hub-challenge");
    var me = board.filter(function (x) { return (x.email || "").toLowerCase() === ME; })[0] || { earned: 0, balance: 0 };
    var bal = me.balance || 0;
    var h = '<div class="hubcard" id="hub-quest"><h3>🎁 Nhiệm vụ &amp; Đổi quà</h3>';
    if (!GD) {
      h += '<div class="q-bal"><div><div class="l">Điểm của bạn</div><div class="n">' + bal + '</div><div class="l">Đã kiếm ' + (me.earned || 0) + " · đã dùng/tặng " + Math.max(0, (me.earned || 0) - bal) + '</div></div><button id="q-give">🔁 Tặng điểm</button></div>'
        + '<div id="qtf"><select id="qt-to"><option value="">Tặng cho…</option></select><input id="qt-n" type="number" min="1" placeholder="Số điểm"><input id="qt-note" placeholder="Lời nhắn (tuỳ chọn)"><button class="hubbtn" id="qt-ok">Tặng</button> <button class="hubbtn ghost" id="qt-x">Huỷ</button></div>';
    }
    h += '<div class="q-task"><span style="font-size:18px">📍</span><div style="flex:1"><b>Nhiệm vụ: Gắn cờ quán trên bản đồ</b><div class="hubmuted" style="font-size:12px">Mỗi cờ = +1 điểm</div></div><a class="hubbtn" href="map.html" style="text-decoration:none">Gắn cờ →</a></div>';
    h += '<div class="q-sub">🛍️ Đổi quà</div><div class="q-rw">' + rewards.map(function (w) {
      var p = Math.min(100, Math.round(bal / w.cost * 100));
      return '<div class="q-r"><div class="ic">' + esc(w.icon || "🎁") + '</div><div class="nm">' + esc(w.name) + '</div><div class="ct">' + w.cost + " điểm</div>"
        + (GD ? '<div class="hubmuted" style="font-size:11.5px;margin-top:4px">' + esc(w.descr || "") + '</div><div class="q-adm" style="margin-top:6px"><button data-rwoff="' + w.id + '">Ẩn</button></div>'
          : '<div class="bar"><i style="width:' + p + '%"></i></div><button data-rd="' + w.id + '" data-nm="' + esc(w.name) + '" data-ct="' + w.cost + '"' + (bal < w.cost ? " disabled" : "") + ">" + (bal < w.cost ? "Còn thiếu " + (w.cost - bal) : "Đổi ngay") + "</button>")
        + "</div>";
    }).join("") + "</div>";
    if (GD) h += '<div style="margin-top:8px"><button class="hubbtn ghost" id="rw-add">＋ Thêm phần thưởng</button></div><div class="pg-form" id="rwf"><div class="r2"><input id="rw-icon" placeholder="Icon (VD 🎟️)"><input id="rw-cost" type="number" placeholder="Số điểm"></div><input id="rw-name" placeholder="Tên phần thưởng"><input id="rw-desc" placeholder="Mô tả"><button class="hubbtn" id="rw-save">Lưu</button></div>';
    // Lịch sử / quản lý
    if (GD) {
      var pend = reds.filter(function (x) { return x.status === "cho_trao"; });
      h += '<div class="q-sub">📦 Yêu cầu đổi quà ' + (pend.length ? "(" + pend.length + " chờ trao)" : "") + "</div>"
        + (reds.length ? reds.map(function (x) { return '<div class="q-row"><span><b>' + esc(x.full_name || x.email) + "</b> · " + esc(x.reward_name) + ' <span class="c">' + esc(x.code) + '</span></span><span><span class="q-st ' + x.status + '">' + ({ cho_trao: "Chờ trao", da_trao: "Đã trao", huy: "Đã huỷ" }[x.status] || x.status) + "</span>" + (x.status === "cho_trao" ? '<span class="q-adm"><button data-mk="' + x.id + '" data-s="da_trao">✓ Đã trao</button><button data-mk="' + x.id + '" data-s="huy">Huỷ & hoàn</button></span>' : "") + "</span></div>"; }).join("") : '<div class="hubmuted">Chưa có ai đổi quà.</div>');
    } else if (reds.length || ledger.length) {
      h += '<details style="margin-top:10px"><summary style="cursor:pointer;font-size:12.5px;font-weight:700;color:#8a6a1e">📜 Lịch sử của bạn</summary>'
        + reds.map(function (x) { return '<div class="q-row"><span>' + esc(x.reward_name) + ' <span class="c">' + esc(x.code) + '</span></span><span class="q-st ' + x.status + '">' + ({ cho_trao: "Chờ trao", da_trao: "Đã nhận", huy: "Đã huỷ" }[x.status] || x.status) + "</span></div>"; }).join("")
        + ledger.filter(function (l) { return l.kind !== "redeem"; }).map(function (l) { var nm = (PEOPLE || []).filter(function (p) { return p.email.toLowerCase() === (l.ref_email || ""); })[0]; return '<div class="q-row"><span>' + (l.kind === "transfer_in" ? "Nhận từ " : l.kind === "transfer_out" ? "Tặng cho " : "Điều chỉnh ") + esc(nm ? nm.full_name : (l.ref_email || "")) + (l.note ? ' <span class="hubmuted">“' + esc(l.note) + "”</span>" : "") + '</span><b style="color:' + (l.delta > 0 ? "#0a7a3a" : "#C0262D") + '">' + (l.delta > 0 ? "+" : "") + l.delta + "</b></div>"; }).join("")
        + "</details>";
    }
    // Bảng điểm
    h += '<div class="q-sub">🏅 Bảng điểm</div>' + board.slice(0, 5).map(function (x, i) { return '<div class="q-row"><span>' + (i + 1) + ". " + esc(x.full_name || x.email) + '</span><b style="color:#B8872F">' + x.balance + " điểm</b></div>"; }).join("");
    h += "</div>";
    el.innerHTML = h;
    bindQuest(bal);
  }
  function bindQuest(bal) {
    document.querySelectorAll("[data-rd]").forEach(function (b) { b.onclick = function () {
      if (!confirm("Đổi " + b.dataset.ct + " điểm lấy “" + b.dataset.nm + "”?")) return;
      b.disabled = true; SB.rpc("redeem_reward", { p_reward: +b.dataset.rd }).then(function (r) {
        if (r.error) { b.disabled = false; return toast("Lỗi: " + r.error.message); }
        if (window.confetti) window.confetti({ particleCount: 140, spread: 80, origin: { y: 0.6 }, colors: ["#C8912E", "#F0D48A", "#FF7A00", "#16D865"] });
        toast("🎉 Đổi thành công! Mã: " + r.data + " — GĐTT sẽ trao quà cho bạn.", 6000); loadQuest();
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
      if (b.dataset.s === "huy" && !confirm("Huỷ yêu cầu và hoàn điểm cho bạn này?")) return;
      SB.rpc("mark_redemption", { p_id: +b.dataset.mk, p_status: b.dataset.s }).then(function (r) { if (r.error) return toast("Lỗi: " + r.error.message); loadQuest(); });
    }; });
    var ra = $("rw-add"); if (ra) {
      ra.onclick = function () { $("rwf").classList.toggle("on"); };
      $("rw-save").onclick = function () {
        var row = { icon: $("rw-icon").value.trim() || "🎁", name: $("rw-name").value.trim(), descr: $("rw-desc").value.trim() || null, cost: parseInt($("rw-cost").value, 10) || 0, sort: 10 };
        if (!row.name || row.cost <= 0) return toast("Nhập tên và số điểm");
        SB.from("rewards").insert(row).then(function (r) { if (r.error) return toast("Lỗi: " + r.error.message); toast("Đã thêm phần thưởng"); loadQuest(); });
      };
    }
    document.querySelectorAll("[data-rwoff]").forEach(function (b) { b.onclick = function () { if (!confirm("Ẩn phần thưởng này?")) return; SB.from("rewards").update({ active: false }).eq("id", +b.dataset.rwoff).then(function () { loadQuest(); }); }; });
  }
  function fillPeople() {
    var s = $("qt-to"); if (!s) return;
    var go = function () { s.innerHTML = '<option value="">Tặng cho…</option>' + PEOPLE.filter(function (p) { return p.email.toLowerCase() !== ME; }).map(function (p) { return '<option value="' + esc(p.email) + '">' + esc(p.full_name || p.email) + " · " + esc((p.dept || "").replace("Phòng ", "")) + "</option>"; }).join(""); };
    if (PEOPLE) go(); else SB.from("role_assignments").select("email,full_name,dept").like("dept", "Phòng%").order("full_name").then(function (r) { PEOPLE = r.data || []; go(); });
  }

  function start() {
    SB = window.SB; if (!SB) return;
    ME = ((window.CLF_USER || {}).email || "").toLowerCase(); GD = (window.CLF_PROFILE || {}).level === "c4";
    SB.from("role_assignments").select("email,full_name,dept").like("dept", "Phòng%").order("full_name").then(function (r) { PEOPLE = r.data || []; });
    loadPrograms(); loadQuest();
    if (location.hash === "#hub-programs" || location.hash === "#hub-challenge") setTimeout(function () { var t = $(location.hash.slice(1)); if (t) t.scrollIntoView({ behavior: "smooth", block: "start" }); }, 900);
  }
  if (window.CLF_READY) start(); else document.addEventListener("clf-ready", start);
})();
