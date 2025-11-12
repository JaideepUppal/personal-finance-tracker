/* utils.js
   Shared helper functions and localStorage access.
*/

// ----- Keys for localStorage -----
var LS_EXPENSES = "pet:expenses";
var LS_BUDGETS = "pet:budgets"; // map like { "YYYY-MM": 100000 }
var LS_GOALS = "pet:goals";

// ----- Date + format helpers -----
function pad(n) {
  return n < 10 ? "0" + n : "" + n;
}
function todayStr() {
  var d = new Date();
  return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
}
function monthKey(d) {
  d = d || new Date();
  return d.getFullYear() + "-" + pad(d.getMonth() + 1);
}
function yen(n) {
  return "¥" + Number(n || 0).toLocaleString("ja-JP");
}

// ----- Storage helpers -----
function getExpenses() {
  try {
    return JSON.parse(localStorage.getItem(LS_EXPENSES)) || [];
  } catch (e) {
    return [];
  }
}
function saveExpenses(arr) {
  localStorage.setItem(LS_EXPENSES, JSON.stringify(arr));
}
function addExpense(item) {
  var arr = getExpenses();
  item.id = crypto.randomUUID();
  item.createdAt = Date.now();
  item.amount = Number(item.amount);
  arr.push(item);
  saveExpenses(arr);
}
function updateExpense(id, patch) {
  var arr = getExpenses();
  var i = arr.findIndex(function (x) {
    return x.id === id;
  });
  if (i >= 0) {
    var old = arr[i];
    arr[i] = Object.assign({}, old, patch);
    arr[i].amount = Number(arr[i].amount);
    saveExpenses(arr);
  }
}
function deleteExpense(id) {
  var arr = getExpenses().filter(function (x) {
    return x.id !== id;
  });
  saveExpenses(arr);
}

function getBudgets() {
  try {
    return JSON.parse(localStorage.getItem(LS_BUDGETS)) || {};
  } catch (e) {
    return {};
  }
}
function saveBudgets(map) {
  localStorage.setItem(LS_BUDGETS, JSON.stringify(map));
}

function getGoals() {
  try {
    return JSON.parse(localStorage.getItem(LS_GOALS)) || [];
  } catch (e) {
    return [];
  }
}
function saveGoals(arr) {
  localStorage.setItem(LS_GOALS, JSON.stringify(arr));
}

// ----- Simple calculations -----
function totalThisMonth() {
  var mk = monthKey();
  return getExpenses()
    .filter(function (e) {
      return (e.date || "").slice(0, 7) === mk;
    })
    .reduce(function (a, b) {
      return a + Number(b.amount);
    }, 0);
}

function topCategoryThisMonth() {
  var mk = monthKey();
  var sum = {};
  getExpenses().forEach(function (e) {
    if ((e.date || "").slice(0, 7) === mk) {
      sum[e.category] = (sum[e.category] || 0) + Number(e.amount);
    }
  });
  var best = "-",
    max = 0;
  Object.keys(sum).forEach(function (k) {
    if (sum[k] > max) {
      max = sum[k];
      best = k;
    }
  });
  return best === "-" ? "—" : best;
}
