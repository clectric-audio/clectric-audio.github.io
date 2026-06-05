/* ============================================================
   Soundings connection graph
   ------------------------------------------------------------
   A curated, hand-laid slice of the connection web that the
   Soundings app renders. Every node and edge is a real,
   defensible music-history fact. Rendered as an interactive
   SVG — no libraries, no build step.
   ============================================================ */
(function () {
  "use strict";

  var W = 1000, H = 700;
  var DOT_R = 12, HALO_R = 24;

  // kind -> CSS custom property for the dot fill
  var KIND_COLOR = {
    artist: "var(--k-artist)",
    instrument: "var(--k-instrument)",
    studio: "var(--k-studio)",
    label: "var(--k-label)",
    maker: "var(--k-maker)"
  };
  var KIND_LABEL = {
    artist: "Artist", instrument: "Instrument", studio: "Studio", label: "Label", maker: "Maker"
  };

  // ---- nodes ------------------------------------------------
  // lp = label placement ("above" | "below"), staggered to avoid collisions.
  var NODES = [
    // East Coast synthesis
    { id: "bob-moog",   label: "Bob Moog",        kind: "artist",     x: 110, y: 95,  lp: "above",
      info: "Built the Moog synthesizer and put subtractive synthesis on the map." },
    { id: "moog",       label: "Moog",            kind: "instrument", x: 215, y: 215, lp: "below",
      info: "The East Coast subtractive synth — gateway sound of a thousand records." },
    { id: "carlos",     label: "Wendy Carlos",    kind: "artist",     x: 110, y: 345, lp: "below",
      info: "Recorded the album that made the synthesizer a serious instrument.", cite: "Switched-On Bach, 1968" },
    { id: "worrell",    label: "Bernie Worrell",  kind: "artist",     x: 330, y: 120, lp: "above",
      info: "Parliament-Funkadelic's keyboardist — synth-funk that Detroit would build on." },

    // West Coast synthesis
    { id: "don-buchla", label: "Don Buchla",      kind: "artist",     x: 90,  y: 470, lp: "above",
      info: "Designed the West Coast synthesizer as a composition machine — no keyboard required." },
    { id: "buchla",     label: "Buchla",          kind: "instrument", x: 240, y: 470, lp: "below",
      info: "Gesture and voltage instead of black-and-white keys." },
    { id: "subotnick",  label: "Morton Subotnick",kind: "artist",     x: 110, y: 605, lp: "below",
      info: "Composed the first album written for a synthesizer.", cite: "Silver Apples of the Moon, 1967" },
    { id: "ciani",      label: "Suzanne Ciani",   kind: "artist",     x: 340, y: 585, lp: "above",
      info: "Made the Buchla a voice of its own across records, film, and sound design." },

    // Transistor Rhythm — the TR-808 across the scenes it touched
    { id: "kakehashi",  label: "Ikutaro Kakehashi",kind: "artist",    x: 470, y: 210, lp: "above",
      info: "Founded Roland and drove the machine that would redraw popular music." },
    { id: "kikumoto",   label: "Tadao Kikumoto",  kind: "artist",     x: 610, y: 95,  lp: "above",
      info: "Engineered the TR-808's circuitry — including that bottomless kick." },
    { id: "roland",     label: "Roland",          kind: "maker",      x: 365, y: 300, lp: "above",
      info: "The company behind the TR-808 — and much of the gear that reshaped modern music." },
    { id: "tr808",      label: "TR-808",          kind: "instrument", x: 500, y: 340, lp: "below",
      info: "The Roland TR-808 — the drum machine that flopped, got discontinued, then rewired popular music." },
    { id: "bambaataa",  label: "Afrika Bambaataa",kind: "artist",     x: 430, y: 500, lp: "below",
      info: "Turned the 808 into the future of the Bronx.", cite: "Planet Rock, 1982" },
    { id: "marvin-gaye",label: "Marvin Gaye",     kind: "artist",     x: 620, y: 500, lp: "below",
      info: "Built a comeback on an 808 drum pattern.", cite: "Sexual Healing, 1982" },

    // Machine Soul — Detroit
    { id: "derrick-may",label: "Derrick May",     kind: "artist",     x: 850, y: 110, lp: "above",
      info: "Detroit techno's bridge from funk to the future.", cite: "Strings of Life, 1987" },

    // Philly Soul
    { id: "gamble",     label: "Kenny Gamble",    kind: "artist",     x: 810, y: 330, lp: "below",
      info: "Half of Gamble & Huff — architects of the Sound of Philadelphia." },
    { id: "huff",       label: "Leon Huff",       kind: "artist",     x: 915, y: 250, lp: "above",
      info: "Keys, songwriting, and a label that defined an era." },
    { id: "phila-intl", label: "Philadelphia Int'l", kind: "label",   x: 905, y: 440, lp: "below",
      info: "Gamble & Huff's label — the imprint that made Philly soul a movement." },
    { id: "earl-young", label: "Earl Young",      kind: "artist",     x: 800, y: 540, lp: "below",
      info: "MFSB's drummer — the open hi-hat that became disco.", cite: "TSOP, 1973" },
    { id: "sigma",      label: "Sigma Sound",     kind: "studio",     x: 910, y: 620, lp: "below",
      info: "Sigma Sound Studios — where the Sound of Philadelphia was cut." },

    // Echo Chamber — Jamaican dub
    { id: "king-tubby", label: "King Tubby",      kind: "artist",     x: 230, y: 660, lp: "below",
      info: "Turned the mixing desk into an instrument and invented dub." },
    { id: "king-tubbys",label: "King Tubby's",    kind: "studio",     x: 410, y: 645, lp: "below",
      info: "King Tubby's studio — the birthplace of dub remixing." },
    { id: "augustus-pablo",label: "Augustus Pablo",kind: "artist",    x: 560, y: 600, lp: "below",
      info: "Melodica master whose dubs Tubby mixed into history.", cite: "King Tubby Meets Rockers Uptown, 1976" },
    { id: "lee-perry",  label: "Lee “Scratch” Perry", kind: "artist", x: 700, y: 660, lp: "below",
      info: "Producer-alchemist whose studio was a sound all its own." },
    { id: "black-ark",  label: "Black Ark",       kind: "studio",     x: 815, y: 650, lp: "above",
      info: "Lee Perry's studio — layered, smeared, unrepeatable." }
  ];

  // ---- edges (from -> to, relationship) ---------------------
  var EDGES = [
    ["bob-moog", "moog", "designed"],
    ["carlos", "moog", "used"],
    ["worrell", "moog", "played"],
    ["worrell", "derrick-may", "influenced"],

    ["don-buchla", "buchla", "designed"],
    ["subotnick", "buchla", "used"],
    ["ciani", "buchla", "used"],

    ["kakehashi", "roland", "founded"],
    ["roland", "tr808", "made"],
    ["kikumoto", "tr808", "designed"],
    ["bambaataa", "tr808", "used"],
    ["marvin-gaye", "tr808", "used"],

    ["gamble", "phila-intl", "founded"],
    ["huff", "phila-intl", "founded"],
    ["gamble", "sigma", "recorded at"],
    ["earl-young", "sigma", "recorded at"],
    ["earl-young", "phila-intl", "played for"],

    ["king-tubby", "king-tubbys", "founded"],
    ["augustus-pablo", "king-tubbys", "recorded at"],
    ["king-tubby", "augustus-pablo", "produced"],
    ["lee-perry", "black-ark", "founded"]
  ];

  var nodeById = {};
  NODES.forEach(function (n) { nodeById[n.id] = n; });

  var svg = document.getElementById("graph-svg");
  var graphEl = document.getElementById("graph");
  if (!svg || !graphEl) return;

  var SVGNS = "http://www.w3.org/2000/svg";
  function el(name, attrs) {
    var e = document.createElementNS(SVGNS, name);
    for (var k in attrs) { e.setAttribute(k, attrs[k]); }
    return e;
  }

  svg.setAttribute("viewBox", "0 0 " + W + " " + H);
  svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
  svg.removeAttribute("aria-hidden");
  svg.setAttribute("role", "group");
  svg.setAttribute("aria-label", "Connection graph. Select a node to trace what it touched.");

  // edges first so nodes paint on top
  var edgeEls = [];
  EDGES.forEach(function (e, i) {
    var a = nodeById[e[0]], b = nodeById[e[1]];
    if (!a || !b) return;
    var line = el("line", { x1: a.x, y1: a.y, x2: b.x, y2: b.y, class: "gedge" });
    line.dataset.from = e[0];
    line.dataset.to = e[1];
    svg.appendChild(line);
    edgeEls.push(line);
  });

  // nodes
  var nodeEls = {};
  NODES.forEach(function (n) {
    var g = el("g", { class: "gnode", tabindex: "0", role: "button" });
    g.dataset.id = n.id;
    g.setAttribute("aria-label", n.label + ", " + KIND_LABEL[n.kind] + ". Activate to see connections.");

    var halo = el("circle", { cx: n.x, cy: n.y, r: HALO_R, class: "gnode__halo" });
    halo.setAttribute("stroke", KIND_COLOR[n.kind]);
    halo.setAttribute("stroke-width", "2.5");
    g.appendChild(halo);

    var dot = el("circle", { cx: n.x, cy: n.y, r: DOT_R, class: "gnode__dot" });
    dot.setAttribute("fill", KIND_COLOR[n.kind]);
    g.appendChild(dot);

    var labelY = n.lp === "above" ? n.y - 20 : n.y + 34;
    var anchor = n.x < 90 ? "start" : (n.x > W - 90 ? "end" : "middle");
    var t = el("text", { x: n.x, y: labelY, class: "gnode__label", "text-anchor": anchor });
    t.textContent = n.label;
    g.appendChild(t);

    svg.appendChild(g);
    nodeEls[n.id] = g;
  });

  // ---- interaction (highlight only — the deep dive lives in the app) ----
  var activeId = null;

  function activate(id) {
    var n = nodeById[id];
    if (!n) return;
    activeId = id;
    graphEl.classList.add("is-active");

    var related = {};
    related[id] = true;

    edgeEls.forEach(function (line) {
      var on = line.dataset.from === id || line.dataset.to === id;
      line.classList.toggle("is-active", on);
      if (on) {
        related[line.dataset.from] = true;
        related[line.dataset.to] = true;
      }
    });
    Object.keys(nodeEls).forEach(function (nid) {
      nodeEls[nid].classList.toggle("is-related", !!related[nid]);
      nodeEls[nid].classList.toggle("is-active", nid === id);
    });
  }

  function reset() {
    activeId = null;
    graphEl.classList.remove("is-active");
    edgeEls.forEach(function (l) { l.classList.remove("is-active"); });
    Object.keys(nodeEls).forEach(function (nid) {
      nodeEls[nid].classList.remove("is-related", "is-active");
    });
  }

  Object.keys(nodeEls).forEach(function (id) {
    var g = nodeEls[id];
    g.addEventListener("click", function (ev) {
      ev.stopPropagation();
      if (activeId === id) { reset(); } else { activate(id); }
    });
    g.addEventListener("keydown", function (ev) {
      if (ev.key === "Enter" || ev.key === " ") {
        ev.preventDefault();
        if (activeId === id) { reset(); } else { activate(id); }
      }
    });
  });

  // click empty canvas to reset
  svg.addEventListener("click", function () { reset(); });

  // Default highlight: Tadao Kikumoto, nudging visitors toward the Roland TR-808.
  activate("kikumoto");
})();
