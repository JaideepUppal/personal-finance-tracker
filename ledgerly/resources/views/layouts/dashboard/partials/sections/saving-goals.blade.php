<section id="saving-goals" class="content-section">
  <div class="section-heading">
    <p class="section-kicker">Longer-term capital</p>
    <h1 class="section-title">Saving Goals</h1>
  </div>

  <!-- Add New Goal -->
  <div class="panel">
    <div class="panel-header">
      <div>
        <p class="panel-kicker">New objective</p>
      <h3 class="panel-title">Create a new goal</h3>
      </div>
    </div>
    <div class="add-row">
      <input
        id="sgName"
        class="filter-input"
        type="text"
        placeholder="Goal name (e.g., Emergency fund, Vacation)"
      />
      <input
        id="sgTarget"
        class="filter-input"
        type="number"
        inputmode="decimal"
        placeholder="Target amount (¥)"
      />
      <input
        id="sgDeadline"
        class="filter-input"
        type="date"
      />
      <button id="sgAddBtn" class="filter-btn" type="button">
        Add goal
      </button>
    </div>
  </div>

  <!-- Goals List -->
  <div class="panel">
    <div class="panel-header">
      <div>
        <p class="panel-kicker">Progress tracking</p>
      <h3 class="panel-title">Your goals</h3>
      </div>
    </div>
    <div id="sgList" class="savings-goals-list">
      <!-- Filled by dashboard.js -->
    </div>
  </div>
</section>
