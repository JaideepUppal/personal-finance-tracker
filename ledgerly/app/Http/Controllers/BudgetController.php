<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Budget;

class BudgetController extends Controller
{
    // GET /api/budgets?month=YYYY-MM
    public function index(Request $request)
    {
        $userId = Auth::id();
        $month  = $request->query('month') ?: now()->format('Y-m');

        $items = Budget::where('user_id', $userId)
            ->where('month', $month)
            ->orderBy('category')
            ->get(['id','category','limit_amount','month','created_at','updated_at']);

        return response()->json([
            'month'   => $month,
            'budgets' => $items,
        ]);
    }

    // POST /api/budgets
    public function store(Request $request)
    {
        $userId = Auth::id();

        $data = $request->validate([
            'category'     => 'required|string|max:64',
            'limit_amount' => 'required|numeric|min:0.01',
            'month'        => 'nullable|date_format:Y-m',
        ]);

        $data['month']    = $data['month'] ?? now()->format('Y-m');
        $data['category'] = strtolower($data['category']);

        $budget = Budget::updateOrCreate(
            ['user_id' => $userId, 'category' => $data['category'], 'month' => $data['month']],
            ['limit_amount' => $data['limit_amount']]
        );

        return response()->json($budget, 201);
    }

    // DELETE /api/budgets/{budget}
    public function destroy(Budget $budget)
    {
        if ($budget->user_id !== Auth::id()) {
            abort(403);
        }

        $budget->delete();

        return response()->json(['ok' => true]);
    }
}