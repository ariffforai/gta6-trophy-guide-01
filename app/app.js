// Leonida Legend — GTA VI trophy guide & tracker.
// Offline: the trophy list is data/trophies.json, loaded over the same origin.
// Progress lives in localStorage only; export/import move it as a JSON file.

const TROPHIES_URL = "data/trophies.json";
const STORAGE_KEY = "leonida-legend-earned-v1";
const PLATINUM_ID = 1;

const ROADMAP_STAGES = [
  { stage: 1, title: "Play the story", text: "All 21 story trophies: the four chapters, the named missions and the five character finales. Just play — they come in order." },
  { stage: 2, title: "Activities & side content", text: "27 trophies: races, shooting range, fishing, stranger strands, challenges, robberies and stunts. Retry freely — nothing here is one-time-only." },
  { stage: 3, title: "Collectibles & exploration", text: "5 trophies: card sets, WAiNK spots, exploring Leonida, discovering vehicles, buying garages. Map coverage, at your own pace." },
  { stage: 4, title: "Cleanup & platinum", text: "100% completion, then the platinum unlocks on its own. Check the stats screen for the last few percent." },
];

const KIND_LABELS = { story: "Story", activity: "Activity", collectible: "Collectible", completion: "Platinum path", online: "Online" };
const DEMO_EARNED = [2, 3, 4, 25, 29, 31, 46, 53, 54];

const params = new URLSearchParams(location.search);
const listEl = document.getElementById("trophyList");
const detailEl = document.getElementById("detailPanel");
const listMetaEl = document.getElementById("listMeta");
const emptyEl = document.getElementById("emptyState");
const onlineEl = document.getElementById("onlineNote");
const searchEl = document.getElementById("search");
const gradeEl = document.getElementById("gradeFilter");
const missableEl = document.getElementById("missableOnly");
const spoilerEl = document.getElementById("spoilerHide");

let trophies = [];
let earned = new Set();
let selectedId = 25;
let activeKind = "all";

function loadEarned() {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
    return new Set(raw.filter((id) => Number.isInteger(id)));
  } catch {
    return new Set();
  }
}

function saveEarned() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...earned].sort((a, b) => a - b)));
}

function gradeTag(grade) {
  return `<span class="tag grade-${grade}">${grade}</span>`;
}

function kindTag(kind) {
  return `<span class="tag kind-${kind}">${KIND_LABELS[kind] ?? kind}</span>`;
}

function isHidden(t) {
  return spoilerEl.checked && t.kind === "story" && !earned.has(t.id);
}

function visibleTrophies() {
  const q = searchEl.value.trim().toLowerCase();
  return trophies.filter((t) => {
    if (activeKind !== "all" && t.kind !== activeKind) return false;
    if (activeKind === "online") return false;
    if (gradeEl.value !== "all" && t.grade !== gradeEl.value) return false;
    if (missableEl.checked && !t.missable) return false;
    if (q) {
      const hay = `${t.name} ${t.description} ${t.guide}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}

function renderProgress() {
  const count = earned.size;
  document.getElementById("earnedCount").textContent = count;
  document.getElementById("progressFill").style.width = `${Math.round((count / trophies.length) * 100)}%`;
  const others = trophies.length - 1;
  const got = count - (earned.has(PLATINUM_ID) ? 1 : 0);
  document.getElementById("progressNote").textContent = earned.has(PLATINUM_ID)
    ? "Platinum earned — you are a Leonida Legend."
    : `Platinum: Vice Got a Price! — ${got} of ${others} to go`;
}

function renderList() {
  const shown = visibleTrophies();
  listEl.replaceChildren();
  emptyEl.hidden = shown.length !== 0 || activeKind === "online";
  onlineEl.hidden = activeKind !== "online";
  listMetaEl.textContent = `Showing ${shown.length} of ${trophies.length} trophies · ${earned.size} earned`;
  for (const t of shown) {
    const li = document.createElement("li");
    li.className = `trophy-row${earned.has(t.id) ? " earned" : ""}${t.id === selectedId ? " selected" : ""}`;
    const box = document.createElement("input");
    box.type = "checkbox";
    box.checked = earned.has(t.id);
    box.setAttribute("aria-label", `Mark ${t.name} earned`);
    box.addEventListener("change", () => {
      if (box.checked) earned.add(t.id);
      else earned.delete(t.id);
      saveEarned();
      renderAll();
    });
    const main = document.createElement("div");
    main.className = "trophy-main";
    if (isHidden(t)) {
      main.innerHTML = `<div class="trophy-top"><span class="trophy-name">Hidden story trophy</span></div>
        <p class="trophy-desc">A story trophy — hidden until earned. Tick it off when you earn it.</p>
        <div class="trophy-tags"><span class="tag spoiler">Spoiler hidden</span>${t.missable ? '<span class="tag missable">⚠ Missable</span>' : ""}</div>`;
    } else {
      const name = document.createElement("span");
      name.className = "trophy-name";
      name.textContent = t.name;
      const top = document.createElement("div");
      top.className = "trophy-top";
      top.append(name);
      const desc = document.createElement("p");
      desc.className = "trophy-desc";
      desc.textContent = t.description;
      const tags = document.createElement("div");
      tags.className = "trophy-tags";
      tags.innerHTML = `${gradeTag(t.grade)}${kindTag(t.kind)}${t.missable ? '<span class="tag missable">⚠ Missable</span>' : ""}`;
      main.append(top, desc, tags);
    }
    li.append(box, main);
    li.addEventListener("click", (event) => {
      if (event.target === box) return;
      selectedId = t.id;
      renderAll();
    });
    listEl.append(li);
  }
}

function renderDetail() {
  const t = trophies.find((x) => x.id === selectedId) ?? trophies[0];
  if (!t) return;
  const hidden = isHidden(t);
  const stage = ROADMAP_STAGES.find((s) => s.stage === t.roadmap);
  detailEl.innerHTML = "";
  const tags = document.createElement("div");
  tags.className = "trophy-tags";
  tags.innerHTML = `${gradeTag(t.grade)}${kindTag(t.kind)}${t.missable ? '<span class="tag missable">⚠ Missable</span>' : ""}<span class="tag">Roadmap stage ${t.roadmap}</span>`;
  const title = document.createElement("h2");
  title.textContent = hidden ? "Hidden story trophy" : t.name;
  const desc = document.createElement("p");
  desc.className = "trophy-desc";
  desc.textContent = hidden ? "This story trophy is hidden by your spoiler setting. Earn it in the game, tick it off, and its guide appears here." : t.description;
  detailEl.append(tags, title, desc);
  if (!hidden) {
    const guideHead = document.createElement("h3");
    guideHead.textContent = "Guide";
    const guide = document.createElement("p");
    guide.className = "guide";
    guide.textContent = t.guide;
    detailEl.append(guideHead, guide);
    if (t.steps?.length) {
      const stepsHead = document.createElement("h3");
      stepsHead.textContent = "Steps";
      const steps = document.createElement("ol");
      steps.className = "steps";
      for (const s of t.steps) {
        const li = document.createElement("li");
        li.textContent = s;
        steps.append(li);
      }
      detailEl.append(stepsHead, steps);
    }
    const srcHead = document.createElement("h3");
    srcHead.textContent = "Sources";
    const srcs = document.createElement("ul");
    srcs.className = "sources-list";
    for (const s of t.sources) {
      const li = document.createElement("li");
      li.textContent = s;
      srcs.append(li);
    }
    detailEl.append(srcHead, srcs);
    const note = document.createElement("div");
    note.className = t.missable ? "missable-box" : "safe-box";
    note.textContent = t.missable
      ? `⚠ Missable: ${t.missable_note}`
      : `Not missable: ${t.missable_note}`;
    detailEl.append(note);
    if (stage) {
      const road = document.createElement("p");
      road.innerHTML = `<strong>Roadmap:</strong> Stage ${stage.stage} — ${stage.title}.`;
      detailEl.append(road);
    }
  }
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = `earned-btn${earned.has(t.id) ? " earned" : ""}`;
  btn.textContent = earned.has(t.id) ? "✓ Earned — click to unmark" : "Mark as earned";
  btn.addEventListener("click", () => {
    if (earned.has(t.id)) earned.delete(t.id);
    else earned.add(t.id);
    saveEarned();
    renderAll();
  });
  detailEl.append(btn);
}

function renderRoadmap() {
  const ol = document.getElementById("roadmapStages");
  ol.replaceChildren();
  for (const s of ROADMAP_STAGES) {
    const stageTrophies = trophies.filter((t) => t.roadmap === s.stage);
    const done = stageTrophies.filter((t) => earned.has(t.id)).length;
    const li = document.createElement("li");
    const num = document.createElement("span");
    num.className = `stage-num${done === stageTrophies.length && stageTrophies.length > 0 ? " done" : ""}`;
    num.textContent = done === stageTrophies.length && stageTrophies.length > 0 ? "✓" : s.stage;
    const body = document.createElement("div");
    body.className = "stage-body";
    const strong = document.createElement("strong");
    strong.textContent = `Stage ${s.stage} — ${s.title}`;
    const p = document.createElement("p");
    p.textContent = s.text;
    const bar = document.createElement("div");
    bar.className = "stage-bar";
    const fill = document.createElement("div");
    fill.style.width = `${stageTrophies.length ? Math.round((done / stageTrophies.length) * 100) : 0}%`;
    bar.append(fill);
    const count = document.createElement("div");
    count.className = "stage-count";
    count.textContent = `${done} of ${stageTrophies.length} trophies earned`;
    body.append(strong, p, bar, count);
    li.append(num, body);
    ol.append(li);
  }
}

function renderAll() {
  renderProgress();
  renderList();
  renderDetail();
  renderRoadmap();
}

function applyParams() {
  if (params.get("demo") === "1" && !localStorage.getItem(STORAGE_KEY)) {
    earned = new Set(DEMO_EARNED);
    saveEarned();
  }
  if (params.get("kind") && KIND_LABELS[params.get("kind")]) activeKind = params.get("kind");
  if (params.get("grade")) gradeEl.value = params.get("grade");
  if (params.get("missable") === "1") missableEl.checked = true;
  if (params.get("spoiler") === "1") spoilerEl.checked = true;
  if (params.get("q")) searchEl.value = params.get("q");
  const sel = Number.parseInt(params.get("select") ?? "", 10);
  if (sel >= 1 && sel <= 55) selectedId = sel;
  document.querySelectorAll("#kindChips .chip").forEach((chip) => {
    chip.classList.toggle("active", chip.dataset.kind === activeKind);
  });
}

async function init() {
  earned = loadEarned();
  const doc = await (await fetch(TROPHIES_URL)).json();
  trophies = doc.trophies;
  applyParams();
  renderAll();
}

document.querySelectorAll("#kindChips .chip").forEach((chip) => {
  chip.addEventListener("click", () => {
    activeKind = chip.dataset.kind;
    document.querySelectorAll("#kindChips .chip").forEach((c) => c.classList.toggle("active", c === chip));
    renderAll();
  });
});
searchEl.addEventListener("input", renderAll);
gradeEl.addEventListener("change", renderAll);
missableEl.addEventListener("change", renderAll);
spoilerEl.addEventListener("change", renderAll);

document.getElementById("exportBtn").addEventListener("click", () => {
  const blob = new Blob([JSON.stringify({ game: "Grand Theft Auto VI", earned: [...earned].sort((a, b) => a - b), exportedAt: new Date().toISOString() }, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "gta6-trophy-progress.json";
  a.click();
  URL.revokeObjectURL(a.href);
});

document.getElementById("importFile").addEventListener("change", async (event) => {
  const file = event.target.files[0];
  if (!file) return;
  try {
    const data = JSON.parse(await file.text());
    const ids = Array.isArray(data) ? data : data.earned;
    const valid = new Set(ids.filter((id) => trophies.some((t) => t.id === id)));
    earned = valid;
    saveEarned();
    renderAll();
  } catch {
    alert("That file is not a valid progress export.");
  }
  event.target.value = "";
});

document.getElementById("resetBtn").addEventListener("click", () => {
  if (confirm("Clear all earned trophies?")) {
    earned = new Set();
    saveEarned();
    renderAll();
  }
});

init();
