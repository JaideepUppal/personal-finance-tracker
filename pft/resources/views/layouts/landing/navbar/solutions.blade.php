<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Ledgerly – Student Finance Solutions</title>
    <link rel="stylesheet" href="{{ asset('css/pages/landing.css') }}" />
  </head>
  <body>
    <!-- Header -->
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
      <h1 class="page-title">Built for student finance</h1>
      <p class="page-subtitle">
        Ledgerly helps students track part-time income, rent reminders, daily spending, budgets, and saving goals without spreadsheet overhead.
      </p>

      <section class="grid three">
        <article class="card">
          <h3 class="card-title">Allowance & Part-time Income</h3>
          <p class="card-tagline">Record allowances, scholarships, stipends, and part-time pay so monthly totals stay clear.</p>
        </article>

        <article class="card">
          <h3 class="card-title">Campus Essentials Budget</h3>
          <p class="card-tagline">Set monthly limits for food, travel, shopping, and other recurring student expenses.</p>
        </article>

        <article class="card">
          <h3 class="card-title">Rent</h3>
          <p class="card-tagline">Track payments, due dates, and recurring rent reminders in the same finance workspace.</p>
        </article>

        <article class="card">
          <h3 class="card-title">Tuition</h3>
          <p class="card-tagline">Plan larger education costs by logging payments, categories, and dates as they happen.</p>
        </article>

        <article class="card">
          <h3 class="card-title">Savings Goals</h3>
          <p class="card-tagline">Save toward trips, emergency funds, devices, or other goals with visible contribution progress.</p>
        </article>
      </section>

      <section class="grid" style="margin-top:22px">
        <article class="card">
          <h3 class="card-title">Also useful for…</h3>
          <p class="card-tagline">
            Ledgerly stays focused on practical workflows that are useful on campus and beyond.
          </p>
        </article>
      </section>

      <div class="cta-row center">
        <a href="{{ route('login') }}" class="cta cta-primary">Start now</a>
        <a href="{{ route('products') }}" class="cta cta-ghost">Explore products</a>
      </div>
    </main>

    <footer class="page-footer">
      <p class="footer-text">© 2025 Ledgerly.</p>
    </footer>
  </body>
</html>
