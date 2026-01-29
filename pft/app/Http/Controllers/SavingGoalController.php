<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\SavingGoal;
use Illuminate\Http\Request;

class SavingGoalController extends Controller
{
    public function index(Request $request)
    {
        return $request->user()
            ->savingGoals()
            ->orderBy('created_at', 'desc')
            ->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name'          => 'required|string|max:255',
            'target_amount' => 'required|numeric|min:0',
            'deadline'      => 'nullable|date',
        ]);

        $goal = SavingGoal::create([
            'user_id'       => $request->user()->id,
            'name'          => $data['name'],
            'target_amount' => $data['target_amount'],
            'saved_amount'  => 0,
            'deadline'      => $data['deadline'] ?? null,
        ]);

        return response()->json($goal, 201);
    }

    public function contribute(Request $request, SavingGoal $savingGoal)
    {
        $this->authorizeGoal($request, $savingGoal);

        $data = $request->validate([
            'amount' => 'required|numeric|min:0.01',
        ]);

        $savingGoal->increment('saved_amount', $data['amount']);

        return response()->json($savingGoal->refresh());
    }

    public function destroy(Request $request, SavingGoal $savingGoal)
    {
        $this->authorizeGoal($request, $savingGoal);

        $savingGoal->delete();

        return response()->json(['ok' => true]);
    }

    protected function authorizeGoal(Request $request, SavingGoal $savingGoal)
    {
        abort_unless($savingGoal->user_id === $request->user()->id, 403);
    }
}
