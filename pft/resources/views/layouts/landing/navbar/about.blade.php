<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>PFT – About us</title>
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
          <a class="nav-link" href="{{ route('about') }}">About us</a>
        </nav>
        <div class="auth-actions">
          <a href="{{ route('login') }}" class="login-btn-link"><button class="login-btn">Log in</button></a>
          <a href="{{ route('login') }}" class="signup-btn-link"><button class="signup-btn">Sign up</button></a>
        </div>
      </div>
    </header>

    <main class="page about">
      <section class="fun-hero card">
        <h1 class="page-title">We’re students building PFT between classes ☕📚</h1>
        <p class="page-subtitle">
          Budgeting apps felt either boring or complicated. So we’re making one that’s <em>actually</em> nice to use: clean, fast, and built around real campus life.
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
            PFT began as a simple class project. When we realized how challenging it could be to manage student finances, we decided to build a tool to make budgeting easier. What started as a classroom project has now grown into a real app designed for students, by students.
          </p>
        </article>

        <article class="card">
          <h3 class="card-title">What we believe</h3>
          <ul class="bullet">
            <li>Clarity over complexity</li>
            <li>Helpful, not preachy</li>
            <li>Privacy by default</li>
            <li>Enjoyable experience → a smooth, friendly design makes good habits stick.</li>
          </ul>
        </article>

        <article class="card">
          <h3 class="card-title">How we build</h3>
          <p class="card-text">
            Small releases, real student budgets, zero fluff. We iterate late at night, keep the interface clean, and focus on making month-end finances stress-free.          </p>
        </article>
      </section>

      <section class="grid three stats">
        <article class="card stat">
          <div class="stat-num">3:17 AM</div>
          <div class="stat-label">average commit time 😅</div>
        </article>
        <article class="card stat">
          <div class="stat-num">∞</div>
          <div class="stat-label">cups of coffee brewed</div>
        </article>
        <article class="card stat">
          <div class="stat-num">100%</div>
          <div class="stat-label">student-first energy</div>
        </article>
      </section>

      <section class="card team">
        <h3 class="card-title">The tiny team</h3>
        <p class="card-text">We’re a small crew of student devs/designers. Say hi if you want to help!</p>
        <div class="avatar-row">
          <div class="avatar">
            <img src="{{ asset('images/IMG_6130.jpg') }}" alt="Description" />
          </div>
        </div>
        <div class="cta-row center">
          <a href="{{ route('login') }}" class="cta cta-primary">Try PFT free</a>
          <a href="{{ route('products') }}" class="cta cta-ghost">See what it does</a>
        </div>
      </section>

    </main>

    <footer class="page-footer">
      <p class="footer-text">© 2025 PFT.</p>
    </footer>
  </body>
</html>
