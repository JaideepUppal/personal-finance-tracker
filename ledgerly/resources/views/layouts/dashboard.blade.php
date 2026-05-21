<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <link rel="icon" type="image/svg+xml" href="{{ asset('favicon.svg') }}">
    <title>Ledgerly · Dashboard</title>
    <script src="{{ asset('js/theme.js') }}?v={{ filemtime(public_path('js/theme.js')) }}"></script>
    <link rel="stylesheet" href="{{ asset('css/pages/dashboard.css') }}?v={{ filemtime(public_path('css/pages/dashboard.css')) }}" />
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  </head>
  <body>
    <a class="skip-link" href="#main-content">Skip to main content</a>
    @include('layouts.dashboard.partials.header')

    <div class="main-container">
      @include('layouts.dashboard.partials.sidebar')

      <main id="main-content" class="content-area" aria-live="polite" tabindex="-1">
        @include('layouts.dashboard.partials.sections.dashboard-overview')
        @include('layouts.dashboard.partials.sections.analytics')
        @include('layouts.dashboard.partials.sections.expense-tracking')
        @include('layouts.dashboard.partials.sections.income-tracking')
        @include('layouts.dashboard.partials.sections.monthly-budget')
        @include('layouts.dashboard.partials.sections.saving-goals')
      </main>
    </div>

    @include('layouts.dashboard.partials.quick-add')
    @include('layouts.dashboard.partials.onboarding-modal')

    <script>
      window.Ledgerly = {
        csrf: document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
      };
    </script>
    <script>
      window.csrf = "{{ csrf_token() }}";
    </script>
    <script src="{{ asset('js/dashboard.js') }}?v={{ filemtime(public_path('js/dashboard.js')) }}"></script>
  </body>
</html>
