# Ledgerly

Ledgerly is an AI-powered personal finance platform built with Laravel. It helps users track income, expenses, budgets, bills, and savings goals from a clean dashboard, with server-side AI features that turn financial activity into practical insights.

This repository is structured as a portfolio-quality full-stack project for demonstrating Laravel development, session-based authentication, protected same-origin APIs, database-backed finance workflows, Chart.js analytics, and AI integration through Groq.

## Project Overview

Ledgerly is designed for students and young professionals who want a focused view of their personal finances without relying on spreadsheets or complex banking tools. The application combines core money-management workflows with AI-assisted analysis so users can understand spending patterns, budget pressure, recurring charges, and savings progress.

## Key Features

- Session-based registration, login, logout, and protected dashboard access
- Income and expense tracking with categories, custom labels, and history views
- Monthly budget management with category limits and progress indicators
- Bill tracking with recurring-payment support and status updates
- Savings goals with target amounts, deadlines, and contribution tracking
- Dashboard analytics for trends, category breakdowns, monthly summaries, and financial snapshots
- Responsive Laravel Blade interface with dedicated landing, auth, and dashboard views
- Light and dark theme support

## AI Features

- AI Finance Coach for personalized financial guidance based on user activity
- Monthly spending insights for trend and category analysis
- Subscription detector for identifying repeated charges
- Budget forecast for estimating upcoming spending
- Finance chatbot for Ledgerly usage help and budgeting questions

All AI requests are handled server-side through Laravel controllers. API keys are read from environment variables and are never exposed to the browser.

## Tech Stack

- Backend: Laravel 12, PHP 8.2+
- Frontend: Blade, HTML, CSS, JavaScript
- Database: MySQL for production-style setup, SQLite-compatible local defaults
- Charts: Chart.js
- AI Provider: Groq API
- Tooling: Vite, npm, Composer, PHPUnit

## Screenshots

Add project screenshots here before sharing the repository publicly:

- Dashboard overview
- Expense and income tracking
- Budget and savings goal workflows
- AI Finance Coach and chatbot

## Installation And Setup

### Prerequisites

- PHP 8.2+
- Composer
- Node.js 20+
- npm
- MySQL, or SQLite for quick local setup
- Groq API key for AI features

### Clone The Repository

```bash
git clone https://github.com/JaideepUppal/ledgerly-ai-finance-platform.git
cd ledgerly-ai-finance-platform/ledgerly
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

Update `.env` for your local database and AI provider:

```env
APP_NAME=Ledgerly
APP_ENV=local
APP_DEBUG=false
APP_URL=http://127.0.0.1:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=ledgerly
DB_USERNAME=your_database_user
DB_PASSWORD=your_database_password

SESSION_DRIVER=database
CACHE_STORE=database
QUEUE_CONNECTION=database

GROQ_API_KEY=your_groq_api_key
GROQ_MODEL=llama-3.3-70b-versatile
```

For SQLite-only local development, keep `DB_CONNECTION=sqlite` and create a local SQLite database file before running migrations.

### Run Migrations

```bash
php artisan migrate
```

### Start Development Servers

```bash
php artisan serve
npm run dev
```

### Build Frontend Assets

```bash
npm run build
```

## Required Environment Variables

- `APP_NAME`
- `APP_ENV`
- `APP_KEY`
- `APP_DEBUG`
- `APP_URL`
- `DB_CONNECTION`
- `DB_DATABASE`
- `DB_USERNAME` and `DB_PASSWORD` when using MySQL
- `SESSION_DRIVER`
- `CACHE_STORE`
- `QUEUE_CONNECTION`
- `GROQ_API_KEY`
- `GROQ_MODEL`

## Security Notes

- Keep `.env` out of version control.
- Use `APP_DEBUG=false` outside local debugging.
- Store AI provider credentials only in environment variables.
- AI endpoints are protected by Laravel session authentication and CSRF validation.
- Dashboard API requests are same-origin and include CSRF headers.
- Passwords are hashed through Laravel's hashing layer.
- Do not expose database credentials, app keys, or AI keys in client-side JavaScript.

## Project Structure

```text
ledgerly-ai-finance-platform/
├── README.md
└── ledgerly/
    ├── app/
    │   ├── Http/Controllers/
    │   └── Models/
    ├── config/
    ├── database/
    │   ├── migrations/
    │   └── seeders/
    ├── public/
    │   ├── css/
    │   └── js/
    ├── resources/
    │   └── views/
    ├── routes/
    ├── tests/
    ├── composer.json
    ├── package.json
    └── vite.config.js
```

## Future Improvements

- CSV import and export workflows
- Recurring bill reminders
- PDF financial reports
- Email summary notifications
- Progressive Web App support
- Multi-currency support
- Broader feature and browser test coverage
- Deployment checklist for a hosted production environment

## Author

Jaideep Uppal

Temple University Japan

GitHub: [JaideepUppal](https://github.com/JaideepUppal)

## License

Portfolio and educational use.
