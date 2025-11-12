/* dashboard.js
   Shows simple totals and budget info.
*/
(function () {
  // total spend this month
  var total = totalThisMonth();
  document.getElementById("kTotal").textContent = yen(total);

  // average per day (up to today)
  var daysPassed = new Date().getDate();
  var avg = Math.round(total / (daysPassed || 1));
  document.getElementById("kAvg").textContent = yen(avg);

  // top category this month
  document.getElementById("kTop").textContent = topCategoryThisMonth();

  // budget
  var budgets = getBudgets();
  var mk = monthKey();
  var budget = Number(budgets[mk] || 0);
  var remain = Math.max(0, budget - total);
  document.getElementById("kRemain").textContent = yen(remain);
  document.getElementById("kBudgetNote").textContent = budget
    ? "(Budget set: " + yen(budget) + ")"
    : "(No budget set)";
})();
