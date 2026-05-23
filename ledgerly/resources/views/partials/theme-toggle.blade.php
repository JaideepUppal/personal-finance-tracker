@php
    $themeToggleClasses = trim('theme-toggle ' . ($themeToggleClass ?? ''));
@endphp

<button class="{{ $themeToggleClasses }}" type="button" data-theme-toggle aria-label="Switch to dark mode">
  <span class="theme-toggle-icon" aria-hidden="true"></span>
  <span class="theme-toggle-text">Dark</span>
</button>
