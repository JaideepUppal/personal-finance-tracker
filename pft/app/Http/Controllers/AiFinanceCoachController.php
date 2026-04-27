<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\RateLimiter;

class AiFinanceCoachController extends Controller
{
    public function __invoke(Request $request)
    {
        $user = $request->user();
        $rateKey = 'ai-finance-coach:' . $user->id;

        if (RateLimiter::tooManyAttempts($rateKey, 5)) {
            return response()->json([
                'message' => 'AI Finance Coach is busy. Please wait a minute and try again.',
            ], 429);
        }

        RateLimiter::hit($rateKey, 60);

        $data = $request->validate([
            'summary' => ['required', 'array'],
            'summary.currency' => ['required', 'string', 'max:8'],
            'summary.month' => ['nullable', 'string', 'regex:/^\d{4}-\d{2}$/'],
            'summary.income' => ['required', 'numeric', 'min:0', 'max:1000000000'],
            'summary.expenses' => ['required', 'numeric', 'min:0', 'max:1000000000'],
            'summary.balance' => ['required', 'numeric', 'min:-1000000000', 'max:1000000000'],
            'summary.savings' => ['required', 'numeric', 'min:0', 'max:1000000000'],
            'summary.category_spending' => ['nullable', 'array', 'max:12'],
            'summary.category_spending.*.category' => ['required', 'string', 'max:48'],
            'summary.category_spending.*.amount' => ['required', 'numeric', 'min:0', 'max:1000000000'],
            'summary.budgets' => ['nullable', 'array', 'max:12'],
            'summary.budgets.*.category' => ['required', 'string', 'max:48'],
            'summary.budgets.*.limit' => ['required', 'numeric', 'min:0', 'max:1000000000'],
            'summary.budgets.*.spent' => ['required', 'numeric', 'min:0', 'max:1000000000'],
            'summary.saving_goals' => ['nullable', 'array'],
            'summary.saving_goals.count' => ['nullable', 'integer', 'min:0', 'max:100'],
            'summary.saving_goals.target_total' => ['nullable', 'numeric', 'min:0', 'max:1000000000'],
            'summary.saving_goals.saved_total' => ['nullable', 'numeric', 'min:0', 'max:1000000000'],
            'summary.bills' => ['nullable', 'array'],
            'summary.bills.paid' => ['nullable', 'integer', 'min:0', 'max:100'],
            'summary.bills.due' => ['nullable', 'integer', 'min:0', 'max:100'],
            'summary.bills.overdue' => ['nullable', 'integer', 'min:0', 'max:100'],
            'summary.bills.upcoming' => ['nullable', 'integer', 'min:0', 'max:100'],
        ]);

        $apiKey = config('services.groq.api_key') ?: env('GROQ_API_KEY');
        $model = config('services.groq.model') ?: 'llama-3.3-70b-versatile';

        if (!$apiKey) {
            return response()->json([
                'message' => 'AI Finance Coach is not configured yet.',
            ], 503);
        }

        $summary = $data['summary'];

        try {
            $response = Http::timeout(20)
                ->retry(1, 250)
                ->withToken($apiKey)
                ->acceptJson()
                ->post('https://api.groq.com/openai/v1/chat/completions', [
                    'model' => $model,
                    'temperature' => 0.2,
                    'max_tokens' => 320,
                    'messages' => [
                        [
                            'role' => 'system',
                            'content' => implode(' ', [
                                'You are Ledgerly AI Finance Coach.',
                                'Give short, practical, non-professional financial guidance.',
                                'Do not claim to be a financial advisor.',
                                'Do not provide investment, legal, or tax advice.',
                                'Use only the provided app summary.',
                                'Return 3 to 5 concise bullet points.',
                            ]),
                        ],
                        [
                            'role' => 'user',
                            'content' => 'Financial summary JSON: ' . json_encode($summary, JSON_UNESCAPED_SLASHES),
                        ],
                    ],
                ]);
        } catch (\Throwable $e) {
            return response()->json([
                'message' => 'AI Finance Coach is unavailable right now.',
            ], 502);
        }

        if ($response->failed()) {
            return response()->json([
                'message' => 'AI Finance Coach could not analyze this month right now.',
            ], 502);
        }

        $advice = trim((string) data_get($response->json(), 'choices.0.message.content', ''));

        if ($advice === '') {
            return response()->json([
                'message' => 'AI Finance Coach returned an empty response.',
            ], 502);
        }

        return response()->json([
            'advice' => $advice,
        ]);
    }
}
