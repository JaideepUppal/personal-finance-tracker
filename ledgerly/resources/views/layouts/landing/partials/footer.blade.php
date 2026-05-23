@php
    $footerTagline = trim($tagline ?? '');
@endphp

<footer class="page-footer">
  <p class="footer-text">© {{ date('Y') }} Ledgerly.@if($footerTagline !== '') {{ $footerTagline }}@endif</p>
</footer>
