<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\BudgetController;
use App\Http\Controllers\BillController;
use App\Http\Controllers\SavingGoalController;
use App\Http\Controllers\AiFinanceCoachController;



 // Web Routes (HTML pages)


// Landing page
Route::get('/', [AuthController::class, 'showLanding'])->name('landing');

// Auth pages
Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
Route::post('/login', [AuthController::class, 'login'])->name('login.submit');
Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
Route::post('/register', [AuthController::class, 'register'])->name('signup');

// App dashboard
Route::get('/dashboard', [AuthController::class, 'showDashboard'])
    ->middleware('auth')
    ->name('dashboard');

// Static navbar pages
Route::get('/about', fn() => view('layouts.landing.navbar.about'))->name('about');
Route::get('/products', fn() => view('layouts.landing.navbar.products'))->name('products');
Route::get('/pricing', fn() => view('layouts.landing.navbar.pricing'))->name('pricing');
Route::get('/solutions', fn() => view('layouts.landing.navbar.solutions'))->name('solutions');
Route::get('/help', fn() => view('layouts.landing.navbar.help'))->name('help');

/*
|--------------------------------------------------------------------------
| Same-origin JSON API (SESSION AUTH)
| These are called from dashboard.js and must stay in web.php.
|--------------------------------------------------------------------------
|
| All endpoints use the /api/... prefix but live here, they use:
| - Session authentication
| - CSRF tokens
| - Same-origin cookie security
|
*/

Route::middleware(['web', 'auth'])->group(function () {

   
    Route::get('/api/transactions', [TransactionController::class, 'index']);
    Route::post('/api/transactions', [TransactionController::class, 'store']);
    Route::delete('/api/transactions/{transaction}', [TransactionController::class, 'destroy']);

    
    Route::get('/api/budgets', [BudgetController::class, 'index']);
    Route::post('/api/budgets', [BudgetController::class, 'store']);
    Route::delete('/api/budgets/{budget}', [BudgetController::class, 'destroy']);

    
    Route::get('/api/bills', [BillController::class, 'index']);
    Route::post('/api/bills', [BillController::class, 'store']);
    Route::post('/api/bills/status', [BillController::class, 'updateStatus']);
    Route::delete('/api/bills/{bill}', [BillController::class, 'destroy']);

    
    Route::get('/api/saving-goals', [SavingGoalController::class, 'index']);
    Route::post('/api/saving-goals', [SavingGoalController::class, 'store']);
    Route::post('/api/saving-goals/{savingGoal}/contribute', [SavingGoalController::class, 'contribute']);
    Route::delete('/api/saving-goals/{savingGoal}', [SavingGoalController::class, 'destroy']);

    Route::post('/api/ai/finance-coach', AiFinanceCoachController::class);
    Route::post('/api/ai/monthly-insights', [AiFinanceCoachController::class, 'monthlyInsights']);
    Route::post('/api/ai/subscription-detector', [AiFinanceCoachController::class, 'subscriptionDetector']);
    Route::post('/api/ai/budget-forecast', [AiFinanceCoachController::class, 'budgetForecast']);
});
