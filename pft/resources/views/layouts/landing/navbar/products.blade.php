<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Ledgerly – Products</title>
    <link rel="stylesheet" href="{{ asset('css/pages/landing.css') }}" />
  </head>
  <body>
    <header class="site-header">
      <div class="site-header-inner">
        <a href="{{ route('landing') }}" class="brand-logo">Ledgerly</a>
        <nav class="nav-links">
          <a class="nav-link" href="{{ route('products') }}">Products</a>
          <a class="nav-link" href="{{ route('solutions') }}">Solutions</a>
          <a class="nav-link" href="{{ route('pricing') }}">Pricing</a>
          <a class="nav-link" href="{{ route('about') }}">About</a>
          <a class="nav-link" href="{{ route('help') }}">Help</a>
        </nav>
        <div class="auth-actions">
          <a href="{{ route('login') }}" class="login-btn-link"><button class="login-btn">Log in</button></a>
          <a href="{{ route('login') }}" class="signup-btn-link"><button class="signup-btn">Sign up</button></a>
        </div>
      </div>
    </header>

    <main class="page">
      <h1 class="page-title">Ledgerly Finance Platform</h1>
      <p class="page-subtitle">Everything students need to see, plan, and improve everyday finances.</p>

      <section class="grid">
        <article class="card">
          <h3 class="card-title">Smart Dashboard</h3>
          <p class="card-tagline">See income, expenses, balance, recent activity, and bill reminders in one clear workspace.</p>
        </article>

        <article class="card">
          <h3 class="card-title">Expense Tracking</h3>
          <p class="card-tagline">Log spending with title, amount, category, date, and recurring bill support.</p>
        </article>

        <article class="card">
          <h3 class="card-title">Budget Planner</h3>
          <p class="card-tagline">Set category limits and monitor month-to-date progress with readable usage bars.</p>
        </article>

        <article class="card">
          <h3 class="card-title">Savings Goals</h3>
          <p class="card-tagline">Create targets, add contributions, and track progress toward short-term and long-term goals.</p>
        </article>

        <article class="card">
          <h3 class="card-title">Bill Reminders</h3>
          <p class="card-tagline">Turn recurring expenses into reminders and keep monthly obligations visible.</p>
        </article>
      </section>

      <div class="cta-row center">
        <a href="{{ route('login') }}" class="cta cta-primary">Start free</a>
        <a href="{{ route('pricing') }}" class="cta cta-ghost">See pricing</a>
      </div>
    </main>

    <footer class="page-footer">
      <p class="footer-text">© 2025 Ledgerly.</p>
    </footer>
  </body>
</html>
