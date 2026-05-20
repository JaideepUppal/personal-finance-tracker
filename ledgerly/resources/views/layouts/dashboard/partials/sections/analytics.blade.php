<section id="analytics" class="content-section">
  <div class="section-heading">
    <p class="section-kicker">AI analytics suite</p>
    <h1 class="section-title">Analytics</h1>
  </div>

  <div class="ai-tools-grid">
    <div id="aiMonthlyInsightsPanel" class="panel ai-feature-panel">
      <div class="panel-header ai-feature-header">
        <div>
          <p class="panel-kicker">Monthly narrative</p>
          <h2 class="panel-title">AI Monthly Spending Insights</h2>
          <p class="ai-coach-copy">Spot patterns in this month's income, spending, savings rate, and largest recent expenses.</p>
        </div>
        <button id="aiMonthlyInsightsButton" class="filter-btn ai-feature-button" type="button">
          Generate insights
        </button>
      </div>
      <div id="aiMonthlyInsightsLoading" class="ai-coach-loading hidden" aria-live="polite">Generating insights...</div>
      <div id="aiMonthlyInsightsError" class="ai-coach-error hidden" role="alert" aria-live="polite"></div>
      <div id="aiMonthlyInsightsOutput" class="ai-coach-output" aria-live="polite">Generate insights after adding income and expenses.</div>
    </div>

    <div id="aiSubscriptionPanel" class="panel ai-feature-panel">
      <div class="panel-header ai-feature-header">
        <div>
          <p class="panel-kicker">Recurring detection</p>
          <h2 class="panel-title">AI Subscription Detector</h2>
          <p class="ai-coach-copy">Review transaction history for recurring or subscription-like spending patterns.</p>
        </div>
        <button id="aiSubscriptionButton" class="filter-btn ai-feature-button" type="button">
          Detect recurring spending
        </button>
      </div>
      <div id="aiSubscriptionLoading" class="ai-coach-loading hidden" aria-live="polite">Checking recurring patterns...</div>
      <div id="aiSubscriptionError" class="ai-coach-error hidden" role="alert" aria-live="polite"></div>
      <div id="aiSubscriptionOutput" class="ai-coach-output" aria-live="polite">Recurring patterns will appear here.</div>
    </div>

    <div id="aiForecastPanel" class="panel ai-feature-panel">
      <div class="panel-header ai-feature-header">
        <div>
          <p class="panel-kicker">Forward view</p>
          <h2 class="panel-title">AI Budget Forecast</h2>
          <p class="ai-coach-copy">Estimate next month's pressure areas and practical budget adjustments.</p>
        </div>
        <button id="aiForecastButton" class="filter-btn ai-feature-button" type="button">
          Forecast next month
        </button>
      </div>
      <div id="aiForecastLoading" class="ai-coach-loading hidden" aria-live="polite">Forecasting next month...</div>
      <div id="aiForecastError" class="ai-coach-error hidden" role="alert" aria-live="polite"></div>
      <div id="aiForecastOutput" class="ai-coach-output" aria-live="polite">Forecast suggestions will appear here.</div>
    </div>
  </div>

  <div id="aiChatPanel" class="panel ai-chat-panel is-collapsed">
    <div class="panel-header ai-chat-header">
      <div>
        <p class="panel-kicker">Contextual assistant</p>
        <h2 class="panel-title">AI Finance Chatbot</h2>
        <p class="ai-coach-copy">
          Ask focused questions about budgeting, spending habits, saving goals, and how to use Ledgerly.
        </p>
      </div>
      <button
        id="aiChatToggle"
        class="filter-btn ai-feature-button"
        type="button"
        aria-expanded="false"
        aria-label="Open chat"
      >
        Open chat
      </button>
    </div>

    <div class="ai-chat-body" hidden>
      <div id="aiChatMessages" class="ai-chat-messages" aria-live="polite">
        <div class="ai-chat-message assistant">
          Ask a finance question, or ask how to interpret your current Ledgerly dashboard.
        </div>
      </div>
      <div id="aiChatLoading" class="ai-chat-loading hidden" aria-live="polite">
        <span class="ai-chat-loading-dot" aria-hidden="true"></span>
        Thinking through your Ledgerly data...
      </div>
      <div id="aiChatError" class="ai-coach-error hidden" role="alert" aria-live="polite"></div>
      <div class="ai-chat-input-row">
        <textarea
          id="aiChatInput"
          class="filter-input ai-chat-input"
          rows="2"
          maxlength="800"
          placeholder="Ask about budgeting, spending, savings goals, or Ledgerly features"
          aria-label="Ask the AI Finance Chatbot"
        ></textarea>
        <button id="aiChatSend" class="filter-btn ai-chat-send" type="button">
          Send
        </button>
      </div>
    </div>
  </div>

  <div class="analytics-grid">
    <!-- Spending trend -->
    <div class="chart-container panel">
      <div class="panel-header">
        <h2 class="panel-title">Spending Trends (Last 14 days)</h2>
      </div>
      <canvas id="anSpendLine"></canvas>
    </div>

    <!-- Category breakdown -->
    <div class="chart-container panel">
      <div class="panel-header">
        <h2 class="panel-title">Category Breakdown (This month)</h2>
      </div>
      <div id="anCatBars" class="cat-bars"></div>
    </div>
  </div>

  <div class="analytics-grid">
    <!-- Monthly comparison -->
    <div class="chart-container panel">
      <div class="panel-header">
        <h2 class="panel-title">Monthly Comparison</h2>
      </div>
      <canvas id="anMonthBar"></canvas>
    </div>

    <!-- Savings rate -->
    <div class="chart-container panel">
      <div class="panel-header">
        <h2 class="panel-title">Savings Snapshot</h2>
      </div>
      <div class="savings-card">
        <div>
          <div class="savings-big" id="anSavingsPct">0%</div>
          <div class="savings-sub" id="anSavingsText">No data yet</div>
        </div>
        <div class="savings-pill" id="anSavingsPill">Savings rate</div>
      </div>
    </div>
  </div>
</section>
