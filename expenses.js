/* expenses.js
   Beginner-friendly CRUD for expenses, plus a simple filter and budget setter.
*/

(function () {
  // Shortcuts to DOM elements
  var list = document.getElementById("list");
  var search = document.getElementById("search");
  var cat = document.getElementById("cat");

  // Modal elements
  var modal = document.getElementById("modal");
  var backdrop = document.getElementById("backdrop");
  var modalTitle = document.getElementById("modalTitle");
  var eid = document.getElementById("eid");
  var desc = document.getElementById("desc");
  var amt = document.getElementById("amt");
  var catIn = document.getElementById("catIn");
  var dateIn = document.getElementById("dateIn");
  var method = document.getElementById("method");

  // Budget UI
  var budgetInput = document.getElementById("budgetInput");
  var budgetHint = document.getElementById("budgetHint");

  // Open/close modal helpers
  function openModal(title, item) {
    modalTitle.textContent = title || "Add Expense";
    eid.value = item ? item.id : "";
    desc.value = item ? item.desc : "";
    amt.value = item ? item.amount : "";
    catIn.value = item ? item.category : "other";
    dateIn.value = item ? item.date : todayStr();
    method.value = item ? item.method || "" : "";
    backdrop.style.display = "block";
    modal.style.display = "flex";
  }
  function closeModal() {
    backdrop.style.display = "none";
    modal.style.display = "none";
  }

  // Render expense list (with optional filtering)
  function render() {
    var q = (search.value || "").trim().toLowerCase();
    var chosen = cat.value;

    var items = getExpenses().filter(function (e) {
      var okText =
        !q ||
        (e.desc || "").toLowerCase().includes(q) ||
        (e.method || "").toLowerCase().includes(q);
      var okCat = chosen === "all" || e.category === chosen;
      return okText && okCat;
    });

    // Sort newest first (by date then created time)
    items.sort(function (a, b) {
      var d = b.date.localeCompare(a.date);
      if (d !== 0) return d;
      return (b.createdAt || 0) - (a.createdAt || 0);
    });

    // Show the list
    list.innerHTML = "";
    if (items.length === 0) {
      list.innerHTML =
        '<div class="list-item"><div>No expenses yet.</div></div>';
      return;
    }

    items.forEach(function (e) {
      var row = document.createElement("div");
      row.className = "list-item";
      row.innerHTML = `
        <div>
          <div style="font-weight:700">${e.desc}</div>
          <div class="badge">${e.date} · ${e.method || "—"} · ${
        e.category
      }</div>
        </div>
        <div style="display:flex; gap:8px; align-items:center;">
          <div style="min-width:120px; text-align:right; font-weight:800">-${yen(
            e.amount
          )}</div>
          <button class="btn" data-edit="${e.id}">Edit</button>
          <button class="btn ghost" data-del="${e.id}">Delete</button>
        </div>
      `;
      list.appendChild(row);
    });

    // Hook up edit/delete buttons
    list.querySelectorAll("[data-edit]").forEach(function (b) {
      b.addEventListener("click", function () {
        var id = b.getAttribute("data-edit");
        var item = getExpenses().find(function (x) {
          return x.id === id;
        });
        if (item) openModal("Edit Expense", item);
      });
    });
    list.querySelectorAll("[data-del]").forEach(function (b) {
      b.addEventListener("click", function () {
        var id = b.getAttribute("data-del");
        deleteExpense(id);
        render();
      });
    });

    // Update budget hint
    var mk = monthKey();
    var budgets = getBudgets();
    var b = Number(budgets[mk] || 0);
    budgetHint.textContent = b
      ? "Budget for " + mk + ": " + yen(b)
      : "No budget set";
  }

  // Add/Edit submit
  document.getElementById("form").addEventListener("submit", function (e) {
    e.preventDefault();
    var payload = {
      desc: desc.value.trim(),
      amount: Number(amt.value),
      category: catIn.value,
      date: dateIn.value,
      method: method.value.trim(),
    };
    if (!payload.desc || !payload.amount || !payload.date) return;

    var id = eid.value;
    if (id) {
      updateExpense(id, payload);
    } else {
      addExpense(payload);
    }
    closeModal();
    render();
  });

  // Wire up UI events
  document.getElementById("addBtn").addEventListener("click", function () {
    openModal("Add Expense");
  });
  document.getElementById("close").addEventListener("click", closeModal);
  document.getElementById("cancel").addEventListener("click", closeModal);
  document.getElementById("backdrop").addEventListener("click", closeModal);

  search.addEventListener("input", render);
  cat.addEventListener("change", render);
  document.getElementById("reset").addEventListener("click", function () {
    search.value = "";
    cat.value = "all";
    render();
  });

  // Save monthly budget
  document
    .getElementById("saveBudgetBtn")
    .addEventListener("click", function () {
      var mk = monthKey();
      var map = getBudgets();
      map[mk] = Math.max(0, Number(budgetInput.value || 0));
      saveBudgets(map);
      render();
    });

  // Seed demo data for first-time users
  if (getExpenses().length === 0) {
    addExpense({
      desc: "Bus",
      amount: 220,
      category: "travel",
      date: todayStr(),
      method: "Suica",
    });
    addExpense({
      desc: "Groceries",
      amount: 1700,
      category: "food",
      date: todayStr(),
      method: "Cash",
    });
  }

  // Start
  render();
})();
