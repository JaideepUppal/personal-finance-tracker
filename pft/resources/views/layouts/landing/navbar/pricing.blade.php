<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>PFT – Pricing</title>
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
      <h1 class="page-title">Simple pricing for student finance</h1>
      <p class="page-subtitle">Built by one student for practical student money management.</p>

      <section class="grid plans">
        <article class="card plan highlight">
          <div class="plan-name">Student</div>
          <div class="plan-price">$0</div>
          <ul class="bullet">
            <li>Simple dashboard to see where your money is going</li>
            <li>Track expenses in seconds, even the tiny ones</li>
            <li>Create budgets for food, rent, coffee, and campus life</li>
            <li>Bill reminders so you don’t forget</li>
            <li>Set savings goals for trips, gadgets, or emergencies</li>
            <li><em>Future ideas:</em> smart auto-categorization + export + AI integration</li>
          </ul>
          <a href="{{ route('login') }}" class="cta cta-primary block">Get started free</a>
          <p class="micro-note" style="margin-top:10px">Free while PFT continues to ship core features.</p>
        </article>

        <article class="card plan soon">
          <div class="plan-name">Pro</div>
          <div class="badge-soon">Coming soon</div>
          <div class="meme-box" style= "background-image: url('https://i.ytimg.com/vi/kLsNWWA7Ktw/maxresdefault.jpg');"></div>
          
          <p class="soon-note">Pro details will be finalized after the core experience is fully polished.</p>
        </article>
      </section>

      <div class="cta-row center">
        <a href="{{ route('login') }}" class="cta cta-primary">Try PFT free</a>
        <a href="{{ route('products') }}" class="cta cta-ghost">See features</a>
      </div>
    </main>

    <footer class="page-footer">
      <p class="footer-text">© 2025 PFT.</p>
    </footer>
  </body>
</html>
