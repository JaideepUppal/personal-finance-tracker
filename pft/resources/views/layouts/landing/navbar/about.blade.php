<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>PFT – About</title>
    <link rel="stylesheet" href="{{ asset('css/pages/landing.css') }}" />
  </head>
  <body>
    <!-- Header  -->
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

    <main class="page about">
      <section class="fun-hero card">
        <h1 class="page-title">I am building PFT between classes</h1>
        <p class="page-subtitle">
          Many budgeting apps felt either rigid or overly complex. I am building PFT to be clean, fast, and practical for real student finances.
        </p>
        <div class="sticker-row">
          <span class="pill">No spreadsheets</span>
          <span class="pill">Solo rent tracking</span>
          <span class="pill">Tuition installments</span>
        </div>
      </section>

      <section class="grid three">
        <article class="card">
          <h3 class="card-title">The spark</h3>
          <p class="card-text">
            PFT started as a class project. After seeing how hard student budgeting can be, I turned it into a real app focused on clarity and everyday use.
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
            Small releases, real student budget scenarios, and no fluff. The focus is a clean interface that reduces month-end money stress.
          </p>
        </article>
      </section>

      <section class="grid three stats">
        <article class="card stat">
          <div class="stat-num">3:17 AM</div>
          <div class="stat-label">average commit time</div>
        </article>
        <article class="card stat">
          <div class="stat-num">∞</div>
          <div class="stat-label">cups of coffee brewed</div>
        </article>
        <article class="card stat">
          <div class="stat-num">100%</div>
          <div class="stat-label">finance-first focus</div>
        </article>
      </section>

      <div class="cta-row center about-cta">
        <a href="{{ route('login') }}" class="cta cta-primary">Try PFT free</a>
        <a href="{{ route('products') }}" class="cta cta-ghost">See what it does</a>
      </div>

    </main>

    <footer class="page-footer">
      <p class="footer-text">© 2025 PFT.</p>
    </footer>
  </body>
</html>
