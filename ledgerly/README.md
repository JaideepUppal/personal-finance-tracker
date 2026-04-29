# Ledgerly

**AI-Powered Personal Finance Platform for Students and Young Professionals**

Ledgerly is a modern full-stack finance web application built to make money management simpler, smarter, and more actionable. It helps users track income, expenses, budgets, savings goals, and financial habits through a clean dashboard enhanced with AI-powered insights.

Designed and developed as a portfolio-grade software engineering project using Laravel, MySQL, JavaScript, and Chart.js.

---

## Live Project Vision

Ledgerly is built for users who want clarity over their finances without using overly complex banking apps or spreadsheets.

Whether you are a student managing monthly expenses, someone saving toward goals, or trying to understand spending habits, Ledgerly helps turn raw numbers into useful decisions.

---

## Core Features

### Authentication & Security

- Secure user registration and login system
- Password hashing using Laravel authentication standards
- Session-based authentication
- Protected dashboard routes
- CSRF protection enabled
- Server-side validation

### Expense Tracking

- Add daily expenses quickly
- Categorize spending (Food, Rent, Transport, Shopping, etc.)
- Custom categories supported
- Search and filter expenses
- Expense history list
- Spending trend charts

### Income Tracking

- Track salary, allowance, freelance income, scholarships, and more
- Categorized income entries
- Monthly summaries
- Income history list
- Income charts

### Budget Management

- Set monthly budgets by category
- View remaining budget instantly
- Progress bars for each category
- Overspending alerts
- Smart visual indicators

### Savings Goals

- Create savings goals
- Set target amount and deadline
- Add contributions over time
- Progress tracking
- Goal completion visibility

### Analytics Dashboard

- Spending trends over time
- Income trends
- Monthly comparisons
- Expense category breakdowns
- Savings percentage snapshot
- Financial overview cards

---

## AI Features

### AI Finance Coach

Provides suggestions based on income, expenses, budgets, goals, and trends.

### AI Monthly Spending Insights

Detects patterns such as rising categories, spikes, and concentration of spending.

### AI Subscription Detector

Identifies repeated charges and possible recurring subscriptions.

### AI Budget Forecast

Predicts next month’s spending from recent activity.

### AI Finance Chatbot

Interactive assistant for budgeting, savings, expenses, and Ledgerly usage help.

---

## Tech Stack

### Backend

- Laravel (PHP)
- MVC Architecture
- Protected Routes
- Server-side Validation

### Frontend

- HTML
- CSS
- JavaScript

### Database

- MySQL

### Charts

- Chart.js

### AI Integration

- Groq API (server-side only)

### Tooling

- Vite

---

## Project Structure

```text
pft/
├── app/
├── public/
│   ├── css/
│   └── js/
├── resources/
│   └── views/
├── routes/
├── database/
└── README.md
```

---

## Security Notes

- API keys stored in `.env`
- No secrets exposed client-side
- AI requests handled server-side
- Input validation enabled
- Protected AI routes
- Safe chatbot rendering

---

## Installation

### Clone Repository

```bash
git clone https://github.com/JaideepUppal/personal-finance-tracker.git
cd personal-finance-tracker/pft
```

### Install Dependencies

```bash
composer install
npm install
```

### Configure Environment

```bash
cp .env.example .env
php artisan key:generate
```

Update `.env`:

```env
DB_DATABASE=your_db
DB_USERNAME=your_user
DB_PASSWORD=your_pass

GROQ_API_KEY=your_key
GROQ_MODEL=llama-3.3-70b-versatile
```

### Run Database

```bash
php artisan migrate
```

### Start App

```bash
php artisan serve
npm run dev
```

---

## Future Improvements

- CSV imports
- Recurring bill reminders
- PDF reports
- Email summaries
- Dark/light themes
- PWA support
- Multi-currency support

---

## Author

**Jaideep Uppal**

Temple University Japan

GitHub: https://github.com/JaideepUppal

---

## License

Portfolio / Educational Use
