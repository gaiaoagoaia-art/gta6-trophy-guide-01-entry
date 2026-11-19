/* Boot, hash routing, events, keyboard shortcuts. No network at runtime. */
(function () {
  var store = window.GTA6_STORE;
  var views = window.GTA6_VIEWS;
  var filters = window.GTA6_FILTERS;

  function route() {
    var hash = (location.hash || "#/").replace(/^#\/?/, "");
    var parts = hash.split("/");
    var r = parts[0] || "checklist";
    if (["checklist", "roadmap", "missables", "planner", "settings"].indexOf(r) === -1) r = "checklist";
    return r;
  }

  function bindChecklist() {
    var box = document.getElementById("search-box");
    if (box) box.addEventListener("input", function () {
      filters.setQuery(box.value);
      views.render("checklist");
      var nb = document.getElementById("search-box");
      if (nb) { nb.focus(); nb.setSelectionRange(nb.value.length, nb.value.length); }
    });
    var grade = document.getElementById("grade-filter");
    if (grade) grade.addEventListener("change", function () { filters.setGrade(grade.value); views.render("checklist"); });
    var earned = document.getElementById("earned-filter");
    if (earned) earned.addEventListener("change", function () { filters.setEarned(earned.value); views.render("checklist"); });
    document.querySelectorAll("[data-kind]").forEach(function (chip) {
      chip.addEventListener("click", function () { filters.setKind(chip.getAttribute("data-kind")); views.render("checklist"); });
    });
    document.querySelectorAll(".trophy").forEach(function (el) {
      var id = parseInt(el.getAttribute("data-id"), 10);
      el.addEventListener("click", function (ev) {
        if (ev.target && ev.target.getAttribute("data-check") !== null) return;
        views.select(id);
        views.render("checklist");
      });
      el.addEventListener("keydown", function (ev) {
        if (ev.key === "Enter" || ev.key === " ") { ev.preventDefault(); views.select(id); views.render("checklist"); }
      });
    });
    document.querySelectorAll("[data-check]").forEach(function (cb) {
      cb.addEventListener("change", function () {
        store.toggle(parseInt(cb.getAttribute("data-check"), 10));
        views.render("checklist");
      });
    });
    document.querySelectorAll("[data-note]").forEach(function (ta) {
      ta.addEventListener("change", function () {
        store.setNote(parseInt(ta.getAttribute("data-note"), 10), ta.value);
      });
    });
  }

  function bindSettings() {
    var sp = document.getElementById("set-spoilers");
    if (sp) sp.addEventListener("change", function () { store.setSpoilers(sp.checked); views.render(route()); });
    var th = document.getElementById("set-theme");
    if (th) th.addEventListener("change", function () { store.setTheme(th.value); views.render(route()); });
    var ex = document.getElementById("export-btn");
    if (ex) ex.addEventListener("click", exportProgress);
    var im = document.getElementById("import-btn");
    var file = document.getElementById("import-file");
    if (im && file) {
      im.addEventListener("click", function () { file.click(); });
      file.addEventListener("change", function () {
        if (!file.files || !file.files[0]) return;
        var reader = new FileReader();
        reader.onload = function () {
          try {
            store.importJSON(String(reader.result));
            views.render(route());
          } catch (e) {
            window.alert("That file could not be imported: " + e.message);
          }
        };
        reader.readAsText(file.files[0]);
      });
    }
    var rs = document.getElementById("reset-btn");
    if (rs) rs.addEventListener("click", function () {
      if (window.confirm("Reset all progress and notes? This cannot be undone.")) {
        store.reset();
        views.render(route());
      }
    });
  }

  function exportProgress() {
    var blob = new Blob([store.exportJSON()], { type: "application/json" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = "gta6-trophy-progress.json";
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  }

  function renderCurrent() {
    var r = route();
    views.render(r);
    if (r === "checklist") bindChecklist();
    if (r === "settings") bindSettings();
  }

  document.addEventListener("keydown", function (ev) {
    var tag = (ev.target && ev.target.tagName) || "";
    var typing = tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT";
    if (ev.key === "/" && !typing) {
      ev.preventDefault();
      var focusSearch = function () {
        var box = document.getElementById("search-box");
        if (box) box.focus();
      };
      if (route() !== "checklist") {
        location.hash = "#/";
        setTimeout(focusSearch, 50);
      } else {
        focusSearch();
      }
    } else if (ev.key === "Escape" && typing && ev.target && ev.target.id === "search-box") {
      ev.target.value = "";
      filters.setQuery("");
      views.render("checklist");
      var nb = document.getElementById("search-box");
      if (nb) nb.focus();
    } else if (ev.key === "t" && !typing) {
      store.setTheme(store.settings.theme === "night" ? "paper" : "night");
    } else if (ev.key === "s" && !typing) {
      store.setSpoilers(!store.settings.spoilers);
      renderCurrent();
    } else if (ev.key === "e" && !typing) {
      exportProgress();
    }
  });

  window.addEventListener("hashchange", renderCurrent);

  var spoilerToggle = document.getElementById("spoiler-toggle");
  if (spoilerToggle) {
    spoilerToggle.checked = store.settings.spoilers;
    spoilerToggle.addEventListener("change", function () {
      store.setSpoilers(spoilerToggle.checked);
      renderCurrent();
    });
  }
  var themeBtn = document.getElementById("theme-toggle");
  if (themeBtn) themeBtn.addEventListener("click", function () {
    store.setTheme(store.settings.theme === "night" ? "paper" : "night");
  });

  store.applyTheme();
  renderCurrent();
})();
