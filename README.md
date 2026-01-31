# Personal Finance Tracker (PFT)

Personal Finance Tracker (PFT) is a full-stack web application designed to help students and young adults understand their spending habits and build healthier financial behavior. The application focuses on clarity, ease of use, and meaningful insights rather than complex budgeting workflows.

PFT allows users to track income and expenses, set monthly budgets, visualize financial trends, receive budget-based reminders, and monitor long-term saving goals — all through a single, responsive dashboard.

---

## Features

### Landing & Marketing Pages
- Public landing page explaining the purpose of PFT
- Product, Solutions, Pricing, and About pages
- Clean, student-focused UI built with Blade and custom CSS

### Authentication
- Secure user registration and login
- Session-based authentication with CSRF protection
- Logout and route protection using Laravel middleware

### Dashboard Overview
- Monthly summary cards:
  - Total income
  - Total expenses
  - Balance
  - Savings
- Recent expenses list
- Budget-based bill reminder panel
- Analytics previews

### Expense Tracking
- Add, view, and delete expenses
- Categories (predefined or custom)
- Search and real-time filtering
- Expense trend and category breakdown charts
- Recurring expense flag support

### Income Tracking
- Add income entries (salary, allowance, part-time work, etc.)
- Income trend and source breakdown charts
- Stored in the same transaction model as expenses for simpler analytics

### Monthly Budgeting
- Set monthly spending limits per category
- Automatically highlights categories close to or exceeding limits
- Budget warnings displayed directly on the dashboard

### Analytics
- Spending trends (last 14 days)
- Category breakdown for the current month
- Monthly comparisons
- Savings snapshot (income vs expenses)

Charts are rendered using Chart.js and updated dynamically without page reloads.

### Saving Goals
- Create long-term financial goals (e.g. travel, emergency fund)
- Track progress with visual progress bars
- Add contributions to goals
- Delete completed or unused goals
- Goals are private and user-specific

### Quick Add Expense
- Floating “+” button on the dashboard
- Quickly record expenses without leaving the page
- Automatically updates totals, lists, and charts

---

## Technology Stack

### Backend
- Laravel (PHP)
- Eloquent ORM
- REST-style JSON endpoints

### Database
- MySQL

### Frontend
- Blade templates
- HTML / CSS / Vanilla JavaScript
- Chart.js (via CDN)

---

## Setup & Run Instructions

### Prerequisites
- PHP
- Composer
- MySQL
- Google Chrome (recommended)

### Installation

```bash
git clone https://github.com/your-username/personal-finance-tracker.git
cd personal-finance-tracker/pft
composer install
copy .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve
```

Open:
http://127.0.0.1:8000

---

## Future Improvements
- Multi-currency support
- Advanced recurring transactions
- Export data (CSV / Excel)
- Email-based bill reminders
- Improved mobile responsiveness

---

## Attribution
Built using Laravel and Chart.js. OpenAI ChatGPT was used as a coding assistant for debugging and improvements.
