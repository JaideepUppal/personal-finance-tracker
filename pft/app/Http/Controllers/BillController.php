<?php

namespace App\Http\Controllers;

use App\Models\Bill;
use Illuminate\Http\Request;

class BillController extends Controller
{
    public function index(Request $request)
    {
        $userId = $request->user()->id;

        return Bill::where('user_id', $userId)
            ->orderBy('due_day')
            ->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title'     => 'required|string|max:255',
            'category'  => 'nullable|string|max:255',
            'amount'    => 'required|numeric|min:0',
            'due_day'   => 'required|integer|min:1|max:31',
            'frequency' => 'required|string|in:monthly',
        ]);

        $data['category'] = $data['category'] ?? 'other';

        $bill = Bill::create([
            'user_id'  => $request->user()->id,
            'title'    => $data['title'],
            'category' => $data['category'],
            'amount'   => $data['amount'],
            'due_day'  => $data['due_day'],
            'frequency'=> $data['frequency'],
        ]);

        return response()->json($bill, 201);
    }

    public function updateStatus(Request $request)
    {
        $data = $request->validate([
            'bill_id' => 'required|exists:bills,id',
            'month'   => ['required','string','regex:/^\d{4}-\d{2}$/'], // YYYY-MM //We used chatgpt to this function as we were having some trouble debugging
            'status'  => 'required|string|in:paid,due,overdue,upcoming',
        ]);

        $bill = Bill::where('id', $data['bill_id'])
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $overrides = $bill->status_overrides ?? [];
        if (!is_array($overrides)) {
            $overrides = (array)$overrides;
        }

        $overrides[$data['month']] = $data['status'];
        $bill->status_overrides = $overrides;
        $bill->save();

        return response()->json($bill);
    }

    public function destroy(Request $request, Bill $bill)
    {
        if ($bill->user_id !== $request->user()->id) {
            abort(403);
        }

        $bill->delete();

        return response()->json(['ok' => true]);
    }
}