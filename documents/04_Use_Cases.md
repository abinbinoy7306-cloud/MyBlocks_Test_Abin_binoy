# System Use Cases Document
**Document Version:** 1.0.0  
**Last Updated:** November 19, 2026, 20:32:02 IST (+05:30)  
**Project:** NCLC Platform (AI-Native Multi-Tenant Architecture)  
**Classification:** Functional Specifications / Internal  

---

## 1. Document Control & Metadata
- **Project Name:** NCLC Business Platform
- **Document Title:** System Use Cases Document
- **Author:** Business Systems Analyst
- **Date & Time of Updation:** 2026-11-19 20:32:02 IST
- **Target Audience:** Product Teams, QA Engineers, System Architects

---

## 2. Use Case Index

| Use Case ID | Name | Actor | Complexity |
|---|---|---|---|
| **UC-01** | User Authentication & Automatic Role-Based Routing | Any Registered User | Medium |
| **UC-02** | Provisioning a New Corporate Firm Tenant | Super Admin | High |
| **UC-03** | Deactivating & Suspending a Firm Tenant | Super Admin | Medium |
| **UC-04** | Onboarding Firm Staff & Role Assignment | Firm Admin | Medium |
| **UC-05** | Configuring Firm Localization & Statutory GST/Tax | Firm Admin | Medium |
| **UC-06** | Managing Direct Reports & Team Directory | Manager | Low |
| **UC-07** | Updating Personal Profile & Changing Password | Any User | Low |

---

## 3. Detailed Use Case Specifications

### UC-01: User Authentication & Automatic Role-Based Routing
- **Primary Actor:** Any User (`super_admin`, `firm_admin`, `manager`, `team_user`)
- **Preconditions:** User has registered credentials and their account is marked `is_active = true`.
- **Trigger:** User navigates to `/login`, enters email and password, and clicks "Sign in" (or selects a 1-Click Demo account pill).
- **Main Flow:**
  1. Frontend sends `POST /api/auth/login` with email and password.
  2. Backend looks up user by email in `users` table.
  3. Bcrypt compares input password against stored hash.
  4. If user belongs to a tenant, backend fetches tenant details, country, and currency.
  5. Backend generates 15-minute Access Token and 7-day Refresh Token.
  6. Backend stores refresh token in database and returns response.
  7. Frontend saves authentication payload to persistent Zustand store.
  8. Router checks `user.role` and redirects to the designated landing dashboard:
     - `super_admin` → `/sa/dashboard`
     - `firm_admin` → `/admin/dashboard`
     - `manager` → `/manager/dashboard`
     - `team_user` → `/dashboard`
- **Exceptions:**
  - *Incorrect Password / Email:* Displays "Invalid credentials" error banner.
  - *Deactivated Account:* Displays "Account is deactivated" with 403 status.

---

### UC-02: Provisioning a New Corporate Firm Tenant
- **Primary Actor:** Super Admin
- **Preconditions:** Super Admin is logged in.
- **Trigger:** Navigates to `/sa/tenants` and clicks "Add Firm" (or accesses `/sa/tenants/new`).
- **Main Flow:**
  1. Super Admin inputs Firm Name (e.g., "Global Logistics Ltd").
  2. Frontend automatically formats and suggests a URL-safe slug (e.g., `global-logistics-ltd`).
  3. Super Admin selects Subscription Plan (`free`, `starter`, `pro`, `enterprise`).
  4. Super Admin selects Base Country from pre-seeded directory (e.g., United Kingdom 🇬🇧).
  5. Super Admin selects Base Currency from pre-seeded directory (e.g., British Pound £).
  6. Submits the form; backend executes `POST /api/tenants`.
  7. Backend initializes a new UUIDv4 tenant record and auto-generates default `tenant_settings`.
  8. Success toast displayed; new firm appears in firm directory.
- **Exceptions:**
  - *Duplicate Slug:* Backend detects existing slug and returns 409 Conflict error.

---

### UC-03: Deactivating & Suspending a Firm Tenant
- **Primary Actor:** Super Admin
- **Preconditions:** Firm tenant is currently active.
- **Main Flow:**
  1. Super Admin opens `/sa/tenants`.
  2. Locates target firm and clicks the Deactivate (Power Off) button.
  3. Confirmation dialog warns of workspace suspension.
  4. Backend sets `is_active = false` on the target tenant record.
  5. Firm status badge toggles to "Inactive".
  6. Any active sessions for that firm's users will be blocked on subsequent token refresh.

---

### UC-04: Onboarding Firm Staff & Role Assignment
- **Primary Actor:** Firm Admin (or Super Admin)
- **Preconditions:** Firm Admin is logged into their firm workspace.
- **Main Flow:**
  1. Navigates to `/admin/users` and clicks "Add Team Member".
  2. Enters First Name, Last Name, Email, Temporary Password, and Role (`manager` or `team_user`).
  3. Form submitted to `POST /api/users`.
  4. Backend automatically binds user to `req.tenantId` (the Firm Admin's firm).
  5. Bcrypt hashes password; new user record inserted.
  6. User list refreshes immediately displaying new staff member.

---

### UC-05: Configuring Firm Localization & Statutory GST/Tax
- **Primary Actor:** Firm Admin
- **Preconditions:** Firm Admin is logged in.
- **Main Flow:**
  1. Navigates to `/admin/settings`.
  2. Selects Base Country, Base Currency, Timezone, and Date Display Format.
  3. Checks "Enable GST / VAT Tax Compliance".
  4. Inputs statutory GSTIN (e.g., `27AAAAA0000A1Z5`).
  5. Clicks "Save All Changes".
  6. Backend updates both `tenants` and `tenant_settings` records atomically.
  7. Success toast confirms localization settings saved.
