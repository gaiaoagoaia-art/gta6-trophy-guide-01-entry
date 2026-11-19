/* Filtering: kind / grade / earned / search. Pure functions over the list. */
window.GTA6_FILTERS = (function () {
  var state = { kind: "all", grade: "all", earned: "all", q: "" };

  function matches(t) {
    if (state.kind === "missable" && !t.missable) return false;
    if (state.kind === "online") return false;
    if (state.kind !== "all" && state.kind !== "missable" && t.kind !== state.kind) return false;
    if (state.grade !== "all" && t.grade !== state.grade) return false;
    if (state.earned === "earned" && !window.GTA6_STORE.isEarned(t.id)) return false;
    if (state.earned === "unearned" && window.GTA6_STORE.isEarned(t.id)) return false;
    if (state.q) {
      var hay = (t.name + " " + t.description + " " + t.guide).toLowerCase();
      if (hay.indexOf(state.q.toLowerCase()) === -1) return false;
    }
    return true;
  }

  return {
    state: state,
    apply: function () { return window.GTA6.all().filter(matches); },
    setKind: function (k) { state.kind = k; },
    setGrade: function (g) { state.grade = g; },
    setEarned: function (e) { state.earned = e; },
    setQuery: function (q) { state.q = q; },
    countByKind: function (kind) { return window.GTA6.byKind(kind).length; }
  };
})();
