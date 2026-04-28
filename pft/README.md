# Ledgerly — AI-Powered Student Finance Platform

Ledgerly is a Laravel-based student finance platform for tracking income, expenses, budgets, bills, saving goals, analytics, and practical AI-powered financial guidance. It is designed for students who need a clear monthly view without spreadsheet overhead.

## Key Features

- Secure authentication with Laravel sessions and CSRF protection
- Income tracking with categories, dates, and dashboard totals
- Expense tracking with category management and recurring bill support
- Monthly budgets with progress visibility by category
- Saving goals with target amounts, deadlines, and contribution tracking
- Bill reminders and recurring spending visibility
- Analytics dashboard powered by Chart.js
- AI Finance Coach for concise monthly next steps
- AI Monthly Spending Insights for current-month spending patterns
- AI Subscription Detector for likely recurring payments
- AI Budget Forecasting for next-month budget pressure areas
- AI Student Finance Chatbot for Ledgerly and student budgeting questions
- Responsive premium dark UI across public pages, auth, and dashboard views

## Tech Stack

- Laravel / PHP
- Blade templates
- MySQL
- JavaScript
- Chart.js
- Groq API
- Vite
- CSS

## Architecture

Ledgerly follows a conventional Laravel MVC structure. Blade renders the public website, auth screens, and dashboard UI. The dashboard is organized with Blade partials under `resources/views/layouts/dashboard/partials` while preserving the existing DOM hooks used by JavaScript.

The app uses session-authenticated same-origin JSON routes inside `routes/web.php` under `/api/...` because the frontend uses Laravel session auth and CSRF tokens. Dashboard styling and behavior are kept in public assets loaded through `asset()`, mainly `public/css/pages/*.css` and `public/js/*.js`.

Groq AI requests are made server-side through Laravel controllers. Frontend JavaScript sends only summarized finance context and user messages; it never receives or exposes the Groq API key.

## Security Notes

- `.env` is ignored and should never be committed
- API keys are stored in environment variables only
- Groq calls happen server-side through Laravel
- Forms and same-origin API requests are CSRF protected
- Dashboard and AI routes are auth protected
- AI output is rendered with safe DOM APIs in the dashboard
- No secrets should be committed to the repository
- `npm audit` should remain clean before commit

## AI Design

Ledgerly AI is purpose-limited to student finance and app usage. It supports budgeting, spending awareness, savings habits, recurring spending detection, monthly insights, forecasting, and chatbot guidance.

The AI features do not provide legal, tax, investment, medical, or professional financial advice. If dashboard data is limited, the AI should ask the user to add income, expenses, budgets, or goals before drawing stronger conclusions.

## Local Setup

```bash
git clone <repository-url>
cd personal-finance-tracker/pft
composer install
npm install
cp .env.example .env
php artisan key:generate
```

Configure your database in `.env`, then run:

```bash
php artisan migrate
npm run build
php artisan serve
```

You can also serve the project with Herd or another local Laravel environment.

## Environment Variables

Use placeholders in committed files only. Add real values to your local `.env`.

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=ledgerly
DB_USERNAME=
DB_PASSWORD=

GROQ_API_KEY=
GROQ_MODEL=llama-3.3-70b-versatile

MAIL_MAILER=
MAIL_HOST=
MAIL_PORT=
MAIL_USERNAME=
MAIL_PASSWORD=
MAIL_ENCRYPTION=
MAIL_FROM_ADDRESS=
```

Groq is optional for local UI testing, but AI endpoints return a clean configuration error until `GROQ_API_KEY` is set.

## Screenshots

### Landing Page

Add a screenshot of the Ledgerly public landing page.

### Dashboard

Add a screenshot of the authenticated dashboard overview.

### Analytics and AI Tools

Add a screenshot of the Chart.js analytics section and AI panels.

### Budget and Savings Goals

Add a screenshot of monthly budgets and saving goals.

## Future Improvements

- Email verification
- Password reset if re-added later
- CSV/PDF export
- Bank statement import
- Mobile app experience
- Multi-currency support
- Production deployment hardening

## Author

Jaideep Uppal  
Computer Science student  
Temple University Japan
