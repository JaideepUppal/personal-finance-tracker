/* goals.js
   Minimal manual goal tracking. Click "Add progress" to increase saved amount.
*/
(function () {
  var list = document.getElementById("goalsList");
  var nameEl = document.getElementById("goalName");
  var targetEl = document.getElementById("goalTarget");

  function render() {
    var arr = getGoals();
    list.innerHTML = "";
    if (arr.length === 0) {
      list.innerHTML =
        '<div class="card">No goals yet. Create one above.</div>';
      return;
    }
    arr.forEach(function (g) {
      var pct = Math.min(100, Math.round((g.progress / g.target) * 100));
      var row = document.createElement("div");
      row.className = "list-item";
      row.innerHTML = `
        <div>
          <div style="font-weight:700">${g.name}</div>
          <div class="badge">${yen(g.progress)} / ${yen(
        g.target
      )} (${pct}%)</div>
        </div>
        <div>
          <button class="btn" data-add="${g.id}">Add progress</button>
          <button class="btn ghost" data-del="${g.id}">Delete</button>
        </div>
      `;
      list.appendChild(row);
    });

    // Wire buttons
    list.querySelectorAll("[data-add]").forEach(function (b) {
      b.addEventListener("click", function () {
        var id = b.getAttribute("data-add");
        var amt = Number(prompt("How much did you save (¥)?", "1000") || 0);
        if (amt > 0) {
          var arr = getGoals();
          var i = arr.findIndex(function (x) {
            return x.id === id;
          });
          if (i >= 0) {
            arr[i].progress += amt;
            saveGoals(arr);
            render();
          }
        }
      });
    });
    list.querySelectorAll("[data-del]").forEach(function (b) {
      b.addEventListener("click", function () {
        var id = b.getAttribute("data-del");
        var arr = getGoals().filter(function (x) {
          return x.id !== id;
        });
        saveGoals(arr);
        render();
      });
    });
  }

  document.getElementById("addGoal").addEventListener("click", function () {
    var name = (nameEl.value || "").trim();
    var target = Number(targetEl.value || 0);
    if (!name || !target) {
      return;
    }
    var arr = getGoals();
    arr.push({
      id: crypto.randomUUID(),
      name: name,
      target: target,
      progress: 0,
      createdAt: Date.now(),
    });
    saveGoals(arr);
    nameEl.value = "";
    targetEl.value = "";
    render();
  });

  // Seed one example goal (optional; delete later)
  if (getGoals().length === 0) {
    saveGoals([
      {
        id: crypto.randomUUID(),
        name: "Emergency Fund",
        target: 50000,
        progress: 5000,
        createdAt: Date.now(),
      },
    ]);
  }

  render();
})();
