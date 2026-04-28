<section id="dashboard" class="content-section active">
  <h1 class="section-title">Dashboard</h1>

  <!-- Summary Cards  -->
  <div class="summary-grid">
    <div class="summary-card">
      <div class="card-label">Total Income (This Month)</div>
      <div class="card-amount positive" id="dashTotalIncome" aria-live="polite">¥0</div>
      <div class="card-change positive" id="dashIncomeChange">
        <span></span>
        <span>—</span>
      </div>
    </div>

    <div class="summary-card">
      <div class="card-label">Total Expenses (This Month)</div>
      <div class="card-amount negative" id="dashTotalExpenses" aria-live="polite">-¥0</div>
      <div class="card-change negative" id="dashExpenseChange">
        <span></span>
        <span>—</span>
      </div>
    </div>

    <div class="summary-card">
      <div class="card-label">Balance (Income − Expenses)</div>
      <div class="card-amount" id="dashBalance" aria-live="polite">¥0</div>
      <div class="card-change positive" id="dashBalanceChange">
        <span></span>
        <span>—</span>
      </div>
    </div>

    <div class="summary-card">
      <div class="card-label">Savings (This Month)</div>
      <div class="card-amount positive" id="dashSavings" aria-live="polite">¥0</div>
      <div class="card-change positive" id="dashSavingsNote">
        <span></span>
        <span>—</span>
      </div>
    </div>
  </div>

  <div id="aiCoachPanel" class="panel ai-coach-panel">
    <div class="panel-header ai-coach-header">
      <div>
        <h2 class="panel-title">AI Finance Coach</h2>
        <p class="ai-coach-copy">
          Get a quick spending summary and practical next steps based on your current Ledgerly dashboard.
        </p>
      </div>
      <button id="aiCoachButton" class="filter-btn ai-coach-button" type="button">
        Analyze my month
      </button>
    </div>
    <div id="aiCoachLoading" class="ai-coach-loading hidden" aria-live="polite">
      Analyzing your month...
    </div>
    <div id="aiCoachError" class="ai-coach-error hidden" role="alert" aria-live="polite"></div>
    <div id="aiCoachOutput" class="ai-coach-output" aria-live="polite">
      Your AI Finance Coach summary will appear here.
    </div>
  </div>

  <!-- Two Column Layout -->
  <div class="two-column">
    <!-- Recent Expenses (live from Expense Tracking) -->
    <div class="panel">
      <div class="panel-header">
        <h2 class="panel-title">Recent Expenses</h2>
        <a class="view-all" data-section="expense-tracking">View All</a>
      </div>
      <div class="expense-list" id="dashRecentExpenses" aria-live="polite"></div>
    </div>

    <!-- Bill Reminders (derived from budgets + heuristics) -->
    <div class="panel">
      <div class="panel-header">
        <h2 class="panel-title">Bill Reminders</h2>
        <a class="view-all" data-section="monthly-budget"></a>
      </div>
      <div class="bill-list" id="dashBillList" aria-live="polite"></div>
    </div>
  </div>
</section>
