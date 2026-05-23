<header class="site-header">
  <div class="site-header-inner">
    @if($brandLink ?? true)
      <a href="{{ route('landing') }}" class="brand-logo">
        <span class="brand-mark" aria-hidden="true">L</span>
        <span>Ledgerly</span>
      </a>
    @else
      <div class="brand-logo">
        <span class="brand-mark" aria-hidden="true">L</span>
        <span>Ledgerly</span>
      </div>
    @endif

    <nav class="nav-links" aria-label="Main navigation">
      <a class="nav-link" href="{{ route('products') }}">Products</a>
      <a class="nav-link" href="{{ route('solutions') }}">Solutions</a>
      <a class="nav-link" href="{{ route('pricing') }}">Pricing</a>
      <a class="nav-link" href="{{ route('about') }}">About</a>
      <a class="nav-link" href="{{ route('help') }}">Help</a>
    </nav>

    <div class="auth-actions">
      @include('partials.theme-toggle')

      <a href="{{ route('login') }}" class="login-btn-link">
        <button class="login-btn">Log in</button>
      </a>

      <a href="{{ route('login', ['mode' => 'signup']) }}" class="signup-btn-link">
        <button class="signup-btn">Start free</button>
      </a>
    </div>
  </div>
</header>
