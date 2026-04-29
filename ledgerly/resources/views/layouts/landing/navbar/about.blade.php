<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Ledgerly – About</title>
    <link rel="stylesheet" href="{{ asset('css/pages/landing.css') }}" />
  </head>
  <body>
    <!-- Header  -->
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

    <main class="page about">
      <section class="fun-hero">
        <h1 class="page-title">Built by one student to make everyday budgeting clearer</h1>
        <p class="page-subtitle">
          Ledgerly is created to make everyday budgeting simpler, with a clean workspace for tracking spending, income, budgets, bills, saving goals, analytics, and practical AI guidance.
        </p>
        <div class="sticker-row">
          <span class="pill">No spreadsheets</span>
          <span class="pill">Rent tracking</span>
          <span class="pill">AI spending reviews</span>
        </div>
      </section>

      <section class="grid three">
        <article class="card">
          <h3 class="card-title">The spark</h3>
          <p class="card-text">
            Ledgerly started as a class project and is now focused on practical student finance: fast entry, clear totals, useful month-to-month context, and safe AI assistance.
          </p>
        </article>

        <article class="card">
          <h3 class="card-title">What I value</h3>
          <ul class="bullet">
            <li>Clarity over complexity</li>
            <li>Helpful, not preachy</li>
            <li>Privacy by default</li>
            <li>A smooth, friendly experience that supports consistent habits</li>
          </ul>
        </article>

        <article class="card">
          <h3 class="card-title">How I build</h3>
          <p class="card-text">
            Small releases, real student budget scenarios, and careful polish. The focus is a secure Laravel application that makes money decisions easier to understand.
          </p>
        </article>
      </section>

      <section class="grid three stats">
        <article class="card stat">
          <div class="stat-num">5</div>
          <div class="stat-label">core finance workflows</div>
        </article>
        <article class="card stat">
          <div class="stat-num">1</div>
          <div class="stat-label">student builder</div>
        </article>
        <article class="card stat">
          <div class="stat-num">100%</div>
          <div class="stat-label">finance-first focus</div>
        </article>
      </section>

      <div class="cta-row center about-cta">
        <a href="{{ route('login') }}" class="cta cta-primary">Start free</a>
        <a href="{{ route('products') }}" class="cta cta-ghost">See what it does</a>
      </div>

    </main>

    <footer class="page-footer">
      <p class="footer-text">© {{ date('Y') }} Ledgerly.</p>
    </footer>
  </body>
</html>
