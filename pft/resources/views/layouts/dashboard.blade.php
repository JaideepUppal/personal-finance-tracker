<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Ledgerly · Dashboard</title>
    <link rel="stylesheet" href="{{ asset('css/pages/dashboard.css') }}?v={{ time() }}" />
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  </head>
  <body>
    <!-- Header -->
    <header class="header">
      <a href="{{ route('dashboard') }}" class="logo">Ledgerly</a>
      <div class="user-section">
        <span class="user-name">Welcome, {{ Auth::user()->name }}</span>
        <div class="user-avatar">
          {{ strtoupper(substr(Auth::user()->name, 0, 1))}}
        </div>
      </div>
    </header>

    <!-- Main Container -->
    <div class="main-container">
      <!-- Sidebar -->
      <aside class="sidebar">
        <nav class="nav-menu" aria-label="Dashboard navigation">
          <a class="nav-item active" data-section="dashboard">
            <span>Dashboard</span>
          </a>
          <a class="nav-item" data-section="expense-tracking">
            <span>Expense Tracking</span>
          </a>
          <a class="nav-item" data-section="income-tracking">
            <span>Income Tracking</span>
          </a>
          <a class="nav-item" data-section="monthly-budget">
            <span>Monthly Budget</span>
          </a>
          <a class="nav-item" data-section="analytics">
            <span>Analytics</span>
          </a>
          <a class="nav-item" data-section="saving-goals">
            <span>Saving Goals</span>
          </a>



          <div class="sidebar-logout">
            <a href="{{ route('logout') }}" class="logout-btn"
              onclick="event.preventDefault(); document.getElementById('logout-form').submit();">
              Logout
            </a>
            <form id="logout-form" action="{{ route('logout') }}" method="POST" style="display:none;">
              @csrf
            </form>
          </div>

        </nav>
      </aside>

      <!-- Content Area -->
      <main class="content-area" aria-live="polite">
        <!-- Dashboard Section -->
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

        <!-- Analytics Section -->
        <section id="analytics" class="content-section">
          <h1 class="section-title">Analytics</h1>

          <div class="analytics-grid">
            <!-- Spending trend -->
            <div class="chart-container panel">
              <div class="panel-header">
                <h2 class="panel-title">Spending Trends (Last 14 days)</h2>
              </div>
              <canvas id="anSpendLine"></canvas>
            </div>

            <!-- Category breakdown -->
            <div class="chart-container panel">
              <div class="panel-header">
                <h2 class="panel-title">Category Breakdown (This month)</h2>
              </div>
              <div id="anCatBars" class="cat-bars"></div>
            </div>
          </div>

          <div class="analytics-grid">
            <!-- Monthly comparison -->
            <div class="chart-container panel">
              <div class="panel-header">
                <h2 class="panel-title">Monthly Comparison</h2>
              </div>
              <canvas id="anMonthBar"></canvas>
            </div>

            <!-- Savings rate -->
            <div class="chart-container panel">
              <div class="panel-header">
                <h2 class="panel-title">Savings Snapshot</h2>
              </div>
              <div class="savings-card">
                <div>
                  <div class="savings-big" id="anSavingsPct">0%</div>
                  <div class="savings-sub" id="anSavingsText">No data yet</div>
                </div>
                <div class="savings-pill" id="anSavingsPill">Savings rate</div>
              </div>
            </div>
          </div>
        </section>

        <!-- Expense Tracking Section -->
        <section id="expense-tracking" class="content-section">
          <h1 class="section-title">Expense Tracking</h1>

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
              <h2 class="panel-title">Add Expense</h2>
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
                <h2 class="panel-title">Expense Trend (Last 7 entries)</h2>
              </div>
              <canvas id="expLineChart"></canvas>
            </div>

            <div class="chart-container panel">
              <div class="panel-header">
                <h2 class="panel-title">Category Breakdown</h2>
              </div>
              <canvas id="expPieChart"></canvas>
            </div>
          </div>

          <!-- List -->
          <div class="panel">
            <div class="panel-header">
              <h2 class="panel-title">Recent Expenses</h2>

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

        <!-- Income Tracking Section -->
        <section id="income-tracking" class="content-section">
          <h1 class="section-title">Income Tracking</h1>

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
              <h2 class="panel-title">Add Income</h2>
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
                <h2 class="panel-title">Income Trend (Last 7 entries)</h2>
              </div>
              <canvas id="incLineChart"></canvas>
            </div>

            <div class="chart-container panel">
              <div class="panel-header">
                <h2 class="panel-title">Source Breakdown</h2>
              </div>
              <canvas id="incPieChart"></canvas>
            </div>
          </div>

          <div class="panel">
            <div class="panel-header">
              <h2 class="panel-title">Recent Income</h2>
            </div>
            <div class="expense-list" id="incomeList">
            </div>
          </div>
        </section>

        <!-- Monthly Budget Section -->
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

        <!-- Saving Goals Section -->
        <section id="saving-goals" class="content-section">
          <h1 class="section-title">Saving Goals</h1>

          <!-- Add New Goal -->
          <div class="panel">
            <div class="panel-header">
              <h3 class="panel-title">Create a new goal</h3>
            </div>
            <div class="add-row">
              <input
                id="sgName"
                class="filter-input"
                type="text"
                placeholder="Goal name (e.g., Emergency fund, Vacation)"
              />
              <input
                id="sgTarget"
                class="filter-input"
                type="number"
                inputmode="decimal"
                placeholder="Target amount (¥)"
              />
              <input
                id="sgDeadline"
                class="filter-input"
                type="date"
              />
              <button id="sgAddBtn" class="filter-btn" type="button">
                Add goal
              </button>
            </div>
          </div>

          <!-- Goals List -->
          <div class="panel">
            <div class="panel-header">
              <h3 class="panel-title">Your goals</h3>
            </div>
            <div id="sgList" class="savings-goals-list">
              <!-- Filled by dashboard.js -->
            </div>
          </div>   
        </section>  
      </main>
    </div>
  

    <!-- Quick Add pop-up card (opened by the + button) -->
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

    <!-- Floating + button visible on every page -->
    <button
      id="floatingQuickAdd"
      class="add-btn"
      type="button"
      aria-label="Quick add expense"
    >
      +
    </button>

    <div id="onboardingModal" class="onboarding-modal hidden" role="dialog" aria-modal="true" aria-labelledby="onboardingTitle">
      <div class="onboarding-card">
        <h2 id="onboardingTitle" class="onboarding-title">Welcome to Ledgerly</h2>
        <p class="onboarding-sub">
          A quick tour to get started:
        </p>
        <ul class="onboarding-list">
          <li><strong>Dashboard:</strong> Track totals, balance, recent expenses, and bill reminders in one place.</li>
          <li><strong>Add Expense:</strong> Capture transactions quickly with category, date, and recurring options.</li>
          <li><strong>Budgets:</strong> Set category limits and monitor progress through live usage bars.</li>
          <li><strong>Analytics:</strong> Review trends, category breakdowns, and monthly comparisons.</li>
          <li><strong>Quick Add (+):</strong> Use the floating button for fast expense entry from any section.</li>
        </ul>
        <div class="onboarding-actions">
          <button id="onboardingClose" class="onboarding-close" type="button">Skip</button>
          <button id="onboardingDone" class="onboarding-done" type="button">Start Using Ledgerly</button>
        </div>
      </div>
    </div>

    <script>
      window.Ledgerly = {
        csrf: document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
      };
    </script>
    <script>
      window.csrf = "{{ csrf_token() }}";
  </script>
    <script src="{{ asset('js/dashboard.js') }}?v={{ time() }}"></script>
  </body>
</html>
