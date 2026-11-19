/* Views: checklist, detail pane, roadmap, missables, planner, settings. */
window.GTA6_VIEWS = (function () {
  var selectedId = null;

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  function isHidden(t) {
    return window.GTA6_STORE.settings.spoilers && t.kind === "story" && !window.GTA6_STORE.isEarned(t.id);
  }
  function displayName(t) {
    return isHidden(t) ? "Hidden story trophy — earn it to reveal" : t.name;
  }
  function displayDesc(t) {
    return isHidden(t) ? "Hidden story trophy — earn it to reveal" : t.description;
  }

  function medal(t) { return '<span class="medal ' + esc(t.grade) + '" title="' + esc(window.GTA6.gradeLabel(t.grade)) + '"></span>'; }

  function tags(t) {
    var out = '<span class="tag">' + esc(window.GTA6.gradeLabel(t.grade)) + "</span>";
    if (t.kind === "story") out += '<span class="tag story">Story</span>';
    if (t.missable) out += '<span class="tag missable">Missable</span>';
    if (t.psnCount) out += '<span class="tag">×' + esc(t.psnCount) + "</span>";
    return out;
  }

  function updateProgress() {
    var total = window.GTA6_CONFIG.total;
    var earned = window.GTA6_STORE.earnedCount();
    var el = document.getElementById("earned-count");
    if (el) el.textContent = String(earned);
    var fill = document.getElementById("progress-fill");
    if (fill) fill.style.width = (earned / total * 100).toFixed(1) + "%";
    var bar = document.getElementById("progress-bar");
    if (bar) bar.setAttribute("aria-valuenow", String(earned));
    var gc = document.getElementById("grade-counts");
    if (gc) {
      gc.textContent = ["platinum", "gold", "silver", "bronze"].map(function (g) {
        return window.GTA6_STORE.earnedByGrade(g) + " / " + window.GTA6_CONFIG.grades[g] + " " + g;
      }).join(" · ");
    }
  }

  function sourcesHtml(t) {
    var parts = window.GTA6.sourcesLine(t).map(function (s) {
      return s.href ? '<a href="' + esc(s.href) + '">' + esc(s.label) + "</a>" : esc(s.label);
    });
    return '<p class="sources"><strong>Sources:</strong> ' + parts.join("; ") + ".</p>";
  }

  function guidePaneHtml(t) {
    if (!t) return '<p class="empty-guide">Select a trophy from the list to read its guide here.</p>';
    var h = "<h2>" + esc(displayName(t)) + "</h2>";
    h += '<p class="grade-line">' + esc(window.GTA6.gradeLabel(t.grade)) + " trophy · Stage " + esc(t.stage) + " · " + esc(t.kind) + "</p>";
    h += "<p>" + esc(displayDesc(t)) + "</p>";
    if (isHidden(t)) {
      h += "<p>Guide hidden with the story spoiler setting. Earn the trophy to reveal its guide, or turn spoilers off in Settings.</p>";
    } else {
      h += "<p>" + esc(t.guide) + "</p>";
      if (t.missable) h += "<p><strong>Missable:</strong> this trophy can be missed — read the guide above and act before the opportunity passes.</p>";
      if (t.psnCount) h += "<p><strong>PSN count:</strong> " + esc(t.psnCount) + " (stated in the official description).</p>";
    }
    h += sourcesHtml(t);
    h += '<label>Your notes<textarea data-note="' + esc(t.id) + '" placeholder="Your own notes for this trophy…">' + esc(window.GTA6_STORE.getNote(t.id)) + "</textarea></label>";
    h += '<p class="muted">Notes are saved in your browser only.</p>';
    return h;
  }

  function renderChecklist(view) {
    var f = window.GTA6_FILTERS.state;
    var list = window.GTA6_FILTERS.apply();
    var kinds = window.GTA6_CONFIG.kinds.map(function (k) {
      var count = k.key === "all" ? window.GTA6_CONFIG.total : window.GTA6_FILTERS.countByKind(k.key);
      return '<button type="button" class="chip' + (f.kind === k.key ? " active" : "") + '" data-kind="' + esc(k.key) + '">' + esc(k.label) + " (" + count + ")</button>";
    }).join("");
    var grades = ["all", "platinum", "gold", "silver", "bronze"].map(function (g) {
      return '<option value="' + g + '"' + (f.grade === g ? " selected" : "") + ">" + (g === "all" ? "All grades" : window.GTA6.gradeLabel(g)) + "</option>";
    }).join("");
    var earnedOpts = [["all", "Earned + unearned"], ["earned", "Earned only"], ["unearned", "Unearned only"]].map(function (o) {
      return '<option value="' + o[0] + '"' + (f.earned === o[0] ? " selected" : "") + ">" + o[1] + "</option>";
    }).join("");

    var h = '<div class="filters" role="search">';
    h += '<input type="search" id="search-box" placeholder="Search name, description or guide…  ( / )" value="' + esc(f.q) + '" aria-label="Search trophies">';
    h += '<select id="grade-filter" aria-label="Filter by grade">' + grades + "</select>";
    h += '<select id="earned-filter" aria-label="Filter by earned">' + earnedOpts + "</select>";
    h += '<div class="chip-row">' + kinds + "</div>";
    h += "</div>";
    h += '<p class="muted">' + list.length + " of 55 trophies shown · Online: 0 trophies on this list — there are no online trophies here, shown honestly.</p>";
    h += '<div class="layout"><div><ul class="trophy-list">';
    list.forEach(function (t) {
      var earned = window.GTA6_STORE.isEarned(t.id);
      h += '<li class="trophy' + (earned ? " earned" : "") + (selectedId === t.id ? " selected" : "") + '" data-id="' + t.id + '" tabindex="0" role="button" aria-pressed="' + earned + '">';
      h += '<input type="checkbox" class="trophy-check" data-check="' + t.id + '"' + (earned ? " checked" : "") + ' aria-label="Mark ' + esc(displayName(t)) + ' as earned">';
      h += medal(t);
      h += '<div class="trophy-body"><div class="trophy-name">' + esc(displayName(t)) + "</div>";
      h += '<div class="trophy-desc">' + esc(displayDesc(t)) + "</div>";
      h += '<div class="trophy-meta">' + tags(t) + "</div></div></li>";
    });
    h += "</ul></div>";
    var sel = selectedId ? window.GTA6.byId(selectedId) : null;
    h += '<aside class="guide-pane" id="guide-pane">' + guidePaneHtml(sel) + "</aside></div>";
    view.innerHTML = h;
  }

  function renderRoadmap(view) {
    var h = "<h2>Roadmap to the platinum</h2>";
    h += "<p>Built from the official trophy descriptions. Play in stage order: story first, then exploration and collectibles, then activities and challenges, with the grind trophies last.</p>";
    window.GTA6_CONFIG.stages.forEach(function (st) {
      var ts = window.GTA6.byStage(st.n);
      var done = ts.filter(function (t) { return window.GTA6_STORE.isEarned(t.id); }).length;
      var pct = ts.length ? Math.round(done / ts.length * 100) : 0;
      h += '<section class="stage"><div class="stage-head"><h2>Stage ' + st.n + " — " + esc(st.title) + "</h2><span>" + done + " / " + ts.length + "</span></div>";
      h += "<p>" + esc(st.blurb) + "</p>";
      h += '<div class="stage-bar"><div class="stage-fill" style="width:' + pct + '%"></div></div>';
      h += '<ul class="stage-trophies">';
      ts.forEach(function (t) {
        h += '<li class="' + (window.GTA6_STORE.isEarned(t.id) ? "done" : "") + '">' + esc(displayName(t)) + ' <span class="muted">(' + esc(window.GTA6.gradeLabel(t.grade)) + ")</span></li>";
      });
      h += "</ul></section>";
    });
    view.innerHTML = h;
  }

  function renderMissables(view) {
    var ms = window.GTA6.missables();
    var h = "<h2>Missables — don't let these pass you by</h2>";
    h += "<p>Built from the official trophy descriptions. A trophy is flagged missable here when its description implies a one-time or chapter-locked opportunity. Story and missable flags are derived from the official trophy descriptions; PlayStation's own hidden list was not cross-checked from this machine.</p>";
    h += "<p><strong>" + ms.length + " missable trophies.</strong> Check each one off before its window closes — and keep a manual save before any attempt you can fail.</p>";
    ms.forEach(function (t) {
      h += '<article class="missable-card"><h3>' + esc(displayName(t)) + ' <span class="tag missable">Missable</span></h3>';
      h += "<p>" + esc(displayDesc(t)) + "</p>";
      h += "<p>" + esc(t.guide) + "</p>" + sourcesHtml(t) + "</article>";
    });
    view.innerHTML = h;
  }

  function planReason(t) {
    if (t.kind === "story") return "Story first — it unlocks everything else.";
    if (t.kind === "collectibles") return "Collect it while you are out exploring anyway.";
    if (t.missable) return "Do it now — its window can close.";
    if (t.stage === 4) return "An activity or challenge to chip away at between missions.";
    return "Cleanup — save it for the end of the run.";
  }

  function renderPlanner(view) {
    var remaining = window.GTA6.all().filter(function (t) { return !window.GTA6_STORE.isEarned(t.id); });
    var order = { story: 0, collectibles: 1, activities: 2 };
    remaining.sort(function (a, b) {
      var d = (order[a.kind] || 2) - (order[b.kind] || 2);
      if (d) return d;
      if (a.missable !== b.missable) return a.missable ? -1 : 1;
      return (a.stage - b.stage) || (a.id - b.id);
    });
    var next = remaining.slice(0, 5);
    var h = "<h2>Next up</h2>";
    h += "<p>Your next 3–5 unearned trophies in roadmap order: story first, then collectibles, then activities, then cleanup.</p>";
    if (!next.length) {
      h += "<p><strong>All 55 trophies earned — congratulations, Leonida Legend!</strong></p>";
    } else {
      next.forEach(function (t, i) {
        h += '<article class="plan-card"><h3><span class="plan-rank">' + (i + 1) + "</span>" + esc(displayName(t)) + "</h3>";
        h += "<p>" + esc(displayDesc(t)) + "</p>";
        h += "<p><strong>Why next:</strong> " + esc(planReason(t)) + "</p>";
        h += "<p>" + esc(t.guide) + "</p>" + sourcesHtml(t) + "</article>";
      });
    }
    view.innerHTML = h;
  }

  function renderSettings(view) {
    var s = window.GTA6_STORE.settings;
    var h = "<h2>Settings</h2>";
    h += '<section class="settings-card"><h3>Display</h3>';
    h += '<label><input type="checkbox" id="set-spoilers"' + (s.spoilers ? " checked" : "") + '> Hide story spoilers (hide story trophy names and descriptions until earned) — shortcut <kbd>s</kbd></label>';
    h += '<label>Theme <select id="set-theme"><option value="paper"' + (s.theme === "paper" ? " selected" : "") + '>Paper</option><option value="night"' + (s.theme === "night" ? " selected" : "") + '>Night</option></select> — shortcut <kbd>t</kbd></label>';
    h += "</section>";
    h += '<section class="settings-card"><h3>Keyboard shortcuts</h3>';
    h += "<p><kbd>/</kbd> focus search · <kbd>t</kbd> toggle theme · <kbd>s</kbd> toggle spoilers · <kbd>e</kbd> export progress</p></section>";
    h += '<section class="settings-card"><h3>Progress</h3>';
    h += '<p><button type="button" class="btn" id="export-btn">Export progress (JSON)</button> <button type="button" class="btn" id="import-btn">Import progress…</button> <input type="file" id="import-file" accept=".json,application/json" hidden> <button type="button" class="btn" id="reset-btn">Reset progress</button></p>';
    h += '<p class="muted">Export downloads your earned trophies and notes as JSON; import reads that file back. Reset clears everything after a confirm.</p></section>';
    h += '<section class="settings-card"><h3>About this guide</h3>';
    h += "<p>Story and missable flags are derived from the official trophy descriptions; PlayStation's own hidden list was not cross-checked from this machine. Guides are original advice written from the official descriptions, not yet checked in the game. Official list: <a href=\"https://www.exophase.com/game/grand-theft-auto-vi-psn/trophies/\">Exophase</a> · <a href=\"https://psnprofiles.com/trophies/43531-grand-theft-auto-vi\">PSNProfiles</a>.</p></section>";
    view.innerHTML = h;
  }

  function render(route) {
    var view = document.getElementById("view");
    if (!view) return;
    if (route === "roadmap") renderRoadmap(view);
    else if (route === "missables") renderMissables(view);
    else if (route === "planner") renderPlanner(view);
    else if (route === "settings") renderSettings(view);
    else renderChecklist(view);
    document.querySelectorAll(".tabs a").forEach(function (a) {
      a.classList.toggle("active", a.getAttribute("data-route") === (route || "checklist"));
    });
    updateProgress();
  }

  return {
    render: render,
    updateProgress: updateProgress,
    select: function (id) { selectedId = id; },
    selectedId: function () { return selectedId; },
    esc: esc
  };
})();
