<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>PFT – Products</title>
    <link rel="stylesheet" href="{{ asset('css/pages/landing.css') }}" />
  </head>
  <body>
    <header class="site-header">
      <div class="site-header-inner">
        <a href="{{ route('landing') }}" class="brand-logo">PFT</a>
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
      <h1 class="page-title">Tools to master your money</h1>
      <p class="page-subtitle">Everything you need to see, plan, and improve your finances.</p>

      <section class="grid">
        <article class="card">
          <h3 class="card-title">Smart Dashboard</h3>
          <p class="card-tagline">See where your money goes before it mysteriously disappears again. Charts that feel like therapy… but for your wallet.</p>
        </article>

        <article class="card">
          <h3 class="card-title">Expense Tracking</h3>
          <p class="card-tagline">Log spending in seconds, from ramen runs to late-night impulse buys. Future AI tagging is planned for a later release.</p>
        </article>

        <article class="card">
          <h3 class="card-title">Budget Planner</h3>
          <p class="card-tagline">Make budgets you’ll totally follow… until finals week hits. Gentle alerts, not financial jump scares.</p>
        </article>

        <article class="card">
          <h3 class="card-title">Savings Goals</h3>
          <p class="card-tagline">Save for trips, gadgets, or the emergency “I'm too tired to cook” meal. Watch tiny progress feel like huge wins.</p>
        </article>

        <article class="card">
          <h3 class="card-title">Bill Reminders</h3>
          <p class="card-tagline">Never forget rent or subscriptions again even when life gets chaotic. Smart reminders that understand stress naps.</p>
        </article>
      </section>

      <div class="cta-row center">
        <a href="{{ route('login') }}" class="cta cta-primary">Try PFT free</a>
        <a href="{{ route('pricing') }}" class="cta cta-ghost">See pricing</a>
      </div>
    </main>

    <footer class="page-footer">
      <p class="footer-text">© 2025 PFT.</p>
    </footer>
  </body>
</html>
