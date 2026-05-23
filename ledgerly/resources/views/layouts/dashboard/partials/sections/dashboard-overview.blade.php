<section id="dashboard" class="content-section active">
  <div class="section-heading">
    <p class="section-kicker">Student finance dashboard</p>
    <h1 class="section-title">Monthly Overview</h1>
  </div>

  <div class="dashboard-command-grid">
    <div class="dashboard-hero" aria-label="Monthly financial health summary">
      <div class="dashboard-hero-copy">
        <div class="hero-meta-row">
          <span id="dashHeroMonth" class="hero-period">This month</span>
          <span id="dashHealthLabel" class="health-chip">Waiting for data</span>
        </div>

        <h2 class="hero-title">Understand your month before it gets expensive.</h2>
        <p id="dashHeroNarrative" class="hero-narrative">
          Add income, expenses, budgets, bills, and saving goals to build a clear monthly finance picture.
        </p>
      </div>

      <div class="hero-health-panel" aria-label="Financial health score">
        <span class="health-label">Health score</span>
        <strong id="dashHealthScore">--</strong>
        <span class="health-scale">Monthly signal</span>
      </div>

      <div class="hero-metrics-strip" aria-label="Financial insight summary">
        <div class="hero-metric">
          <span>Savings rate</span>
          <strong id="dashSavingsRate">0%</strong>
        </div>
        <div class="hero-metric">
          <span>Cash flow</span>
          <strong id="dashCashFlow">¥0</strong>
        </div>
        <div class="hero-metric">
          <span>7-day cash flow</span>
          <strong id="dashSpendPace">No trend yet</strong>
        </div>
      </div>

      <div class="cashflow-pulse" aria-label="Seven day cash flow pulse">
        <div class="pulse-header">
          <div class="pulse-copy">
            <span>7-day pulse</span>
            <strong id="dashPulseSummary">Income vs spending</strong>
          </div>
          <div class="pulse-legend" aria-label="Pulse legend">
            <span><i class="pulse-dot income" aria-hidden="true"></i>Income</span>
            <span><i class="pulse-dot expense" aria-hidden="true"></i>Spending</span>
          </div>
        </div>
        <div id="dashCashFlowBars" class="cashflow-bars" aria-hidden="true"></div>
      </div>
    </div>

    <div id="aiCoachPanel" class="panel ai-coach-panel dashboard-ai-panel">
      <div class="panel-header ai-coach-header">
        <div>
          <p class="panel-kicker">AI month review</p>
          <h2 class="panel-title">AI Finance Coach</h2>
          <p class="ai-coach-copy">
            Summarize this month and get a few practical next steps.
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
        Press “Analyze my month” to get personalized suggestions based on your financial activity this month.
      </div>
    </div>
  </div>

  <!-- Summary Cards  -->
  <div class="summary-grid">
    <div class="summary-card">
      <div class="card-label">Income this month</div>
      <div class="card-amount positive" id="dashTotalIncome" aria-live="polite">¥0</div>
      <div class="card-change positive" id="dashIncomeChange">
        <span></span>
        <span>—</span>
      </div>
    </div>

    <div class="summary-card">
      <div class="card-label">Expenses this month</div>
      <div class="card-amount negative" id="dashTotalExpenses" aria-live="polite">-¥0</div>
      <div class="card-change negative" id="dashExpenseChange">
        <span></span>
        <span>—</span>
      </div>
    </div>

    <div class="summary-card">
      <div class="card-label">Net cash flow</div>
      <div class="card-amount" id="dashBalance" aria-live="polite">¥0</div>
      <div class="card-change positive" id="dashBalanceChange">
        <span></span>
        <span>—</span>
      </div>
    </div>

    <div class="summary-card">
      <div class="card-label">Saved this month</div>
      <div class="card-amount positive" id="dashSavings" aria-live="polite">¥0</div>
      <div class="card-change positive" id="dashSavingsNote">
        <span></span>
        <span>—</span>
      </div>
    </div>
  </div>

  <div class="dashboard-insight-grid" aria-label="Monthly insight rail">
    <div class="insight-cell">
      <span class="insight-label">Top category</span>
      <strong id="dashTopCategory">No spending yet</strong>
      <p>Where you spent the most this month.</p>
    </div>
    <div class="insight-cell">
      <span class="insight-label">Budget pressure</span>
      <strong id="dashBudgetPressure">No budgets yet</strong>
      <p>Closest category to its monthly limit.</p>
    </div>
    <div class="insight-cell">
      <span class="insight-label">Bill signal</span>
      <strong id="dashBillSignal">No recurring bills</strong>
      <p>Bills that are upcoming or overdue.</p>
    </div>
    <div class="insight-cell insight-cell-wide">
      <span class="insight-label">Smart next step</span>
      <strong id="dashRecommendation">Add your first transaction</strong>
      <p>Based on your current activity.</p>
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
        <a class="view-all" data-section="monthly-budget">Review</a>
      </div>
      <div class="bill-list" id="dashBillList" aria-live="polite"></div>
    </div>
  </div>
</section>
