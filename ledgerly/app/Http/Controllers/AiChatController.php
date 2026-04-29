<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\RateLimiter;

class AiChatController extends Controller
{
    private const REFUSAL = 'I can help with Ledgerly, budgeting, spending, savings goals, and student finance habits. I can\'t help with that topic here.';

    public function __invoke(Request $request)
    {
        $rateKey = 'ai:chat:' . $request->user()->id;

        if (RateLimiter::tooManyAttempts($rateKey, 8)) {
            return response()->json([
                'success' => false,
                'message' => 'AI Chatbot is busy. Please wait a minute and try again.',
            ], 429);
        }

        RateLimiter::hit($rateKey, 60);

        $data = $request->validate([
            'message' => ['required', 'string', 'min:2', 'max:800'],
            'context' => ['nullable', 'array'],
            'context.currency' => ['nullable', 'string', 'max:8'],
            'context.month' => ['nullable', 'string', 'regex:/^\d{4}-\d{2}$/'],
            'context.income' => ['nullable', 'numeric', 'min:0', 'max:1000000000'],
            'context.expenses' => ['nullable', 'numeric', 'min:0', 'max:1000000000'],
            'context.balance' => ['nullable', 'numeric', 'min:-1000000000', 'max:1000000000'],
            'context.savings' => ['nullable', 'numeric', 'min:0', 'max:1000000000'],
            'context.savings_rate' => ['nullable', 'numeric', 'min:0', 'max:1000'],
            'context.category_spending' => ['nullable', 'array', 'max:8'],
            'context.category_spending.*.category' => ['required', 'string', 'max:48'],
            'context.category_spending.*.amount' => ['required', 'numeric', 'min:0', 'max:1000000000'],
            'context.budgets' => ['nullable', 'array', 'max:8'],
            'context.budgets.*.category' => ['required', 'string', 'max:48'],
            'context.budgets.*.limit' => ['required', 'numeric', 'min:0', 'max:1000000000'],
            'context.budgets.*.spent' => ['required', 'numeric', 'min:0', 'max:1000000000'],
            'context.saving_goals' => ['nullable', 'array'],
            'context.saving_goals.count' => ['nullable', 'integer', 'min:0', 'max:100'],
            'context.saving_goals.target_total' => ['nullable', 'numeric', 'min:0', 'max:1000000000'],
            'context.saving_goals.saved_total' => ['nullable', 'numeric', 'min:0', 'max:1000000000'],
            'context.bills' => ['nullable', 'array'],
            'context.bills.paid' => ['nullable', 'integer', 'min:0', 'max:100'],
            'context.bills.due' => ['nullable', 'integer', 'min:0', 'max:100'],
            'context.bills.overdue' => ['nullable', 'integer', 'min:0', 'max:100'],
            'context.bills.upcoming' => ['nullable', 'integer', 'min:0', 'max:100'],
        ]);

        $message = trim($data['message']);

        if ($this->isClearlyOutOfScope($message)) {
            return response()->json([
                'success' => true,
                'reply' => self::REFUSAL,
            ]);
        }

        $apiKey = config('services.groq.api_key') ?: env('GROQ_API_KEY');
        $model = config('services.groq.model') ?: 'llama-3.3-70b-versatile';

        if (!$apiKey) {
            return response()->json([
                'success' => false,
                'message' => 'AI Chatbot is not configured yet.',
            ], 503);
        }

        $context = $this->safeContext($data['context'] ?? []);

        try {
            $response = Http::timeout(20)
                ->retry(1, 250)
                ->withToken($apiKey)
                ->acceptJson()
                ->post('https://api.groq.com/openai/v1/chat/completions', [
                    'model' => $model,
                    'temperature' => 0.25,
                    'max_tokens' => 360,
                    'messages' => [
                        [
                            'role' => 'system',
                            'content' => implode(' ', [
                                'You are Ledgerly\'s AI assistant inside a student finance dashboard.',
                                'Only help with Ledgerly app usage, budgeting, spending habits, saving goals, category planning, recurring spending, and student finance organization.',
                                'Politely refuse unrelated topics, coding, homework, medical, legal, tax, investment, or professional financial advice.',
                                'Never ask for or reference the user\'s name, email, password, or authentication data.',
                                'Use only the provided app context and the user message.',
                                'If context is insufficient, ask the user to add income, expense, budget, or goal data.',
                                'Keep replies concise, practical, and no more than five short sentences or bullets.',
                            ]),
                        ],
                        [
                            'role' => 'user',
                            'content' => 'Finance context JSON: ' . json_encode($context, JSON_UNESCAPED_SLASHES) . "\n\nUser message: " . $message,
                        ],
                    ],
                ]);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'AI Chatbot is unavailable right now.',
            ], 502);
        }

        if ($response->failed()) {
            return response()->json([
                'success' => false,
                'message' => 'AI Chatbot could not answer right now.',
            ], 502);
        }

        $reply = trim((string) data_get($response->json(), 'choices.0.message.content', ''));

        if ($reply === '') {
            return response()->json([
                'success' => false,
                'message' => 'AI Chatbot returned an empty response.',
            ], 502);
        }

        return response()->json([
            'success' => true,
            'reply' => mb_substr($reply, 0, 1600),
        ]);
    }

    private function safeContext(array $context): array
    {
        return [
            'currency' => $context['currency'] ?? 'JPY',
            'month' => $context['month'] ?? null,
            'income' => $context['income'] ?? 0,
            'expenses' => $context['expenses'] ?? 0,
            'balance' => $context['balance'] ?? 0,
            'savings' => $context['savings'] ?? 0,
            'savings_rate' => $context['savings_rate'] ?? 0,
            'category_spending' => array_slice($context['category_spending'] ?? [], 0, 8),
            'budgets' => array_slice($context['budgets'] ?? [], 0, 8),
            'saving_goals' => $context['saving_goals'] ?? [],
            'bills' => $context['bills'] ?? [],
        ];
    }

    private function isClearlyOutOfScope(string $message): bool
    {
        $blocked = [
            'code',
            'programming',
            'javascript',
            'php',
            'laravel',
            'homework',
            'essay',
            'medical',
            'diagnosis',
            'legal',
            'lawsuit',
            'tax return',
            'file taxes',
            'stock pick',
            'crypto',
            'investment advice',
            'which stock',
        ];

        $lower = mb_strtolower($message);

        foreach ($blocked as $term) {
            if (str_contains($lower, $term)) {
                return true;
            }
        }

        return false;
    }
}
