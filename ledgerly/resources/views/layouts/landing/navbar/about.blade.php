<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="icon" type="image/svg+xml" href="{{ asset('favicon.svg') }}">
    <title>Ledgerly – About</title>
    <script src="{{ asset('js/theme.js') }}?v={{ filemtime(public_path('js/theme.js')) }}"></script>
    <link rel="stylesheet" href="{{ asset('css/pages/landing.css') }}" />
  </head>
  <body>
    <a class="skip-link" href="#main-content">Skip to main content</a>
    @include('layouts.landing.partials.header')

    <main id="main-content" class="page about" tabindex="-1">
      <section class="fun-hero">
        <h1 class="page-title">Built by one student to make everyday budgeting clearer</h1>
        <p class="page-subtitle">
          Ledgerly makes everyday budgeting easier to read, with a clear dashboard for spending, income, budgets, bills, saving goals, analytics, and practical AI guidance.
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
            Small releases, real student budget scenarios, and careful polish. The focus is a secure Laravel app that makes everyday money easier to understand.
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
          <div class="stat-label">money clarity focus</div>
        </article>
      </section>

      <div class="cta-row center about-cta">
        <a href="{{ route('login', ['mode' => 'signup']) }}" class="cta cta-primary">Start for free</a>
        <a href="{{ route('products') }}" class="cta cta-ghost">Explore features</a>
      </div>

    </main>

    @include('layouts.landing.partials.footer')
  </body>
</html>
