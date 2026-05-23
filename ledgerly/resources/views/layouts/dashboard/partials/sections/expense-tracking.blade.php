<section id="expense-tracking" class="content-section">
  <div class="section-heading">
    <p class="section-kicker">Your spending</p>
    <h1 class="section-title">Expense Tracking</h1>
  </div>

  <!-- Top bar -->
  <div class="filters-bar">
    <input
      id="expSearch"
      class="filter-input"
      type="text"
      placeholder="Search expenses..."
    />
    <span id="expTotal" class="total-pill">-¥0</span>
  </div>

  <!-- Add expense -->
  <div class="panel">
    <div class="panel-header">
      <div>
        <p class="panel-kicker">Add expense</p>
      <h2 class="panel-title">Add Expense</h2>
      </div>
    </div>

    <div class="add-row">
      <input
        id="expTitle"
        class="filter-input"
        type="text"
        placeholder="e.g., Ramen, Rent, Taxi"
      />
      <div class="amount-wrapper">
      <p id="expAmountError" class="expAmountError">
        Amount cannot be negative.
        </p>

      <input
        id="expAmount"
        class="filter-input"
        type="number"
        inputmode="decimal"
        placeholder="Amount (¥)"
      />
    </div>

      <select id="expCategory" class="filter-select">
        <option value="food">Food</option>
        <option value="rent">Rent</option>
        <option value="travel">Travel</option>
        <option value="shopping">Shopping</option>
        <option value="other">Other</option>
        <option value="__custom__">Custom</option>
      </select>

      <input
        id="expCategoryCustom"
        class="filter-input"
        type="text"
        placeholder="Enter custom category"
        style="display:none;"
      />

      <input id="expDate" class="filter-input" type="date" />

      <label class="recurring-toggle">
        <input id="expRecurring" type="checkbox" />
        <span>Recurring monthly</span>
      </label>

      <button id="expAddBtn" class="filter-btn" type="button">Add</button>
    </div>
  </div>

  <!-- Analytics -->
  <div class="analytics-grid">
    <div class="chart-container panel">
      <div class="panel-header">
        <div>
          <p class="panel-kicker">Trend view</p>
        <h2 class="panel-title">Spending Trend (Recent 7)</h2>
        </div>
      </div>
      <canvas id="expLineChart" role="img" aria-label="Expense trend chart for recent expenses"></canvas>
    </div>

    <div class="chart-container panel">
      <div class="panel-header">
        <div>
          <p class="panel-kicker">Allocation</p>
        <h2 class="panel-title">Category Breakdown</h2>
        </div>
      </div>
      <canvas id="expPieChart" role="img" aria-label="Expense category breakdown chart"></canvas>
    </div>
  </div>

  <!-- List -->
  <div class="panel">
    <div class="panel-header">
      <div>
        <p class="panel-kicker">Recent expenses</p>
      <h2 class="panel-title">Recent Expenses</h2>
      </div>

       <!--  Sort dropdown just for Expense Tracking -->
      <select id="expSort" class="filter-select">
        <option value="default">Default</option>
        <option value="date_desc">Newest</option>
        <option value="date_asc">Oldest</option>
        <option value="amount_desc">High → Low</option>
        <option value="amount_asc">Low → High</option>
      </select>
    </div>
    <div class="expense-list" id="expenseList"></div>
  </div>
</section>
