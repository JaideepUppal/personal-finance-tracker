// ============================================================================
// Bootstrap, API helpers, and shared utilities
// ============================================================================

//  username/avatar from login
(function () {
  const savedName = localStorage.getItem("pftUserName");

  if (savedName) {
    //  "Welcome, name"
    const userNameSpan = document.querySelector(".user-name");
    if (userNameSpan) {
      userNameSpan.textContent = savedName;
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

function currentMonthKey(date = new Date()) {
  const d = dateFromAny(date);
  return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0");
}

function normalizeBudgetRecord(record = {}) {
  const category = String(record.category || "other").toLowerCase();
  const limit = Number(record.limit_amount ?? record.limit ?? 0);

  return {
    ...record,
    id: record.id,
    category,
    limit_amount: Number.isFinite(limit) ? limit : 0,
    month: record.month || currentMonthKey(),
  };
}

const currentBudgetSnapshot = {
  month: currentMonthKey(),
  budgets: [],
  loaded: false,
  loading: false,
  error: null,
  promise: null,
};

window.currentBudgetSnapshot = currentBudgetSnapshot;

function getCurrentBudgetRecords(month = currentMonthKey()) {
  if (currentBudgetSnapshot.month !== month) return [];
  return currentBudgetSnapshot.budgets;
}

function getCurrentBudgetMap(month = currentMonthKey()) {
  return getCurrentBudgetRecords(month).reduce((acc, budget) => {
    acc[budget.category] = Number(budget.limit_amount || 0);
    return acc;
  }, {});
}

async function fetchBudgetSnapshot(month = currentMonthKey()) {
  if (
    currentBudgetSnapshot.loading &&
    currentBudgetSnapshot.promise &&
    currentBudgetSnapshot.month === month
  ) {
    return currentBudgetSnapshot.promise;
  }

  currentBudgetSnapshot.month = month;
  currentBudgetSnapshot.loading = true;
  currentBudgetSnapshot.error = null;

  currentBudgetSnapshot.promise = (async () => {
    try {
      const res = await apiFetch(
        `/api/budgets?month=${encodeURIComponent(month)}`
      );
      if (!res.ok) {
        throw new Error(`GET /api/budgets failed ${res.status}`);
      }

      const data = await res.json();
      const budgets = Array.isArray(data.budgets)
        ? data.budgets.map(normalizeBudgetRecord)
        : [];

      currentBudgetSnapshot.month = data.month || month;
      currentBudgetSnapshot.budgets = budgets;
      currentBudgetSnapshot.loaded = true;
      currentBudgetSnapshot.error = null;
      document.dispatchEvent(
        new CustomEvent("budgets:changed", {
          detail: {
            month: currentBudgetSnapshot.month,
            budgets,
          },
        })
      );
      return budgets;
    } catch (error) {
      currentBudgetSnapshot.budgets = [];
      currentBudgetSnapshot.loaded = false;
      currentBudgetSnapshot.error = error;
      throw error;
    } finally {
      currentBudgetSnapshot.loading = false;
      currentBudgetSnapshot.promise = null;
    }
  })();

  return currentBudgetSnapshot.promise;
}

async function ensureBudgetSnapshotLoaded(month = currentMonthKey()) {
  if (currentBudgetSnapshot.loaded && currentBudgetSnapshot.month === month) {
    return currentBudgetSnapshot.budgets;
  }
  return fetchBudgetSnapshot(month);
}

const CATEGORY_META = {
  food: { icon: "FD", tone: "food", label: "Food" },
  rent: { icon: "RT", tone: "rent", label: "Rent" },
  travel: { icon: "TR", tone: "travel", label: "Travel" },
  shopping: { icon: "SH", tone: "shopping", label: "Shopping" },
  other: { icon: "OT", tone: "other", label: "Other" },
  "part-time": { icon: "PT", tone: "part-time", label: "Part-time" },
  allowance: { icon: "AL", tone: "allowance", label: "Allowance" },
  stipend: { icon: "ST", tone: "stipend", label: "Stipend" },
  scholarship: { icon: "SC", tone: "scholarship", label: "Scholarship" },
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
      return { ...meta, icon: "IN" };
    }
    return meta;
  }
  return {
    icon: type === "income" ? "IN" : "TX",
    tone: "custom",
    label: prettyCategory(normalized),
  };
}

function renderCategoryPill(category, type = "expense") {
  const meta = getCategoryMeta(category, type);
  const tone = String(meta.tone || "custom").replace(/[^a-z0-9-]/g, "");
  return `<span class="category-pill cat-${tone}"><span class="category-dot" aria-hidden="true"></span>${escapeHtml(meta.label)}</span>`;
}

const CHART_THEME_FALLBACKS = {
  light: {
    text: "#111827",
    muted: "#64748B",
    soft: "#94A3B8",
    border: "#E2E8F0",
    panel: "#FFFFFF",
    primary: "#2563EB",
    money: "#16A34A",
    danger: "#DC2626",
    warning: "#F59E0B",
    accent: "#0D9488",
  },
  dark: {
    text: "#F8FAFC",
    muted: "#CBD5E1",
    soft: "#94A3B8",
    border: "#263449",
    panel: "#111827",
    primary: "#60A5FA",
    money: "#34D399",
    danger: "#FB7185",
    warning: "#FBBF24",
    accent: "#2DD4BF",
  },
};

function activeThemeName() {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

function cssVar(name, fallback) {
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
  return value || fallback;
}

function colorAlpha(color, alpha) {
  const value = String(color || "").trim();
  const hex = value.replace("#", "");

  if (/^[0-9a-f]{3}$/i.test(hex)) {
    const expanded = hex
      .split("")
      .map((char) => char + char)
      .join("");
    return colorAlpha(`#${expanded}`, alpha);
  }

  if (/^[0-9a-f]{6}$/i.test(hex)) {
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  return value || `rgba(37, 99, 235, ${alpha})`;
}

function getLedgerlyChartTheme() {
  const mode = activeThemeName();
  const fallback = CHART_THEME_FALLBACKS[mode];
  const primary = cssVar("--primary", fallback.primary);
  const money = cssVar("--money", fallback.money);
  const danger = cssVar("--danger", fallback.danger);
  const warning = cssVar("--warning", fallback.warning);
  const accent = cssVar("--accent", fallback.accent);
  const soft = cssVar("--text-soft", fallback.soft);

  return {
    mode,
    text: cssVar("--text-main", fallback.text),
    muted: cssVar("--text-muted", fallback.muted),
    soft,
    border: cssVar("--border", fallback.border),
    panel: cssVar("--surface", fallback.panel),
    tooltipBg: mode === "dark" ? "rgba(15, 23, 42, 0.98)" : "rgba(255, 255, 255, 0.98)",
    tooltipTitle: fallback.text,
    tooltipBody: fallback.muted,
    tooltipBorder: cssVar("--border-strong", fallback.border),
    grid: mode === "dark" ? "rgba(148, 163, 184, 0.12)" : "rgba(100, 116, 139, 0.16)",
    primary,
    money,
    danger,
    warning,
    accent,
    palette: [primary, money, accent, warning, danger, soft, "#475569", "#64748B"],
  };
}

let ledgerlyChartTheme = getLedgerlyChartTheme();

function syncLedgerlyChartTheme() {
  ledgerlyChartTheme = getLedgerlyChartTheme();

  if (typeof Chart !== "undefined") {
    Chart.defaults.color = ledgerlyChartTheme.text;
  }
}

function lineColors(tone = "primary") {
  const theme = ledgerlyChartTheme;
  const color =
    tone === "income" || tone === "money"
      ? theme.money
      : tone === "expense" || tone === "danger"
      ? theme.danger
      : tone === "accent"
      ? theme.accent
      : theme.primary;

  return {
    border: color,
    fillTop: colorAlpha(color, theme.mode === "dark" ? 0.24 : 0.18),
    fillBottom: colorAlpha(color, 0.02),
  };
}

function chartCategoryColor(label = "", index = 0, type = "expense") {
  const theme = ledgerlyChartTheme;
  const normalized = String(label).toLowerCase();
  const expenseColors = {
    food: theme.money,
    rent: theme.warning,
    travel: theme.primary,
    shopping: theme.accent,
    other: theme.soft,
  };
  const incomeColors = {
    "part-time": theme.money,
    "part time": theme.money,
    allowance: theme.primary,
    stipend: theme.warning,
    scholarship: theme.accent,
    other: theme.soft,
  };
  const map = type === "income" ? incomeColors : expenseColors;
  return map[normalized] || theme.palette[index % theme.palette.length];
}

function chartYen(value) {
  return "¥" + Math.round(Number(value || 0)).toLocaleString();
}

function parsedChartValue(context) {
  const parsed = context.parsed;
  if (parsed && typeof parsed === "object") {
    return parsed.y ?? parsed.r ?? 0;
  }
  return parsed ?? 0;
}

function chartVerticalGradient(context, topColor, bottomColor) {
  const chart = context.chart;
  const area = chart.chartArea;
  if (!area) return topColor;

  const gradient = chart.ctx.createLinearGradient(0, area.top, 0, area.bottom);
  gradient.addColorStop(0, topColor);
  gradient.addColorStop(1, bottomColor);
  return gradient;
}

function ledgerlyLineDataset(label, tone = "primary") {
  const colors = lineColors(tone);

  return {
    label,
    ledgerlyTone: tone,
    data: [],
    borderColor: colors.border,
    backgroundColor: (context) =>
      chartVerticalGradient(
        context,
        lineColors(tone).fillTop,
        lineColors(tone).fillBottom
      ),
    pointBackgroundColor: ledgerlyChartTheme.panel,
    pointBorderColor: colors.border,
    pointBorderWidth: 2,
    pointHoverBackgroundColor: colors.border,
    pointHoverBorderColor: ledgerlyChartTheme.panel,
    pointHoverBorderWidth: 2,
    pointHoverRadius: 3.5,
    pointRadius: 0,
    pointHitRadius: 12,
    borderWidth: 1.6,
    cubicInterpolationMode: "monotone",
    tension: 0.35,
    fill: true,
  };
}

function ledgerlyChartPlugins(showLegend = true, settings = {}) {
  const showPercent = Boolean(settings.showPercent);
  const legendPosition = settings.legendPosition || "bottom";

  return {
    legend: {
      display: showLegend,
      position: legendPosition,
      labels: {
        color: ledgerlyChartTheme.text,
        usePointStyle: true,
        pointStyle: "circle",
        boxWidth: 6,
        boxHeight: 6,
        padding: 10,
        font: { family: "Manrope", size: 10.5, weight: "500" },
      },
    },
    tooltip: {
      backgroundColor: ledgerlyChartTheme.tooltipBg,
      titleColor: ledgerlyChartTheme.tooltipTitle,
      bodyColor: ledgerlyChartTheme.tooltipBody,
      borderColor: ledgerlyChartTheme.tooltipBorder,
      borderWidth: 1,
      cornerRadius: 8,
      displayColors: true,
      boxPadding: 4,
      padding: 9,
      titleFont: { family: "Manrope", size: 11.5, weight: "700" },
      bodyFont: { family: "Manrope", size: 11.5, weight: "500" },
      callbacks: {
        label(context) {
          const label = context.dataset.label ? `${context.dataset.label}: ` : "";
          const value = parsedChartValue(context);

          if (showPercent) {
            const total = (context.dataset.data || []).reduce(
              (sum, next) => sum + Number(next || 0),
              0
            );
            const percent = total ? Math.round((Number(value || 0) / total) * 100) : 0;
            const itemLabel = context.label ? `${context.label}: ` : label;
            return `${itemLabel}${chartYen(value)} (${percent}%)`;
          }

          return `${label}${chartYen(value)}`;
        },
      },
    },
  };
}

function ledgerlyChartScales() {
  return {
    x: {
      border: { display: false },
      grid: { display: false, drawBorder: false, tickLength: 0 },
      ticks: {
        color: ledgerlyChartTheme.muted,
        autoSkip: true,
        maxTicksLimit: 7,
        maxRotation: 0,
        padding: 7,
        font: { family: "Manrope", size: 10.5, weight: "500" },
      },
    },
    y: {
      border: { display: false },
      grid: { color: ledgerlyChartTheme.grid, drawBorder: false },
      ticks: {
        color: ledgerlyChartTheme.muted,
        maxTicksLimit: 5,
        padding: 7,
        precision: 0,
        font: { family: "Manrope", size: 10.5, weight: "500" },
        callback(value) {
          return chartYen(value);
        },
      },
      beginAtZero: true,
      grace: "12%",
    },
  };
}

function ledgerlyDoughnutOptions() {
  return {
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: 1,
    cutout: "72%",
    layout: { padding: 8 },
    plugins: ledgerlyChartPlugins(true, { showPercent: true }),
    animation: { duration: 720, easing: "easeOutQuart" },
  };
}

const ledgerlyDoughnutCenterPlugin = {
  id: "ledgerlyDoughnutCenter",
  afterDraw(chart) {
    if (chart.config.type !== "doughnut") return;
    const dataset = chart.data.datasets?.[0];
    const total = (dataset?.data || []).reduce(
      (sum, next) => sum + Number(next || 0),
      0
    );
    if (!total) return;

    const meta = chart.getDatasetMeta(0);
    const center = meta.data?.[0];
    if (!center) return;

    const { ctx } = chart;
    ctx.save();
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = ledgerlyChartTheme.muted;
    ctx.font = "600 10.5px Manrope, sans-serif";
    ctx.fillText("Total", center.x, center.y - 10);
    ctx.fillStyle = ledgerlyChartTheme.text;
    ctx.font = "700 16px Manrope, Avenir Next, sans-serif";
    ctx.fillText(chartYen(total), center.x, center.y + 10);
    ctx.restore();
  },
};

if (typeof Chart !== "undefined") {
  Chart.defaults.font.family = "Manrope, Avenir Next, Segoe UI, sans-serif";
  Chart.defaults.color = ledgerlyChartTheme.text;
  Chart.defaults.elements.arc.borderJoinStyle = "round";
}

function applyLedgerlyChartTheme(chart) {
  const theme = ledgerlyChartTheme;
  const plugins = chart.options?.plugins;

  if (plugins?.legend?.labels) {
    plugins.legend.labels.color = theme.text;
  }

  if (plugins?.tooltip) {
    plugins.tooltip.backgroundColor = theme.tooltipBg;
    plugins.tooltip.titleColor = theme.tooltipTitle;
    plugins.tooltip.bodyColor = theme.tooltipBody;
    plugins.tooltip.borderColor = theme.tooltipBorder;
  }

  ["x", "y"].forEach((axis) => {
    const scale = chart.options?.scales?.[axis];
    if (!scale) return;
    if (scale.ticks) scale.ticks.color = theme.muted;
    if (axis === "y" && scale.grid) scale.grid.color = theme.grid;
  });

  (chart.data?.datasets || []).forEach((dataset) => {
    if (dataset.ledgerlyTone) {
      const colors = lineColors(dataset.ledgerlyTone);
      dataset.borderColor = colors.border;
      dataset.pointBackgroundColor = theme.panel;
      dataset.pointBorderColor = colors.border;
      dataset.pointHoverBackgroundColor = colors.border;
      dataset.pointHoverBorderColor = theme.panel;
    }

    if (dataset.ledgerlyPaletteType) {
      dataset.backgroundColor = (chart.data.labels || []).map((label, index) =>
        chartCategoryColor(label, index, dataset.ledgerlyPaletteType)
      );
      dataset.borderColor = theme.panel;
      dataset.hoverBorderColor = theme.panel;
    }

    if (dataset.ledgerlyCashflowBars) {
      dataset.borderColor = [colorAlpha(theme.money, 0.44), colorAlpha(theme.danger, 0.44)];
    }
  });
}

function refreshLedgerlyCharts() {
  syncLedgerlyChartTheme();

  if (typeof Chart === "undefined" || !Chart.instances) return;

  Object.values(Chart.instances).forEach((chart) => {
    applyLedgerlyChartTheme(chart);
    chart.resize();
    chart.update("none");
  });
}

window.addEventListener("ledgerly:themechange", refreshLedgerlyCharts);

// ============================================================================
// Navigation
// ============================================================================

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

  window.requestAnimationFrame(() => {
    refreshLedgerlyCharts();
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

// ============================================================================
// Expense tracking
// ============================================================================

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
    <div class="transaction-actions">
      <div class="expense-amount negative">-${yen(amount)}</div>
      <button class="tiny-del" aria-label="delete">×</button>
    </div>
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
        ledgerlyLineDataset("Recent Expenses", "expense"),
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { intersect: false, mode: "index" },
      layout: { padding: { top: 6, right: 8, bottom: 2, left: 2 } },
      plugins: ledgerlyChartPlugins(false),
      scales: ledgerlyChartScales(),
    },
  });

  const pieChart = new Chart(pieEl.getContext("2d"), {
    type: "doughnut",
    data: {
      labels: [],
      datasets: [
        {
          data: [],
          ledgerlyPaletteType: "expense",
          borderColor: ledgerlyChartTheme.panel,
          borderWidth: 2,
          hoverBorderColor: ledgerlyChartTheme.panel,
          hoverOffset: 6,
          spacing: 2,
        },
      ],
    },
    plugins: [ledgerlyDoughnutCenterPlugin],
    options: ledgerlyDoughnutOptions(),
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
    pieChart.data.datasets[0].backgroundColor = pieChart.data.labels.map(
      (label, i) => chartCategoryColor(label, i, "expense")
    );

    pieChart.data.datasets[0].borderColor = ledgerlyChartTheme.panel;
    pieChart.data.datasets[0].borderWidth = 2;

    pieChart.update();
  }

  document.addEventListener("expenses:changed", redrawCharts);
  redrawCharts();
})();

// ============================================================================
// Income tracking
// ============================================================================

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
      <div class="transaction-actions">
        <div class="income-amount positive">+${yen(amount)}</div>
        <button class="tiny-del" aria-label="delete">×</button>
      </div>
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
          ledgerlyLineDataset("Recent Income", "income"),
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { intersect: false, mode: "index" },
        layout: { padding: { top: 6, right: 8, bottom: 2, left: 2 } },
        plugins: ledgerlyChartPlugins(false),
        scales: ledgerlyChartScales(),
      },
    });

    // Pie chart with dynamic categories (custom gets its own color)
    const pieChart = new Chart(pieEl.getContext("2d"), {
      type: "doughnut",
      data: {
        labels: [],
        datasets: [
          {
            data: [],
            ledgerlyPaletteType: "income",
            borderColor: ledgerlyChartTheme.panel,
            borderWidth: 2,
            hoverBorderColor: ledgerlyChartTheme.panel,
            hoverOffset: 6,
            spacing: 2,
          },
        ],
      },
      plugins: [ledgerlyDoughnutCenterPlugin],
      options: ledgerlyDoughnutOptions(),
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

      const colors = pieLabels.map((label, i) => {
        return chartCategoryColor(label, i, "income");
      });

      pieChart.data.labels = pieLabels;
      pieChart.data.datasets[0].data = pieData;
      pieChart.data.datasets[0].backgroundColor = colors;
      pieChart.data.datasets[0].borderColor = ledgerlyChartTheme.panel;
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

// ============================================================================
// Monthly budgets
// ============================================================================

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

  const monthKey = () => currentMonthKey();
  let budgetsLoading = false;
  let budgetLoadError = "";

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

  function setTotals(limit = 0, spent = 0) {
    if (totalLim) totalLim.textContent = "Budget: " + yen(limit);
    if (totalSpd) totalSpd.textContent = "Spent: -" + yen(spent);
    if (totalRem) totalRem.textContent = "Left: " + yen(Math.max(limit - spent, 0));
  }

  function renderBudgetMessage(title, detail = "") {
    setTotals();
    listEl.innerHTML = "";
    const card = document.createElement("div");
    card.className = "budget-card";
    card.innerHTML = `
      <div class="bud-top-row">
        <div>
          <div class="bud-cat-name">${escapeHtml(title)}</div>
          ${
            detail
              ? `<div class="bud-percent-text">${escapeHtml(detail)}</div>`
              : ""
          }
        </div>
      </div>
    `;
    listEl.appendChild(card);
  }

  function render() {
    if (budgetsLoading) {
      renderBudgetMessage("Loading budgets...");
      return;
    }

    if (budgetLoadError) {
      renderBudgetMessage(budgetLoadError);
      return;
    }

    const budgets = getCurrentBudgetRecords(monthKey());
    const spent = spentByCategory();

    listEl.innerHTML = "";
    let tLimit = 0,
      tSpent = 0;

    if (!budgets.length) {
      renderBudgetMessage(
        "No budgets yet",
        "Set a category limit to start tracking this month."
      );
      return;
    }

    budgets.forEach((budget) => {
      const limit = Number(budget.limit_amount || 0);
      const useCat = String(budget.category || "other").toLowerCase();
      const used = Number(spent[useCat] || 0);
      const remain = Math.max(limit - used, 0);

      tLimit += limit;
      tSpent += Math.min(used, limit);

      const pct =
        limit > 0 ? Math.min(100, Math.round((used / limit) * 100)) : 0;
      const prettyCat = useCat.charAt(0).toUpperCase() + useCat.slice(1);
      const safeCat = escapeHtml(prettyCat.replace(/-/g, " "));
      const safeCatKey = escapeHtml(useCat);
      const safeBudgetId = escapeHtml(String(budget.id || ""));

      const card = document.createElement("div");
      card.className = "budget-card";
      card.innerHTML = `
        <div class="bud-top-row">
          <div class="bud-cat-name">${safeCat}</div>
          <button class="tiny-del-ghost bud-remove-btn" data-budget-id="${safeBudgetId}" data-budget-category="${safeCatKey}">
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

    setTotals(tLimit, tSpent);
  }

  async function refreshBudgets() {
    budgetsLoading = true;
    budgetLoadError = "";
    render();

    try {
      await fetchBudgetSnapshot(monthKey());
    } catch (err) {
      console.error("Failed to load budgets:", err);
      budgetLoadError = "Could not load budgets. Please refresh.";
    } finally {
      budgetsLoading = false;
      render();
    }
  }

  // Add / update limit (supports Custom...)
  addBtn.addEventListener("click", async () => {
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

    addBtn.disabled = true;
    budgetLoadError = "";

    try {
      const res = await apiFetch("/api/budgets", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`POST /api/budgets failed ${res.status}`);
      }

      await res.json().catch(() => ({}));
      amtEl.value = "";
      catEl.value = "food";
      if (catCustomEl) {
        catCustomEl.value = "";
        catCustomEl.style.display = "none";
      }
      await refreshBudgets();
    } catch (err) {
      console.error("Failed to save budget:", err);
      budgetLoadError = "Could not save budget. Please try again.";
      render();
    } finally {
      addBtn.disabled = false;
    }
  });

  // Remove a category budget from the database
  listEl.addEventListener("click", async (e) => {
    const btn = e.target.closest(".bud-remove-btn");
    if (!btn) return;

    const budgetId = btn.getAttribute("data-budget-id");
    if (!budgetId) return;

    btn.disabled = true;
    budgetLoadError = "";

    try {
      await deleteJSON(`/api/budgets/${encodeURIComponent(budgetId)}`);
      await refreshBudgets();
    } catch (err) {
      console.error("Failed to delete budget:", err);
      budgetLoadError = "Could not remove budget. Please try again.";
      render();
    } finally {
      btn.disabled = false;
    }
  });

  document.addEventListener("expenses:changed", render);
  document.addEventListener("budgets:changed", render);
  refreshBudgets();
})();

// ============================================================================
// Analytics and charts
// ============================================================================

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
        ledgerlyLineDataset("Daily spend", "expense"),
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { intersect: false, mode: "index" },
      layout: { padding: { top: 6, right: 8, bottom: 2, left: 2 } },
      plugins: ledgerlyChartPlugins(false),
      scales: ledgerlyChartScales(),
    },
  });

  const monthBar = new Chart(monthBarEl.getContext("2d"), {
    type: "bar",
    data: {
      labels: ["Income", "Expenses"],
      datasets: [
        {
          data: [0, 0],
          ledgerlyCashflowBars: true,
          backgroundColor(context) {
            const income = context.dataIndex === 0;
            return chartVerticalGradient(
              context,
              colorAlpha(income ? ledgerlyChartTheme.money : ledgerlyChartTheme.danger, 0.88),
              colorAlpha(income ? ledgerlyChartTheme.money : ledgerlyChartTheme.danger, 0.42)
            );
          },
          borderColor: [
            colorAlpha(ledgerlyChartTheme.money, 0.44),
            colorAlpha(ledgerlyChartTheme.danger, 0.44),
          ],
          borderWidth: 0,
          borderRadius: 6,
          borderSkipped: false,
          barPercentage: 0.58,
          categoryPercentage: 0.62,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      layout: { padding: { top: 6, right: 8, bottom: 2, left: 2 } },
      plugins: ledgerlyChartPlugins(false),
      scales: ledgerlyChartScales(),
    },
  });

  function drawCatBars(totals) {
    catBarsEl.innerHTML = "";
    const max = Math.max(1, ...cats.map((c) => totals[c] || 0));
    const barAccents = {
      food: [ledgerlyChartTheme.money, colorAlpha(ledgerlyChartTheme.money, 0.72)],
      rent: [ledgerlyChartTheme.warning, colorAlpha(ledgerlyChartTheme.warning, 0.72)],
      travel: [ledgerlyChartTheme.primary, colorAlpha(ledgerlyChartTheme.primary, 0.72)],
      shopping: [ledgerlyChartTheme.accent, colorAlpha(ledgerlyChartTheme.accent, 0.72)],
      other: [ledgerlyChartTheme.soft, colorAlpha(ledgerlyChartTheme.soft, 0.72)],
    };

    cats.forEach((c) => {
      const val = totals[c] || 0;
      const row = document.createElement("div");
      row.className = "cat-row";
      row.style.setProperty("--row-accent", barAccents[c][0]);
      row.style.setProperty("--row-accent-2", barAccents[c][1]);
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

// ============================================================================
// Dashboard overview, bill reminders, and section syncing
// ============================================================================

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
  const heroMonthEl = document.getElementById("dashHeroMonth");
  const healthScoreEl = document.getElementById("dashHealthScore");
  const healthLabelEl = document.getElementById("dashHealthLabel");
  const heroNarrativeEl = document.getElementById("dashHeroNarrative");
  const savingsRateEl = document.getElementById("dashSavingsRate");
  const cashFlowEl = document.getElementById("dashCashFlow");
  const spendPaceEl = document.getElementById("dashSpendPace");
  const topCategoryEl = document.getElementById("dashTopCategory");
  const budgetPressureEl = document.getElementById("dashBudgetPressure");
  const billSignalEl = document.getElementById("dashBillSignal");
  const recommendationEl = document.getElementById("dashRecommendation");
  const cashFlowBarsEl = document.getElementById("dashCashFlowBars");
  const pulseSummaryEl = document.getElementById("dashPulseSummary");

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

  function setText(el, value) {
    if (el) el.textContent = value;
  }

  function signedYen(value) {
    const amount = Math.abs(Number(value || 0));
    if (Number(value || 0) < 0) return "-" + yen(amount);
    if (Number(value || 0) > 0) return "+" + yen(amount);
    return yen(0);
  }

  function clamp(number, min, max) {
    return Math.min(max, Math.max(min, number));
  }

  function currentMonthTotals() {
    const expensesByCategory = {};
    let income = 0;
    let expenses = 0;

    getIncomeItems().forEach((it) => {
      const iso = it.dataset.date;
      if (!thisMonth(iso)) return;
      income += Number(it.dataset.amount || 0);
    });

    getExpenseItems().forEach((it) => {
      const iso = it.dataset.date;
      if (!thisMonth(iso)) return;
      const amount = Number(it.dataset.amount || 0);
      const category = (it.dataset.category || "other").toLowerCase();
      expenses += amount;
      expensesByCategory[category] = (expensesByCategory[category] || 0) + amount;
    });

    const balance = income - expenses;
    const savings = Math.max(0, balance);
    const savingsRate = income > 0 ? Math.round((savings / income) * 100) : 0;
    const topCategory = Object.entries(expensesByCategory).sort(
      (a, b) => b[1] - a[1]
    )[0];

    return {
      income,
      expenses,
      balance,
      savings,
      savingsRate,
      expensesByCategory,
      topCategory,
    };
  }

  function getBudgetPressure(expensesByCategory) {
    const budgets = loadBudgetsForCurrentMonth();
    const entries = Object.entries(budgets)
      .map(([category, limit]) => {
        const cleanCategory = String(category || "other").toLowerCase();
        const numericLimit = Number(limit || 0);
        const spent = Number(expensesByCategory[cleanCategory] || 0);
        const pct = numericLimit > 0 ? Math.round((spent / numericLimit) * 100) : 0;
        return { category: cleanCategory, limit: numericLimit, spent, pct };
      })
      .filter((entry) => entry.limit > 0)
      .sort((a, b) => b.pct - a.pct);

    return entries[0] || null;
  }

  function getBillSignal() {
    const counts = { paid: 0, due: 0, overdue: 0, upcoming: 0 };

    billWrap.querySelectorAll(".bill-chip").forEach((chip) => {
      if (chip.classList.contains("chip-paid")) counts.paid += 1;
      if (chip.classList.contains("chip-due")) counts.due += 1;
      if (chip.classList.contains("chip-overdue")) counts.overdue += 1;
      if (chip.classList.contains("chip-upcoming")) counts.upcoming += 1;
    });

    return counts;
  }

  function renderCashFlowPulse() {
    if (!cashFlowBarsEl) {
      return { income: 0, expenses: 0, net: 0, hasData: false };
    }

    const now = new Date();
    const days = [];

    for (let i = 6; i >= 0; i -= 1) {
      const day = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      day.setDate(day.getDate() - i);
      days.push({
        key: localDateKey(day),
        label: fmtShort(day),
        income: 0,
        expenses: 0,
      });
    }

    const dayMap = Object.fromEntries(days.map((day) => [day.key, day]));

    getIncomeItems().forEach((it) => {
      const key = localDateKey(it.dataset.date || new Date());
      if (dayMap[key]) dayMap[key].income += Number(it.dataset.amount || 0);
    });

    getExpenseItems().forEach((it) => {
      const key = localDateKey(it.dataset.date || new Date());
      if (dayMap[key]) dayMap[key].expenses += Number(it.dataset.amount || 0);
    });

    const max = Math.max(
      1,
      ...days.flatMap((day) => [day.income, day.expenses])
    );
    const totals = days.reduce(
      (sum, day) => {
        sum.income += day.income;
        sum.expenses += day.expenses;
        return sum;
      },
      { income: 0, expenses: 0 }
    );
    const net = totals.income - totals.expenses;
    const hasData = totals.income > 0 || totals.expenses > 0;

    cashFlowBarsEl.innerHTML = days
      .map((day) => {
        const incomeHeight = day.income ? clamp(Math.round((day.income / max) * 100), 8, 100) : 4;
        const expenseHeight = day.expenses ? clamp(Math.round((day.expenses / max) * 100), 8, 100) : 4;
        const isEmpty = !day.income && !day.expenses;
        const title = `${day.label}: income ${yen(day.income)}, spending ${yen(day.expenses)}`;

        return `
          <div class="cashflow-day${isEmpty ? " is-empty" : ""}" title="${escapeHtml(title)}">
            <div class="cashflow-day-bars">
              <span class="cashflow-bar income" style="height:${incomeHeight}%"></span>
              <span class="cashflow-bar expense" style="height:${expenseHeight}%"></span>
            </div>
            <span class="cashflow-date">${escapeHtml(day.label)}</span>
          </div>
        `;
      })
      .join("");

    setText(
      pulseSummaryEl,
      hasData ? `${signedYen(net)} net this week` : "No recent activity"
    );

    return { ...totals, net, hasData };
  }

  function updateDashboardIntelligence(snapshot = currentMonthTotals()) {
    const now = new Date();
    const monthName = new Intl.DateTimeFormat(undefined, {
      month: "long",
      year: "numeric",
    }).format(now);
    const budgetPressure = getBudgetPressure(snapshot.expensesByCategory);
    const bills = getBillSignal();
    const hasData = snapshot.income > 0 || snapshot.expenses > 0;
    const sevenDayPulse = renderCashFlowPulse();
    const topCategoryLabel = snapshot.topCategory
      ? `${prettyCategory(snapshot.topCategory[0])} · ${yen(snapshot.topCategory[1])}`
      : "No spend yet";

    let healthScore = null;
    if (hasData) {
      const budgetPenalty = budgetPressure
        ? budgetPressure.pct >= 100
          ? 18
          : budgetPressure.pct >= 90
          ? 12
          : budgetPressure.pct >= 75
          ? 6
          : 0
        : 0;
      const billPenalty = bills.overdue * 12 + bills.due * 6;
      const negativeCashPenalty = snapshot.balance < 0 ? 22 : 0;
      healthScore = Math.round(
        clamp(70 + snapshot.savingsRate * 0.32 - budgetPenalty - billPenalty - negativeCashPenalty, 35, 96)
      );
    }

    let healthLabel = "Waiting for data";
    let healthTone = "";
    if (healthScore !== null) {
      if (healthScore >= 82) {
        healthLabel = "Strong month";
      } else if (healthScore >= 65) {
        healthLabel = "Stable month";
      } else if (healthScore >= 50) {
        healthLabel = "Watch pressure";
        healthTone = "warning";
      } else {
        healthLabel = "Needs attention";
        healthTone = "danger";
      }
    }

    let narrative = "Add income, expenses, budgets, bills, and saving goals to build a clear monthly finance picture.";
    if (hasData && snapshot.balance >= 0) {
      narrative = snapshot.topCategory
        ? `You are keeping ${snapshot.savingsRate}% of income unspent this month, with ${topCategoryLabel.toLowerCase()} as the largest spending signal.`
        : `You are keeping ${snapshot.savingsRate}% of income unspent this month. Add expenses to reveal category pressure and spending trends.`;
    }
    if (hasData && snapshot.balance < 0) {
      narrative = `Spending is ahead of income by ${yen(Math.abs(snapshot.balance))}. Use the budget pressure and top category signals to decide where to tighten next.`;
    }

    let recommendation = "Add your first transaction";
    if (snapshot.balance < 0 && snapshot.topCategory) {
      recommendation = `Reduce ${prettyCategory(snapshot.topCategory[0])} by ${yen(Math.ceil(Math.abs(snapshot.balance) * 0.25))}`;
    } else if (budgetPressure && budgetPressure.pct >= 90) {
      recommendation = `Review ${prettyCategory(budgetPressure.category)} before it crosses the limit`;
    } else if (snapshot.savings > 0) {
      recommendation = `Move ${yen(Math.max(1000, Math.round(snapshot.savings * 0.25)))} toward a saving goal`;
    } else if (snapshot.expenses > 0) {
      recommendation = "Add income to unlock a clearer savings forecast";
    }

    setText(heroMonthEl, monthName);
    setText(healthScoreEl, healthScore === null ? "--" : String(healthScore));
    setText(healthLabelEl, healthLabel);
    setText(heroNarrativeEl, narrative);
    setText(savingsRateEl, `${snapshot.savingsRate}%`);
    setText(cashFlowEl, signedYen(snapshot.balance));
    setText(
      spendPaceEl,
      sevenDayPulse.hasData ? signedYen(sevenDayPulse.net) : "No 7-day data"
    );
    setText(topCategoryEl, topCategoryLabel);
    setText(
      budgetPressureEl,
      budgetPressure
        ? `${prettyCategory(budgetPressure.category)} at ${budgetPressure.pct}%`
        : "No budgets set"
    );
    setText(
      billSignalEl,
      bills.overdue
        ? `${bills.overdue} overdue`
        : bills.due
        ? `${bills.due} due soon`
        : bills.upcoming
        ? `${bills.upcoming} upcoming`
        : "No recurring bills"
    );
    setText(recommendationEl, recommendation);

    cashFlowEl?.classList.toggle("negative", snapshot.balance < 0);
    cashFlowEl?.classList.toggle("positive", snapshot.balance >= 0);
    healthLabelEl?.classList.remove("warning", "danger");
    if (healthTone) healthLabelEl?.classList.add(healthTone);
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
    const snapshot = currentMonthTotals();
    const { income, expenses, balance, savings, savingsRate } = snapshot;

    incomeEl.textContent = yen(income);
    expenseEl.textContent = "-" + yen(expenses);
    balanceEl.textContent = signedYen(balance);
    savingsEl.textContent = yen(savings);
    balanceEl.classList.toggle("negative", balance < 0);
    balanceEl.classList.toggle("positive", balance >= 0);

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
    balChangeEl.querySelector("span:nth-child(2)").textContent =
      balance >= 0 ? "Positive cash flow" : "Spending ahead";
    balChangeEl.classList.toggle("negative", balance < 0);
    balChangeEl.classList.toggle("positive", balance >= 0);
    savNoteEl.querySelector("span:nth-child(2)").textContent =
      income > 0 ? `${savingsRate}% saved this month` : "—";

    updateDashboardIntelligence(snapshot);
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
        <div class="transaction-actions">
          <div class="expense-amount negative">-¥0</div>
        </div>
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
      <div class="transaction-actions">
        <div class="expense-amount negative">-${yen(amount)}</div>
      </div>
    `;
      recentWrap.appendChild(row);
    });
  }

  // Loading Monthly Budget limits to build “reminders”
  function loadBudgetsForCurrentMonth() {
    return getCurrentBudgetMap(currentMonthKey());
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
      updateDashboardIntelligence();
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
      updateDashboardIntelligence();
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
        <div class="transaction-actions">
          <div class="expense-amount negative">-¥${amount.toLocaleString()}</div>
          <button class="tiny-del" aria-label="delete">×</button>
        </div>
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

    updateDashboardIntelligence();
  }

  function redrawAll() {
    renderSummary();
    renderRecentExpenses();
    renderBills();
  }

  // React to changes from other tabs
  document.addEventListener("expenses:changed", redrawAll);
  document.addEventListener("incomes:changed", redrawAll);
  document.addEventListener("budgets:changed", renderSummary);

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

// ============================================================================
// Saving goals
// ============================================================================

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

// ============================================================================
// Quick add and onboarding
// ============================================================================

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

// ============================================================================
// AI finance tools
// ============================================================================

function numberFromMoney(text = "") {
  const value = Number(String(text).replace(/[^\d.-]/g, ""));
  return Number.isFinite(value) ? Math.abs(value) : 0;
}

function readCurrentBudgets(month) {
  return getCurrentBudgetMap(month);
}

function roundMoney(value) {
  const number = Number(value || 0);
  return Number.isFinite(number) ? Math.round(number * 100) / 100 : 0;
}

function formatAiYen(value) {
  const numeric = Number(String(value || "").replace(/[^\d.-]/g, ""));
  if (!Number.isFinite(numeric) || numeric <= 0) return "";
  return "¥" + Math.round(numeric).toLocaleString();
}

function normalizeAiBadge(value) {
  const raw = String(value || "").trim().toLowerCase();
  if (!raw) return "";
  if (raw.includes("likely")) return "Likely";
  if (raw.includes("possible")) return "Possible";
  if (raw.includes("medium")) return "Medium";
  if (raw.includes("high")) return "High";
  if (raw.includes("low")) return "Low";
  return "";
}

function transactionSummaryFromItem(item, type) {
  const title =
    item.querySelector(".expense-details h4")?.textContent?.trim() ||
    (type === "income" ? "Income" : "Expense");

  return {
    type,
    title: title.slice(0, 80),
    category: String(item.dataset.category || "other")
      .toLowerCase()
      .slice(0, 48),
    amount: roundMoney(item.dataset.amount || 0),
    date: localDateKey(item.dataset.date || new Date()),
  };
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
  const transactions = [];
  const currentMonthExpenses = [];

  expenseItems.forEach((item) => {
    const tx = transactionSummaryFromItem(item, "expense");
    transactions.push(tx);

    if (!isSameLocalMonth(item.dataset.date, now)) return;
    const amount = Number(item.dataset.amount || 0);
    const category = (item.dataset.category || "other")
      .toLowerCase()
      .slice(0, 48);
    expenses += amount;
    categoryTotals[category] = (categoryTotals[category] || 0) + amount;
    currentMonthExpenses.push(tx);
  });

  let income = 0;
  incomeItems.forEach((item) => {
    const tx = transactionSummaryFromItem(item, "income");
    transactions.push(tx);

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
        limit: roundMoney(limit || 0),
        spent: roundMoney(categoryTotals[key] || 0),
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
  const savings = Math.max(0, balance);
  const savingsRate = income > 0 ? Math.round((savings / income) * 100) : 0;
  const largestRecentTransactions = currentMonthExpenses
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 8);

  return {
    currency: "JPY",
    month,
    income: roundMoney(income),
    expenses: roundMoney(expenses),
    balance: roundMoney(balance),
    savings: roundMoney(savings),
    savings_rate: savingsRate,
    category_spending: categorySpending,
    budgets,
    saving_goals: {
      count: savingGoals.count,
      target_total: roundMoney(savingGoals.target_total),
      saved_total: roundMoney(savingGoals.saved_total),
    },
    bills,
    largest_recent_transactions: largestRecentTransactions,
    transactions: transactions
      .sort((a, b) => dateFromAny(b.date) - dateFromAny(a.date))
      .slice(0, 100),
  };
}

function collectAiChatContext() {
  const summary = collectAiFinanceSummary();

  return {
    currency: summary.currency,
    month: summary.month,
    income: summary.income,
    expenses: summary.expenses,
    balance: summary.balance,
    savings: summary.savings,
    savings_rate: summary.savings_rate,
    category_spending: summary.category_spending.slice(0, 8),
    budgets: summary.budgets.slice(0, 8),
    saving_goals: summary.saving_goals,
    bills: summary.bills,
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
  resetAiOutputScroll(output);
}

function appendAiText(parent, text, className) {
  if (!text) return;
  const el = document.createElement("div");
  el.className = className;
  el.textContent = text;
  parent.appendChild(el);
}

function appendAiMeta(parent, label, value, asBadge = false) {
  if (!value) return;

  const row = document.createElement("div");
  row.className = "ai-output-meta-row";

  const labelEl = document.createElement("span");
  labelEl.className = "ai-output-meta-label";
  labelEl.textContent = label;
  row.appendChild(labelEl);

  const valueEl = document.createElement("span");
  valueEl.className = asBadge ? "ai-output-badge" : "ai-output-meta-value";
  valueEl.textContent = value;
  row.appendChild(valueEl);

  parent.appendChild(row);
}

function resetAiOutputScroll(output) {
  output.scrollTop = 0;
}

function renderAiEmptyState(output, message) {
  output.textContent = "";
  output.classList.remove("has-advice");
  output.classList.remove("ai-output-loading");
  output.classList.add("ai-output-empty");

  const card = document.createElement("div");
  card.className = "ai-output-item ai-output-empty-card";
  appendAiText(card, message, "ai-output-detail");

  output.appendChild(card);
  resetAiOutputScroll(output);
}

function renderAiLoadingState(output, message) {
  output.textContent = "";
  output.classList.remove("has-advice", "ai-output-empty");
  output.classList.add("ai-output-loading");

  const card = document.createElement("div");
  card.className = "ai-loading-card";

  const header = document.createElement("div");
  header.className = "ai-loading-header";

  const dots = document.createElement("span");
  dots.className = "ai-loading-dots";
  for (let i = 0; i < 3; i += 1) {
    const dot = document.createElement("span");
    dots.appendChild(dot);
  }

  const label = document.createElement("span");
  label.textContent = message;

  header.appendChild(dots);
  header.appendChild(label);
  card.appendChild(header);

  for (let i = 0; i < 3; i += 1) {
    const skeleton = document.createElement("div");
    skeleton.className = "ai-loading-skeleton";
    card.appendChild(skeleton);
  }

  output.appendChild(card);
  resetAiOutputScroll(output);
}

function renderAiItems(output, items, emptyMessage) {
  output.textContent = "";
  output.classList.remove("ai-output-empty", "ai-output-loading");
  output.classList.add("has-advice");

  if (!Array.isArray(items) || !items.length) {
    renderAiEmptyState(output, emptyMessage);
    return;
  }

  const list = document.createElement("div");
  list.className = "ai-output-list";

  items.slice(0, 5).forEach((item) => {
    const card = document.createElement("div");
    card.className = "ai-output-item";

    if (typeof item === "string") {
      appendAiText(card, item, "ai-output-title");
      list.appendChild(card);
      return;
    }

    const title = item.title || item.category || "Insight";
    const amount = formatAiYen(item.amount);
    const priority = normalizeAiBadge(item.priority);
    const confidence = normalizeAiBadge(item.confidence);
    const description = item.description || item.detail || item.reason || "";
    const action = item.action ? `Action: ${item.action}` : "";

    appendAiText(card, title, "ai-output-title");
    appendAiMeta(card, "Estimated amount:", amount);
    appendAiMeta(card, "Priority:", priority, true);
    appendAiMeta(card, "Confidence:", confidence, true);
    appendAiText(card, description, "ai-output-detail");
    appendAiText(card, action, "ai-output-action");

    list.appendChild(card);
  });

  output.appendChild(list);
  resetAiOutputScroll(output);
}

function wireAiFinanceCoach() {
  const panel = document.getElementById("aiCoachPanel");
  const button = document.getElementById("aiCoachButton");
  const output = document.getElementById("aiCoachOutput");
  const loading = document.getElementById("aiCoachLoading");
  const error = document.getElementById("aiCoachError");

  if (!panel || !button || !output || !loading || !error) return;

  button.addEventListener("click", async () => {
    const loadingMessage =
      loading.textContent.trim() || "Analyzing your month...";

    button.disabled = true;
    loading.textContent = loadingMessage;
    loading.classList.add("hidden");
    renderAiLoadingState(output, loadingMessage);
    error.classList.add("hidden");
    error.textContent = "";

    try {
      await ensureBudgetSnapshotLoaded();
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
      renderAiEmptyState(
        output,
        "Your AI Finance Coach summary will appear here."
      );
    } finally {
      loading.classList.add("hidden");
      button.disabled = false;
    }
  });
}

function wireAiItemsPanel(config) {
  const button = document.getElementById(config.buttonId);
  const output = document.getElementById(config.outputId);
  const loading = document.getElementById(config.loadingId);
  const error = document.getElementById(config.errorId);

  if (!button || !output || !loading || !error) return;

  renderAiEmptyState(output, output.textContent.trim() || config.emptyMessage);

  button.addEventListener("click", async () => {
    button.disabled = true;
    loading.textContent = config.loadingMessage;
    loading.classList.add("hidden");
    renderAiLoadingState(output, config.loadingMessage);
    error.classList.add("hidden");
    error.textContent = "";

    try {
      await ensureBudgetSnapshotLoaded();
      const res = await apiFetch(config.endpoint, {
        method: "POST",
        body: JSON.stringify({ summary: collectAiFinanceSummary() }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok || data.success === false) {
        throw new Error(data.message || config.errorMessage);
      }

      renderAiItems(output, data.items || [], config.emptyMessage);
    } catch (err) {
      error.textContent = err.message || config.errorMessage;
      error.classList.remove("hidden");
      renderAiEmptyState(output, config.emptyMessage);
    } finally {
      loading.classList.add("hidden");
      button.disabled = false;
    }
  });
}

function appendAiChatMessage(messages, role, text) {
  const bubble = document.createElement("div");
  bubble.className = `ai-chat-message ${role}`;
  bubble.textContent = String(text || "").trim();
  messages.appendChild(bubble);
  messages.scrollTop = messages.scrollHeight;
}

function setAiChatLoading(loading, isLoading) {
  loading.classList.toggle("hidden", !isLoading);
}

function wireAiChatbot() {
  const panel = document.getElementById("aiChatPanel");
  const toggle = document.getElementById("aiChatToggle");
  const body = panel?.querySelector(".ai-chat-body");
  const messages = document.getElementById("aiChatMessages");
  const input = document.getElementById("aiChatInput");
  const send = document.getElementById("aiChatSend");
  const error = document.getElementById("aiChatError");
  const loading = document.getElementById("aiChatLoading");

  if (
    !panel ||
    !toggle ||
    !body ||
    !messages ||
    !input ||
    !send ||
    !error ||
    !loading
  ) {
    return;
  }

  function setChatCollapsed(collapsed, shouldFocus = false) {
    panel.classList.toggle("is-collapsed", collapsed);
    body.hidden = collapsed;
    toggle.textContent = collapsed ? "Open chat" : "Collapse chat";
    toggle.setAttribute("aria-expanded", String(!collapsed));
    toggle.setAttribute(
      "aria-label",
      collapsed ? "Open chat" : "Collapse chat"
    );

    if (!collapsed) {
      messages.scrollTop = messages.scrollHeight;
      if (shouldFocus) input.focus();
    }
  }

  setChatCollapsed(panel.classList.contains("is-collapsed"));

  toggle.addEventListener("click", () => {
    setChatCollapsed(!panel.classList.contains("is-collapsed"), true);
  });

  async function submitMessage() {
    const message = input.value.trim();
    if (!message || send.disabled) return;

    error.classList.add("hidden");
    error.textContent = "";
    appendAiChatMessage(messages, "user", message);
    input.value = "";
    send.disabled = true;
    input.disabled = true;
    setAiChatLoading(loading, true);

    try {
      await ensureBudgetSnapshotLoaded();
      const res = await apiFetch("/api/ai/chat", {
        method: "POST",
        body: JSON.stringify({
          message,
          context: collectAiChatContext(),
        }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok || data.success === false) {
        throw new Error(data.message || "AI Chatbot is unavailable right now.");
      }

      appendAiChatMessage(
        messages,
        "assistant",
        data.reply || "I could not generate a response. Please try again."
      );
    } catch (err) {
      error.textContent = err.message || "AI Chatbot is unavailable right now.";
      error.classList.remove("hidden");
    } finally {
      setAiChatLoading(loading, false);
      send.disabled = false;
      input.disabled = false;
      if (!body.hidden) input.focus();
    }
  }

  send.addEventListener("click", submitMessage);
  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      submitMessage();
    }
  });
}

function wireAiFeaturePanels() {
  [
    {
      buttonId: "aiMonthlyInsightsButton",
      outputId: "aiMonthlyInsightsOutput",
      loadingId: "aiMonthlyInsightsLoading",
      errorId: "aiMonthlyInsightsError",
      endpoint: "/api/ai/monthly-insights",
      loadingMessage: "Analyzing spending patterns...",
      emptyMessage: "No monthly insights returned. Please try again.",
      errorMessage: "AI Monthly Spending Insights is unavailable right now.",
    },
    {
      buttonId: "aiSubscriptionButton",
      outputId: "aiSubscriptionOutput",
      loadingId: "aiSubscriptionLoading",
      errorId: "aiSubscriptionError",
      endpoint: "/api/ai/subscription-detector",
      loadingMessage: "Reviewing recurring transactions...",
      emptyMessage: "No recurring spending patterns returned.",
      errorMessage: "AI Subscription Detector is unavailable right now.",
    },
    {
      buttonId: "aiForecastButton",
      outputId: "aiForecastOutput",
      loadingId: "aiForecastLoading",
      errorId: "aiForecastError",
      endpoint: "/api/ai/budget-forecast",
      loadingMessage: "Forecasting next month...",
      emptyMessage: "No forecast suggestions returned. Please try again.",
      errorMessage: "AI Budget Forecast is unavailable right now.",
    },
  ].forEach(wireAiItemsPanel);
}

document.addEventListener("DOMContentLoaded", wireFloatingQuickAdd);
document.addEventListener("DOMContentLoaded", wireOnboarding);
document.addEventListener("DOMContentLoaded", wireAiFinanceCoach);
document.addEventListener("DOMContentLoaded", wireAiFeaturePanels);
document.addEventListener("DOMContentLoaded", wireAiChatbot);
