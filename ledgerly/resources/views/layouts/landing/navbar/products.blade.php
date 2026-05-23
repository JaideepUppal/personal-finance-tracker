<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="icon" type="image/svg+xml" href="{{ asset('favicon.svg') }}">
    <title>Ledgerly – Products</title>
    <script src="{{ asset('js/theme.js') }}?v={{ filemtime(public_path('js/theme.js')) }}"></script>
    <link rel="stylesheet" href="{{ asset('css/pages/landing.css') }}" />
  </head>
  <body>
    <a class="skip-link" href="#main-content">Skip to main content</a>
    @include('layouts.landing.partials.header')

    <main id="main-content" class="page" tabindex="-1">
      <h1 class="page-title">Features for everyday student money</h1>
      <p class="page-subtitle">Track what came in, what went out, what is due, and what to adjust next.</p>

      <section class="grid">
        <article class="card">
          <h3 class="card-title">Smart Dashboard</h3>
          <p class="card-tagline">See income, expenses, balance, recent activity, and bill reminders without digging.</p>
        </article>

        <article class="card">
          <h3 class="card-title">Expense Tracking</h3>
          <p class="card-tagline">Log spending with title, amount, category, date, and recurring bill support.</p>
        </article>

        <article class="card">
          <h3 class="card-title">Budget Planner</h3>
          <p class="card-tagline">Set category limits and monitor month-to-date progress with readable usage bars.</p>
        </article>

        <article class="card">
          <h3 class="card-title">Savings Goals</h3>
          <p class="card-tagline">Create targets, add contributions, and track progress toward short-term and long-term goals.</p>
        </article>

        <article class="card">
          <h3 class="card-title">Bill Reminders</h3>
          <p class="card-tagline">Turn recurring expenses into reminders and keep monthly obligations visible.</p>
        </article>

        <article class="card">
          <h3 class="card-title">Analytics Dashboard</h3>
          <p class="card-tagline">Review spending trends, category breakdowns, monthly comparisons, and savings snapshots.</p>
        </article>

        <article class="card">
          <h3 class="card-title">AI Finance Coach</h3>
          <p class="card-tagline">Generate short, practical next steps from your current income, expenses, budgets, bills, and goals.</p>
        </article>

        <article class="card">
          <h3 class="card-title">AI Spending Insights</h3>
          <p class="card-tagline">Use monthly insights, recurring spending detection, and forecasts to spot patterns faster.</p>
        </article>

        <article class="card">
          <h3 class="card-title">AI Student Finance Chatbot</h3>
          <p class="card-tagline">Ask focused questions about budgeting, saving goals, category planning, and Ledgerly workflows.</p>
        </article>

        <article class="card">
          <h3 class="card-title">Secure Laravel Authentication</h3>
          <p class="card-tagline">Keep the dashboard behind session-based authentication with CSRF-protected same-origin requests.</p>
        </article>
      </section>

      <div class="cta-row center">
        <a href="{{ route('login', ['mode' => 'signup']) }}" class="cta cta-primary">Start for free</a>
        <a href="{{ route('pricing') }}" class="cta cta-ghost">See pricing</a>
      </div>
    </main>

    @include('layouts.landing.partials.footer')
  </body>
</html>
