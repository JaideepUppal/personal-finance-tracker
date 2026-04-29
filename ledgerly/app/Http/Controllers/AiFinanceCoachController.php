<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\RateLimiter;

class AiFinanceCoachController extends Controller
{
    public function __invoke(Request $request)
    {
        if ($limited = $this->rateLimitResponse($request, 'finance-coach')) {
            return $limited;
        }

        $summary = $this->validatedSummary($request);
        $groq = $this->groqTextResponse(
            'Ledgerly AI Finance Coach',
            [
                'Give short, practical, non-professional financial guidance.',
                'Do not claim to be a financial advisor.',
                'Do not provide investment, legal, or tax advice.',
                'Use only the provided app summary.',
                'Return 3 to 5 concise bullet points.',
            ],
            $summary,
            320
        );

        if (!$groq['success']) {
            return response()->json(['message' => $groq['message']], $groq['status']);
        }

        return response()->json(['advice' => $groq['content']]);
    }

    public function monthlyInsights(Request $request)
    {
        if ($limited = $this->rateLimitResponse($request, 'monthly-insights', true)) {
            return $limited;
        }

        $summary = $this->validatedSummary($request);

        return $this->itemsResponse(
            'AI Monthly Spending Insights',
            [
                'Summarize the current month using income, expenses, balance, savings rate, top categories, and largest recent transactions.',
                'Return 3 to 5 concise insights for a student budget.',
                'Call out category pressure, savings habits, and practical next steps.',
            ],
            $summary,
            5
        );
    }

    public function subscriptionDetector(Request $request)
    {
        if ($limited = $this->rateLimitResponse($request, 'subscription-detector', true)) {
            return $limited;
        }

        $summary = $this->validatedSummary($request);

        return $this->itemsResponse(
            'AI Subscription Detector',
            [
                'Look for repeated or similar expense titles, categories, amounts, and dates.',
                'Return likely subscriptions or recurring payments only when the data supports it.',
                'For each item include title, category if available, approximate amount, confidence, reason, and suggested action.',
                'If the history is insufficient, return one low-confidence item explaining that more transaction history is needed.',
                'Do not invent subscriptions.',
            ],
            $summary,
            5
        );
    }

    public function budgetForecast(Request $request)
    {
        if ($limited = $this->rateLimitResponse($request, 'budget-forecast', true)) {
            return $limited;
        }

        $summary = $this->validatedSummary($request);

        return $this->itemsResponse(
            'AI Budget Forecast',
            [
                'Forecast practical next-month budget suggestions from current income, expenses, category totals, budgets, and saving goals.',
                'Include expected expense pressure areas, suggested category limits, one saving goal recommendation, and one caution.',
                'Be clear that the forecast is an estimate, not guaranteed.',
            ],
            $summary,
            5
        );
    }

    private function validatedSummary(Request $request): array
    {
        $data = $request->validate([
            'summary' => ['required', 'array'],
            'summary.currency' => ['required', 'string', 'max:8'],
            'summary.month' => ['nullable', 'string', 'regex:/^\d{4}-\d{2}$/'],
            'summary.income' => ['required', 'numeric', 'min:0', 'max:1000000000'],
            'summary.expenses' => ['required', 'numeric', 'min:0', 'max:1000000000'],
            'summary.balance' => ['required', 'numeric', 'min:-1000000000', 'max:1000000000'],
            'summary.savings' => ['required', 'numeric', 'min:0', 'max:1000000000'],
            'summary.savings_rate' => ['nullable', 'numeric', 'min:0', 'max:1000'],
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
            'summary.largest_recent_transactions' => ['nullable', 'array', 'max:12'],
            'summary.largest_recent_transactions.*.title' => ['required', 'string', 'max:80'],
            'summary.largest_recent_transactions.*.category' => ['nullable', 'string', 'max:48'],
            'summary.largest_recent_transactions.*.amount' => ['required', 'numeric', 'min:0', 'max:1000000000'],
            'summary.largest_recent_transactions.*.date' => ['nullable', 'string', 'max:32'],
            'summary.transactions' => ['nullable', 'array', 'max:120'],
            'summary.transactions.*.type' => ['required', 'string', 'in:expense,income'],
            'summary.transactions.*.title' => ['required', 'string', 'max:80'],
            'summary.transactions.*.category' => ['nullable', 'string', 'max:48'],
            'summary.transactions.*.amount' => ['required', 'numeric', 'min:0', 'max:1000000000'],
            'summary.transactions.*.date' => ['nullable', 'string', 'max:32'],
        ]);

        return $data['summary'];
    }

    private function rateLimitResponse(Request $request, string $feature, bool $itemsShape = false)
    {
        $rateKey = 'ai:' . $feature . ':' . $request->user()->id;

        if (!RateLimiter::tooManyAttempts($rateKey, 5)) {
            RateLimiter::hit($rateKey, 60);
            return null;
        }

        $message = 'This AI feature is busy. Please wait a minute and try again.';

        if ($itemsShape) {
            return response()->json(['success' => false, 'message' => $message], 429);
        }

        return response()->json(['message' => $message], 429);
    }

    private function itemsResponse(string $feature, array $instructions, array $summary, int $limit)
    {
        $groq = $this->groqTextResponse(
            $feature,
            array_merge($instructions, [
                'Avoid investment, tax, legal, or professional financial advice.',
                'Use only the provided app summary.',
                'Return valid JSON only with this shape: {"items":[{"title":"short title","amount":null,"priority":"Low/Medium/High or null","confidence":"Low/Medium/High/Likely/Possible or null","description":"short practical description","action":"short suggested action"}]}.',
                'Use amount only when there is a real positive estimated amount. Use null for missing, zero, or not applicable amounts.',
                'Do not combine amount and confidence in one field. Avoid raw labels such as "0 - High" or "880000 - High".',
                'Do not invent data. For insufficient data, return one helpful low-data item with a clear description and action.',
                'Keep description to one short sentence and action to one short sentence.',
                'No markdown, no code fence, no introduction.',
            ]),
            $summary,
            520
        );

        if (!$groq['success']) {
            return response()->json([
                'success' => false,
                'message' => $groq['message'],
            ], $groq['status']);
        }

        $items = $this->parseItems($groq['content'], $limit);

        if (!$items) {
            return response()->json([
                'success' => false,
                'message' => $feature . ' returned an empty response.',
            ], 502);
        }

        return response()->json([
            'success' => true,
            'items' => $items,
        ]);
    }

    private function groqTextResponse(string $feature, array $instructions, array $summary, int $maxTokens): array
    {
        $apiKey = config('services.groq.api_key') ?: env('GROQ_API_KEY');
        $model = config('services.groq.model') ?: 'llama-3.3-70b-versatile';

        if (!$apiKey) {
            return [
                'success' => false,
                'status' => 503,
                'message' => $feature . ' is not configured yet.',
            ];
        }

        try {
            $response = Http::timeout(20)
                ->retry(1, 250)
                ->withToken($apiKey)
                ->acceptJson()
                ->post('https://api.groq.com/openai/v1/chat/completions', [
                    'model' => $model,
                    'temperature' => 0.2,
                    'max_tokens' => $maxTokens,
                    'messages' => [
                        [
                            'role' => 'system',
                            'content' => implode(' ', array_merge([
                                'You are ' . $feature . ' inside Ledgerly.',
                                'Give short, practical, student-friendly, non-professional budgeting guidance.',
                                'Do not claim to be a financial advisor.',
                            ], $instructions)),
                        ],
                        [
                            'role' => 'user',
                            'content' => 'Financial summary JSON: ' . json_encode($summary, JSON_UNESCAPED_SLASHES),
                        ],
                    ],
                ]);
        } catch (\Throwable $e) {
            return [
                'success' => false,
                'status' => 502,
                'message' => $feature . ' is unavailable right now.',
            ];
        }

        if ($response->failed()) {
            return [
                'success' => false,
                'status' => 502,
                'message' => $feature . ' could not analyze this data right now.',
            ];
        }

        $content = trim((string) data_get($response->json(), 'choices.0.message.content', ''));

        if ($content === '') {
            return [
                'success' => false,
                'status' => 502,
                'message' => $feature . ' returned an empty response.',
            ];
        }

        return [
            'success' => true,
            'status' => 200,
            'content' => $content,
        ];
    }

    private function parseItems(string $content, int $limit): array
    {
        $json = trim($content);
        $json = preg_replace('/^```(?:json)?\s*|\s*```$/i', '', $json);
        $decoded = json_decode($json, true);

        if (!is_array($decoded) && preg_match('/\{.*\}/s', $json, $match)) {
            $decoded = json_decode($match[0], true);
        }

        $items = is_array($decoded) && isset($decoded['items']) && is_array($decoded['items'])
            ? $decoded['items']
            : [];

        if (!$items) {
            $items = array_map(function ($line) {
                return ['title' => preg_replace('/^[-*\x{2022}\d.)\s]+/u', '', trim($line))];
            }, preg_split('/\r?\n/', $content) ?: []);
        }

        $items = array_values(array_filter(array_map(function ($item) {
            if (is_string($item)) {
                $title = trim($item);

                return $title === '' ? null : ['title' => mb_substr($title, 0, 120)];
            }

            if (!is_array($item)) {
                return null;
            }

            $normalized = [];
            foreach (['title', 'amount', 'priority', 'confidence', 'description', 'detail', 'reason', 'action', 'category'] as $key) {
                if (!isset($item[$key]) || is_array($item[$key]) || is_object($item[$key])) {
                    continue;
                }

                $value = trim((string) $item[$key]);
                if ($value !== '') {
                    $normalized[$key] = mb_substr($value, 0, 240);
                }
            }

            return $normalized ?: null;
        }, $items)));

        return array_slice($items, 0, $limit);
    }
}
