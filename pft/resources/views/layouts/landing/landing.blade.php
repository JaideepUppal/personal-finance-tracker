<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>PFT – Personal Finance Tracker</title>
    <link rel="stylesheet" type="text/css" href="{{ asset('css/pages/landing.css') }}" /> 

  </head>

  <body>
    <!-- HEADER / NAV -->
    <header class="site-header">
      <div class="site-header-inner">
        <div class="brand-logo">PFT</div>

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
          Your finances<br />
          simplified
        </h1>

        <p class="subtext">
          See every dollar. Control every cent.<br />
          Make money simple again.
        </p>

        <p class="confidence-line">No spreadsheets. No stress. Just clarity.</p>
      </section>

      <section class="hero-right">
        <!-- dashboard preview card -->
        <div class="preview-card">
          <div class="preview-card-header">
            <span class="preview-app-name">Dashboard Snapshot</span>
            <span class="preview-pill">Live</span>
          </div>

          <div class="preview-stats-grid">
            <div class="mini-card">
              <div class="mini-label">TOTAL INCOME</div>
              <div class="mini-value positive">$5,420</div>
              <div class="mini-change positive">↑ 12% vs last month</div>
            </div>

            <div class="mini-card">
              <div class="mini-label">EXPENSES</div>
              <div class="mini-value negative">$3,240</div>
              <div class="mini-change negative">↑ 8% vs last month</div>
            </div>

            <div class="mini-card">
              <div class="mini-label">SAVINGS</div>
              <div class="mini-value positive">$12,450</div>
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
        © 2025 PFT. Built by one student for clear student finance.
      </p>
    </footer>
  </body>
</html>
