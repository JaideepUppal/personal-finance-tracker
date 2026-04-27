<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Login | Ledgerly</title>

    <link rel="stylesheet" href="{{ asset('css/pages/login.css') }}">
</head>
<body>

<div class="container" id="container">

    <!-- Sign Up Form -->
    <div class="form-container sign-up-container">
        <form method="POST" action="{{ route('signup') }}" aria-label="Create account form">
            @csrf
            <h1>Create Account</h1>
            <span>Start tracking student finances with Ledgerly</span>

            <input type="text" name="name" placeholder="Name" value="{{ old('name') }}" autocomplete="name" required />
            <input type="email" name="email" placeholder="Email" value="{{ old('email') }}" autocomplete="email" required />
            <input type="password" name="password" placeholder="Password" autocomplete="new-password" required />
            <input type="password" name="password_confirmation" placeholder="Confirm Password" autocomplete="new-password" required />

            @if ($errors->any() && session('form') === 'signup')
                <div class="error" role="alert" aria-live="polite">
                    @foreach ($errors->all() as $error)
                        <p>{{ $error }}</p>
                    @endforeach
                </div>
            @endif

            <button type="submit">Sign Up</button>
        </form>
    </div>

    <!-- Sign In Form -->
    <div class="form-container sign-in-container">
        <form method="POST" action="{{ route('login.submit') }}" aria-label="Sign in form">
            @csrf
            <h1>Sign In</h1>
            <span>Continue to your Ledgerly workspace</span>

            <input type="email" name="email" placeholder="Email" value="{{ old('email') }}" autocomplete="email" required />
            <input type="password" name="password" placeholder="Password" autocomplete="current-password" required />

            @if ($errors->any() && session('form') === 'signin')
                <div class="error" role="alert" aria-live="polite">
                    @foreach ($errors->all() as $error)
                        <p>{{ $error }}</p>
                    @endforeach
                </div>
            @endif

            <button type="submit">Sign In</button>
        </form>
    </div>

    <!-- Overlay -->
    <div class="overlay-container">
        <div class="overlay">
            <div class="overlay-panel overlay-left">
                <h1>Welcome Back</h1>
                <p>Sign in to continue managing spending, budgets, bills, and goals.</p>
                <button class="ghost" id="signIn">Sign In</button>
            </div>
            <div class="overlay-panel overlay-right">
                <h1>Start with Ledgerly</h1>
                <p>Create an account for clear student finance tracking.</p>
                <button class="ghost" id="signUp">Sign Up</button>
            </div>
        </div>
    </div>

</div>

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
