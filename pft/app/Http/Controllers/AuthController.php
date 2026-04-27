<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class AuthController extends Controller
{
    public function showLanding()
    {
        return view('layouts.landing.landing');
    }

    public function showLogin()
    {
        return view('auth.login');
    }

    public function showDashboard()
    {
        return view('layouts.dashboard', ['user' => Auth::user()]);
    }

    // LOGIN
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if (!Auth::attempt($credentials)) {
            return back()
                ->withErrors(['email' => 'Invalid credentials'])
                ->onlyInput('email')
                ->with('form', 'signin'); // mark login side
        }

        $request->session()->regenerate();
        return redirect()->route('dashboard');
    }

    // REGISTER
    public function register(Request $request)
    {
        //  mark that this form is signup before validation runs
        session()->flash('form', 'signup');

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);

        Auth::login($user);
        $request->session()->regenerate();

        return redirect()->route('dashboard');
    }

    // LOGOUT
    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return redirect()->route('landing');
    }
}
