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
