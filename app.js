/* ===== Sapo Competency Framework — app logic ===== */
(function () {
  const { LEVELS, GROUPS, COMPETENCIES } = window.CLF;
  const byId = (id) => document.getElementById(id);
  const levelById = (id) => LEVELS.find((l) => l.id === id);
  const groupById = (id) => GROUPS.find((g) => g.id === id);
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

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

  // ---- shared: nav + footer ----
  function buildNav(activeFile) {
    const nav = byId("nav");
    if (!nav) return;
    const items = [["index.html", "Trang chủ"]].concat(
      LEVELS.map((l) => [l.file, l.short])
    ).concat([["rubric.html", "Rubric"]]);
    nav.innerHTML = items.map(([f, t]) =>
      `<a href="${f}" class="${f === activeFile ? "active" : ""}">${t}</a>`).join("");
  }
  function buildFoot() {
    const f = byId("foot");
    if (f) f.innerHTML = `<div class="wrap"><span>Khung năng lực đội ngũ Kinh doanh · Sapo</span><span>Bản nháp để duyệt — nội dung có thể điều chỉnh</span></div>`;
  }

  // ================= INDEX =================
  function renderIndex() {
    // level cards
    const grid = byId("levels");
    if (grid) {
      grid.innerHTML = LEVELS.map((l) => `
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
      lad.innerHTML = LEVELS.map((l, i) => `
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
    document.title = lv.title + " · Khung năng lực Kinh doanh Sapo";

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
      html += `<h2 id="sec-cv" style="font-size:20px;margin-top:32px">Giá trị cốt lõi Sapo</h2>
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
    if (window.CLF_READY || !window.SB) startRender();
    else document.addEventListener("clf-ready", startRender, { once: true });
  });
})();
