/* ===== FNBHCM HUB — các khối trang chủ: tiến độ trung tâm, việc hôm nay, thử thách,
   bảng tin thành tích (thả tim), đua phòng, hiệu ứng ăn mừng ===== */
(function () {
  var SB, ME = "", LV = "", ISGD = false;
  var MONEY = { doanhso: 1, kinhngu: 1 };
  function $(id) { return document.getElementById(id); }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function sm(n) { n = Number(n) || 0; if (n >= 1e9) return (Math.round(n / 1e7) / 100).toString().replace(".", ",") + " tỷ"; return Math.round(n / 1e6) + "tr"; }
  function mon(p) { return p ? parseInt(String(p).split("-")[1], 10) : ""; }
  function pctChg(a, b) { if (!b) return ""; var p = Math.round((a - b) / b * 100); return '<span class="' + (p >= 0 ? "up" : "down") + '">' + (p >= 0 ? "▲ " : "▼ ") + Math.abs(p) + "%</span>"; }
  function ago(t) { var s = (Date.now() - Date.parse(t)) / 1000; if (s < 60) return "vừa xong"; if (s < 3600) return Math.floor(s / 60) + " phút trước"; if (s < 86400) return Math.floor(s / 3600) + " giờ trước"; if (s < 7 * 86400) return Math.floor(s / 86400) + " ngày trước"; var d = new Date(t); return d.getDate() + "/" + (d.getMonth() + 1); }
  function fmtVal(code, v) { v = Number(v) || 0; if (MONEY[code]) return sm(v); if (code === "minhtinh") { if (v >= 1e6) return (Math.round(v / 1e5) / 10).toString().replace(".", ",") + "tr"; if (v >= 1000) return (Math.round(v / 100) / 10).toString().replace(".", ",") + "k"; } return v.toLocaleString("vi-VN"); }
  function toast(m, ms) { var t = $("hub-toast"); if (!t) { t = document.createElement("div"); t.id = "hub-toast"; t.className = "hub-toast"; document.body.appendChild(t); } t.textContent = m; t.classList.add("show"); clearTimeout(t._t); t._t = setTimeout(function () { t.classList.remove("show"); }, ms || 3200); }

  // ---------- 13. Tiến độ toàn trung tâm ----------
  function renderCenter() {
    var el = $("hub-center"); if (!el) return;
    SB.rpc("center_progress").then(function (r) {
      var c = (r.data || [])[0]; if (!c || !c.period) { el.innerHTML = ""; return; }
      var pct = c.target ? Math.round(c.rev / c.target * 100) : 0;
      el.innerHTML = '<div class="hubcenter"><div><div class="hc-l">🏢 TOÀN TRUNG TÂM · THÁNG ' + mon(c.period) + '</div>'
        + '<div class="hc-v">' + sm(c.rev) + ' <small>/ chuẩn ' + sm(c.target) + '</small></div></div>'
        + '<div class="hc-bar"><div class="hc-track"><div class="hc-fill" style="width:' + Math.min(100, pct) + '%"></div></div>'
        + '<div class="hc-pct"><b style="color:#F0D48A">' + pct + '%</b> chuẩn · ' + pctChg(c.rev, c.prev_rev) + ' so tháng ' + (mon(c.period) - 1 || 12) + ' · ' + c.members + ' sale</div></div></div>';
    });
  }

  // ---------- 7. Việc của bạn hôm nay ----------
  function renderTodo() {
    var el = $("hub-todo"); if (!el || !window.hubTodo) return;
    el.innerHTML = '<div class="hubcard" id="todo"><h3>📋 Việc của bạn hôm nay</h3><div class="hubmuted">Đang tải…</div></div>';
    window.hubTodo().then(function (items) {
      var h = items.length ? items.map(function (x) {
        return '<a class="todo-item' + (x.act ? " act" : "") + '" href="' + esc(x.href || "#") + '"><span class="ti">' + x.icon + '</span><span class="tt">' + esc(x.text) + '</span><span class="tgo">' + (x.act ? "Làm ngay →" : "") + "</span></a>";
      }).join("") : '<div class="hubmuted">Không có việc tồn — tuyệt vời! 🎉</div>';
      var n = items.filter(function (x) { return x.act; }).length;
      el.innerHTML = '<div class="hubcard" id="todo"><h3>📋 Việc của bạn hôm nay' + (n ? '<span class="hs">' + n + " việc cần làm</span>" : "") + "</h3>" + h + "</div>";
    }, function () { el.innerHTML = ""; });
  }

  // ---------- 4. Thử thách ----------
  var PEOPLE = null;
  function renderChallenges() {
    var el = $("hub-challenge"); if (!el) return;
    SB.from("challenges").select("*").eq("active", true).order("end_date").then(function (r) {
      var list = r.data || [];
      var head = '<h3>🎯 Thử thách' + (ISGD ? '<span class="hs"><button class="hubbtn" id="ch-new" style="padding:4px 10px;font-size:12px">➕ Tạo thử thách</button></span>' : "") + "</h3>";
      var form = ISGD ? '<div id="ch-form" style="display:none"><div class="hubform">'
        + '<input class="full" id="cf-title" placeholder="Tên thử thách (vd: Tuần lễ phủ bản đồ)">'
        + '<input class="full" id="cf-desc" placeholder="Mô tả ngắn">'
        + '<select id="cf-metric"><option value="pins">Tự đếm: số cờ gắn mới</option><option value="manual">Chấm tay (GĐTT ghi nhận)</option></select>'
        + '<input id="cf-target" type="number" min="1" value="5" placeholder="Mục tiêu">'
        + '<input id="cf-start" type="date"><input id="cf-end" type="date">'
        + '<input class="full" id="cf-reward" placeholder="Phần thưởng (vd: quà từ GĐTT)">'
        + '<div class="full"><button class="hubbtn" id="cf-save">Tạo &amp; thông báo</button> <button class="hubbtn ghost" id="cf-cancel">Huỷ</button></div></div></div>' : "";
      if (!list.length) { el.innerHTML = '<div class="hubcard" id="hub-challenge-card">' + head + form + '<div class="hubmuted">Chưa có thử thách nào đang diễn ra.</div></div>'; bindChForm(); return; }
      Promise.all(list.map(function (c) { return SB.rpc("challenge_progress", { p_id: c.id }); })).then(function (prs) {
        var boxes = list.map(function (c, i) {
          var rows = (prs[i].data || []);
          var days = Math.max(0, Math.ceil((Date.parse(c.end_date + "T23:59:59+07:00") - Date.now()) / 864e5));
          var doneN = rows.filter(function (x) { return x.value >= c.target; }).length;
          var top = rows.slice(0, 5).map(function (x) {
            var p = Math.min(100, Math.round(x.value / c.target * 100));
            return '<div class="ch-row' + (x.value >= c.target ? " done" : "") + '"><span class="cn">' + esc(x.full_name || x.email) + '</span><span class="cb"><span style="width:' + p + '%"></span></span><span class="chv">' + x.value + "/" + c.target + "</span></div>";
          }).join("") || '<div class="hubmuted">Chưa ai ghi điểm — vào bản đồ gắn cờ ngay!</div>';
          var mine = rows.find(function (x) { return x.email === ME; });
          var me = ISGD ? "" : '<div class="ch-me">Bạn: ' + (mine ? mine.value : 0) + "/" + c.target + ((mine && mine.value >= c.target) ? " — đã đạt 🎉" : "") + "</div>";
          var adm = ISGD ? '<div style="margin-top:8px;display:flex;gap:6px;flex-wrap:wrap">'
            + (c.metric === "manual" ? '<select class="ch-p" data-id="' + c.id + '" style="padding:5px;border:1px solid #ddd3bf;border-radius:7px;font-size:12px"><option value="">Ghi nhận cho…</option></select><input class="ch-v" data-id="' + c.id + '" type="number" min="0" value="' + c.target + '" style="width:60px;padding:5px;border:1px solid #ddd3bf;border-radius:7px;font-size:12px"><button class="hubbtn ch-mark" data-id="' + c.id + '" style="padding:4px 10px;font-size:12px">Lưu</button>' : "")
            + '<button class="hubbtn ghost ch-end" data-id="' + c.id + '" style="padding:4px 10px;font-size:12px">Kết thúc</button></div>' : "";
          return '<div class="ch-box"><div class="ch-title">' + esc(c.title) + '</div><div class="ch-meta">' + esc(c.description || "") + (c.description ? " · " : "") + "Mục tiêu " + c.target + (c.metric === "pins" ? " cờ mới" : "") + " · còn <b>" + days + " ngày</b> · " + doneN + " người đã đạt" + (c.reward ? "<br>🎁 " + esc(c.reward) : "") + "</div>" + top + me + adm + "</div>";
        }).join("");
        el.innerHTML = '<div class="hubcard" id="hub-challenge-card">' + head + form + boxes + "</div>";
        bindChForm();
        if (ISGD) bindChAdmin();
      });
    });
  }
  function bindChForm() {
    var b = $("ch-new"), f = $("ch-form"); if (!b || !f) return;
    var today = new Date(Date.now() + 7 * 3600e3).toISOString().slice(0, 10), wk = new Date(Date.now() + 7 * 3600e3 + 7 * 864e5).toISOString().slice(0, 10);
    $("cf-start").value = today; $("cf-end").value = wk;
    b.onclick = function () { f.style.display = f.style.display === "none" ? "block" : "none"; };
    $("cf-cancel").onclick = function () { f.style.display = "none"; };
    $("cf-save").onclick = function () {
      var t = $("cf-title").value.trim(); if (!t) { toast("Nhập tên thử thách nhé"); return; }
      this.disabled = true;
      SB.rpc("save_challenge", { p_title: t, p_desc: $("cf-desc").value, p_metric: $("cf-metric").value, p_target: parseInt($("cf-target").value, 10) || 1, p_start: $("cf-start").value, p_end: $("cf-end").value, p_reward: $("cf-reward").value })
        .then(function (r) { if (r.error) { toast("Lỗi: " + r.error.message); return; } toast("Đã tạo thử thách & đăng lên bảng tin"); renderChallenges(); renderFeed(); });
    };
  }
  function bindChAdmin() {
    document.querySelectorAll(".ch-end").forEach(function (b) {
      b.onclick = function () { if (!confirm("Kết thúc thử thách này?")) return; SB.rpc("end_challenge", { p_id: +b.dataset.id }).then(function () { toast("Đã kết thúc"); renderChallenges(); }); };
    });
    var sels = document.querySelectorAll(".ch-p"); if (!sels.length) return;
    var fill = function () { sels.forEach(function (s) { s.innerHTML = '<option value="">Ghi nhận cho…</option>' + PEOPLE.map(function (p) { return '<option value="' + esc(p.email) + '">' + esc(p.full_name || p.email) + "</option>"; }).join(""); }); };
    if (PEOPLE) fill(); else SB.from("role_assignments").select("email,full_name,dept").like("dept", "Phòng%").order("full_name").then(function (r) { PEOPLE = r.data || []; fill(); });
    document.querySelectorAll(".ch-mark").forEach(function (b) {
      b.onclick = function () {
        var id = b.dataset.id, s = document.querySelector('.ch-p[data-id="' + id + '"]'), v = document.querySelector('.ch-v[data-id="' + id + '"]');
        if (!s.value) { toast("Chọn người trước"); return; }
        SB.rpc("mark_challenge", { p_id: +id, p_email: s.value, p_value: parseInt(v.value, 10) || 0 }).then(function (r) { if (r.error) { toast("Lỗi: " + r.error.message); return; } toast("Đã ghi nhận"); renderChallenges(); });
      };
    });
  }

  // ---------- 1 + 12. Bảng tin thành tích + thả tim ----------
  var FEED_LIMIT = 12, FEED = [], REACT = {};
  function renderFeed() {
    var el = $("hub-feed"); if (!el) return;
    SB.from("feed_events").select("*").order("created_at", { ascending: false }).limit(FEED_LIMIT).then(function (r) {
      FEED = r.data || [];
      var ids = FEED.map(function (x) { return x.id; });
      (ids.length ? SB.from("feed_reactions").select("event_id,email,full_name,kind").in("event_id", ids) : Promise.resolve({ data: [] })).then(function (rr) {
        REACT = {}; (rr.data || []).forEach(function (x) { var k = x.event_id + "|" + x.kind; (REACT[k] = REACT[k] || []).push(x); });
        drawFeed(); celebrate();
      });
    });
  }
  function nameLink(ev) {
    var t = esc(ev.title || ""), fn = ev.full_name || "";
    if (fn && ev.email && (ev.title || "").indexOf(fn) === 0) t = '<a href="profile.html?email=' + encodeURIComponent(ev.email) + '">' + esc(fn) + "</a>" + esc(ev.title.slice(fn.length));
    if (ev.kind === "award" && ev.detail) t += ": <b>" + esc(fmtVal(ev.ref, ev.detail)) + "</b>";
    if (ev.kind === "challenge" && ev.detail) t += '<br><span class="hubmuted">🎁 ' + esc(ev.detail) + "</span>";
    return t;
  }
  function reactBtn(ev, kind, emo) {
    var arr = REACT[ev.id + "|" + kind] || [], on = arr.some(function (x) { return x.email === ME; });
    var who = arr.map(function (x) { return x.full_name || x.email; }).join(", ");
    return '<button class="react' + (on ? " on" : "") + '" data-id="' + ev.id + '" data-k="' + kind + '" title="' + esc(who || "Hãy là người đầu tiên") + '">' + emo + " " + (arr.length || "") + "</button>";
  }
  function drawFeed() {
    var el = $("hub-feed");
    var items = FEED.map(function (ev) {
      var hot = ev.kind === "rank" && ev.detail === "1";
      return '<div class="feed-item' + (hot ? " hot" : "") + '"><span class="feed-ic">' + (ev.icon || "✨") + '</span><div class="feed-tx">' + nameLink(ev)
        + '<div class="feed-meta"><span class="ago">' + ago(ev.created_at) + "</span>" + reactBtn(ev, "clap", "👏") + reactBtn(ev, "fire", "🔥") + "</div></div></div>";
    }).join("") || '<div class="hubmuted">Chưa có hoạt động nào.</div>';
    el.innerHTML = '<div class="hubcard"><h3>📣 Bảng tin thành tích<span class="hs">Tự cập nhật</span></h3>' + items
      + (FEED.length >= FEED_LIMIT ? '<div style="text-align:center;margin-top:8px"><button class="hubbtn ghost" id="feed-more">Xem thêm</button></div>' : "") + "</div>";
    el.querySelectorAll(".react").forEach(function (b) {
      b.onclick = function () {
        var id = +b.dataset.id, k = b.dataset.k, key = id + "|" + k, arr = REACT[key] = REACT[key] || [];
        var on = arr.some(function (x) { return x.email === ME; });
        if (on) REACT[key] = arr.filter(function (x) { return x.email !== ME; }); else arr.push({ email: ME, full_name: "Bạn", kind: k });
        drawFeed();
        SB.rpc("toggle_reaction", { p_event: id, p_kind: k }).then(function (r) { if (r.error) toast("Lỗi: " + r.error.message); });
      };
    });
    var m = $("feed-more"); if (m) m.onclick = function () { FEED_LIMIT += 12; renderFeed(); };
  }

  // ---------- 2. Hiệu ứng ăn mừng ----------
  var celebrated = false;
  function confetti(big) {
    var go = function () { if (!window.confetti) return; var o = { spread: 80, origin: { y: 0.6 }, colors: ["#C8912E", "#F0D48A", "#FF7A00", "#16D865", "#ffffff"] };
      window.confetti(Object.assign({ particleCount: big ? 160 : 90 }, o)); if (big) setTimeout(function () { window.confetti(Object.assign({ particleCount: 120, angle: 60, origin: { x: 0, y: 0.7 } }, o)); window.confetti(Object.assign({ particleCount: 120, angle: 120, origin: { x: 1, y: 0.7 } }, o)); }, 350); };
    if (window.confetti) return go();
    var s = document.createElement("script"); s.src = "https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.3/dist/confetti.browser.min.js"; s.onload = go; document.head.appendChild(s);
  }
  function celebrate() {
    if (celebrated || !FEED.length) return; celebrated = true;
    var KEY = "hubFeedSeen", seen = 0; try { seen = parseInt(localStorage.getItem(KEY) || "0", 10) || 0; } catch (e) {}
    var maxId = Math.max.apply(null, FEED.map(function (x) { return x.id; }));
    try { localStorage.setItem(KEY, String(maxId)); } catch (e) {}
    if (!seen) return; // lần đầu vào: không bắn pháo
    var fresh = FEED.filter(function (x) { return x.id > seen; });
    var mine = fresh.filter(function (x) { return x.email === ME && (x.kind === "rank" || x.kind === "star" || x.kind === "award"); })[0];
    var big = fresh.filter(function (x) { return (x.kind === "rank" && x.detail === "1") || x.kind === "star"; })[0];
    if (mine) { confetti(true); toast("🎉 Chúc mừng bạn! " + mine.title.replace(mine.full_name || "", "").trim(), 5000); }
    else if (big) { confetti(false); toast((big.icon || "🎉") + " " + big.title, 4500); }
  }

  // ---------- 3. Đua theo phòng ----------
  var RACE = [], RACE_BY = "rev";
  function renderRace() {
    var el = $("hub-race"); if (!el) return;
    SB.rpc("dept_race").then(function (r) { RACE = r.data || []; drawRace(); });
  }
  function drawRace() {
    var el = $("hub-race"); var by = RACE_BY;
    var rows = RACE.slice().sort(function (a, b) { return by === "rev" ? b.rev - a.rev : b.pins - a.pins; });
    var mx = Math.max.apply(null, rows.map(function (x) { return by === "rev" ? Number(x.rev) : x.pins; }).concat([1]));
    var med = ["🥇", "🥈", "🥉"];
    var per = rows[0] && rows[0].period;
    el.innerHTML = '<div class="hubcard"><h3>🏁 Đua theo phòng<span class="hs">' + (by === "rev" ? "Doanh thu tháng " + mon(per) : "Tổng số cờ trên bản đồ") + "</span></h3>"
      + '<div class="race-tabs"><button data-b="rev" class="' + (by === "rev" ? "on" : "") + '">💰 Doanh thu</button><button data-b="pins" class="' + (by === "pins" ? "on" : "") + '">🗺️ Gắn cờ</button></div>'
      + rows.map(function (x, i) {
        var v = by === "rev" ? Number(x.rev) : x.pins;
        return '<div class="race-row"><span class="rk">' + (med[i] || i + 1) + '</span><span class="rn">' + esc(String(x.dept).replace("Phòng ", "").replace(" HCM", "")) + ' <span class="hubmuted">· ' + x.members + " người</span></span>"
          + '<span class="rbar"><span style="width:' + Math.round(v / mx * 100) + '%"></span></span>'
          + '<span class="rv">' + (by === "rev" ? sm(v) + "<small>" + (pctChg(x.rev, x.prev_rev) || "&nbsp;") + "</small>" : v + " cờ") + "</span></div>";
      }).join("") + "</div>";
    el.querySelectorAll(".race-tabs button").forEach(function (b) { b.onclick = function () { RACE_BY = b.dataset.b; drawRace(); }; });
  }

  function start() {
    SB = window.SB; if (!SB) return;
    ME = ((window.CLF_USER || {}).email || "").toLowerCase();
    LV = (window.CLF_PROFILE || {}).level || ""; ISGD = LV === "c4";
    renderCenter(); renderTodo(); renderChallenges(); renderRace();
    SB.rpc("refresh_rank_events").then(renderFeed, renderFeed);
    if (location.hash === "#todo") setTimeout(function () { var t = $("todo"); if (t) t.scrollIntoView({ behavior: "smooth", block: "center" }); }, 900);
  }
  if (window.CLF_READY) start(); else document.addEventListener("clf-ready", start);
})();
