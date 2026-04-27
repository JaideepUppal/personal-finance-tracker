//  username/avatar from login
(function () {
  const savedName = localStorage.getItem("pftUserName");

  if (savedName) {
    //  "Welcome, name"
    const userNameSpan = document.querySelector(".user-name");
    if (userNameSpan) {
      userNameSpan.textContent = "Welcome, " + savedName;
    }

    const avatarDiv = document.querySelector(".user-avatar");
    if (avatarDiv && savedName.length > 0) {
      avatarDiv.textContent = savedName[0].toUpperCase();
    }
  }
})();

function getMeta(name) {
  return (
    document.querySelector(`meta[name="${name}"]`)?.getAttribute("content") ||
    ""
  );
}
function getCookie(name) {
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith(name + "="))
    ?.split("=")[1];
}
function apiFetch(url, options = {}) {
  const csrfMeta = getMeta("csrf-token");
  const xsrfCookie = getCookie("XSRF-TOKEN");
  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
    ...(csrfMeta ? { "X-CSRF-TOKEN": csrfMeta } : {}),
    ...(xsrfCookie ? { "X-XSRF-TOKEN": decodeURIComponent(xsrfCookie) } : {}),
    ...(options.headers || {}),
  };
  return fetch(url, {
    method: options.method || "GET",
    body: options.body || null,
    credentials: "include",
    headers,
  });
}
// Small helper that throws on non-2xx
async function postJSON(url, body) {
  const res = await apiFetch(url, {
    method: "POST",
    body: JSON.stringify(body),
  });
  if (!res.ok)
    throw new Error(`POST ${url} failed ${res.status}: ${await res.text()}`);
  return res.json();
}
async function deleteJSON(url) {
  const res = await apiFetch(url, { method: "DELETE" });
  if (!res.ok)
    throw new Error(`DELETE ${url} failed ${res.status}: ${await res.text()}`);
  return res.json();
}

const CATEGORY_META = {
  food: { icon: "🍜", tone: "food", label: "Food" },
  rent: { icon: "🏠", tone: "rent", label: "Rent" },
  travel: { icon: "🚗", tone: "travel", label: "Travel" },
  shopping: { icon: "🛍️", tone: "shopping", label: "Shopping" },
  other: { icon: "💳", tone: "other", label: "Other" },
  "part-time": { icon: "💼", tone: "part-time", label: "Part-time" },
  allowance: { icon: "🎁", tone: "allowance", label: "Allowance" },
  stipend: { icon: "🏫", tone: "stipend", label: "Stipend" },
  scholarship: { icon: "🎓", tone: "scholarship", label: "Scholarship" },
};

function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, (char) => {
    return {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    }[char];
  });
}

function parseLocalDateInput(value) {
  const parts = String(value || "")
    .split("-")
    .map(Number);
  const [year, month, day] = parts;
  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day, 12, 0, 0, 0);
}

function dateFromAny(value) {
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? new Date() : value;
  }
  if (typeof value === "number") {
    const numericDate = new Date(value);
    return Number.isNaN(numericDate.getTime()) ? new Date() : numericDate;
  }

  const raw = String(value || "");
  const dateOnly = /^\d{4}-\d{2}-\d{2}$/.test(raw);
  const parsed = dateOnly ? parseLocalDateInput(raw) : new Date(raw || Date.now());

  if (!parsed || Number.isNaN(parsed.getTime())) return new Date();
  return parsed;
}

function isoFromDateInput(value) {
  return (parseLocalDateInput(value) || new Date()).toISOString();
}

function localDateKey(value) {
  const date = dateFromAny(value);
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
}

function isSameLocalMonth(value, reference = new Date()) {
  const date = dateFromAny(value);
  return (
    date.getFullYear() === reference.getFullYear() &&
    date.getMonth() === reference.getMonth()
  );
}

function formatShortDate(value) {
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
  }).format(dateFromAny(value));
}

function formatLongDate(value) {
  return new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(dateFromAny(value));
}

function prettyCategory(category) {
  return (category || "other")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (m) => m.toUpperCase());
}

function getCategoryMeta(category, type = "expense") {
  const normalized = (category || "other").toLowerCase();
  const meta = CATEGORY_META[normalized];
  if (meta) {
    if (type === "income" && normalized === "other") {
      return { ...meta, icon: "💰" };
    }
    return meta;
  }
  return {
    icon: type === "income" ? "💰" : "💳",
    tone: "custom",
    label: prettyCategory(normalized),
  };
}

function renderCategoryPill(category, type = "expense") {
  const meta = getCategoryMeta(category, type);
  const tone = String(meta.tone || "custom").replace(/[^a-z0-9-]/g, "");
  return `<span class="category-pill cat-${tone}"><span class="category-dot" aria-hidden="true"></span>${escapeHtml(meta.label)}</span>`;
}

//  Sidebar navigation logic (same as before)
//  Sidebar navigation logic with tab memory
const navItems = document.querySelectorAll(".nav-item");
const sections = document.querySelectorAll(".content-section");

function activateSection(sectionId) {
  navItems.forEach((nav) => {
    nav.classList.toggle(
      "active",
      nav.getAttribute("data-section") === sectionId
    );
  });

  // update content panels
  sections.forEach((sec) => {
    sec.classList.toggle("active", sec.id === sectionId);
  });
}

// click handler: change tab + remember it
navItems.forEach((item) => {
  item.addEventListener("click", function () {
    const sectionId = this.getAttribute("data-section");
    localStorage.setItem("pftActiveSection", sectionId);
    activateSection(sectionId);
  });
});

// on page load: restore last active tab (fallback = dashboard)
const savedSection = localStorage.getItem("pftActiveSection");
if (savedSection && document.getElementById(savedSection)) {
  activateSection(savedSection);
} else {
  // if nothing saved, keep whatever is already active in HTML
  const defaultNav = document.querySelector(".nav-item.active");
  if (defaultNav) {
    const sectionId = defaultNav.getAttribute("data-section");
    activateSection(sectionId);
  }
}

//  Expenses Tracking(add/search/delete + total + sorting)
(function () {
  const list = document.getElementById("expenseList");
  const totalEl = document.getElementById("expTotal");
  const addBtn = document.getElementById("expAddBtn");
  const titleEl = document.getElementById("expTitle");
  const amtEl = document.getElementById("expAmount");
  const catEl = document.getElementById("expCategory");
  const searchEl = document.getElementById("expSearch");
  const sortEl = document.getElementById("expSort");
  const errorEl = document.getElementById("amountError");

  const incAmount = document.getElementById("incAmount");

  amtEl.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      const value = parseFloat(amtEl.value);

      if (value < 0) {
        document.getElementById("expAmountError").style.display = "block";
      } else {
        document.getElementById("expAmountError").style.display = "none";
      }
    }
  });

  // Hook up "Custom..." category control + recurring
  const dateEl = document.getElementById("expDate");
  const recurEl = document.getElementById("expRecurring");
  const catCustomEl = document.getElementById("expCategoryCustom");

  if (!list || !totalEl) return;

  if (catEl) {
    catEl.addEventListener("change", () => {
      if (catEl.value === "__custom__") {
        catCustomEl.style.display = "inline-block";
        catCustomEl.focus();
      } else {
        catCustomEl.style.display = "none";
        catCustomEl.value = "";
      }
    });
  }

  function yen(n) {
    return "¥" + Number(n).toLocaleString();
  }

  function recalcTotal() {
    let sum = 0;
    list.querySelectorAll(".expense-item").forEach((it) => {
      const v = Number(it.dataset.amount || 0);
      if (it.style.display !== "none") sum += v;
    });
    totalEl.textContent = "-" + yen(sum);
  }

  function addItem(title, amount, category, isoDateOptional) {
    const item = document.createElement("div");
    item.className = "expense-item";
    item.dataset.category = category;
    item.dataset.amount = amount;

    // Save the timestamp so charts can show real dates
    const now = isoDateOptional ? dateFromAny(isoDateOptional) : new Date();
    item.dataset.date = now.toISOString();

    const meta = getCategoryMeta(category, "expense");
    const safeTitle = escapeHtml(title || "Untitled");
    const safeLabel = escapeHtml(meta.label);
    const safeIcon = escapeHtml(meta.icon);

    // Short visible date for the row (e.g., "Sep 25")
    const display = formatShortDate(now);

    item.innerHTML = `
    <div class="expense-info">
      <div class="expense-icon">${safeIcon}</div>
      <div class="expense-details">
        <h4>${safeTitle}</h4>
        <p>${display} · ${safeLabel}</p>
        ${renderCategoryPill(category, "expense")}
      </div>
    </div>
    <div class="expense-amount negative">-${yen(amount)}</div>
    <button class="tiny-del" aria-label="delete">×</button>
  `;

    // UX: newest added row appears on top
    list.prepend(item);
    return item;
  }

  // Used by the initial loader that reads /api/transactions
  window.__expAddItem = (title, amount, category, isoDate, id) => {
    const row = addItem(title, amount, category, isoDate);
    if (row) {
      if (id != null) row.dataset.id = id;
      if (isoDate) row.dataset.date = dateFromAny(isoDate).toISOString();
    }
  };

  //  Sorting (Default / Newest / Oldest / High-Low / Low-High)
  function applySort() {
    if (!sortEl) return;

    const mode = sortEl.value || "default";
    const items = Array.from(list.querySelectorAll(".expense-item"));

    items.sort((a, b) => {
      const amountA = Number(a.dataset.amount || 0);
      const amountB = Number(b.dataset.amount || 0);
      const dateA = dateFromAny(a.dataset.date || 0);
      const dateB = dateFromAny(b.dataset.date || 0);
      const idA = Number(a.dataset.id || 0);
      const idB = Number(b.dataset.id || 0);

      switch (mode) {
        case "amount_desc":
          return amountB - amountA; // High → Low
        case "amount_asc":
          return amountA - amountB; // Low → High
        case "date_asc":
          return dateA - dateB; // Oldest → Newest
        case "date_desc":
          return dateB - dateA; // Newest → Oldest
        case "default":
        default:
          // DEFAULT: order it was inputted in DB
          // (assumes auto-increment ID; later inserts have bigger id)
          return idB - idA; // highest id (last added) on top
      }
    });

    items.forEach((it) => list.appendChild(it));
  }

  sortEl?.addEventListener("change", () => {
    applySort();
    recalcTotal();
    document.dispatchEvent(new Event("expenses:changed"));
  });

  // Add (save EXPENSE to backend, then draw)
  addBtn?.addEventListener("click", async () => {
    const title = (titleEl.value || "Untitled").trim();
    const amt = Number(amtEl.value);
    let cat = (catEl.value || "other").toLowerCase();

    if (cat === "__custom__") {
      const c = (catCustomEl.value || "").trim().toLowerCase();
      if (c) cat = c.replace(/\s+/g, "-");
    }
    if (!amt || amt <= 0) return;

    // Build ISO; use expDate if provided
    const iso = dateEl?.value ? isoFromDateInput(dateEl.value) : new Date().toISOString();

    try {
      // Save to backend
      const saved = await postJSON("/api/transactions", {
        type: "expense",
        title,
        amount: amt,
        category: cat,
        occurred_at: iso,
        date: iso,
      });

      // Render the row
      const row = addItem(
        saved.title,
        Number(saved.amount),
        (saved.category || "other").toLowerCase(),
        saved.date || iso
      );
      if (row) {
        row.dataset.id = saved.id;
        row.dataset.date = dateFromAny(saved.date || iso).toISOString();
      }

      // If checked as recurring, persist as a monthly bill “template”
      // If checked as recurring, persist as a monthly bill in the DB
      if (recurEl?.checked) {
        const due = dateEl?.value
          ? parseLocalDateInput(dateEl.value) || new Date()
          : new Date();
        const dueDay = due.getDate(); // monthly repeat on this day

        try {
          await postJSON("/api/bills", {
            title,
            category: cat,
            amount: amt,
            due_day: dueDay,
            frequency: "monthly",
          });
        } catch (err) {
          console.error("Failed to save bill:", err);
        }
      }

      // Cleanup form
      titleEl.value = "";
      amtEl.value = "";
      if (dateEl) dateEl.value = "";
      if (catEl) catEl.value = "food";
      if (catCustomEl) {
        catCustomEl.value = "";
        catCustomEl.style.display = "none";
      }
      if (recurEl) recurEl.checked = false;

      recalcTotal();
      document.dispatchEvent(new Event("expenses:changed"));

      if (sortEl) {
        applySort();
        document.dispatchEvent(new Event("expenses:changed"));
      }
    } catch (e) {
      console.error(e);
      alert("Failed to add expense.");
    }
  });

  // Delete (call backend if the row has an id)
  list.addEventListener("click", async (e) => {
    if (!e.target.classList.contains("tiny-del")) return;
    const row = e.target.closest(".expense-item");
    const id = row?.dataset.id;
    if (!row) return;

    try {
      if (id) {
        await deleteJSON(`/api/transactions/${id}`);
      }
      row.remove();
      recalcTotal();
      if (sortEl) applySort();
      document.dispatchEvent(new Event("expenses:changed"));
    } catch (err) {
      console.error(err);
      alert("Failed to delete expense.");
    }
  });

  // Search filter
  function applySearch() {
    const q = (searchEl.value || "").toLowerCase();
    list.querySelectorAll(".expense-item").forEach((it) => {
      const text = it.innerText.toLowerCase();
      it.style.display = text.includes(q) ? "flex" : "none";
    });
    recalcTotal();
    document.dispatchEvent(new Event("expenses:changed"));
  }
  searchEl?.addEventListener("input", applySearch);

  // initial total (no sorting; whatever order backend rendered is shown)
  recalcTotal();
  document.dispatchEvent(new Event("expenses:changed"));
})();

//  Expense charts (auto from visible list, dynamic categories)
(function () {
  const list = document.getElementById("expenseList");
  const lineEl = document.getElementById("expLineChart");
  const pieEl = document.getElementById("expPieChart");
  if (!list || !lineEl || !pieEl || typeof Chart === "undefined") return;

  const lineChart = new Chart(lineEl.getContext("2d"), {
    type: "line",
    data: {
      labels: [],
      datasets: [
        {
          label: "Recent Expenses",
          data: [],
          borderColor: "#6fd36f",
          backgroundColor: "rgba(111,211,111,.12)",
          tension: 0.35,
          fill: true,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { labels: { color: "#e2e3e9" } } },
      scales: {
        x: { ticks: { color: "#c3c4cc" } },
        y: { ticks: { color: "#c3c4cc" }, beginAtZero: true },
      },
    },
  });

  const pieChart = new Chart(pieEl.getContext("2d"), {
    type: "pie",
    data: { labels: [], datasets: [{ data: [], borderWidth: 0 }] },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      aspectRatio: 1,
      plugins: { legend: { labels: { color: "#e2e3e9" } } },
    },
  });

  function getVisibleItems() {
    return Array.from(list.querySelectorAll(".expense-item")).filter(
      (it) => it.style.display !== "none"
    );
  }
  const pretty = (s) =>
    (s || "other").replace(/-/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());
  const short = (iso) => formatShortDate(iso);

  function redrawCharts() {
    const items = getVisibleItems();
    const last7 = items.slice(0, 7);

    // Line
    const amounts = last7.map((it) => Number(it.dataset.amount || 0)).reverse();
    const labels = last7
      .map((it) => short(it.dataset.date || new Date().toISOString()))
      .reverse();
    lineChart.data.labels = labels;
    lineChart.data.datasets[0].data = amounts;
    lineChart.update();

    // Pie: compute totals per category (dynamic)
    const totals = {};
    items.forEach((it) => {
      const k = (it.dataset.category || "other").toLowerCase();
      totals[k] = (totals[k] || 0) + Number(it.dataset.amount || 0);
    });

    // Sort by biggest; show all (or top N if you prefer)
    const entries = Object.entries(totals).sort((a, b) => b[1] - a[1]);
    pieChart.data.labels = entries.map(([k]) => pretty(k));
    pieChart.data.datasets[0].data = entries.map(([, v]) => v);

    // Give the slices colors (otherwise it looks black on dark bg)
    const palette = [
      "#7DF1A4",
      "#57B1FF",
      "#FFB27A",
      "#FF8A8A",
      "#BFC6FF",
      "#E3D26F",
      "#9AE6B4",
      "#F7C3FF",
      "#85E3FF",
      "#6FD36F",
    ];

    pieChart.data.datasets[0].backgroundColor = pieChart.data.labels.map(
      (_, i) => palette[i % palette.length]
    );

    pieChart.data.datasets[0].borderColor = "rgba(255,255,255,.06)";
    pieChart.data.datasets[0].borderWidth = 2;

    pieChart.update();
  }

  document.addEventListener("expenses:changed", redrawCharts);
  redrawCharts();
})();

//  Income Tracking (add/search/delete + total + charts)
(function () {
  const list = document.getElementById("incomeList");
  const totalEl = document.getElementById("incTotal");
  const addBtn = document.getElementById("incAddBtn");
  const titleEl = document.getElementById("incTitle");
  const amtEl = document.getElementById("incAmount");
  const catEl = document.getElementById("incCategory");
  const dateEl = document.getElementById("incDate");
  const searchEl = document.getElementById("incSearch");
  const catCustomEl = document.getElementById("incCategoryCustom");

  if (!list || !totalEl) return;

  // Show / hide custom category input
  if (catEl && catCustomEl) {
    catEl.addEventListener("change", () => {
      if (catEl.value === "__custom__") {
        catCustomEl.style.display = "inline-block";
        catCustomEl.focus();
      } else {
        catCustomEl.style.display = "none";
        catCustomEl.value = "";
      }
    });
  }

  function yen(n) {
    return "¥" + Number(n).toLocaleString();
  }

  function recalcTotal() {
    let sum = 0;
    list.querySelectorAll(".expense-item").forEach((it) => {
      if (it.style.display !== "none") sum += Number(it.dataset.amount || 0);
    });
    totalEl.textContent = yen(sum);
  }

  function addItem(title, amount, category, isoDate) {
    const item = document.createElement("div");
    item.className = "expense-item"; // reuse styles
    item.dataset.category = category;
    item.dataset.amount = amount;
    item.dataset.date = dateFromAny(isoDate).toISOString();
    const meta = getCategoryMeta(category, "income");
    const safeTitle = escapeHtml(title || "Untitled");
    const safeLabel = escapeHtml(meta.label);
    const safeIcon = escapeHtml(meta.icon);

    const display = formatShortDate(isoDate);

    item.innerHTML = `
      <div class="expense-info">
        <div class="expense-icon">${safeIcon}</div>
        <div class="expense-details">
          <h4>${safeTitle}</h4>
          <p>${display} · ${safeLabel}</p>
          ${renderCategoryPill(category, "income")}
        </div>
      </div>
      <div class="income-amount positive">+${yen(amount)}</div>
      <button class="tiny-del" aria-label="delete">×</button>
    `;
    list.prepend(item);
    return item;
  }

  window.__incAddItem = (title, amount, category, isoDate, id) => {
    addItem(title, amount, category, isoDate);
    const row = document.getElementById("incomeList")?.firstElementChild;
    if (row) {
      row.dataset.id = id;
      row.dataset.date = dateFromAny(isoDate).toISOString();
    }
  };

  // Add income (supports Custom...)
  addBtn?.addEventListener("click", async () => {
    const title = (titleEl.value || "Untitled").trim();
    const amt = Number(amtEl.value);
    let cat = (catEl.value || "other").toLowerCase();

    if (cat === "__custom__") {
      const c = (catCustomEl?.value || "").trim().toLowerCase();
      if (c) cat = c.replace(/\s+/g, "-");
    }

    if (!amt || amt <= 0) return;

    const iso = dateEl.value ? isoFromDateInput(dateEl.value) : new Date().toISOString();

    try {
      const saved = await postJSON("/api/transactions", {
        type: "income",
        title,
        amount: amt,
        category: cat,
        occurred_at: iso,
        date: iso,
      });

      addItem(
        saved.title,
        Number(saved.amount),
        (saved.category || "other").toLowerCase(),
        saved.date || iso
      );
      const first = list.querySelector(".expense-item");
      if (first) {
        first.dataset.id = saved.id;
        first.dataset.date = dateFromAny(saved.date || iso).toISOString();
      }

      // reset form
      titleEl.value = "";
      amtEl.value = "";
      dateEl.value = "";
      catEl.value = "part-time";
      if (catCustomEl) {
        catCustomEl.value = "";
        catCustomEl.style.display = "none";
      }

      recalcTotal();
      document.dispatchEvent(new Event("incomes:changed"));
    } catch (e) {
      console.error(e);
      alert("Failed to add income.");
    }
  });

  // Delete
  list.addEventListener("click", async (e) => {
    if (!e.target.classList.contains("tiny-del")) return;
    const row = e.target.closest(".expense-item");
    const id = row?.dataset.id;
    if (!row) return;

    try {
      if (id) {
        await deleteJSON(`/api/transactions/${id}`);
      }
      row.remove();
      recalcTotal();
      document.dispatchEvent(new Event("incomes:changed"));
    } catch (err) {
      console.error(err);
      alert("Failed to delete income.");
    }
  });

  // Search
  function applySearch() {
    const q = (searchEl.value || "").toLowerCase();
    list.querySelectorAll(".expense-item").forEach((it) => {
      const text = it.innerText.toLowerCase();
      it.style.display = text.includes(q) ? "flex" : "none";
    });
    recalcTotal();
    document.dispatchEvent(new Event("incomes:changed"));
  }
  searchEl?.addEventListener("input", applySearch);

  // Charts
  const lineEl = document.getElementById("incLineChart");
  const pieEl = document.getElementById("incPieChart");
  if (lineEl && pieEl && typeof Chart !== "undefined") {
    const lineChart = new Chart(lineEl.getContext("2d"), {
      type: "line",
      data: {
        labels: [],
        datasets: [
          {
            label: "Recent Income",
            data: [],
            borderColor: "#6fd36f",
            backgroundColor: "rgba(111,211,111,.12)",
            tension: 0.35,
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { labels: { color: "#e2e3e9" } } },
        scales: {
          x: { ticks: { color: "#c3c4cc" } },
          y: { ticks: { color: "#c3c4cc" }, beginAtZero: true },
        },
      },
    });

    // Pie chart with dynamic categories (custom gets its own color)
    const pieChart = new Chart(pieEl.getContext("2d"), {
      type: "pie",
      data: { labels: [], datasets: [{ data: [], borderWidth: 0 }] },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        aspectRatio: 1,
        plugins: { legend: { labels: { color: "#e2e3e9" } } },
      },
    });

    const short = (iso) => formatShortDate(iso);

    const pretty = (s) =>
      (s || "other")
        .replace(/-/g, " ")
        .replace(/\b\w/g, (m) => m.toUpperCase());

    function getVisible() {
      return [...list.querySelectorAll(".expense-item")].filter(
        (it) => it.style.display !== "none"
      );
    }

    function redraw() {
      const items = getVisible();
      const last7 = items.slice(0, 7);

      const amounts = last7
        .map((it) => Number(it.dataset.amount || 0))
        .reverse();
      const labels = last7
        .map((it, i) => {
          const iso = it.dataset.date || new Date().toISOString();
          return short(iso);
        })
        .reverse();

      lineChart.data.labels = labels;
      lineChart.data.datasets[0].data = amounts;
      lineChart.update();

      //  Pie chart (one slice per category, including customs)
      const totals = {};
      items.forEach((it) => {
        const k = (it.dataset.category || "other").toLowerCase();
        totals[k] = (totals[k] || 0) + Number(it.dataset.amount || 0);
      });

      const entries = Object.entries(totals).sort((a, b) => b[1] - a[1]);
      const pieLabels = entries.map(([k]) => pretty(k));
      const pieData = entries.map(([, v]) => v);

      // Base colors for standard categories
      const baseColorMap = {
        "Part-time": "#6fd36f",
        Allowance: "#4da3ff",
        Stipend: "#ffc857",
        Scholarship: "#9b8cff",
        Other: "#5dd3c3",
      };

      // Extra palette for any custom categories
      const extraPalette = [
        "#FF8A8A",
        "#BFC6FF",
        "#E3D26F",
        "#F7C3FF",
        "#85E3FF",
        "#9AE6B4",
        "#FBB6CE",
        "#A5F3FC",
      ];

      const colors = pieLabels.map((label, i) => {
        if (baseColorMap[label]) return baseColorMap[label];
        // custom category → take from extraPalette
        return extraPalette[i % extraPalette.length];
      });

      pieChart.data.labels = pieLabels;
      pieChart.data.datasets[0].data = pieData;
      pieChart.data.datasets[0].backgroundColor = colors;
      pieChart.data.datasets[0].borderColor = "rgba(255,255,255,.06)";
      pieChart.data.datasets[0].borderWidth = 2;
      pieChart.update();
    }

    document.addEventListener("incomes:changed", redraw);
    recalcTotal();
    redraw();
  } else {
    recalcTotal();
  }
})();

/*  Initial load from server  */
async function loadTransactionsOnce() {
  try {
    const res = await apiFetch("/api/transactions");
    if (!res.ok) throw new Error(`GET /api/transactions ${res.status}`);
    const rows = await res.json();

    // Expense list DOM
    const expList = document.getElementById("expenseList");
    const incList = document.getElementById("incomeList");

    rows.forEach((r) => {
      const type = (r.type || "").toLowerCase();
      const cat = (r.category || "other").toLowerCase();
      const amt = Number(r.amount || 0);

      const iso =
        r.date ||
        r.occurred_at ||
        r.created_at ||
        r.updated_at ||
        new Date().toISOString();

      if (type === "expense" && expList) {
        window.__expAddItem?.(r.title || "Expense", amt, cat, iso, r.id);
      }
      if (type === "income" && incList) {
        window.__incAddItem?.(r.title || "Income", amt, cat, iso, r.id);
      }
    });

    const sortEl = document.getElementById("expSort");
    if (expList && sortEl) {
      // make sure dropdown shows Default
      sortEl.value = "default";

      const items = Array.from(expList.querySelectorAll(".expense-item"));
      items
        .sort((a, b) => {
          const idA = Number(a.dataset.id || 0);
          const idB = Number(b.dataset.id || 0);
          // same logic as applySort() default case: highest id (latest) on top
          return idB - idA;
        })
        .forEach((it) => expList.appendChild(it));
    }

    // Trigger recalcs
    document.dispatchEvent(new Event("expenses:changed"));
    document.dispatchEvent(new Event("incomes:changed"));
  } catch (e) {
    console.error("Failed to load transactions:", e);
  }
}
document.addEventListener("DOMContentLoaded", async () => {
  await fetch("/sanctum/csrf-cookie", {
    method: "GET",
    credentials: "include",
  });

  //  load data
  loadTransactionsOnce();
});

(function () {
  const listEl = document.getElementById("budgetList");
  const addBtn = document.getElementById("budAddBtn");
  const catEl = document.getElementById("budCategory");
  const amtEl = document.getElementById("budAmount");
  const totalLim = document.getElementById("budTotalLimit");
  const totalSpd = document.getElementById("budTotalSpent");
  const totalRem = document.getElementById("budTotalRemain");
  const catCustomEl = document.getElementById("budCategoryCustom");
  if (!listEl || !addBtn) return;

  // Show / hide custom budget category
  if (catEl && catCustomEl) {
    catEl.addEventListener("change", () => {
      if (catEl.value === "__custom__") {
        catCustomEl.style.display = "inline-block";
        catCustomEl.focus();
      } else {
        catCustomEl.style.display = "none";
        catCustomEl.value = "";
      }
    });
  }

  // Storage keys are per-month (YYYY-MM)
  const monthKey = () => {
    const d = new Date();
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0");
  };
  const LS_KEY = (mk = monthKey()) => "pft_budgets_" + mk;

  function loadBudgets() {
    try {
      return JSON.parse(localStorage.getItem(LS_KEY()) || "{}");
    } catch {
      return {};
    }
  }
  function saveBudgets(b) {
    localStorage.setItem(LS_KEY(), JSON.stringify(b || {}));
  }

  function yen(n) {
    return "¥" + Number(n).toLocaleString();
  }
  function currentMonthISO(iso) {
    const d = iso ? dateFromAny(iso) : new Date();
    const now = new Date();
    return (
      d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth()
    );
  }

  // now dynamic per-category spent (works for custom categories)
  function spentByCategory() {
    const out = {};
    const items = document.querySelectorAll("#expenseList .expense-item");
    items.forEach((it) => {
      const cat = (it.dataset.category || "other").toLowerCase();
      const amt = Number(it.dataset.amount || 0);
      const iso = it.dataset.date;
      if (!currentMonthISO(iso)) return;
      out[cat] = (out[cat] || 0) + amt;
    });
    return out;
  }

  function render() {
    const budgets = loadBudgets();
    const spent = spentByCategory();

    listEl.innerHTML = "";
    let tLimit = 0,
      tSpent = 0;

    Object.keys(budgets).forEach((cat) => {
      const limit = Number(budgets[cat] || 0);
      const useCat = cat.toLowerCase();
      const used = Number(spent[useCat] || 0);
      const remain = Math.max(limit - used, 0);

      tLimit += limit;
      tSpent += Math.min(used, limit);

      const pct =
        limit > 0 ? Math.min(100, Math.round((used / limit) * 100)) : 0;
      const prettyCat = useCat.charAt(0).toUpperCase() + useCat.slice(1);
      const safeCat = escapeHtml(prettyCat.replace(/-/g, " "));
      const safeCatKey = escapeHtml(useCat);

      const card = document.createElement("div");
      card.className = "budget-card";
      card.innerHTML = `
        <div class="bud-top-row">
          <div class="bud-cat-name">${safeCat}</div>
          <button class="tiny-del-ghost bud-remove-btn" data-del="${safeCatKey}">
            Remove
          </button>
        </div>

        <div class="bud-numbers-row">
          <span>Limit: ${yen(limit)}</span>
          <span>Spent: -${yen(used)}</span>
          <span>Remaining: ${remain === 0 ? "¥0" : yen(remain)}</span>
        </div>

        <div class="bud-progress-container">
          <div class="bud-progress ${
            pct >= 90 ? "danger" : pct >= 70 ? "warn" : ""
          }">
            <span style="width:${pct}%"></span>
          </div>
          <div class="bud-percent-text">${pct}% of limit</div>
        </div>
      `;
      listEl.appendChild(card);
    });

    totalLim.textContent = "Budget: " + yen(tLimit);
    totalSpd.textContent = "Spent: -" + yen(tSpent);
    totalRem.textContent = "Left: " + yen(Math.max(tLimit - tSpent, 0));
  }

  // Add / update limit (supports Custom...)
  addBtn.addEventListener("click", () => {
    let cat = (catEl.value || "other").toLowerCase();
    const amt = Number(amtEl.value);
    if (!amt || amt <= 0) return;

    if (cat === "__custom__") {
      const c = (catCustomEl?.value || "").trim().toLowerCase();
      if (c) cat = c.replace(/\s+/g, "-");
    }

    const payload = {
      category: cat,
      limit_amount: Number(amt),
      month: monthKey(), // 'YYYY-MM'
    };

    apiFetch("/api/budgets", {
      method: "POST",
      body: JSON.stringify(payload),
    })
      .then((r) => (r.ok ? r.json() : Promise.reject(r)))
      .catch((err) => console.warn("Budget save (server) failed:", err))
      .finally(() => {
        const data = loadBudgets();
        data[cat] = amt; // add or update
        saveBudgets(data);
        amtEl.value = "";
        catEl.value = "food";
        if (catCustomEl) {
          catCustomEl.value = "";
          catCustomEl.style.display = "none";
        }
        render();
      });
  });

  // Remove a category
  document.addEventListener("click", (e) => {
    if (e.target.matches(".tiny-del-ghost")) {
      const cat = e.target.getAttribute("data-del");
      const data = loadBudgets();
      delete data[cat];
      saveBudgets(data);
      render();
    }
  });

  document.addEventListener("expenses:changed", render);
  render();
})();

//  Analytics
(function () {
  const spendLineEl = document.getElementById("anSpendLine");
  const monthBarEl = document.getElementById("anMonthBar");
  const catBarsEl = document.getElementById("anCatBars");
  const savePctEl = document.getElementById("anSavingsPct");
  const saveTxtEl = document.getElementById("anSavingsText");
  const savePillEl = document.getElementById("anSavingsPill");
  if (!spendLineEl || !monthBarEl || !catBarsEl) return;

  const DAY_MS = 86400000;
  const cats = ["food", "rent", "travel", "shopping", "other"];

  function yen(n) {
    return "¥" + Number(n).toLocaleString();
  }
  function short(iso) {
    return formatShortDate(iso);
  }
  function isThisMonth(iso) {
    const d = dateFromAny(iso || Date.now());
    const now = new Date();
    return (
      d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth()
    );
  }

  function getExpenseItems() {
    return [...document.querySelectorAll("#expenseList .expense-item")];
  }
  function getIncomeItems() {
    return [...document.querySelectorAll("#incomeList .expense-item")];
  }

  //  Data aggregation
  function lastNDays(n) {
    const out = [];
    const now = new Date();
    for (let i = n - 1; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth(), now.getDate()); // midnight today
      d.setDate(d.getDate() - i);
      const key = localDateKey(d);
      out.push({ key, label: short(d), total: 0 });
    }
    return out;
  }

  function spendingSeries(days = 14) {
    const buckets = lastNDays(days);
    const map = Object.fromEntries(buckets.map((b) => [b.key, b]));
    getExpenseItems().forEach((it) => {
      const iso = it.dataset.date || new Date().toISOString();
      const key = localDateKey(iso);
      if (map[key]) map[key].total += Number(it.dataset.amount || 0);
    });
    return buckets;
  }

  function categoryTotalsThisMonth() {
    const totals = { food: 0, rent: 0, travel: 0, shopping: 0, other: 0 };
    getExpenseItems().forEach((it) => {
      const iso = it.dataset.date;
      if (!isThisMonth(iso)) return;
      const c = (it.dataset.category || "other").toLowerCase();
      totals[cats.includes(c) ? c : "other"] += Number(it.dataset.amount || 0);
    });
    return totals;
  }

  function monthIncomeExpense() {
    let inc = 0,
      exp = 0;
    getIncomeItems().forEach((it) => {
      const iso = it.dataset.date;
      if (isThisMonth(iso)) inc += Number(it.dataset.amount || 0);
    });
    getExpenseItems().forEach((it) => {
      const iso = it.dataset.date;
      if (isThisMonth(iso)) exp += Number(it.dataset.amount || 0);
    });
    return { inc, exp };
  }

  //  Charts
  const spendLine = new Chart(spendLineEl.getContext("2d"), {
    type: "line",
    data: {
      labels: [],
      datasets: [
        {
          label: "Daily spend",
          data: [],
          borderColor: "#6fd36f",
          backgroundColor: "rgba(111,211,111,.12)",
          tension: 0.35,
          fill: true,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { labels: { color: "#e2e3e9" } } },
      scales: {
        x: { ticks: { color: "#c3c4cc" } },
        y: { ticks: { color: "#c3c4cc" }, beginAtZero: true },
      },
    },
  });

  const monthBar = new Chart(monthBarEl.getContext("2d"), {
    type: "bar",
    data: {
      labels: ["Income", "Expenses"],
      datasets: [
        {
          data: [0, 0],
          backgroundColor: ["#6fd36f", "#ff6b6b"],
          borderWidth: 0,
          borderRadius: 8,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { ticks: { color: "#c3c4cc" } },
        y: { ticks: { color: "#c3c4cc" }, beginAtZero: true },
      },
    },
  });

  function drawCatBars(totals) {
    catBarsEl.innerHTML = "";
    const max = Math.max(1, ...cats.map((c) => totals[c] || 0));
    cats.forEach((c) => {
      const val = totals[c] || 0;
      const row = document.createElement("div");
      row.className = "cat-row";
      row.innerHTML = `
        <div class="cat-name">${escapeHtml(c)}</div>
        <div class="cat-bar"><span style="width:${Math.round(
          (val / max) * 100
        )}%"></span></div>
        <div class="cat-amt">-${yen(val)}</div>
      `;
      catBarsEl.appendChild(row);
    });
  }

  function redraw() {
    // Spending trend
    const series = spendingSeries(14);
    spendLine.data.labels = series.map((b) => b.label);
    spendLine.data.datasets[0].data = series.map((b) => b.total);
    spendLine.update();

    // Category bars
    const totals = categoryTotalsThisMonth();
    drawCatBars(totals);

    // Month bar + savings
    const { inc, exp } = monthIncomeExpense();
    monthBar.data.datasets[0].data = [inc, exp];
    monthBar.update();

    const save = Math.max(0, inc - exp);
    const pct = inc > 0 ? Math.round((save / inc) * 100) : 0;
    savePctEl.textContent = `${pct}%`;
    saveTxtEl.textContent = `${yen(save)} saved out of ${yen(inc)} income`;
    savePillEl.textContent =
      pct >= 50
        ? "Nice! Solid savings."
        : pct >= 20
        ? "Good start."
        : "Let’s grow this.";
  }

  // Redraw when data changes
  document.addEventListener("expenses:changed", redraw);
  document.addEventListener("incomes:changed", redraw);

  // Initial
  redraw();
})();

//CHANGES TO THE DASHBOARD,SYNCING TO THE OTHER TABS
//  Dashboard (sync with other tabs + yen)
(function () {
  const incomeEl = document.getElementById("dashTotalIncome");
  const expenseEl = document.getElementById("dashTotalExpenses");
  const balanceEl = document.getElementById("dashBalance");
  const savingsEl = document.getElementById("dashSavings");
  const incChangeEl = document.getElementById("dashIncomeChange");
  const expChangeEl = document.getElementById("dashExpenseChange");
  const balChangeEl = document.getElementById("dashBalanceChange");
  const savNoteEl = document.getElementById("dashSavingsNote");

  const recentWrap = document.getElementById("dashRecentExpenses");
  const billWrap = document.getElementById("dashBillList");

  if (!incomeEl || !recentWrap || !billWrap) return;

  const cats = ["food", "rent", "travel", "shopping", "other"];
  const DAY_MS = 86400000;

  // Utils
  const yen = (n) => "¥" + Number(n || 0).toLocaleString();
  const thisMonth = (d) => {
    const x = dateFromAny(d || Date.now());
    const now = new Date();
    return (
      x.getFullYear() === now.getFullYear() && x.getMonth() === now.getMonth()
    );
  };
  const fmtShort = (d) => formatShortDate(d);

  function getExpenseItems() {
    return [...document.querySelectorAll("#expenseList .expense-item")];
  }
  function getIncomeItems() {
    return [...document.querySelectorAll("#incomeList .expense-item")];
  }

  // Simple month-to-date vs last-month-to-date % change helper
  function monthToDateTotals(getter) {
    const now = new Date();
    const mtdEnd = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      23,
      59,
      59
    );
    const mtdStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastStart = new Date(
      lastMonth.getFullYear(),
      lastMonth.getMonth(),
      1
    );
    const lastEnd = new Date(
      lastMonth.getFullYear(),
      lastMonth.getMonth(),
      now.getDate(),
      23,
      59,
      59
    );

    const sumRange = (items, selector) =>
      items.reduce((acc, it) => {
        const iso = it.dataset.date || new Date().toISOString();
        const d = dateFromAny(iso);
        if (d >= selector.start && d <= selector.end) {
          acc += Number(it.dataset.amount || 0);
        }
        return acc;
      }, 0);

    const items = getter();
    return {
      cur: sumRange(items, { start: mtdStart, end: mtdEnd }),
      prev: sumRange(items, { start: lastStart, end: lastEnd }),
    };
  }

  function pctChange(cur, prev) {
    if (!prev) return "—";
    const diff = ((cur - prev) / prev) * 100;
    const arrow = diff >= 0 ? "↑" : "↓";
    return `${arrow} ${Math.abs(Math.round(diff))}% vs last MTD`;
  }

  function renderSummary() {
    // income/expense month totals
    const income = getIncomeItems().reduce((s, it) => {
      const iso = it.dataset.date;
      return thisMonth(iso) ? s + Number(it.dataset.amount || 0) : s;
    }, 0);

    const expenses = getExpenseItems().reduce((s, it) => {
      const iso = it.dataset.date;
      return thisMonth(iso) ? s + Number(it.dataset.amount || 0) : s;
    }, 0);

    const balance = Math.max(0, income - expenses);
    const savings = balance; // here savings == month balance

    incomeEl.textContent = yen(income);
    expenseEl.textContent = "-" + yen(expenses);
    balanceEl.textContent = yen(balance);
    savingsEl.textContent = yen(savings);

    // % change badges
    const incMTD = monthToDateTotals(getIncomeItems);
    const expMTD = monthToDateTotals(getExpenseItems);

    incChangeEl.querySelector("span:nth-child(2)").textContent = pctChange(
      incMTD.cur,
      incMTD.prev
    );
    expChangeEl.querySelector("span:nth-child(2)").textContent = pctChange(
      expMTD.cur,
      expMTD.prev
    );
    balChangeEl.querySelector("span:nth-child(2)").textContent = incMTD.prev
      ? `↑ ${Math.round(
          ((income - expenses) / Math.max(1, incMTD.prev)) * 100
        )}% of last MTD income`
      : "—";
    savNoteEl.querySelector("span:nth-child(2)").textContent =
      income > 0
        ? `${Math.round((savings / income) * 100)}% saved this month`
        : "—";
  }

  function renderRecentExpenses(limit = 4) {
    recentWrap.innerHTML = "";

    const allItems = getExpenseItems();

    if (!allItems.length) {
      recentWrap.innerHTML = `
      <div class="expense-item">
        <div class="expense-info">
          <div class="expense-icon">💳</div>
          <div class="expense-details">
            <h4>No expenses yet</h4>
            <p>Add some in Expense Tracking</p>
            ${renderCategoryPill("other", "expense")}
          </div>
        </div>
        <div class="expense-amount negative">-¥0</div>
      </div>`;
      return;
    }

    // Sort by date DESC (newest first)
    const sorted = allItems
      .map((it) => ({
        el: it,
        date: dateFromAny(it.dataset.date || new Date().toISOString()),
      }))
      .sort((a, b) => b.date - a.date)
      .slice(0, limit);

    sorted.forEach(({ el }) => {
      const amount = Number(el.dataset.amount || 0);
      const cat = (el.dataset.category || "other").toLowerCase();
      const meta = getCategoryMeta(cat, "expense");
      const title =
        el.querySelector(".expense-details h4")?.textContent || "Expense";
      const iso = el.dataset.date || new Date().toISOString();

      const row = document.createElement("div");
      row.className = "expense-item";
      row.dataset.category = cat;
      const safeTitle = escapeHtml(title);
      const safeLabel = escapeHtml(meta.label);
      const safeIcon = escapeHtml(meta.icon);
      row.innerHTML = `
      <div class="expense-info">
        <div class="expense-icon">${safeIcon}</div>
        <div class="expense-details">
          <h4>${safeTitle}</h4>
          <p>${fmtShort(iso)} · ${safeLabel}</p>
          ${renderCategoryPill(cat, "expense")}
        </div>
      </div>
      <div class="expense-amount negative">-${yen(amount)}</div>
    `;
      recentWrap.appendChild(row);
    });
  }

  // Loading Monthly Budget limits to build “reminders”
  function loadBudgetsForCurrentMonth() {
    const now = new Date();
    const key = `pft_budgets_${now.getFullYear()}-${String(
      now.getMonth() + 1
    ).padStart(2, "0")}`;
    try {
      return JSON.parse(localStorage.getItem(key) || "{}");
    } catch {
      return {};
    }
  }

  async function renderBills() {
    billWrap.innerHTML = "";

    const now = new Date();
    const monthKey = `${now.getFullYear()}-${String(
      now.getMonth() + 1
    ).padStart(2, "0")}`;

    // 1. Load bills from API
    let bills = [];
    try {
      const res = await apiFetch("/api/bills");
      if (!res.ok) throw new Error(`GET /api/bills ${res.status}`);
      bills = await res.json();
    } catch (e) {
      console.error("Failed to load bills:", e);
      billWrap.innerHTML = `
        <div class="bill-item">
          <div class="bill-info">
            <h4>Unable to load bills</h4>
            <p style="opacity:.75">Please try again later.</p>
          </div>
        </div>`;
      return;
    }

    // 2. If no bills → empty state
    if (!bills.length) {
      billWrap.innerHTML = `
        <div class="bill-item">
          <div class="bill-info">
            <h4>No recurring bills</h4>
            <p style="opacity:.75">Mark an expense as “Recurring” in Expense Tracking to see it here.</p>
          </div>
        </div>`;
      return;
    }

    // existing expense items for automatic Paid detection
    const expenseItems = [
      ...document.querySelectorAll("#expenseList .expense-item"),
    ];

    function findAutoPaid(bill) {
      const now = new Date();
      const billTitle = (bill.title || "").toLowerCase().trim();
      const billCat = (bill.category || "").toLowerCase().trim();

      return expenseItems.some((it) => {
        const iso = it.dataset.date;
        if (!iso) return false;

        const d = dateFromAny(iso);
        const sameMonth =
          d.getFullYear() === now.getFullYear() &&
          d.getMonth() === now.getMonth();
        if (!sameMonth) return false;

        const cat = (it.dataset.category || "").toLowerCase().trim();
        const title = (
          it.querySelector(".expense-details h4")?.textContent || ""
        )
          .toLowerCase()
          .trim();

        return cat === billCat && title === billTitle;
      });
    }

    function getManualStatus(bill) {
      const overrides = bill.status_overrides || {};
      if (!overrides || typeof overrides !== "object") return undefined;
      return overrides[monthKey];
    }

    function computeStatus(bill) {
      const now = new Date();
      const lastDayOfMonth = new Date(
        now.getFullYear(),
        now.getMonth() + 1,
        0
      ).getDate();
      const dueDay = Math.min(
        Math.max(Number(bill.due_day || 1), 1),
        lastDayOfMonth
      );
      const due = new Date(now.getFullYear(), now.getMonth(), dueDay);

      const manual = getManualStatus(bill);
      if (manual) return { status: manual, due };

      const autoPaid = findAutoPaid(bill);
      if (autoPaid) return { status: "paid", due };

      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const dueDateOnly = new Date(
        due.getFullYear(),
        due.getMonth(),
        due.getDate()
      );
      const daysUntil = Math.round((dueDateOnly - today) / 86400000);
      if (daysUntil < 0) return { status: "overdue", due };
      if (daysUntil <= 3) return { status: "due", due };

      return { status: "upcoming", due };
    }

    function statusChip(s) {
      switch (s) {
        case "paid":
          return { text: "Paid", cls: "chip-paid" };
        case "due":
          return { text: "Due Soon", cls: "chip-due" };
        case "overdue":
          return { text: "Overdue", cls: "chip-overdue" };
        default:
          return { text: "Upcoming", cls: "chip-upcoming" };
      }
    }

    function addExpenseGhostRow(title, amount, category, iso) {
      const list = document.getElementById("expenseList");
      if (!list) return;

      const div = document.createElement("div");
      div.className = "expense-item";
      div.dataset.category = category;
      div.dataset.amount = String(amount);
      div.dataset.date = iso;

      const display = formatShortDate(iso);
      const meta = getCategoryMeta(category, "expense");
      const safeTitle = escapeHtml(title || "Expense");
      const safeLabel = escapeHtml(meta.label);
      const safeIcon = escapeHtml(meta.icon);

      div.innerHTML = `
        <div class="expense-info">
          <div class="expense-icon">${safeIcon}</div>
          <div class="expense-details">
            <h4>${safeTitle}</h4>
            <p>${display} · ${safeLabel}</p>
            ${renderCategoryPill(category, "expense")}
          </div>
        </div>
        <div class="expense-amount negative">-¥${amount.toLocaleString()}</div>
        <button class="tiny-del" aria-label="delete">×</button>
      `;
      list.prepend(div);
    }

    const rows = bills.map((b) => {
      const { status, due } = computeStatus(b);
      const chip = statusChip(status);
      const dueStr = `${due.toLocaleString(undefined, {
        month: "short",
      })} ${String(due.getDate()).padStart(2, "0")}`;

      return `
        <div class="bill-item"
          data-id="${escapeHtml(String(b.id))}"
          data-btitle="${escapeHtml(b.title)}"
          data-bcat="${escapeHtml(b.category)}"
          data-bamt="${Number(b.amount)}"
          data-bdue="${String(b.due_day || 1)}">
          <div class="bill-info">
            <h4>${escapeHtml(b.title)}</h4>
            <p class="bill-meta">
              Monthly · ¥${Number(b.amount).toLocaleString()} · Due: ${dueStr}
            </p>
          </div>
          <div class="bill-ops">
            <span class="bill-chip ${chip.cls}">${chip.text}</span>
            ${
              status !== "paid"
                ? `
              <div class="bill-status-wrapper">
                <select class="bill-status-select"
                  aria-label="Mark bill status"
                  data-id="${escapeHtml(String(b.id))}">
                  <option value="">Mark as</option>
                  <option value="paid">Paid</option>
                  <option value="due">Due Soon</option>
                  <option value="overdue">Overdue</option>
                  <option value="upcoming">Upcoming</option>
                </select>
              </div>`
                : ""
            }
            <button class="bill-remove" aria-label="Remove bill">×</button>
          </div>
        </div>
      `;
    });

    billWrap.innerHTML = rows.join("");

    async function saveOverride(status, billId) {
      try {
        await postJSON("/api/bills/status", {
          bill_id: billId,
          month: monthKey,
          status,
        });
      } catch (e) {
        console.error("Failed to save bill status:", e);
      }
    }

    billWrap.querySelectorAll(".bill-status-select").forEach((sel) => {
      sel.addEventListener("change", async (e) => {
        const val = e.target.value;
        if (!val) return;

        const host = e.target.closest(".bill-item");
        const id = host.dataset.id;
        const title = host.dataset.btitle;
        const category = host.dataset.bcat;
        const amount = Number(host.dataset.bamt);

        if (val === "paid") {
          const iso = new Date().toISOString();
          try {
            await postJSON("/api/transactions", {
              type: "expense",
              title,
              amount,
              category,
              occurred_at: iso,
              date: iso,
            });

            addExpenseGhostRow(title, amount, category, iso);
            await saveOverride("paid", id);
            await renderBills();
            document.dispatchEvent(new Event("expenses:changed"));
          } catch (err) {
            console.error(err);
            alert("Could not save payment. Please try again.");
          }
        } else {
          await saveOverride(val, id);
          await renderBills();
        }

        e.target.selectedIndex = 0;
      });
    });

    // Delete recurring bill
    billWrap.querySelectorAll(".bill-remove").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const host = btn.closest(".bill-item");
        const id = host.dataset.id;
        try {
          await deleteJSON(`/api/bills/${id}`);
          await renderBills();
        } catch (err) {
          console.error("Failed to delete bill:", err);
        }
      });
    });
  }

  function redrawAll() {
    renderSummary();
    renderRecentExpenses();
    renderBills();
  }

  // React to changes from other tabs
  document.addEventListener("expenses:changed", redrawAll);
  document.addEventListener("incomes:changed", redrawAll);

  // Make "View All" links switch sections
  document.querySelectorAll("#dashboard .view-all").forEach((a) => {
    a.addEventListener("click", (e) => {
      const sec = a.getAttribute("data-section");
      if (!sec) return;
      document
        .querySelectorAll(".nav-item")
        .forEach((nav) => nav.classList.remove("active"));
      const targetNav = document.querySelector(
        `.nav-item[data-section="${sec}"]`
      );
      targetNav?.classList.add("active");
      document
        .querySelectorAll(".content-section")
        .forEach((s) => s.classList.remove("active"));
      document.getElementById(sec)?.classList.add("active");
    });
  });

  // Initial paint
  redrawAll();
})();

// Saving Goals (create / list / contribute / delete)
(function () {
  const listEl = document.getElementById("sgList");
  const nameEl = document.getElementById("sgName");
  const targetEl = document.getElementById("sgTarget");
  const deadlineEl = document.getElementById("sgDeadline");
  const addBtn = document.getElementById("sgAddBtn");

  // If Saving Goals section isn't on this page, do nothing
  if (!listEl || !nameEl || !targetEl || !addBtn) return;

  const yen = (n) => "¥" + Number(n || 0).toLocaleString();

  async function fetchGoals() {
    const res = await apiFetch("/api/saving-goals");
    if (!res.ok) throw new Error("Failed to load saving goals");
    return res.json();
  }

  function renderGoals(goals) {
    if (!goals.length) {
      listEl.innerHTML = `
        <div class="savings-goal-card empty">
          <div class="sg-empty-title">No goals yet</div>
          <p class="sg-empty-text">
            Create your first saving goal above – for example an emergency fund or a vacation.
          </p>
        </div>
      `;
      return;
    }

    listEl.innerHTML = "";

    goals.forEach((g) => {
      const target = Number(g.target_amount || 0);
      const saved = Number(g.saved_amount || 0);
      const pct =
        target > 0 ? Math.min(100, Math.round((saved / target) * 100)) : 0;

      const deadline = g.deadline ? formatLongDate(g.deadline) : "No deadline";

      const card = document.createElement("div");
      card.className = "savings-goal-card";
      card.dataset.id = g.id;

      card.innerHTML = `
        <div class="sg-top-row">
          <div class="sg-main">
            <div class="sg-name">${escapeHtml(g.name)}</div>
            <div class="sg-deadline">Deadline: ${deadline}</div>
          </div>
          <button class="tiny-del sg-remove" aria-label="Delete goal">×</button>
        </div>

        <div class="sg-amount-row">
          <span class="sg-saved">Saved: ${yen(saved)}</span>
          <span class="sg-target">Target: ${yen(target)}</span>
        </div>

        <div class="sg-progress">
          <span style="width:${pct}%;"></span>
        </div>
        <div class="sg-percent">${pct}% of goal</div>

        <div class="sg-contrib-row">
          <input
            type="number"
            class="filter-input sg-contrib-input"
            placeholder="Add amount (¥)"
          />
          <button class="filter-btn sg-contrib-btn">Add</button>
        </div>
      `;
      listEl.appendChild(card);
    });
  }

  async function refreshGoals() {
    try {
      const goals = await fetchGoals();
      renderGoals(goals);
    } catch (err) {
      console.error(err);
      listEl.innerHTML = `
        <div class="savings-goal-card error">
          <div class="sg-empty-title">Unable to load goals</div>
          <p class="sg-empty-text">Please try again later.</p>
        </div>
      `;
    }
  }

  // Add new goal
  addBtn.addEventListener("click", async () => {
    const name = (nameEl.value || "").trim();
    const target = Number(targetEl.value);
    const deadline = deadlineEl.value || null;

    if (!name || !target || target <= 0) {
      addBtn.textContent = "Name + target required";
      setTimeout(() => (addBtn.textContent = "Add goal"), 900);
      return;
    }

    try {
      await postJSON("/api/saving-goals", {
        name,
        target_amount: target,
        deadline,
      });

      nameEl.value = "";
      targetEl.value = "";
      if (deadlineEl) deadlineEl.value = "";

      await refreshGoals();
    } catch (err) {
      console.error(err);
      alert("Failed to create saving goal.");
    }
  });

  // Contribute & delete
  listEl.addEventListener("click", async (e) => {
    const card = e.target.closest(".savings-goal-card");
    if (!card) return;
    const id = card.dataset.id;

    // Delete goal
    if (e.target.classList.contains("sg-remove")) {
      try {
        await deleteJSON(`/api/saving-goals/${id}`);
        await refreshGoals();
      } catch (err) {
        console.error(err);
        alert("Failed to delete goal.");
      }
      return;
    }

    // Add contribution
    if (e.target.classList.contains("sg-contrib-btn")) {
      const input = card.querySelector(".sg-contrib-input");
      const amt = Number(input?.value || 0);
      if (!amt || amt <= 0) {
        e.target.textContent = "Enter amount";
        setTimeout(() => (e.target.textContent = "Add"), 900);
        return;
      }

      try {
        await postJSON(`/api/saving-goals/${id}/contribute`, { amount: amt });
        input.value = "";
        await refreshGoals();
      } catch (err) {
        console.error(err);
        alert("Failed to add to goal.");
      }
    }
  });

  // Initial load
  refreshGoals();
})();

//  Floating Quick Add Expense with Custom category
function wireFloatingQuickAdd() {
  const btn = document.getElementById("floatingQuickAdd");
  const card = document.getElementById("quickAddCard");

  if (!btn || !card) return;

  const qTitle = document.getElementById("qExpTitle");
  const qAmount = document.getElementById("qExpAmount");
  const qCategory = document.getElementById("qExpCategory");
  const qAddBtn = document.getElementById("qExpAddBtn");
  const qCancelBtn = document.getElementById("qExpCancelBtn");
  const qCategoryCustom = document.getElementById("qExpCategoryCustom");

  // Main Expense Tracking form
  const expTitle = document.getElementById("expTitle");
  const expAmount = document.getElementById("expAmount");
  const expCategory = document.getElementById("expCategory");
  const expAddBtn = document.getElementById("expAddBtn");
  const expCategoryCustom = document.getElementById("expCategoryCustom");

  function openCard() {
    card.classList.remove("hidden");
    if (qTitle) qTitle.focus();
  }

  function closeCard() {
    card.classList.add("hidden");
  }

  // Toggle card when user clicks +
  btn.addEventListener("click", () => {
    if (card.classList.contains("hidden")) {
      openCard();
    } else {
      closeCard();
    }
  });

  // Show / hide custom in the popup
  if (qCategory && qCategoryCustom) {
    qCategory.addEventListener("change", () => {
      if (qCategory.value === "__custom__") {
        qCategoryCustom.style.display = "inline-block";
        qCategoryCustom.focus();
      } else {
        qCategoryCustom.style.display = "none";
        qCategoryCustom.value = "";
      }
    });
  }

  // Cancel button
  if (qCancelBtn) {
    qCancelBtn.addEventListener("click", (e) => {
      e.preventDefault();
      if (qTitle) qTitle.value = "";
      if (qAmount) qAmount.value = "";
      if (qCategory) qCategory.value = "food";
      if (qCategoryCustom) {
        qCategoryCustom.value = "";
        qCategoryCustom.style.display = "none";
      }
      closeCard();
    });
  }

  // Add button
  if (qAddBtn) {
    qAddBtn.addEventListener("click", (e) => {
      e.preventDefault();

      if (
        !qTitle ||
        !qAmount ||
        !qCategory ||
        !expTitle ||
        !expAmount ||
        !expCategory ||
        !expAddBtn
      ) {
        // something critical is missing → just close the card gracefully
        closeCard();
        return;
      }

      const titleVal = (qTitle.value || "").trim();
      const amountVal = Number(qAmount.value);
      const catValRaw = (qCategory.value || "other").toLowerCase();

      if (!titleVal || !amountVal || amountVal <= 0) {
        qAddBtn.textContent = "Fill title & amount";
        setTimeout(() => {
          qAddBtn.textContent = "Add";
        }, 900);
        return;
      }

      let catVal = catValRaw;

      // custom category support
      if (catValRaw === "__custom__") {
        if (!qCategoryCustom || !qCategoryCustom.value.trim()) {
          qAddBtn.textContent = "Type category";
          setTimeout(() => {
            qAddBtn.textContent = "Add";
          }, 900);
          return;
        }

        const custom = qCategoryCustom.value.trim();
        if (expCategoryCustom) expCategoryCustom.value = custom;
        // keep main select on "__custom__" so expAdd handler reads from expCategoryCustom
        catVal = "__custom__";
      } else if (expCategoryCustom) {
        expCategoryCustom.value = "";
      }

      // Copy to main Expense Tracking form
      expTitle.value = titleVal;
      expAmount.value = String(amountVal);
      expCategory.value = catVal;

      // Trigger the existing Expense add handler (handles saving + events)
      expAddBtn.click();

      // Reset quick-add fields
      qTitle.value = "";
      qAmount.value = "";
      qCategory.value = "food";
      if (qCategoryCustom) {
        qCategoryCustom.value = "";
        qCategoryCustom.style.display = "none";
      }
      closeCard();
    });
  }
}

function wireOnboarding() {
  const modal = document.getElementById("onboardingModal");
  const closeBtn = document.getElementById("onboardingClose");
  const doneBtn = document.getElementById("onboardingDone");
  const key = "pft_onboarded";

  if (!modal || localStorage.getItem(key) === "1") return;

  const close = () => {
    modal.classList.add("hidden");
    localStorage.setItem(key, "1");
  };

  modal.classList.remove("hidden");

  closeBtn?.addEventListener("click", close);
  doneBtn?.addEventListener("click", close);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) close();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modal.classList.contains("hidden")) close();
  });
}

function numberFromMoney(text = "") {
  const value = Number(String(text).replace(/[^\d.-]/g, ""));
  return Number.isFinite(value) ? Math.abs(value) : 0;
}

function readCurrentBudgets(month) {
  try {
    const raw = localStorage.getItem(`pft_budgets_${month}`);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function collectAiFinanceSummary() {
  const now = new Date();
  const month = localDateKey(now).slice(0, 7);
  const expenseItems = [
    ...document.querySelectorAll("#expenseList .expense-item"),
  ];
  const incomeItems = [...document.querySelectorAll("#incomeList .expense-item")];

  const categoryTotals = {};
  let expenses = 0;
  expenseItems.forEach((item) => {
    if (!isSameLocalMonth(item.dataset.date, now)) return;
    const amount = Number(item.dataset.amount || 0);
    const category = (item.dataset.category || "other")
      .toLowerCase()
      .slice(0, 48);
    expenses += amount;
    categoryTotals[category] = (categoryTotals[category] || 0) + amount;
  });

  let income = 0;
  incomeItems.forEach((item) => {
    if (!isSameLocalMonth(item.dataset.date, now)) return;
    income += Number(item.dataset.amount || 0);
  });

  const categorySpending = Object.entries(categoryTotals)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([category, amount]) => ({
      category,
      amount: Math.round(amount * 100) / 100,
    }));

  const budgets = Object.entries(readCurrentBudgets(month))
    .slice(0, 12)
    .map(([category, limit]) => {
      const key = String(category).toLowerCase().slice(0, 48);
      return {
        category: key,
        limit: Number(limit || 0),
        spent: Math.round(Number(categoryTotals[key] || 0) * 100) / 100,
      };
    });

  const goalCards = [
    ...document.querySelectorAll("#sgList .savings-goal-card[data-id]"),
  ];
  const savingGoals = goalCards.reduce(
    (acc, card) => {
      acc.count += 1;
      acc.saved_total += numberFromMoney(
        card.querySelector(".sg-saved")?.textContent || ""
      );
      acc.target_total += numberFromMoney(
        card.querySelector(".sg-target")?.textContent || ""
      );
      return acc;
    },
    { count: 0, target_total: 0, saved_total: 0 }
  );

  const bills = { paid: 0, due: 0, overdue: 0, upcoming: 0 };
  document.querySelectorAll("#dashBillList .bill-chip").forEach((chip) => {
    if (chip.classList.contains("chip-paid")) bills.paid += 1;
    if (chip.classList.contains("chip-due")) bills.due += 1;
    if (chip.classList.contains("chip-overdue")) bills.overdue += 1;
    if (chip.classList.contains("chip-upcoming")) bills.upcoming += 1;
  });

  const balance = income - expenses;

  return {
    currency: "JPY",
    month,
    income: Math.round(income * 100) / 100,
    expenses: Math.round(expenses * 100) / 100,
    balance: Math.round(balance * 100) / 100,
    savings: Math.round(Math.max(0, balance) * 100) / 100,
    category_spending: categorySpending,
    budgets,
    saving_goals: {
      count: savingGoals.count,
      target_total: Math.round(savingGoals.target_total * 100) / 100,
      saved_total: Math.round(savingGoals.saved_total * 100) / 100,
    },
    bills,
  };
}

function renderAiCoachAdvice(output, advice) {
  output.textContent = "";
  output.classList.add("has-advice");

  const bullets = String(advice || "")
    .split(/\r?\n/)
    .map((line) => line.replace(/^[-*•\d.)\s]+/, "").trim())
    .filter(Boolean)
    .slice(0, 5);

  if (!bullets.length) {
    output.textContent = "No advice returned. Please try again.";
    return;
  }

  const list = document.createElement("ul");
  bullets.forEach((bullet) => {
    const item = document.createElement("li");
    item.textContent = bullet;
    list.appendChild(item);
  });
  output.appendChild(list);
}

function wireAiFinanceCoach() {
  const panel = document.getElementById("aiCoachPanel");
  const button = document.getElementById("aiCoachButton");
  const output = document.getElementById("aiCoachOutput");
  const loading = document.getElementById("aiCoachLoading");
  const error = document.getElementById("aiCoachError");

  if (!panel || !button || !output || !loading || !error) return;

  button.addEventListener("click", async () => {
    button.disabled = true;
    loading.classList.remove("hidden");
    error.classList.add("hidden");
    error.textContent = "";

    try {
      const res = await apiFetch("/api/ai/finance-coach", {
        method: "POST",
        body: JSON.stringify({ summary: collectAiFinanceSummary() }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(
          data.message || "AI Finance Coach could not analyze this month."
        );
      }

      renderAiCoachAdvice(output, data.advice || "");
    } catch (err) {
      error.textContent =
        err.message || "AI Finance Coach is unavailable right now.";
      error.classList.remove("hidden");
    } finally {
      loading.classList.add("hidden");
      button.disabled = false;
    }
  });
}

document.addEventListener("DOMContentLoaded", wireFloatingQuickAdd);
document.addEventListener("DOMContentLoaded", wireOnboarding);
document.addEventListener("DOMContentLoaded", wireAiFinanceCoach);
