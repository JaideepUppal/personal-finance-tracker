<header class="header">
  <a href="{{ route('dashboard') }}" class="logo">
    <span class="logo-mark" aria-hidden="true">L</span>
    <span>Ledgerly</span>
  </a>
  <div class="user-section">
    <button class="theme-toggle" type="button" data-theme-toggle aria-label="Switch to dark mode">
      <span class="theme-toggle-icon" aria-hidden="true"></span>
      <span class="theme-toggle-text">Dark</span>
    </button>
    <div class="workspace-status" aria-label="Dashboard status">
      <span class="status-dot" aria-hidden="true"></span>
      <span>Dashboard ready</span>
    </div>
    <span class="user-name">{{ Auth::user()->name }}</span>
    <div class="user-avatar">
      {{ strtoupper(substr(Auth::user()->name, 0, 1))}}
    </div>
  </div>
</header>
