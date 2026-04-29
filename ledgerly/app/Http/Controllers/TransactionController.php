<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Transaction;
use Illuminate\Support\Facades\Log;

class TransactionController extends Controller
{
    public function index(Request $request)
    {
        $userId = Auth::id();

        $items = Transaction::where('user_id', $userId)  //userId is an integer
            ->orderByDesc('date')                        
            ->orderByDesc('id')
            ->limit(300)
            ->get(['id','type','title','amount','category','date','created_at','updated_at']);

        return response()->json($items);
    }

    public function store(Request $request)
    {
        $userId = Auth::id();

        $data = $request->validate([
            'type'        => 'required|in:expense,income',
            'title'       => 'nullable|string|max:160',
            'amount'      => 'required|numeric|min:0.01',
            'category'    => 'nullable|string|max:64',
            'occurred_at' => 'nullable|date',
            'date'        => 'nullable|date',
        ]);

        try {
            $tx = Transaction::create([
                'user_id'  => $userId,
                'type'     => $data['type'],
                'title'    => $data['title']    ?? null,
                'amount'   => $data['amount'],
                'category' => $data['category'] ?? null,
                'date'     => $data['date'] ?? $data['occurred_at'] ?? now(),
            ]);

            return response()->json($tx, 201);
        } catch (\Throwable $e) {
            Log::error('TX store failed', ['err' => $e->getMessage(), 'payload' => $data]);
            return response()->json(['message' => 'Transaction save failed'], 500);
        }
    }

    public function destroy(Transaction $transaction)
    {
        if ($transaction->user_id !== Auth::id()) {
            abort(403);
        }
        $transaction->delete();
        return response()->json(['ok' => true]);
    }
}