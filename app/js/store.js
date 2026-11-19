/* Progress store: localStorage only, no network. */
window.GTA6_STORE = (function () {
  var KEY = "gta6-trophy-guide-progress-v1";
  var SETTINGS_KEY = "gta6-trophy-guide-settings-v1";
  var state = { earned: {}, notes: {} };
  var settings = { theme: "paper", spoilers: false };

  function load() {
    try {
      var raw = localStorage.getItem(KEY);
      if (raw) {
        var parsed = JSON.parse(raw);
        if (parsed && typeof parsed === "object") {
          state.earned = parsed.earned || {};
          state.notes = parsed.notes || {};
        }
      }
    } catch (e) { state = { earned: {}, notes: {} }; }
    try {
      var sraw = localStorage.getItem(SETTINGS_KEY);
      if (sraw) {
        var s = JSON.parse(sraw);
        if (s && typeof s === "object") {
          if (s.theme === "night" || s.theme === "paper") settings.theme = s.theme;
          settings.spoilers = !!s.spoilers;
        }
      }
    } catch (e) { /* keep defaults */ }
  }

  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* storage full/blocked */ }
  }
  function saveSettings() {
    try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings)); } catch (e) { /* ignore */ }
  }

  function earnedCount() {
    return Object.keys(state.earned).filter(function (k) { return state.earned[k]; }).length;
  }
  function earnedByGrade(grade) {
    return window.GTA6.byGrade(grade).filter(function (t) { return state.earned[t.id]; }).length;
  }

  load();

  return {
    state: state,
    settings: settings,
    isEarned: function (id) { return !!state.earned[id]; },
    toggle: function (id) {
      state.earned[id] = !state.earned[id];
      if (!state.earned[id]) delete state.earned[id];
      save();
      return state.earned[id];
    },
    setNote: function (id, text) {
      if (text) state.notes[id] = text; else delete state.notes[id];
      save();
    },
    getNote: function (id) { return state.notes[id] || ""; },
    earnedCount: earnedCount,
    earnedByGrade: earnedByGrade,
    exportJSON: function () {
      return JSON.stringify({ app: "gta6-trophy-guide", version: 1, earned: state.earned, notes: state.notes }, null, 2);
    },
    importJSON: function (text) {
      var parsed = JSON.parse(text);
      if (!parsed || typeof parsed !== "object") throw new Error("not an object");
      state.earned = parsed.earned || {};
      state.notes = parsed.notes || {};
      save();
    },
    reset: function () {
      state.earned = {};
      state.notes = {};
      save();
    },
    applyTheme: function () {
      document.documentElement.setAttribute("data-theme", settings.theme === "night" ? "night" : "paper");
      var btn = document.getElementById("theme-toggle");
      if (btn) btn.textContent = settings.theme === "night" ? "Paper theme" : "Night theme";
    },
    setTheme: function (theme) { settings.theme = theme; saveSettings(); this.applyTheme(); },
    setSpoilers: function (on) {
      settings.spoilers = !!on;
      saveSettings();
      var box = document.getElementById("spoiler-toggle");
      if (box) box.checked = settings.spoilers;
    }
  };
})();
