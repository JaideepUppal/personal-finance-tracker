<section id="monthly-budget" class="content-section">
  <h1 class="section-title">Monthly Budget</h1>

  <div class="filters-bar">
    <span id="budTotalLimit" class="total-pill">Budget: ¥0</span>
    <span id="budTotalSpent" class="total-pill">Spent: ¥0</span>
    <span id="budTotalRemain" class="total-pill">Left: ¥0</span>
  </div>

  <div class="panel">
    <div class="panel-header">
      <h2 class="panel-title">Set category limit</h2>
    </div>
    <div class="add-row">
      <select id="budCategory" class="filter-select">
        <option value="food">Food</option>
        <option value="rent">Rent</option>
        <option value="travel">Travel</option>
        <option value="shopping">Shopping</option>
        <option value="other">Other</option>
        <option value="__custom__">Custom</option>
      </select>
      <input
        id="budAmount"
        class="filter-input"
        type="number"
        inputmode="decimal"
        placeholder="Limit this month (¥)"
      />
      <input
        id="budCategoryCustom"
        class="filter-input"
        type="text"
        placeholder="Enter custom category"
        style="display:none"
      />
      <button id="budAddBtn" class="filter-btn">Add / Update</button>
    </div>
  </div>

  <div class="panel">
    <div class="budget-wrapper">
      <h2 class="section-title">Your Categories</h2>
    </div>

      <div id="budgetList"></div>
  </div>
</section>
