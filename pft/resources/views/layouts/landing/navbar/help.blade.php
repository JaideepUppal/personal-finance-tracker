<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Ledgerly – Help</title>
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
      <h1 class="page-title">Help & FAQ</h1>
      <p class="page-subtitle">
        Quick answers for everyday actions in Ledgerly.
      </p>

      <section class="grid">
        <article class="card">
          <h3 class="card-title">How do I add a transaction?</h3>
          <p class="card-text">
            Open Expense Tracking or Income Tracking, enter title, amount, category, and date, then press Add.
            The transaction updates totals and analytics automatically.
          </p>
        </article>

        <article class="card">
          <h3 class="card-title">Can I use custom categories?</h3>
          <p class="card-text">
            Yes. Select Custom in the category dropdown, type your category name, then save the entry.
            Custom categories appear in lists and chart breakdowns.
          </p>
        </article>

        <article class="card">
          <h3 class="card-title">How do budgets work?</h3>
          <p class="card-text">
            In Monthly Budget, set a limit by category. Ledgerly compares current-month expenses against that limit
            and updates each progress bar in real time.
          </p>
        </article>

        <article class="card">
          <h3 class="card-title">How do saving goals work?</h3>
          <p class="card-text">
            Create a goal with target amount and optional deadline. Add contributions anytime; Ledgerly tracks saved
            amount and progress percentage automatically.
          </p>
        </article>

        <article class="card">
          <h3 class="card-title">What do the charts show?</h3>
          <p class="card-text">
            Charts visualize recent expense and income trends, category distribution, and monthly comparison.
            They refresh as entries are added, deleted, or filtered.
          </p>
        </article>
      </section>

      <div class="cta-row center">
        <a href="{{ route('login') }}" class="cta cta-primary">Open Dashboard</a>
        <a href="{{ route('products') }}" class="cta cta-ghost">Explore Features</a>
      </div>
    </main>

    <footer class="page-footer">
      <p class="footer-text">© 2025 Ledgerly.</p>
    </footer>
  </body>
</html>
