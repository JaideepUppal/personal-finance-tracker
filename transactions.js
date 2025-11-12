/* transactions.js
   Simple read-only table with search + CSV export.
*/
(function () {
  var q = document.getElementById("q");
  var cat = document.getElementById("cat");
  var tbody = document.getElementById("tbody");

  function filtered() {
    var term = (q.value || "").trim().toLowerCase();
    var chosen = cat.value;
    return getExpenses()
      .filter(function (e) {
        var okText =
          !term ||
          (e.desc || "").toLowerCase().includes(term) ||
          (e.method || "").toLowerCase().includes(term);
        var okCat = chosen === "all" || e.category === chosen;
        return okText && okCat;
      })
      .sort(function (a, b) {
        var d = b.date.localeCompare(a.date);
        if (d !== 0) return d;
        return (b.createdAt || 0) - (a.createdAt || 0);
      });
  }

  function render() {
    var items = filtered();
    tbody.innerHTML = items
      .map(function (e) {
        return (
          "<tr>" +
          "<td>" +
          (e.date || "") +
          "</td>" +
          "<td>" +
          (e.desc || "") +
          "</td>" +
          "<td>" +
          (e.category || "") +
          "</td>" +
          "<td>" +
          (e.method || "—") +
          "</td>" +
          "<td class='right'>-" +
          yen(e.amount) +
          "</td>" +
          "</tr>"
        );
      })
      .join("");
  }

  function toCSV(items) {
    var header = ["date", "description", "category", "method", "amount"];
    var rows = items.map(function (e) {
      return [e.date, e.desc, e.category, e.method || "", e.amount];
    });
    var lines = [header]
      .concat(rows)
      .map(function (r) {
        return r
          .map(function (v) {
            v = String(v == null ? "" : v);
            return '"' + v.replace(/"/g, '""') + '"';
          })
          .join(",");
      })
      .join("\n");
    return new Blob([lines], { type: "text/csv;charset=utf-8" });
  }

  document.getElementById("exportBtn").addEventListener("click", function () {
    var blob = toCSV(filtered());
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "transactions.csv";
    a.click();
    URL.revokeObjectURL(a.href);
  });

  q.addEventListener("input", render);
  cat.addEventListener("change", render);

  render();
})();
