<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>PFT – Student Finance Solutions</title>
    <link rel="stylesheet" href="{{ asset('css/pages/landing.css') }}" />
  </head>
  <body>
    <!-- Header -->
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
      <h1 class="page-title">Built for student finance</h1>
      <p class="page-subtitle">
        Designed for real campus budgets: part-time income, rent reminders, and day-to-day spending decisions without spreadsheet overhead.
      </p>

      <section class="grid three">
        <article class="card">
          <h3 class="card-title">Allowance & Part-time Income</h3>
          <p class="card-tagline">Manage surprise transfers and part-time paychecks. Track income like the responsible adult you’re becoming.</p>
        </article>

        <article class="card">
          <h3 class="card-title">Campus Essentials Budget</h3>
          <p class="card-tagline">Budget for “real food,” emergency coffee, and that one scooter ride when the hill wins.</p>
        </article>

        <article class="card">
          <h3 class="card-title">Rent</h3>
          <p class="card-tagline">Track payments, due dates, and avoid month-change panic attacks. Slow, steady, responsible.</p>
        </article>

        <article class="card">
          <h3 class="card-title">Tuition</h3>
          <p class="card-tagline">Break tuition into installments, track fees and payment dates without the wallet jump scare.</p>
        </article>

        <article class="card">
          <h3 class="card-title">Savings Goals</h3>
          <p class="card-tagline">Trips, gadgets, emergency funds — small steps, big wins, less overdraft anxiety.</p>
        </article>
      </section>

      <section class="grid" style="margin-top:22px">
        <article class="card">
          <h3 class="card-title">Also useful for…</h3>
          <p class="card-tagline">
            Useful beyond campus too, while staying focused on practical student finance workflows.
          </p>
        </article>
      </section>

      <div class="cta-row center">
        <a href="{{ route('login') }}" class="cta cta-primary">Start now</a>
        <a href="{{ route('products') }}" class="cta cta-ghost">Explore products</a>
      </div>
    </main>

    <footer class="page-footer">
      <p class="footer-text">© 2025 PFT.</p>
    </footer>
  </body>
</html>
