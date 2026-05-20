<aside class="sidebar">
  <div class="sidebar-product">
    <span class="sidebar-product-mark" aria-hidden="true">L</span>
    <div>
      <strong>Ledgerly</strong>
      <span>Student finance</span>
    </div>
  </div>

  <nav class="nav-menu" aria-label="Dashboard navigation">
    <a class="nav-item active" data-section="dashboard">
      <span class="nav-icon nav-icon-dashboard" aria-hidden="true"></span>
      <span>Dashboard</span>
    </a>
    <a class="nav-item" data-section="expense-tracking">
      <span class="nav-icon nav-icon-expense" aria-hidden="true"></span>
      <span>Expenses</span>
    </a>
    <a class="nav-item" data-section="income-tracking">
      <span class="nav-icon nav-icon-income" aria-hidden="true"></span>
      <span>Income</span>
    </a>
    <a class="nav-item" data-section="monthly-budget">
      <span class="nav-icon nav-icon-budget" aria-hidden="true"></span>
      <span>Budgets</span>
    </a>
    <a class="nav-item" data-section="analytics">
      <span class="nav-icon nav-icon-analytics" aria-hidden="true"></span>
      <span>Analytics</span>
    </a>
    <a class="nav-item" data-section="saving-goals">
      <span class="nav-icon nav-icon-goals" aria-hidden="true"></span>
      <span>Goals</span>
    </a>

    <div class="sidebar-logout">
      <a href="{{ route('logout') }}" class="logout-btn" aria-label="Log out of Ledgerly" title="Log out"
        onclick="event.preventDefault(); document.getElementById('logout-form').submit();">
        <span class="logout-icon" aria-hidden="true"></span>
        <span>Log out</span>
      </a>
      <form id="logout-form" action="{{ route('logout') }}" method="POST" style="display:none;">
        @csrf
      </form>
    </div>
  </nav>
</aside>
