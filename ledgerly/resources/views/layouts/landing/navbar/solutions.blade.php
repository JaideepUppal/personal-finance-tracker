<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="icon" type="image/svg+xml" href="{{ asset('favicon.svg') }}">
    <title>Ledgerly – Student Finance Solutions</title>
    <script src="{{ asset('js/theme.js') }}?v={{ filemtime(public_path('js/theme.js')) }}"></script>
    <link rel="stylesheet" href="{{ asset('css/pages/landing.css') }}" />
  </head>
  <body>
    <a class="skip-link" href="#main-content">Skip to main content</a>
    <!-- Header -->
    <header class="site-header">
      <div class="site-header-inner">
        <a href="{{ route('landing') }}" class="brand-logo">
          <span class="brand-mark" aria-hidden="true">L</span>
          <span>Ledgerly</span>
        </a>
        <nav class="nav-links">
          <a class="nav-link" href="{{ route('products') }}">Products</a>
          <a class="nav-link" href="{{ route('solutions') }}">Solutions</a>
          <a class="nav-link" href="{{ route('pricing') }}">Pricing</a>
          <a class="nav-link" href="{{ route('about') }}">About</a>
          <a class="nav-link" href="{{ route('help') }}">Help</a>
        </nav>
        <div class="auth-actions">
          <button class="theme-toggle" type="button" data-theme-toggle aria-label="Switch to dark mode">
            <span class="theme-toggle-icon" aria-hidden="true"></span>
            <span class="theme-toggle-text">Dark</span>
          </button>
          <a href="{{ route('login') }}" class="login-btn-link"><button class="login-btn">Log in</button></a>
          <a href="{{ route('login', ['mode' => 'signup']) }}" class="signup-btn-link"><button class="signup-btn">Start free</button></a>
        </div>
      </div>
    </header>

    <main id="main-content" class="page" tabindex="-1">
      <h1 class="page-title">Built for student finance</h1>
      <p class="page-subtitle">
        Ledgerly helps students track part-time income, rent, food, transport, recurring spending, budgets, and saving goals without spreadsheet cleanup.
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
          <p class="card-tagline">Track payments, due dates, and recurring rent reminders alongside the rest of your monthly money.</p>
        </article>

        <article class="card">
          <h3 class="card-title">Tuition</h3>
          <p class="card-tagline">Plan larger education costs by logging payments, categories, and dates as they happen.</p>
        </article>

        <article class="card">
          <h3 class="card-title">Savings Goals</h3>
          <p class="card-tagline">Save toward trips, emergency funds, devices, or other goals with visible contribution progress.</p>
        </article>

        <article class="card">
          <h3 class="card-title">Recurring Spending Awareness</h3>
          <p class="card-tagline">Use AI subscription detection to review repeated payments and decide what still belongs in the budget.</p>
        </article>

        <article class="card">
          <h3 class="card-title">Monthly Budget Reviews</h3>
          <p class="card-tagline">Generate spending insights and next-month forecasts from the money data you already track.</p>
        </article>

        <article class="card">
          <h3 class="card-title">Student Finance Guidance</h3>
          <p class="card-tagline">Ask the AI chatbot focused questions about budgeting habits, category planning, and Ledgerly workflows.</p>
        </article>
      </section>

      <section class="grid" style="margin-top:22px">
        <article class="card">
          <h3 class="card-title">Also useful for…</h3>
          <p class="card-tagline">
            Ledgerly stays focused on daily awareness, bill visibility, saving consistency, and simpler monthly reviews.
          </p>
        </article>
      </section>

      <div class="cta-row center">
        <a href="{{ route('login', ['mode' => 'signup']) }}" class="cta cta-primary">Start for free</a>
        <a href="{{ route('products') }}" class="cta cta-ghost">Explore features</a>
      </div>
    </main>

    <footer class="page-footer">
      <p class="footer-text">© {{ date('Y') }} Ledgerly.</p>
    </footer>
  </body>
</html>
