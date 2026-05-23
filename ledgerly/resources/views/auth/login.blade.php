<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="icon" type="image/svg+xml" href="{{ asset('favicon.svg') }}">
    <title>Login | Ledgerly</title>

    <script src="{{ asset('js/theme.js') }}?v={{ filemtime(public_path('js/theme.js')) }}"></script>
    <link rel="stylesheet" href="{{ asset('css/pages/login.css') }}">
</head>
<body>

<a href="{{ route('landing') }}" class="auth-back-link">Back to home</a>

<button class="theme-toggle auth-theme-toggle" type="button" data-theme-toggle aria-label="Switch to dark mode">
    <span class="theme-toggle-icon" aria-hidden="true"></span>
    <span class="theme-toggle-text">Dark</span>
</button>

<main class="auth-shell">
    <section class="auth-brand-panel" aria-label="Ledgerly overview">
        <a href="{{ route('landing') }}" class="auth-brand">
            <span class="brand-mark" aria-hidden="true">L</span>
            <span>Ledgerly</span>
        </a>

        <div class="auth-brand-copy">
            <p class="auth-eyebrow">Student finance cockpit</p>
            <h1>Your finances, finally clear.</h1>
            <p>
                Track money in, money out, budgets, bills, goals, and AI guidance from one calm dashboard.
            </p>
        </div>

        <div class="auth-value-list" aria-label="Ledgerly product value">
            <div class="auth-value-item">
                <span aria-hidden="true">01</span>
                <div>
                    <strong>See the whole month</strong>
                    <p>Income, expenses, cashflow, and savings stay visible.</p>
                </div>
            </div>
            <div class="auth-value-item">
                <span aria-hidden="true">02</span>
                <div>
                    <strong>Catch budget pressure early</strong>
                    <p>Category limits and bills show what needs attention.</p>
                </div>
            </div>
            <div class="auth-value-item">
                <span aria-hidden="true">03</span>
                <div>
                    <strong>Turn data into next steps</strong>
                    <p>Ledgerly AI summarizes patterns and practical moves.</p>
                </div>
            </div>
        </div>

        <div class="auth-brand-metric" aria-label="Example monthly snapshot">
            <span>Monthly clarity score</span>
            <strong>86</strong>
        </div>
    </section>

    <section class="auth-panel" aria-label="Authentication">
        <div class="container" id="container">
            <div class="auth-card-intro">
                <p class="auth-eyebrow">Secure access</p>
                <h2>Sign in to Ledgerly</h2>
                <p>Welcome back. Continue tracking your month with clear budgets, goals, and AI insights.</p>
            </div>

            <div class="auth-switch" role="group" aria-label="Choose authentication mode">
                <button class="auth-switch-btn auth-switch-signin" id="signIn" type="button">Sign in</button>
                <button class="auth-switch-btn auth-switch-signup" id="signUp" type="button">Create account</button>
            </div>

            <div class="auth-forms">
                <!-- Sign In Form -->
                <div class="form-container sign-in-container">
                    <form method="POST" action="{{ route('login.submit') }}" aria-label="Sign in form">
                        @csrf
                        <div class="form-heading">
                            <h3>Sign in</h3>
                            <span>Use your Ledgerly account to open the finance dashboard.</span>
                        </div>

                        <div class="form-field">
                            <label for="loginEmail">Email address</label>
                            <input id="loginEmail" type="email" name="email" placeholder="you@example.com" value="{{ old('email') }}" autocomplete="email" required />
                        </div>

                        <div class="form-field">
                            <label for="loginPassword">Password</label>
                            <div class="password-field">
                                <input id="loginPassword" type="password" name="password" placeholder="Enter your password" autocomplete="current-password" required />
                                <button class="password-toggle" type="button" aria-label="Show password">
                                    <span aria-hidden="true">Show</span>
                                </button>
                            </div>
                        </div>

                        @if ($errors->any() && session('form') === 'signin')
                            <div class="error" role="alert" aria-live="polite">
                                @foreach ($errors->all() as $error)
                                    <p>{{ $error }}</p>
                                @endforeach
                            </div>
                        @endif

                        <button type="submit">Sign in</button>
                    </form>
                </div>

                <!-- Sign Up Form -->
                <div class="form-container sign-up-container">
                    <form method="POST" action="{{ route('signup') }}" aria-label="Create account form">
                        @csrf
                        <div class="form-heading">
                            <h3>Create account</h3>
                            <span>Start tracking spending, budgets, bills, savings, and AI guidance.</span>
                        </div>

                        <div class="form-field">
                            <label for="signupName">Name</label>
                            <input id="signupName" type="text" name="name" placeholder="Your name" value="{{ old('name') }}" autocomplete="name" required />
                        </div>

                        <div class="form-field">
                            <label for="signupEmail">Email address</label>
                            <input id="signupEmail" type="email" name="email" placeholder="you@example.com" value="{{ old('email') }}" autocomplete="email" required />
                        </div>

                        <div class="form-field">
                            <label for="signupPassword">Password</label>
                            <div class="password-field">
                                <input id="signupPassword" type="password" name="password" placeholder="Create a password" autocomplete="new-password" required />
                                <button class="password-toggle" type="button" aria-label="Show password">
                                    <span aria-hidden="true">Show</span>
                                </button>
                            </div>
                        </div>

                        <div class="form-field">
                            <label for="signupPasswordConfirmation">Confirm password</label>
                            <div class="password-field">
                                <input id="signupPasswordConfirmation" type="password" name="password_confirmation" placeholder="Confirm your password" autocomplete="new-password" required />
                                <button class="password-toggle" type="button" aria-label="Show password">
                                    <span aria-hidden="true">Show</span>
                                </button>
                            </div>
                        </div>

                        @if ($errors->any() && session('form') === 'signup')
                            <div class="error" role="alert" aria-live="polite">
                                @foreach ($errors->all() as $error)
                                    <p>{{ $error }}</p>
                                @endforeach
                            </div>
                        @endif

                        <button type="submit">Create account</button>
                    </form>
                </div>
            </div>
        </div>
    </section>
</main>

<script src="{{ asset('js/login.js') }}"></script>

<!-- Auto-open correct panel on error -->
<script>
@if ($errors->any() && session('form') === 'signup')
    document.getElementById("container").classList.add("right-panel-active");
@endif
@if ($errors->any() && session('form') === 'signin')
    document.getElementById("container").classList.remove("right-panel-active");
@endif
</script>

</body>
</html>
