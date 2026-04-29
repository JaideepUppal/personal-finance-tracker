<header class="header">
  <a href="{{ route('dashboard') }}" class="logo">Ledgerly</a>
  <div class="user-section">
    <span class="user-name">Welcome, {{ Auth::user()->name }}</span>
    <div class="user-avatar">
      {{ strtoupper(substr(Auth::user()->name, 0, 1))}}
    </div>
  </div>
</header>
