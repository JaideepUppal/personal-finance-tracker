<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Ledgerly — Smart Money Management for Students</title>
    <link rel="stylesheet" type="text/css" href="{{ asset('css/pages/landing.css') }}" /> 

  </head>

  <body>
    <!-- HEADER / NAV -->
    <header class="site-header">
      <div class="site-header-inner">
        <div class="brand-logo">Ledgerly</div>

        <nav class="nav-links" aria-label="Main navigation">
            <a class="nav-link" href="{{ route('products') }}">Products</a>
          <a class="nav-link" href="{{ route('solutions') }}">Solutions</a>
          <a class="nav-link" href="{{ route('pricing') }}">Pricing</a>
          <a class="nav-link" href="{{ route('about') }}">About</a>
          <a class="nav-link" href="{{ route('help') }}">Help</a>
        </nav>

        <div class="auth-actions">

          <a href="{{route('login')}}" class="login-btn-link">
            <button class="login-btn">Log in</button>
          </a>

          <a href="{{route('login')}}" class="signup-btn-link">
            <button class="signup-btn">Sign up</button>
          </a>
        </div>
      </div>
    </header>

    <!-- HERO -->
    <main class="hero">
      <section class="hero-left">
        <h1 class="headline">
          Ledgerly
        </h1>

        <p class="subtext">
          Smart money management for students. Track spending, budgets, bills, and savings goals in one focused workspace.
        </p>

        <p class="confidence-line">Created to make everyday budgeting simpler.</p>

        <div class="hero-ctas">
          <a href="{{ route('login') }}" class="cta cta-primary">Start free</a>
          <a href="{{ route('products') }}" class="cta cta-ghost">Explore features</a>
        </div>
      </section>

      <section class="hero-right">
        <!-- dashboard preview card -->
        <div class="preview-card">
          <div class="preview-card-header">
            <span class="preview-app-name">Ledgerly Dashboard</span>
            <span class="preview-pill">Live</span>
          </div>

          <div class="preview-stats-grid">
            <div class="mini-card">
              <div class="mini-label">TOTAL INCOME</div>
              <div class="mini-value positive">¥185,000</div>
              <div class="mini-change positive">↑ 12% vs last month</div>
            </div>

            <div class="mini-card">
              <div class="mini-label">EXPENSES</div>
              <div class="mini-value negative">¥92,400</div>
              <div class="mini-change negative">↑ 8% vs last month</div>
            </div>

            <div class="mini-card">
              <div class="mini-label">SAVINGS</div>
              <div class="mini-value positive">¥42,600</div>
              <div class="mini-change positive">↑ 22% vs last month</div>
            </div>
          </div>

          <div class="preview-footnote">
            Track spending. Get bill reminders. See trends.
          </div>
        </div>
      </section>
    </main>

    <!-- FOOTER -->
    <footer class="page-footer">
      <p class="footer-text">
        © 2025 Ledgerly. Built by one student for clear student finance.
      </p>
    </footer>
  </body>
</html>
