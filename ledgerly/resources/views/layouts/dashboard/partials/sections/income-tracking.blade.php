<section id="income-tracking" class="content-section">
  <div class="section-heading">
    <p class="section-kicker">Cash inflows</p>
    <h1 class="section-title">Income Tracking</h1>
  </div>

  <div class="filters-bar">
    <input
      id="incSearch"
      class="filter-input"
      type="text"
      placeholder="Search income..."
    />
    <span id="incTotal" class="total-pill">¥0</span>
  </div>

  <div class="panel">
    <div class="panel-header">
      <div>
        <p class="panel-kicker">Capture income</p>
      <h2 class="panel-title">Add Income</h2>
      </div>
    </div>
    <div class="add-row">
      <input
        id="incTitle"
        class="filter-input"
        type="text"
        placeholder="e.g., Part-time job, Allowance"
      />
      <div class="amount-wrapperInc">
        <p id="incAmountError" class="incAmountError">
          Amount cannot be negative.
          </p>
      <input
              id="incAmount"
              class="filter-input"
              type="number"
              inputmode="decimal"
              placeholder="Amount (¥)"
            />
        </div>

      <select id="incCategory" class="filter-select">
        <option value="part-time">Part-time</option>
        <option value="allowance">Allowance</option>
        <option value="stipend">Stipend</option>
        <option value="scholarship">Scholarship</option>
        <option value="other">Other</option>
        <option value="__custom__">Custom</option>
      </select>

      <input
        id="incCategoryCustom"
        class="filter-input"
        type="text"
        placeholder="Enter custom category"
        style="display:none"
      />
      <input id="incDate" class="filter-input" type="date" />
      <button id="incAddBtn" class="filter-btn">Add</button>
    </div>
  </div>

  <div class="analytics-grid">
    <div class="chart-container panel">
      <div class="panel-header">
        <div>
          <p class="panel-kicker">Trend view</p>
        <h2 class="panel-title">Income Trend (Last 7 entries)</h2>
        </div>
      </div>
      <canvas id="incLineChart" role="img" aria-label="Income trend chart for recent income"></canvas>
    </div>

    <div class="chart-container panel">
      <div class="panel-header">
        <div>
          <p class="panel-kicker">Source mix</p>
        <h2 class="panel-title">Source Breakdown</h2>
        </div>
      </div>
      <canvas id="incPieChart" role="img" aria-label="Income source breakdown chart"></canvas>
    </div>
  </div>

  <div class="panel">
    <div class="panel-header">
      <div>
        <p class="panel-kicker">Ledger feed</p>
      <h2 class="panel-title">Recent Income</h2>
      </div>
    </div>
    <div class="expense-list" id="incomeList">
    </div>
  </div>
</section>
