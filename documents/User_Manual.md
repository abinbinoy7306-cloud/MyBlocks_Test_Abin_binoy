# User Manual

*Date Updated: November 19, 2026, 21:21 IST*

## Introduction
This manual guides end‑users through the NCLC platform – a multi‑tenant, multi‑country, multi‑currency SaaS solution powered by Google Gemini.

## Access URLs & Login
- **Frontend Application**: http://localhost:5173
- **Backend API (Swagger UI)**: http://localhost:5000/api-docs
- **Login Credentials** (pre‑seeded for demo):
  - **Super Admin**: `admin@nclc.com` / `Admin@123`
  - **Firm Admin (Acme Corp)**: `admin@acme.com` / `Admin@123`
  - **Manager**: `manager@acme.com` / `Manager@123`
  - **Team Member**: `user@acme.com` / `User@1234`

## Navigation & Help (`?` icons)
Each major screen contains a **?** icon next to section titles. Hover or click to view contextual help. Administrators can edit help text via the **Help Texts** admin page (API: `/api/help-texts`).

## Core Workflows
1. **Tenant Creation (Super Admin)** – Dashboard → **Tenants** → **Add New**.
2. **User Management (Firm Admin)** – Settings → **Users** → **Add / Edit**.
3. **Invoice Generation (Firm Admin / Manager)** – Finance → **Invoices** → **Create**.
4. **Task Assignment (Manager)** – Team → **Tasks** → **Assign**.
5. **Help Text Editing (Super Admin)** – Admin → **Help Texts** → **Edit**.

## Multi‑Country / Currency
- Navigate to **Settings → Localization**.
- Select the required country and default currency.
- All monetary fields respect the selected currency formatting.

## Reporting & AI Assistance
- Use the **Gemini Prompt Bar** at the top of each page to ask natural‑language questions, e.g., “Show me overdue invoices for France”.
- Results appear as cards with actionable buttons.

## FAQ
- **Q:** *Why is the dashboard blank?*\
  **A:** Ensure you are logged in with a role that has dashboard permissions (Super Admin, Firm Admin, Manager).\
- **Q:** *How do I reset the app?*\
  **A:** Use the **Restart** button in the admin panel or stop/start the server processes.

> **Note:** This manual will be expanded as new features are released.
