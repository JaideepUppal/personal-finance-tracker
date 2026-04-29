<div id="quickAddCard" class="panel hidden">
  <div class="panel-header">
    <h2 class="panel-title">Quick Add Expense</h2>
  </div>
  <div class="add-row">
    <input
      id="qExpTitle"
      class="filter-input"
      type="text"
      placeholder="e.g., Ramen, Rent, Taxi"
    />
    <input
      id="qExpAmount"
      class="filter-input"
      type="number"
      inputmode="decimal"
      placeholder="Amount (¥)"
    />
    <input
      id="qExpCategoryCustom"
      type="text"
      class="filter-input"
      placeholder="Enter custom category"
      style="display:none;margin-top:8px"
    />
    <select id="qExpCategory" class="filter-select">
      <option value="food">Food</option>
      <option value="rent">Rent</option>
      <option value="travel">Travel</option>
      <option value="shopping">Shopping</option>
      <option value="other">Other</option>
      <option value="__custom__">Custom</option>
    </select>
    <button id="qExpAddBtn" class="filter-btn">Add</button>
    <button id="qExpCancelBtn" class="filter-btn">Cancel</button>
  </div>
</div>

<button
  id="floatingQuickAdd"
  class="add-btn"
  type="button"
  aria-label="Quick add expense"
>
  +
</button>
