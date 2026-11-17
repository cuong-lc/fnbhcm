/* ===== Competency Framework — app logic ===== */
(function () {
  const { LEVELS, GROUPS, COMPETENCIES } = window.CLF;
  const byId = (id) => document.getElementById(id);
  const levelById = (id) => LEVELS.find((l) => l.id === id);
  const groupById = (id) => GROUPS.find((g) => g.id === id);
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  // ---- phân quyền: chỉ Giám đốc Trung tâm (c4) mới xem trang cấp GĐTT ----
  const RESTRICTED = "c4";
  const isGD = () => (window.CLF_PROFILE && window.CLF_PROFILE.level) === "c4";
  const canSeeLevel = (l) => l.id !== RESTRICTED || isGD();
  // Nhân viên (c1) / Thử việc (c0): ẩn lộ trình 4 cấp, mục Trưởng phòng & Rubric
  const isStaffView = () => { const lv = (window.CLF_PROFILE && window.CLF_PROFILE.level) || ""; return lv === "c0" || lv === "c1"; };

  // ---- storage: đồng bộ Supabase (hydrate qua auth.js -> window.CLF_PROGRESS) ----
  const PROG = window.CLF_PROGRESS || (window.CLF_PROGRESS = {});
  const store = {
    get(k) { return PROG[k] === true ? "1" : "0"; },
    set(k, v) {
      const on = (v === "1" || v === 1 || v === true);
      PROG[k] = on;
      try { localStorage.setItem(k, on ? "1" : "0"); } catch (e) {}
      if (window.SB && window.CLF_USER) {
        window.SB.from('progress').upsert(
          { user_id: window.CLF_USER.id, email: window.CLF_USER.email, item_key: k, done: on, updated_at: new Date().toISOString() },
          { onConflict: 'user_id,item_key' }
        ).then(function(){}, function(){});
      }
    },
  };

  // ---- Mục lục bên trái cho trang dài (tự quét tiêu đề) ----
  function setupToc() {
    if (window._tocOn) return; window._tocOn = 1;
    const box = document.createElement("div"); box.id = "toc"; box.className = "toc"; document.body.appendChild(box);
    const fab = document.createElement("button"); fab.id = "tocfab"; fab.className = "tocfab"; fab.type = "button"; document.body.appendChild(fab);
    fab.onclick = (e) => { e.stopPropagation(); box.classList.toggle("open"); };
    document.addEventListener("click", (e) => { if (!box.contains(e.target) && e.target !== fab) box.classList.remove("open"); });
    let heads = [], timer = null;
    const scan = () => {
      const main = document.querySelector("main") || document.body;
      const H = [].filter.call(main.querySelectorAll("h2, .grp-head h3, [data-toc]"), (h) => h.offsetParent && h.offsetHeight > 8 && (h.dataset.toc || (h.textContent.trim() && !h.closest(".hubcard,.card,#toc,iframe"))));
      const long = document.body.scrollHeight > window.innerHeight * 2.2;
      if (H.length < 3 || !long) { box.style.display = "none"; fab.style.display = "none"; heads = []; return; }
      heads = H; box.style.display = ""; fab.style.display = "";
      let n = 0;
      box.innerHTML = '<div class="toc-h">📑 ' + H.length + " mục</div>" + H.map((h, i) => {
        if (!h.id) h.id = "toc-" + i;
        const sub = h.tagName === "H3"; if (!sub) n++;
        const t = (h.dataset.toc || h.textContent).replace(/\s+/g, " ").trim().slice(0, 48);
        return `<a href="#${h.id}" class="toc-i${sub ? " sub" : ""}" data-i="${i}"><span class="toc-n">${sub ? "•" : n}</span><span class="toc-t">${esc(t)}</span></a>`;
      }).join("");
      fab.textContent = "📑 " + H.length + " mục";
      [].forEach.call(box.querySelectorAll(".toc-i"), (a) => a.onclick = (e) => {
        e.preventDefault(); const h = heads[+a.dataset.i]; if (!h) return;
        window.scrollTo({ top: h.getBoundingClientRect().top + window.scrollY - 80, behavior: "smooth" }); box.classList.remove("open");
      });
      spy();
    };
    const spy = () => {
      if (!heads.length) return; let cur = 0;
      heads.forEach((h, i) => { if (h.getBoundingClientRect().top < 130) cur = i; });
      [].forEach.call(box.querySelectorAll(".toc-i"), (a) => a.classList.toggle("on", +a.dataset.i === cur));
    };
    const later = () => { clearTimeout(timer); timer = setTimeout(scan, 600); };
    window.addEventListener("scroll", spy, { passive: true }); window.addEventListener("resize", later);
    new MutationObserver(later).observe(document.querySelector("main") || document.body, { childList: true, subtree: true });
    setTimeout(scan, 1200);
  }

  // ---- Nút Góp ý: Báo lỗi / Góp ý tính năng (mọi trang) ----
  function setupFeedback() {
    if (window._fbOn) return; window._fbOn = 1;
    const SB = window.SB, U = window.CLF_USER || {}, P = window.CLF_PROFILE || {}, GD = P.level === "c4";
    const st = document.createElement("style");
    st.textContent = "#fb-btn{position:fixed;left:14px;bottom:14px;z-index:58;border:1px solid var(--line);background:#fff;color:#17130D;font-weight:800;font-size:12.5px;border-radius:22px;padding:9px 14px;box-shadow:0 6px 18px rgba(0,0,0,.14);cursor:pointer;font-family:inherit;display:flex;align-items:center;gap:6px}"
      + "#fb-btn:hover{background:#FBF3E2}#fb-btn .nb{background:#E5484D;color:#fff;border-radius:10px;font-size:10px;padding:1px 6px}"
      + "@media(max-width:1280px){#fb-btn{bottom:62px}}"
      + "#fb-pn{position:fixed;left:14px;bottom:64px;z-index:59;width:min(380px,calc(100vw - 28px));max-height:calc(100vh - 110px);overflow:auto;background:#fff;border:1px solid var(--line);border-radius:16px;box-shadow:0 16px 40px rgba(0,0,0,.18);padding:14px;display:none}"
      + "#fb-pn.on{display:block}@media(max-width:1280px){#fb-pn{bottom:112px}}"
      + ".fb-tabs{display:flex;gap:4px;background:#F6EFDE;border-radius:10px;padding:3px;margin:6px 0 10px}.fb-tabs button{flex:1;border:0;background:transparent;border-radius:8px;padding:7px 6px;font-size:12.5px;font-weight:700;color:#6B6150;cursor:pointer;font-family:inherit}.fb-tabs button.on{background:#fff;color:#17130D;box-shadow:0 1px 3px rgba(0,0,0,.1)}"
      + "#fb-pn textarea{width:100%;box-sizing:border-box;min-height:110px;border:1.5px solid #ddd3bf;border-radius:10px;padding:9px 10px;font-family:inherit;font-size:13.5px;resize:vertical}"
      + ".fb-send{margin-top:8px;width:100%;border:0;border-radius:10px;padding:10px;font-weight:800;cursor:pointer;font-family:inherit;background:linear-gradient(135deg,#F0D48A,#D4A94C);color:#17130D}"
      + ".fb-it{border-top:1px solid #F1E7D2;padding:8px 0;font-size:12.5px}.fb-it .m{color:#8a7a55;font-size:11.5px}.fb-it .t{white-space:pre-wrap;color:#17130D;margin:3px 0}.fb-it button{border:1px solid #ECE4D5;background:#fff;border-radius:7px;font-size:11px;padding:2px 8px;cursor:pointer;margin-right:4px}"
      + ".fb-st{font-size:10.5px;font-weight:700;border-radius:20px;padding:1px 7px;margin-left:4px}.fb-st.moi{background:#FFF3D6;color:#9a6a00}.fb-st.dang{background:#E3EEFB;color:#24467A}.fb-st.xong{background:#DDF7E7;color:#0a7a3a}";
    document.head.appendChild(st);
    const btn = document.createElement("button"); btn.id = "fb-btn"; btn.type = "button"; btn.innerHTML = "💬 Góp ý";
    const pn = document.createElement("div"); pn.id = "fb-pn";
    document.body.appendChild(btn); document.body.appendChild(pn);
    pn.addEventListener("click", (e) => e.stopPropagation());
    let TAB = "bug";
    const ST = { moi: "Mới", dang: "Đang xử lý", xong: "Đã xong" };
    const draw = () => {
      const tabs = [["bug", "🐞 Báo lỗi"], ["idea", "💡 Góp ý tính năng"], [GD ? "inbox" : "mine", GD ? "📥 Hộp thư" : "📄 Của tôi"]];
      pn.innerHTML = '<div style="display:flex;align-items:center"><b style="font-size:14px">💬 Góp ý cho FNBHCM HUB</b><span id="fb-x" style="margin-left:auto;cursor:pointer;color:#8a6a1e">✕</span></div>'
        + '<div class="fb-tabs">' + tabs.map(([k, t]) => `<button data-k="${k}" class="${TAB === k ? "on" : ""}">${t}</button>`).join("") + "</div><div id=\"fb-body\"></div>";
      pn.querySelector("#fb-x").onclick = () => pn.classList.remove("on");
      [].forEach.call(pn.querySelectorAll(".fb-tabs button"), (b) => b.onclick = () => { TAB = b.dataset.k; draw(); });
      const body = pn.querySelector("#fb-body");
      if (TAB === "bug" || TAB === "idea") {
        body.innerHTML = '<div style="font-size:12px;color:#6B6150;margin-bottom:6px">' + (TAB === "bug" ? "Mô tả lỗi: bạn đang làm gì, thấy gì sai? (trang hiện tại được gửi kèm tự động)" : "Bạn muốn web có thêm tính năng gì, hoặc sửa chỗ nào cho tiện hơn?") + "</div>"
          + '<textarea id="fb-tx" placeholder="' + (TAB === "bug" ? "VD: Bấm Lưu điểm trên bản đồ thì báo lỗi…" : "VD: Thêm bộ lọc quán theo quận…") + '"></textarea><button class="fb-send" id="fb-go">Gửi</button><div id="fb-ok" style="font-size:12px;margin-top:6px"></div>';
        body.querySelector("#fb-go").onclick = async () => {
          const t = body.querySelector("#fb-tx").value.trim(); if (t.length < 5) { body.querySelector("#fb-ok").textContent = "Viết thêm chút nội dung nhé."; return; }
          const b = body.querySelector("#fb-go"); b.disabled = true; b.textContent = "Đang gửi…";
          const r = await SB.from("feedback").insert({ kind: TAB, content: t, page: location.pathname + location.search, email: (U.email || "").toLowerCase(), full_name: P.full_name || null });
          b.disabled = false; b.textContent = "Gửi";
          if (r.error) { body.querySelector("#fb-ok").textContent = "Lỗi: " + r.error.message; return; }
          body.querySelector("#fb-tx").value = ""; body.querySelector("#fb-ok").innerHTML = '<span style="color:#0a7a3a;font-weight:700">✅ Đã gửi — cảm ơn bạn! GĐTT đã nhận được thông báo.</span>';
        };
      } else {
        body.innerHTML = '<div class="hubmuted" style="font-size:12px">Đang tải…</div>';
        let q = SB.from("feedback").select("*").order("created_at", { ascending: false }).limit(50);
        q.then((r) => {
          const L = r.data || [];
          body.innerHTML = L.length ? L.map((f) => `<div class="fb-it"><div class="m">${f.kind === "bug" ? "🐞 Lỗi" : "💡 Góp ý"} · ${esc(f.full_name || f.email)} · ${new Date(f.created_at).toLocaleString("vi-VN")} <span class="fb-st ${f.status}">${ST[f.status] || f.status}</span></div><div class="t">${esc(f.content)}</div><div class="m">📄 ${esc(f.page || "")}</div>`
            + (GD ? `<div style="margin-top:4px">${f.status !== "dang" ? `<button data-id="${f.id}" data-s="dang">Đang xử lý</button>` : ""}${f.status !== "xong" ? `<button data-id="${f.id}" data-s="xong">✓ Đã xong</button>` : ""}</div>` : "") + "</div>").join("")
            : '<div class="hubmuted" style="font-size:12.5px">Chưa có góp ý nào.</div>';
          [].forEach.call(body.querySelectorAll("button[data-id]"), (b) => b.onclick = async () => { await SB.from("feedback").update({ status: b.dataset.s }).eq("id", +b.dataset.id); draw(); badge(); });
        });
      }
    };
    const badge = () => { if (!GD) return; SB.from("feedback").select("id", { count: "exact", head: true }).eq("status", "moi").then((r) => { btn.innerHTML = "💬 Góp ý" + (r.count ? ` <span class="nb">${r.count}</span>` : ""); }); };
    btn.onclick = (e) => { e.stopPropagation(); if (GD && !pn.classList.contains("on")) TAB = "inbox"; pn.classList.toggle("on"); if (pn.classList.contains("on")) draw(); };
    document.addEventListener("click", (e) => { if (!pn.contains(e.target) && e.target !== btn && !btn.contains(e.target)) pn.classList.remove("on"); });
    badge();
  }

  // ---- shared: nav + footer ----
  function buildNav(activeFile) {
    const nav = byId("nav");
    if (!nav) return;
    const isGD = !!(window.CLF_PROFILE && window.CLF_PROFILE.level === "c4");
    const isLeader = isGD || (window.CLF_PROFILE && window.CLF_PROFILE.level === "c3");
    const staff = isStaffView();
    // Menu gom nhóm: mục đơn + nhóm thả xuống
    const tools = (isGD ? [["video.html", '🎬 Kho video <span class="soon">Beta</span>']] : []).concat([["kichban.html", '💬 Kịch bản chốt <span class="soon">Coming soon</span>']]).concat(isLeader ? [["camnangleader.html", "📘 Cẩm nang Leader"]] : []);
    const levels = LEVELS.filter(canSeeLevel).filter((l) => !(staff && l.id === "c3")).map((l) => [l.file, l.short]).concat(staff ? [] : [["rubric.html", "📏 Rubric"]]);
    const admin = isGD ? [["popup.html", "🎁 Quản lý Popup"], ["badges.html", "🏛️ Phong Thần"], ["report.html", "📊 Báo cáo tuần"], ["people.html", "🔒 Hồ sơ NS"]] : [];
    const menu = [["index.html", "🏠 Trang chủ"], ["map.html", "🗺️ Bản đồ KH"], { label: "🧰 Công cụ", items: tools }, { label: "📚 Khung năng lực", items: levels }]
      .concat(admin.length ? [{ label: "⚙️ Quản trị", items: admin }] : [])
      .concat(window.CLF_READY ? [["profile.html", "👤 Hồ sơ của tôi"]] : []);
    const link = ([f, t]) => `<a href="${f}" class="${f === activeFile ? "active" : ""}">${t}</a>`;
    nav.innerHTML = menu.map((m) => {
      if (Array.isArray(m)) return link(m);
      if (m.items.length === 1) return link(m.items[0]);
      const on = m.items.some(([f]) => f === activeFile);
      return `<div class="ndd${on ? " on" : ""}"><button type="button" class="ndd-b">${m.label} <span class="ndd-cv">▾</span></button><div class="ndd-m">${m.items.map(link).join("")}</div></div>`;
    }).join("");
    [].forEach.call(nav.querySelectorAll(".ndd-b"), (b) => b.addEventListener("click", (e) => {
      e.stopPropagation(); const d = b.parentElement, was = d.classList.contains("open");
      [].forEach.call(nav.querySelectorAll(".ndd.open"), (x) => x.classList.remove("open")); if (!was) d.classList.add("open");
    }));
    if (!window._nddDoc) { window._nddDoc = 1; document.addEventListener("click", () => [].forEach.call(document.querySelectorAll(".ndd.open"), (x) => x.classList.remove("open"))); }
    // Nút ☰ cho mobile
    const wrap = nav.parentElement;
    let tg = byId("navtoggle");
    if (!tg && wrap) {
      tg = document.createElement("button");
      tg.id = "navtoggle"; tg.className = "navtoggle"; tg.type = "button";
      tg.setAttribute("aria-label", "Menu"); tg.textContent = "☰";
      tg.onclick = (e) => { e.stopPropagation(); nav.classList.toggle("open"); };
      wrap.insertBefore(tg, nav);
      document.addEventListener("click", (e) => { if (!nav.contains(e.target) && e.target !== tg) nav.classList.remove("open"); });
      setupToc();
    }
    [].forEach.call(nav.querySelectorAll("a"), (a) => a.addEventListener("click", () => nav.classList.remove("open")));
    // 🔔 Chuông nhắc việc (mọi trang, sau khi đã có hồ sơ)
    if (window.CLF_READY && window.SB) setupFeedback();
    if (window.CLF_READY && window.SB && wrap && !byId("navbell")) {
      const bell = document.createElement("button");
      bell.type = "button"; bell.id = "navbell"; bell.className = "navbell";
      bell.title = "Việc của bạn"; bell.innerHTML = "🔔";
      wrap.style.position = "relative";
      wrap.appendChild(bell);
      const pop = document.createElement("div");
      pop.className = "bellpop"; pop.id = "bellpop";
      pop.innerHTML = '<div class="bp-h">📋 Việc của bạn hôm nay</div><div class="bp-b">Đang tải…</div>';
      wrap.appendChild(pop);
      const escH = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
      bell.addEventListener("click", (e) => { e.stopPropagation(); pop.classList.toggle("on"); });
      document.addEventListener("click", (e) => { if (!pop.contains(e.target)) pop.classList.remove("on"); });
      window.hubTodo().then((items) => {
        const n = items.filter((x) => x.act).length;
        if (n) bell.innerHTML = '🔔<span class="nb">' + n + "</span>";
        pop.querySelector(".bp-b").innerHTML = items.length
          ? items.map((x) => '<a class="todo-item' + (x.act ? " act" : "") + '" href="' + escH(x.href || "#") + '"><span class="ti">' + x.icon + '</span><span class="tt">' + escH(x.text) + '</span><span class="tgo">' + (x.act ? "Làm →" : "") + "</span></a>").join("")
          : '<div class="hubmuted">Không có việc tồn — tuyệt vời! 🎉</div>';
      }, () => { pop.querySelector(".bp-b").innerHTML = '<div class="hubmuted">Chưa tải được.</div>'; });
    }
  }

  // ===== Sự kiện / popup hiện hành (đổi ảnh + hạn ở đây cho popup mới) =====
  // Sự kiện popup: GĐTT quản lý tại popup.html (bảng popups). Lấy popup còn hạn ưu tiên sort nhỏ nhất.
  window.HUB_EVENT = null;
  let _evP = null;
  window.hubEvent = function () {
    if (_evP) return _evP;
    if (!window.SB) return Promise.resolve(null);
    const now = new Date().toISOString();
    _evP = window.SB.from("popups").select("*").eq("active", true).lte("start_at", now).gt("end_at", now)
      .order("sort", { ascending: true }).order("start_at", { ascending: false }).limit(1)
      .then((r) => { const x = (r.data || [])[0]; window.HUB_EVENT = x ? { key: "hubPop_" + x.id, img: x.img, end: x.end_at, title: x.title, alt: x.title, cta: x.cta, target: x.target } : null; return window.HUB_EVENT; })
      .catch(() => null);
    return _evP;
  };

  // ===== Việc của bạn hôm nay (dùng chung cho chuông + trang chủ) =====
  let _todoP = null;
  window.hubTodo = function () {
    if (_todoP) return _todoP;
    const SB = window.SB, U = window.CLF_USER || {}, P = window.CLF_PROFILE || {};
    const me = (U.email || "").toLowerCase(), lv = P.level || "";
    const isGD = lv === "c4";
    const sm = (n) => { n = Number(n) || 0; return n >= 1e9 ? (Math.round(n / 1e8) / 10).toString().replace(".", ",") + " tỷ" : Math.round(n / 1e6) + "tr"; };
    const T = ["Chí Tôn", "Á Tôn", "Quý Tôn"];
    _todoP = Promise.all([
      SB.from("places").select("created_at").ilike("owner_email", me),
      SB.rpc("center_badges"),
      SB.from("revenues").select("period,amount").ilike("email", me),
      SB.rpc("my_chuan"),
      SB.from("progress").select("item_key").eq("user_id", U.id).eq("done", true).like("item_key", "clf_c1_ck_%"),
      Promise.all([SB.rpc("quest_available", { p_email: me }), SB.from("rewards").select("cost").eq("active", true), SB.from("announcements").select("id,title,created_at").eq("active", true).gte("created_at", new Date(Date.now() - 7 * 864e5).toISOString())]),
      isGD ? SB.from("badge_requests").select("id", { count: "exact", head: true }).eq("status", "pending") : Promise.resolve({}),
      isGD ? SB.from("sales_scripts").select("id", { count: "exact", head: true }).eq("status", "pending") : Promise.resolve({})
    ]).then(async (r) => {
      const items = [];
      const pins = r[0].data || [], wk = Date.now() - 7 * 864e5;
      const pins7 = pins.filter((p) => Date.parse(p.created_at) > wk).length;
      const isSale = /^Phòng/.test(P.dept || "") || ["c0", "c1", "c2", "c3"].indexOf(lv) >= 0;
      if (isSale && !isGD) {
        if (!pins7) items.push({ act: 1, icon: "📍", text: "Tuần này bạn chưa gắn cờ quán nào — check-in 1 quán nhé", href: "map.html" });
        else items.push({ icon: "📍", text: "Tuần này bạn đã gắn " + pins7 + " cờ 👍", href: "map.html" });
      }
      // Bách Địa
      const cb = (r[1].data || []).filter((x) => String(x.item_key).indexOf("chal_bachdia_") === 0).sort((a, b) => b.val - a.val);
      const myIdx = cb.findIndex((x) => (x.email || "") === me);
      if (myIdx >= 0 && myIdx < 3) items.push({ icon: "🔥", text: "Bạn đang là " + T[myIdx] + " · Bách Địa Đại Sư (" + cb[myIdx].val + " cờ)", href: "index.html" });
      else if (myIdx >= 3 && cb[2]) { const need = cb[2].val - cb[myIdx].val + 1; items.push({ act: 1, icon: "🗺️", text: "Thêm " + need + " cờ là vào Top 3 Bách Địa (đang hạng " + (myIdx + 1) + ")", href: "map.html" }); }
      // Doanh thu vs chuẩn
      const mc = (r[3].data || [])[0];
      if (mc && mc.period && isSale && !isGD) {
        const rv = (r[2].data || []).find((x) => x.period === mc.period);
        const L = rv ? Number(rv.amount) || 0 : 0, C = Number(mc.chuan) || 0, mn = parseInt(mc.period.split("-")[1], 10);
        if (L < C) items.push({ act: 1, icon: "💰", text: "Tháng " + mn + ": " + sm(L) + " / chuẩn " + sm(C) + " — còn thiếu " + sm(C - L), href: "dashboard.html" });
        else items.push({ icon: "💰", text: "Tháng " + mn + " vượt chuẩn: " + sm(L) + " / " + sm(C) + " (" + Math.round(L / C * 100) + "%) 👏", href: "dashboard.html" });
      }
      // Checklist Cấp 1
      if (lv === "c0" || lv === "c1") {
        const done = (r[4].data || []).length, left = Math.max(0, 71 - done);
        if (left) items.push({ act: 1, icon: "✅", text: "Còn " + left + " mục checklist Cấp 1 chưa tích", href: "cap-1-nhan-vien.html" });
      }
      // Sự kiện đang chạy → xem lại popup
      try { const EV = await window.hubEvent(); if (EV && Date.now() < Date.parse(EV.end)) items.unshift({ act: 1, icon: "🎁", text: "Sự kiện: " + EV.title + " — xem lại", href: "#event" }); } catch (e) {}
      // Chương trình mới (7 ngày, chưa xem)
      try {
        const q = r[5] || [], seen = JSON.parse(localStorage.getItem("hubAnnSeen") || "[]");
        const fresh = ((q[2] && q[2].data) || []).filter((a) => seen.indexOf(a.id) < 0);
        if (fresh.length) items.unshift({ act: 1, icon: "📢", text: fresh.length + " chương trình / chính sách mới — xem ngay", href: "index.html#hub-programs" });
        // Nhiệm vụ đổi quà
        const bal = Number(q[0] && q[0].data) || 0, costs = ((q[1] && q[1].data) || []).map((x) => x.cost).sort((a, b) => a - b);
        if (!isGD && costs.length) {
          if (bal >= costs[0]) items.push({ act: 1, icon: "🎁", text: "Bạn có " + bal + " điểm nhiệm vụ — đủ đổi quà rồi!", href: "index.html#hub-challenge" });
          else items.push({ icon: "🎁", text: "Thêm " + (costs[0] - bal) + " cờ nữa là đổi được voucher (" + bal + "/" + costs[0] + " điểm)", href: "map.html" });
        }
      } catch (e) {}
      if (isGD) {
        const br = r[6].count || 0, sp = r[7].count || 0;
        if (br) items.push({ act: 1, icon: "🏛️", text: br + " đề xuất danh hiệu chờ duyệt", href: "badges.html" });
        if (sp) items.push({ act: 1, icon: "💬", text: sp + " kịch bản chốt chờ duyệt", href: "kichban.html" });
        try { const vp = await SB.from("videos").select("id", { count: "exact", head: true }).eq("status", "cho_duyet"); if (vp.count) items.unshift({ act: 1, icon: "🎬", text: vp.count + " video chờ anh duyệt vào Kho video", href: "video.html#duyet" }); } catch (e) {}
        try { const wh = await SB.from("whales").select("id", { count: "exact", head: true }).eq("status", "cho_duyet"); if (wh.count) items.unshift({ act: 1, icon: "🐋", text: wh.count + " yêu cầu ghi nhận Kình Ngư chờ anh duyệt", href: "index.html#hub-whale" }); } catch (e) {}
        try { const rd = await SB.from("redemptions").select("id", { count: "exact", head: true }).eq("status", "cho_trao"); if (rd.count) items.unshift({ act: 1, icon: "🎁", text: rd.count + " yêu cầu đổi quà chờ anh gửi voucher", href: "index.html#hub-challenge" }); } catch (e) {}
        items.push({ icon: "📊", text: "Xem báo cáo tuần & điểm sức khoẻ đội ngũ", href: "report.html" });
      }
      return items;
    });
    return _todoP;
  };
  function buildFoot() {
    const f = byId("foot");
    if (f) f.innerHTML = `<div class="wrap"><span>Khung năng lực đội ngũ Kinh doanh</span><span>Bản nháp để duyệt — nội dung có thể điều chỉnh</span></div>`;
  }

  // ================= INDEX =================
  function renderIndex() {
    // Nhân viên/Thử việc: ẩn hẳn khối "Bốn cấp trong lộ trình"
    const lvSec = byId("levels-section");
    if (lvSec && isStaffView()) lvSec.style.display = "none";
    // level cards
    const grid = byId("levels");
    if (grid) {
      grid.innerHTML = LEVELS.filter(canSeeLevel).map((l) => `
        <a class="lvl-card" href="${l.file}">
          <div class="bar" style="background:${l.color}"></div>
          <div class="body">
            <div class="step">Cấp ${l.order}</div>
            <h3>${esc(l.title)}</h3>
            <div class="dre">${esc(l.dreyfus)}</div>
            <div class="desc">${esc(l.role)}</div>
            <div class="go">Xem chuẩn cần đạt →</div>
          </div>
        </a>`).join("");
    }
    // ladder
    const lad = byId("ladder");
    if (lad) {
      lad.innerHTML = LEVELS.filter(canSeeLevel).map((l, i) => `
        <a class="rung" href="${l.file}" style="background:${l.color};height:${70 + i * 34}px;text-decoration:none">
          <div style="font-size:12px;opacity:.85">Cấp ${l.order}</div>
          <div style="font-weight:700;font-size:15px">${esc(l.short)}</div>
        </a>`).join("");
    }
    // search
    const input = byId("search");
    const out = byId("searchResults");
    if (input && out) {
      input.addEventListener("input", () => {
        const q = input.value.trim().toLowerCase();
        if (!q) { out.innerHTML = ""; return; }
        const hits = [];
        COMPETENCIES.forEach((c) => {
          const inName = c.name.toLowerCase().includes(q);
          LEVELS.forEach((l) => {
            const std = c.levels[l.id] || "";
            if (inName || std.toLowerCase().includes(q)) {
              hits.push({ c, l, std });
            }
          });
        });
        if (!hits.length) { out.innerHTML = `<div class="muted">Không tìm thấy kết quả cho “${esc(q)}”.</div>`; return; }
        out.innerHTML = hits.slice(0, 24).map((h) =>
          `<a class="sr-item" href="${h.l.file}#${h.c.id}" style="display:block">
             <div class="sr-comp">${esc(h.c.name)}</div>
             <div class="sr-lv"><b>${esc(h.l.title)}:</b> ${esc(h.std)}</div>
           </a>`).join("");
      });
    }
  }

  // ================= LEVEL PAGE =================
  function renderLevel(levelId) {
    const lv = levelById(levelId);
    if (!lv) return;
    if (levelId === RESTRICTED && !isGD()) {
      const head = byId("pagehead");
      if (head) { head.style.background = "#0F1437"; head.innerHTML = `<div class="wrap"><h1>Không truy cập được</h1></div>`; }
      const main = byId("main");
      if (main) main.innerHTML = `<div class="progress-wrap" style="display:block;text-align:center;padding:30px"><p>Trang cấp <b>Giám đốc Trung tâm</b> chỉ dành cho Giám đốc Trung tâm.</p><p><a href="index.html">← Về trang chủ</a></p></div>`;
      document.title = "Không truy cập được ";
      return;
    }
    document.title = lv.title + " · Khung năng lực Kinh doanh";

    // header
    const head = byId("pagehead");
    head.style.background = lv.color === "#0F1437" ? "#0F1437" : `linear-gradient(135deg,${lv.color},#0F1437)`;
    head.innerHTML = `<div class="wrap">
      <div class="crumb"><a href="index.html">Trang chủ</a> › Cấp ${lv.order}</div>
      <div class="step">Cấp ${lv.order}</div>
      <h1>${esc(lv.title)}</h1>
      <div class="dre">${esc(lv.dreyfus)}</div>
      <p class="role">${esc(lv.role)}</p>
    </div>`;

    const main = byId("main");
    let html = "";

    // in-page section navigation (jump links)
    const hasCk = !!(CLF.CHECKLISTS || {})[lv.id];
    const secs = [];
    if (lv.gate) secs.push(["sec-gate", "Tiêu chuẩn"]);
    secs.push(["sec-kpi", "KPI"]);
    if (lv.managerSkills) secs.push(["sec-ms", "Kỹ năng quản lý"]);
    secs.push(["sec-comp", "Năng lực"]);
    if (lv.valueStages) secs.push(["sec-cv", "Giá trị cốt lõi"]);
    secs.push(["sec-promote", lv.reviewBased ? "Điều kiện cần" : "Điều kiện lên cấp"]);
    if (lv.reviewBased && lv.appointment) secs.push(["sec-appoint", "Bổ nhiệm"]);
    html += `<nav class="secnav">${secs.map((s) => `<a href="#${s[0]}">${esc(s[1])}</a>`).join("")}</nav>`;

    // progress + actions
    html += `<div class="progress-wrap">
      <span class="ptxt">Tiến độ đạt chuẩn</span>
      <div class="bar-track"><div class="bar-fill" id="barFill"></div></div>
      <span class="ptxt" id="barPct">0%</span>
      <button class="btn" onclick="window.print()">🖨️ In / Lưu PDF</button>
      <button class="btn ghost" id="resetBtn">Đặt lại</button>
    </div>`;

    // Gate — tiêu chuẩn định lượng
    if (lv.gate) {
      html += `<div class="gate" id="sec-gate">
        <div class="gate-h">Tiêu chuẩn định lượng của cấp ${lv.reviewCycle ? `<span class="gate-cycle">⟳ ${esc(lv.reviewCycle)}</span>` : ""}</div>
        <ul class="gate-list">${lv.gate.map((g) => `<li><span class="gd"></span><span>${esc(g)}</span></li>`).join("")}</ul>
      </div>`;
    }

    // KPIs
    html += `<h2 id="sec-kpi" style="font-size:20px;margin-top:6px">KPI tiêu biểu của cấp này</h2>
      <div class="accent"></div>
      <div class="kpis">${lv.kpis.map((k) =>
      `<div class="kpi"><div class="lab">Chỉ số</div><div class="val">${esc(k)}</div></div>`).join("")}</div>`;

    // role-specific mandatory management skills (e.g., Trưởng phòng player-coach)
    if (lv.managerSkills) {
      html += `<h2 id="sec-ms" style="font-size:20px;margin-top:28px">Kỹ năng quản lý bắt buộc <span class="sec-count" id="msPct"></span></h2>
        <div class="sub" style="margin-top:4px">Vai trò player-coach: vừa giữ số cá nhân, vừa dẫn dắt cả phòng. Tích vào ô khi đã làm chủ — tiến độ tự lưu.</div>
        <div class="ms-grid">${lv.managerSkills.map((grp, gi) => `
          <div class="ms-card"><div class="ms-h">${esc(grp.g)} <span class="ms-count" data-msg="${gi}"></span></div>
            <ul class="ms-list">${grp.items.map((it, ii) => {
              const key = `clf_${lv.id}_ms_${gi}_${ii}`;
              const ck = store.get(key) === "1";
              return `<li class="ms-item ${ck ? "done" : ""}"><label><input type="checkbox" data-key="${key}" data-ms="1" data-msg="${gi}" ${ck ? "checked" : ""}><span>${esc(it)}</span></label></li>`;
            }).join("")}</ul>
          </div>`).join("")}</div>`;
    }


    // competency groups (5 domain). Nhân viên: domain "Kiến thức kỹ năng chuyên môn" = checklist 3 nhóm.
    const ckData = (CLF.CHECKLISTS || {})[lv.id];
    html += `<h2 id="sec-comp" style="font-size:20px;margin-top:26px">Chuẩn cần đạt theo năng lực</h2>
      <div class="sub" style="margin-top:4px">Tích vào ô khi đã đạt chuẩn — tiến độ tự lưu & đồng bộ.</div>`;
    GROUPS.forEach((g) => {
      const comps = COMPETENCIES.filter((c) => c.group === g.id);
      html += `<div class="grp">
        <div class="grp-head">
          <span class="ic" style="background:${hexA(g.color, .12)}">${g.icon}</span>
          <h3>${esc(g.name)}</h3><span class="en">${esc(g.en)}</span>
          <span class="grp-prog" data-grp="${g.id}"></span>
        </div>`;
      if (lv.id === 'c1' && g.id === 'd1' && ckData) {
        html += `<div class="sub" style="margin:2px 0 8px">Checklist thành thạo — 3 nhóm: Sản phẩm · Triển khai · Kỹ năng khác.</div>`;
        ckData.forEach((p, pi) => {
          html += `<details class="ck-part" open><summary><span class="ck-pt">${esc(p.part)}</span><span class="ck-count" data-part="${pi}"></span></summary>`;
          p.categories.forEach((cat, ci) => {
            html += `<div class="ck-cat"><div class="ck-cat-h">${esc(cat.cat)}${cat.opt ? ` <span class="opt-tag">không bắt buộc</span>` : ""}</div>`;
            cat.items.forEach((it, ii) => {
              const key = `clf_${lv.id}_ck_${pi}_${ci}_${ii}`;
              const ck = store.get(key) === "1";
              html += `<label class="ck-item ${ck ? "done" : ""}">
                <input type="checkbox" data-key="${key}" data-ck="1" data-part="${pi}" ${ck ? "checked" : ""}>
                <span class="ck-txt"><span class="ck-n">${esc(it.n)}${it.opt ? ` <span class="opt-tag">tùy chọn</span>` : ""}</span>${it.d ? `<span class="ck-d">${esc(it.d)}</span>` : ""}</span>
              </label>`;
            });
            html += `</div>`;
          });
          html += `</details>`;
        });
      } else {
        comps.forEach((c) => {
          const key = `clf_${lv.id}_comp_${c.id}`;
          const checked = store.get(key) === "1";
          const pb = c.playbook ? c.playbook[lv.id] : "";
          const pbLabel = lv.order === LEVELS.length ? "Duy trì & mở rộng" : "Cần bổ sung để lên cấp tiếp theo";
          html += `<div class="comp ${checked ? "done" : ""}" id="${c.id}" data-grp="${g.id}">
            <label class="chk"><input type="checkbox" data-key="${key}" ${checked ? "checked" : ""}></label>
            <div class="ctext">
              <div class="cname">${esc(c.name)}</div>
              <div class="cstd">${esc(c.levels[lv.id])}</div>
              ${pb ? `<div class="cpb"><span class="cpb-lab">${pbLabel}</span><span class="cpb-txt">${esc(pb)}</span></div>` : ""}
            </div>
          </div>`;
        });
      }
      html += `</div>`;
    });

    // core values + mastery stage for this level
    if (lv.valueStages && CLF.CORE_VALUES) {
      const stages = CLF.VALUE_STAGES;
      const ids = lv.valueStages;
      const names = stages.filter((s) => ids.includes(s.id)).map((s) => s.name).join(" + ");
      html += `<h2 id="sec-cv" style="font-size:20px;margin-top:32px">Giá trị cốt lõi</h2>
        <div class="sub" style="margin-top:4px">Mức độ kỳ vọng ở cấp này: <b style="color:var(--blue)">${esc(names)}</b></div>
        <div class="vstage">${stages.map((s) => {
          const on = ids.includes(s.id);
          return `<div class="vstep ${on ? "on" : ""}"><div class="vs-n">${esc(s.name)}</div><div class="vs-d">${esc(s.d)}</div></div>`;
        }).join("")}</div>
        <div class="cv-list">${CLF.CORE_VALUES.map((v, i) => `
          <div class="cv"><div class="cv-h"><span class="cv-num">${i + 1}</span>${esc(v.name)}</div>
            <ul class="cv-b">${v.behaviors.map((b) => `<li>${esc(b)}</li>`).join("")}</ul>
          </div>`).join("")}</div>`;
    }

    // promote checklist (necessary, measurable, tickable)
    html += `<div class="promote" id="sec-promote">
      <h3>${lv.reviewBased ? "Điều kiện cần — đo được" : "Hoàn thành để lên cấp tiếp theo"}</h3>
      <p>${lv.reviewBased ? "Đây là điều kiện cần (chưa đủ) để được xem xét. Tích khi đã đạt." : "Đối chiếu các điều kiện đo được dưới đây trước khi xét thăng tiến."}</p>
      <ul>${lv.nextChecklist.map((t, i) => {
        const key = `clf_${lv.id}_promote_${i}`;
        const ck = store.get(key) === "1";
        return `<li class="${ck ? "done" : ""}"><input type="checkbox" data-key="${key}" data-promote="1" ${ck ? "checked" : ""}><span>${esc(t)}</span></li>`;
      }).join("")}</ul>
    </div>`;

    // appointment factors (sufficient, qualitative, review-based — NOT auto-scored)
    if (lv.reviewBased && lv.appointment) {
      html += `<div class="appoint" id="sec-appoint">
        <div class="appoint-head">
          <h3>Yếu tố quyết định bổ nhiệm — điều kiện đủ</h3>
          <span class="pill">Đang xét duyệt</span>
        </div>
        <p class="appoint-note">Đạt chuẩn năng lực và điều kiện cần ở trên mới là “đủ tư cách được xem xét”. Các yếu tố dưới đây do Ban lãnh đạo cân nhắc — không tự đánh giá và không tính vào tiến độ.</p>
        <ul class="factor-list">${lv.appointment.map((t) => `<li><span class="fd"></span><span>${esc(t)}</span></li>`).join("")}</ul>
      </div>`;
    }

    // prev/next
    const prev = LEVELS.find((l) => l.order === lv.order - 1);
    const next = LEVELS.find((l) => l.order === lv.order + 1);
    html += `<div class="pn">
      ${prev ? `<a href="${prev.file}"><div class="dir">← Cấp trước</div><div class="t">${esc(prev.title)}</div></a>` : `<a href="index.html"><div class="dir">←</div><div class="t">Về trang chủ</div></a>`}
      ${next ? `<a href="${next.file}" style="text-align:right"><div class="dir">Cấp tiếp theo →</div><div class="t">${esc(next.title)}</div></a>` : `<a href="index.html" style="text-align:right"><div class="dir">→</div><div class="t">Về trang chủ</div></a>`}
    </div>`;

    main.innerHTML = html;

    // wire checkboxes
    main.querySelectorAll('input[type="checkbox"]').forEach((cb) => {
      cb.addEventListener("change", () => {
        store.set(cb.dataset.key, cb.checked ? "1" : "0");
        if (cb.dataset.promote) {
          cb.closest("li").classList.toggle("done", cb.checked);
        } else if (cb.dataset.ck) {
          cb.closest(".ck-item").classList.toggle("done", cb.checked);
          updateChecklist(lv);
        } else if (cb.dataset.ms) {
          cb.closest(".ms-item").classList.toggle("done", cb.checked);
          updateManagerSkills(lv);
        } else {
          cb.closest(".comp").classList.toggle("done", cb.checked);
          updateProgress(lv);
        }
      });
    });
    byId("resetBtn").addEventListener("click", () => {
      if (!confirm("Đặt lại toàn bộ tiến độ của cấp này?")) return;
      main.querySelectorAll('input[type="checkbox"]').forEach((cb) => {
        cb.checked = false; store.set(cb.dataset.key, "0");
        const li = cb.closest("li"); if (li) li.classList.remove("done");
        const cp = cb.closest(".comp"); if (cp) cp.classList.remove("done");
        const ci = cb.closest(".ck-item"); if (ci) ci.classList.remove("done");
        const mi = cb.closest(".ms-item"); if (mi) mi.classList.remove("done");
      });
      updateProgress(lv);
      if (ckData) updateChecklist(lv);
      if (lv.managerSkills) updateManagerSkills(lv);
    });
    updateProgress(lv);
    if (ckData) updateChecklist(lv);
    if (lv.managerSkills) updateManagerSkills(lv);
  }

  function updateManagerSkills(lv) {
    if (!lv.managerSkills) return;
    let total = 0, done = 0;
    lv.managerSkills.forEach((grp, gi) => {
      let gt = 0, gd = 0;
      grp.items.forEach((it, ii) => {
        gt++;
        if (store.get(`clf_${lv.id}_ms_${gi}_${ii}`) === "1") gd++;
      });
      total += gt; done += gd;
      const el = document.querySelector(`.ms-count[data-msg="${gi}"]`);
      if (el) el.textContent = gd + "/" + gt;
    });
    const p = byId("msPct");
    if (p) p.textContent = "(" + done + "/" + total + ")";
  }

  function updateChecklist(lv) {
    const ckData = (CLF.CHECKLISTS || {})[lv.id];
    if (!ckData) return;
    let total = 0, done = 0;
    const partTotals = [], partDone = [];
    ckData.forEach((p, pi) => {
      let pt = 0, pd = 0;
      p.categories.forEach((cat, ci) => {
        cat.items.forEach((it, ii) => {
          pt++;
          if (store.get(`clf_${lv.id}_ck_${pi}_${ci}_${ii}`) === "1") pd++;
        });
      });
      partTotals[pi] = pt; partDone[pi] = pd; total += pt; done += pd;
    });
    const pct = total ? Math.round((done / total) * 100) : 0;
    const f = byId("ckFill"), p = byId("ckPct");
    if (f) f.style.width = pct + "%";
    if (p) p.textContent = pct + "% (" + done + "/" + total + ")";
    document.querySelectorAll(".ck-count[data-part]").forEach((el) => {
      const pi = +el.dataset.part;
      el.textContent = partDone[pi] + "/" + partTotals[pi];
    });
  }

  function updateProgress(lv) {
    const total = COMPETENCIES.length;
    let done = 0;
    COMPETENCIES.forEach((c) => { if (store.get(`clf_${lv.id}_comp_${c.id}`) === "1") done++; });
    const pct = Math.round((done / total) * 100);
    const f = byId("barFill"), p = byId("barPct");
    if (f) f.style.width = pct + "%";
    if (p) p.textContent = pct + "% (" + done + "/" + total + ")";
    GROUPS.forEach((g) => {
      const comps = COMPETENCIES.filter((c) => c.group === g.id);
      let d = 0; comps.forEach((c) => { if (store.get(`clf_${lv.id}_comp_${c.id}`) === "1") d++; });
      const el = document.querySelector(`.grp-prog[data-grp="${g.id}"]`);
      if (el) el.textContent = d + "/" + comps.length;
    });
  }

  // ================= SELF ASSESSMENT =================
  function renderAssess() {
    const main = byId("main");
    let html = `<div class="progress-wrap"><span class="ptxt">Chọn mức bạn đang đạt cho từng năng lực, rồi xem cấp đề xuất.</span>
      <button class="btn" id="calcBtn">Xem kết quả</button>
      <button class="btn ghost" id="resetA">Đặt lại</button></div>`;
    html += `<div id="result"></div>`;
    GROUPS.forEach((g) => {
      const comps = COMPETENCIES.filter((c) => c.group === g.id);
      html += `<div class="grp"><div class="grp-head"><span class="ic" style="background:${hexA(g.color, .12)}">${g.icon}</span><h3>${esc(g.name)}</h3></div>`;
      comps.forEach((c) => {
        const saved = store.get(`clf_assess_${c.id}`) || "";
        const opts = [["0", "Chưa đạt"]].concat(LEVELS.map((l) => [String(l.order), l.short]));
        html += `<div class="assess-row"><div class="cname">${esc(c.name)}</div>
          <div class="opts">${opts.map(([v, t]) =>
          `<label class="opt ${saved === v ? "sel" : ""}" data-comp="${c.id}" data-v="${v}">
             <input type="radio" name="a_${c.id}" value="${v}" ${saved === v ? "checked" : ""}>
             <span class="ol">${t === "Chưa đạt" ? "—" : "Cấp " + v}</span>${esc(t)}
           </label>`).join("")}</div></div>`;
      });
      html += `</div>`;
    });
    main.innerHTML = html;

    main.querySelectorAll(".opt").forEach((o) => {
      o.addEventListener("click", () => {
        const comp = o.dataset.comp;
        main.querySelectorAll(`.opt[data-comp="${comp}"]`).forEach((x) => x.classList.remove("sel"));
        o.classList.add("sel");
        o.querySelector("input").checked = true;
        store.set(`clf_assess_${comp}`, o.dataset.v);
      });
    });
    byId("calcBtn").addEventListener("click", calcAssess);
    byId("resetA").addEventListener("click", () => {
      COMPETENCIES.forEach((c) => store.set(`clf_assess_${c.id}`, ""));
      renderAssess();
    });
    if (COMPETENCIES.some((c) => store.get(`clf_assess_${c.id}`))) calcAssess();
  }

  function calcAssess() {
    const total = COMPETENCIES.length;
    let answered = 0, sum = 0;
    const counts = [0, 0, 0, 0, 0]; // index = level (0=chưa đạt..4)
    COMPETENCIES.forEach((c) => {
      const v = parseInt(store.get(`clf_assess_${c.id}`) || "", 10);
      if (!isNaN(v)) { answered++; sum += v; counts[v]++; }
    });
    const res = byId("result");
    if (answered < total) {
      res.innerHTML = `<div class="result-card"><div class="muted">Đã chọn ${answered}/${total} năng lực. Hoàn tất để có kết quả chính xác hơn.</div></div>`;
    }
    // Suggested level = cao nhất mà đạt >= 70% năng lực ở mức đó trở lên
    let suggested = 0;
    for (let L = LEVELS.length; L >= 1; L--) {
      let meet = 0;
      COMPETENCIES.forEach((c) => {
        const v = parseInt(store.get(`clf_assess_${c.id}`) || "0", 10) || 0;
        if (v >= L) meet++;
      });
      if (meet / total >= 0.7) { suggested = L; break; }
    }
    const lvObj = LEVELS.find((l) => l.order === suggested);
    const avg = answered ? (sum / answered).toFixed(1) : "0";
    const readiness = lvObj && lvObj.reviewBased; // leadership levels: bổ nhiệm cần xét duyệt
    res.innerHTML = `<div class="result-card">
      <div class="muted">${suggested ? (readiness ? "Mức độ sẵn sàng" : "Cấp đề xuất hiện tại") : "Cấp đề xuất hiện tại"}</div>
      <div class="big">${suggested ? (readiness ? "Sẵn sàng phát triển lên " + esc(lvObj.title) : esc(lvObj.title)) : "Đang xây nền tảng"}</div>
      <div class="sub2">${suggested ? esc(lvObj.dreyfus) : "Tập trung đạt chuẩn Cấp 1 trước."}</div>
      ${readiness ? `<div class="muted" style="margin-top:8px;max-width:520px;margin-left:auto;margin-right:auto">Đây là vị trí lãnh đạo: đạt năng lực mới là điều kiện cần. Việc bổ nhiệm còn phụ thuộc nhu cầu tổ chức và quyết định của Ban lãnh đạo.</div>` : ""}
      <div class="muted" style="margin-top:12px">Điểm trung bình: ${avg}/4 · Đã chọn ${answered}/${total} năng lực</div>
      ${suggested && suggested < LEVELS.length ? `<div style="margin-top:14px"><a class="btn" href="${LEVELS.find(l=>l.order===suggested+1).file}">Xem chuẩn cấp tiếp theo →</a></div>` : ""}
    </div>`;
  }

  // ================= RUBRIC (manager calibration) =================
  function renderRubric() {
    const main = byId("main");
    let html = `<div class="progress-wrap">
      <span class="ptxt">Bảng đánh giá để quản lý chấm khi review định kỳ — dùng mô tả mỗi mức để chấm khách quan.</span>
      <button class="btn" onclick="window.print()">🖨️ In / Lưu PDF</button>
    </div>`;

    // scoring guide
    html += `<div class="okr"><div class="okr-tag">Thang chấm</div>
      <ul class="okr-kr">
        <li><span class="krn">0</span> Chưa đạt — chưa thể hiện được hành vi của cấp 1</li>
        <li><span class="krn">1</span> Đạt chuẩn Nhân viên</li>
        <li><span class="krn">2</span> Đạt chuẩn Chuyên gia</li>
        <li><span class="krn">3</span> Đạt chuẩn Trưởng phòng</li>
        <li><span class="krn">4</span> Đạt chuẩn Giám đốc Trung tâm</li>
      </ul>
      <div class="muted" style="margin-top:6px">Chấm theo bằng chứng quan sát được, không theo cảm tính. Lấy hành vi cao nhất mà nhân sự thể hiện ổn định.</div>
    </div>`;

    GROUPS.forEach((g) => {
      const comps = COMPETENCIES.filter((c) => c.group === g.id);
      if (!comps.length) return;
      html += `<div class="grp">
        <div class="grp-head"><span class="ic" style="background:${hexA(g.color, .12)}">${g.icon}</span><h3>${esc(g.name)}</h3></div>`;
      let rows = `<tr><th class="rb-c">Năng lực</th>${LEVELS.map((l) => `<th>${esc(l.short)} <span class="rb-pt">(${l.order})</span></th>`).join("")}</tr>`;
      comps.forEach((c) => {
        rows += `<tr><td class="rb-c">${esc(c.name)}</td>${LEVELS.map((l) => `<td>${esc(c.levels[l.id])}</td>`).join("")}</tr>`;
      });
      html += `<div class="rb-wrap"><table class="rubric">${rows}</table></div></div>`;
    });
    main.innerHTML = html;
  }

  // helper: hex + alpha
  function hexA(hex, a) {
    const h = hex.replace("#", "");
    const r = parseInt(h.substr(0, 2), 16), g = parseInt(h.substr(2, 2), 16), b = parseInt(h.substr(4, 2), 16);
    return `rgba(${r},${g},${b},${a})`;
  }

  // ================= POPUP SỰ KIỆN (lần đầu vào) =================
  window.hubEventPopup = function eventPopup(force) {
    var $ = function (id) { return document.getElementById(id); };
    var esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };
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
    var go = function () { close(); if (EV.target && !$(EV.target)) { location.href = "index.html#" + EV.target; return; } var t = EV.target ? $(EV.target) : null; if (t) window.scrollTo({ top: t.getBoundingClientRect().top + scrollY - 80, behavior: "smooth" }); };
    ov.querySelector(".hp-x").onclick = close; if (!ov.querySelector(".hp-go")) ov.querySelector(".hp-bar").insertAdjacentHTML("beforeend", '<button class="hp-go">Đã hiểu</button>');
    ov.querySelector(".hp-no").onclick = function () { try { localStorage.setItem(KEY, "off"); } catch (e) {} close(); };
    ov.querySelector(".hp-go").onclick = go; ov.querySelector("img").onclick = go;
    ov.addEventListener("click", function (e) { if (e.target === ov) close(); });
    document.addEventListener("keydown", function k(e) { if (e.key === "Escape") { close(); document.removeEventListener("keydown", k); } });
  };
  // ---- Dải 🔥 Tin nóng (mọi trang): vinh danh đang ghim + thành tích quan trọng 3 ngày gần nhất ----
  function startTicker() {
    if (!window.SB || !window.CLF_READY || document.getElementById("hub-tick")) return;
    const bar = document.querySelector(".topbar"); if (!bar) return;
    const since = new Date(Date.now() - 3 * 864e5).toISOString(), now = new Date().toISOString();
    Promise.all([
      window.SB.from("honors").select("icon,title,names").eq("active", true).lte("start_at", now).gt("end_at", now).order("created_at", { ascending: false }).limit(5),
      window.SB.from("feed_events").select("icon,title,kind,full_name").in("kind", ["rank", "whale", "honor", "challenge", "star", "award"]).gte("created_at", since).order("created_at", { ascending: false }).limit(15)
    ]).then((r) => {
      const esc = (x) => String(x == null ? "" : x).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
      const items = [];
      (r[0].data || []).forEach((h) => items.push("<b>" + esc(h.icon || "🏅") + " Vinh danh " + esc(h.names) + "</b> — " + esc(h.title)));
      const seen = {};
      (r[1].data || []).filter((e) => e.kind !== "honor").forEach((e) => {
        // Mỗi người trong mỗi danh hiệu chỉ lấy tin mới nhất (bỏ các bậc cũ trùng lặp)
        const t = String(e.title || ""), k = e.kind === "rank" ? "rank|" + (t.split("·").pop() || "").trim() + "|" + (e.full_name || t.split(" lên ")[0]) : e.kind + "|" + (e.full_name || t);
        if (seen[k]) return; seen[k] = 1; items.push(esc(e.icon || "✨") + " " + esc(t));
      });
      if (!items.length) return;
      if (!document.getElementById("tick-style")) {
        const st = document.createElement("style"); st.id = "tick-style";
        st.textContent = "#hub-tick{display:flex;align-items:center;gap:10px;background:linear-gradient(90deg,#1b1408,#3a2a10 50%,#1b1408);color:#FFE8B0;font-size:12.5px;height:30px;overflow:hidden;cursor:pointer;border-top:1px solid #5a4318}"
          + "#hub-tick .tk-l{flex:none;padding:0 10px 0 12px;font-weight:800;color:#FFB547;background:#1b1408;height:100%;display:flex;align-items:center;box-shadow:6px 0 10px #1b1408;z-index:1}"
          + "#hub-tick .tk-w{flex:1;overflow:hidden;white-space:nowrap;-webkit-mask-image:linear-gradient(90deg,transparent,#000 3%,#000 97%,transparent);mask-image:linear-gradient(90deg,transparent,#000 3%,#000 97%,transparent)}"
          + "#hub-tick .tk-t{display:inline-block;padding-left:100%;animation:tkMove var(--tkd,40s) linear infinite}#hub-tick:hover .tk-t{animation-play-state:paused}"
          + "#hub-tick .tk-t span{margin-right:42px}#hub-tick .tk-t b{color:#FFD36B}"
          + "@keyframes tkMove{from{transform:translateX(0)}to{transform:translateX(-100%)}}@media(prefers-reduced-motion:reduce){#hub-tick .tk-t{animation:none;padding-left:0}}";
        document.head.appendChild(st);
      }
      const el = document.createElement("div"); el.id = "hub-tick"; el.title = "Xem Bảng tin thành tích";
      el.innerHTML = '<span class="tk-l">🔥 Tin nóng</span><div class="tk-w"><div class="tk-t">' + items.map((x) => "<span>" + x + "</span>").join("") + "</div></div>";
      el.querySelector(".tk-t").style.setProperty("--tkd", Math.max(25, items.length * 9) + "s");
      el.onclick = () => { const f = document.getElementById("hub-feed"); if (f) f.scrollIntoView({ behavior: "smooth", block: "start" }); else location.href = "index.html#hub-feed"; };
      bar.appendChild(el);
    }).catch(() => {});
  }

  function startEventPopup() {
    if (!window.SB || !window.CLF_READY || window._evStarted) return; window._evStarted = 1;
    window.hubEvent().then(function () { setTimeout(function () { window.hubEventPopup(location.hash === "#event"); }, 800); });
    window.addEventListener("hashchange", function () { if (location.hash === "#event") window.hubEventPopup(true); });
  }

  // ---- init (chờ auth.js nạp xong tiến độ: window.CLF_READY / sự kiện 'clf-ready') ----
  function startRender() {
    const page = document.body.dataset.page;
    if (page === "index") renderIndex();
    else if (page === "level") renderLevel(document.body.dataset.level);
    else if (page === "rubric") renderRubric();
    else if (page === "assess") renderAssess();
  }
  document.addEventListener("DOMContentLoaded", () => {
    const file = location.pathname.split("/").pop() || "index.html";
    buildNav(file);
    buildFoot();
    const go = () => { buildNav(file); startRender(); try { startEventPopup(); startTicker(); } catch (e) {} };
    if (window.CLF_READY || !window.SB) go();
    else document.addEventListener("clf-ready", go, { once: true });
  });
})();
