<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Ledgerly – Pricing</title>
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
      <h1 class="page-title">Simple pricing for student finance</h1>
      <p class="page-subtitle">Ledgerly is currently free while the student finance platform continues to improve.</p>

      <section class="grid plans">
        <article class="card plan highlight">
          <div class="plan-name">Student</div>
          <div class="plan-price">$0</div>
          <ul class="bullet">
            <li>Dashboard totals for income, expenses, balance, and savings</li>
            <li>Expense and income tracking with custom categories</li>
            <li>Monthly category budgets with progress visibility</li>
            <li>Recurring bill reminders from saved expenses</li>
            <li>Saving goals with contribution tracking</li>
            <li>Analytics for spending trends and category breakdowns</li>
            <li>AI Finance Coach, monthly insights, subscription detection, budget forecasts, and chatbot guidance</li>
          </ul>
          <a href="{{ route('login') }}" class="cta cta-primary block">Get started free</a>
          <p class="micro-note" style="margin-top:10px">Free while Ledgerly continues to improve the core experience.</p>
        </article>

        <article class="card plan soon">
          <div class="plan-name">Pro</div>
          <div class="badge-soon">Coming soon</div>
          <p class="soon-note">Future plans may include exports, deeper insights, and advanced automation after the core experience is fully polished.</p>
        </article>
      </section>

      <div class="cta-row center">
        <a href="{{ route('login') }}" class="cta cta-primary">Start free</a>
        <a href="{{ route('products') }}" class="cta cta-ghost">See features</a>
      </div>
    </main>

    <footer class="page-footer">
      <p class="footer-text">© {{ date('Y') }} Ledgerly.</p>
    </footer>
  </body>
</html>
