<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="icon" type="image/svg+xml" href="{{ asset('favicon.svg') }}">
    <title>Ledgerly — AI Finance Dashboard for Students</title>
    <script src="{{ asset('js/theme.js') }}?v={{ filemtime(public_path('js/theme.js')) }}"></script>
    <link rel="stylesheet" type="text/css" href="{{ asset('css/pages/landing.css') }}" /> 

  </head>

  <body>
    <a class="skip-link" href="#main-content">Skip to main content</a>
    @include('layouts.landing.partials.header', ['brandLink' => false])

    <!-- HERO -->
    <main id="main-content" class="hero" tabindex="-1">
      <section class="hero-left">
        <p class="hero-eyebrow">AI-powered finance dashboard for students</p>
        <h1 class="headline">
          Track every yen. Spend with clarity.
        </h1>

        <p class="subtext">
          See spending, budgets, savings goals, bills, and AI guidance without fighting a spreadsheet.
        </p>

        <p class="confidence-line">Understand your month before it gets expensive. Built with Laravel, Chart.js, and practical server-side AI.</p>

        <div class="hero-ctas">
          <a href="{{ route('login', ['mode' => 'signup']) }}" class="cta cta-primary">Start for free</a>
          <a href="{{ route('products') }}" class="cta cta-ghost">Explore features</a>
        </div>

        <div class="hero-proof-row" aria-label="Product capabilities">
          <span>Income tracking</span>
          <span>Smart budgets</span>
          <span>AI insights</span>
          <span>Free to start</span>
        </div>
      </section>

      <section class="hero-right">
        <div class="preview-card" aria-label="Ledgerly dashboard preview">
          <div class="preview-card-header">
            <span class="preview-app-name">Ledgerly Dashboard</span>
            <span class="preview-pill">Student finance</span>
          </div>

          <div class="preview-command-summary">
            <div>
              <span>Month health</span>
              <strong>86</strong>
            </div>
            <p>Spending is steady, savings are improving, and rent is the only recurring bill due this week.</p>
          </div>

          <div class="preview-stats-grid">
            <div class="mini-card">
              <div class="mini-label">TOTAL INCOME</div>
              <div class="mini-value positive">¥185,000</div>
              <div class="mini-change positive">↑ 12% vs last month</div>
            </div>

            <div class="mini-card">
              <div class="mini-label">EXPENSES</div>
              <div class="mini-value negative">¥92,400</div>
              <div class="mini-change negative">↑ 8% vs last month</div>
            </div>

            <div class="mini-card">
              <div class="mini-label">SAVINGS</div>
              <div class="mini-value positive">¥42,600</div>
              <div class="mini-change positive">↑ 22% vs last month</div>
            </div>
          </div>

          <div class="preview-visual-grid">
            <div class="preview-chart-card">
              <div class="preview-section-label">Spending trend</div>
              <div class="preview-chart-line" aria-hidden="true">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>

            <div class="preview-insight-card">
              <div class="preview-section-label">AI Finance Coach</div>
              <p>Food spending is trending higher this week. Tighten the meal budget and move ¥6,000 toward the emergency fund.</p>
            </div>
          </div>

          <div class="preview-activity-list" aria-label="Recent dashboard activity">
            <div class="preview-activity-row">
              <span>Rent</span>
              <strong>-¥58,000</strong>
            </div>
            <div class="preview-activity-row">
              <span>Part-time pay</span>
              <strong class="positive">+¥72,000</strong>
            </div>
            <div class="preview-activity-row">
              <span>Emergency fund</span>
              <strong>68%</strong>
            </div>
          </div>

          <div class="preview-footnote">
            Track money. See trends. Ask Ledgerly AI what to do next.
          </div>
        </div>
      </section>
    </main>

    <section class="landing-value-grid" aria-label="Ledgerly product highlights">
      <article class="landing-value-card">
        <span class="value-kicker">01</span>
        <h2>Track the money that shapes your month</h2>
        <p>Log income, expenses, recurring bills, and custom categories without losing the bigger monthly picture.</p>
      </article>
      <article class="landing-value-card">
        <span class="value-kicker">02</span>
        <h2>Spot budget pressure early</h2>
        <p>Chart.js views show spending trends, category pressure, savings rate, and monthly cash flow clearly.</p>
      </article>
      <article class="landing-value-card">
        <span class="value-kicker">03</span>
        <h2>Use AI for practical next steps</h2>
        <p>Finance Coach, monthly insights, forecasts, and focused chat help turn your data into next steps.</p>
      </article>
    </section>

    @include('layouts.landing.partials.footer', ['tagline' => 'AI-powered finance platform built with Laravel.'])
  </body>
</html>
