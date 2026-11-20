# Complete End-User Manual & Operational Guide
**Document Version:** 1.0.0  
**Last Updated:** November 19, 2026, 20:32:02 IST (+05:30)  
**Project:** NCLC Platform (AI-Native Multi-Tenant Architecture)  
**Classification:** Operational / End-User Manual  

---

## 1. Document Control & Metadata
- **Project Name:** NCLC Business Operations Platform
- **Document Title:** Platform User Manual & Administrator Runbook
- **Author:** Customer Success & Product Documentation Team
- **Date & Time of Updation:** 2026-11-19 20:32:02 IST
- **Target Audience:** All System Users, Firm Administrators, IT Managers, Platform Operators

---

## 2. Platform Access Points & URLs

| Portal Component | Uniform Resource Locator (URL) | Port | Description |
|---|---|---|---|
| **Web Application Portal** | **`http://localhost:5173`** | 5173 | Primary interactive web UI for all roles |
| **Login Gateway** | **`http://localhost:5173/login`** | 5173 | Authentication entry point with 1-click test credentials |
| **REST API Server** | **`http://localhost:5000/api`** | 5000 | Core Express API backend service |
| **API Health Check** | **`http://localhost:5000/health`** | 5000 | Live operational probe endpoint |
| **MySQL Database** | **`localhost:3306`** | 3306 | Relational persistence storage (`nclc_crm`) |

---

## 3. Login Credentials Directory (Role-Wise Breakdown)

The system comes pre-seeded with 4 distinct operational accounts representing each level of authority in the enterprise hierarchy. 

> [!TIP]
> On the login page at **`http://localhost:5173/login`**, click any of the **Quick Demo Account** buttons below the login form to automatically populate credentials.

### Level 1: Super Administrator (Global Master Admin)
- **Role Code:** `super_admin`
- **Email:** `admin@nclc.com`
- **Password:** `Admin@123`
- **Default Landing Page:** `http://localhost:5173/sa/dashboard`
- **Accessible Navigation:**
  - 🏢 **Dashboard** (`/sa/dashboard`): Platform-wide metric cards (total firms, total global users, active tenants, countries).
  - 🏭 **All Firms** (`/sa/tenants`): Searchable, paginated directory of all registered organizations; add firm modal; firm detail view; firm deactivation toggle.
  - 👥 **All Users** (`/sa/users`): Universal user table across all firms; global user creation modal.
  - 👤 **My Profile** (`/profile`): Update name and personal password.

---

### Level 2: Firm Administrator (Corporate Organization Admin)
- **Role Code:** `firm_admin`
- **Organization:** **Acme Corp** (India, ₹ INR)
- **Email:** `admin@acme.com`
- **Password:** `Admin@123`
- **Default Landing Page:** `http://localhost:5173/admin/dashboard`
- **Accessible Navigation:**
  - 📊 **Dashboard** (`/admin/dashboard`): Organization workspace preview, staff headcounts, role distribution.
  - 👥 **Users** (`/admin/users`): Add, view, filter, and deactivate team members strictly belonging to Acme Corp.
  - ⚙️ **Firm Settings** (`/admin/settings`): Configure Base Country (India 🇮🇳), Base Currency (INR ₹), Timezone (`Asia/Kolkata`), Date Format, and statutory GST / GSTIN.
  - 👤 **My Profile** (`/profile`): Self-service personal profile and security.

---

### Level 3: Department Manager
- **Role Code:** `manager`
- **Organization:** **Acme Corp** (India, ₹ INR)
- **Email:** `manager@acme.com`
- **Password:** `Manager@123`
- **Default Landing Page:** `http://localhost:5173/manager/dashboard`
- **Accessible Navigation:**
  - 📊 **Dashboard** (`/manager/dashboard`): Department overview, direct reports list, team status metrics.
  - 👥 **My Team** (`/manager/team`): Detailed roster of assigned team members, contact information, and availability status.
  - 👤 **My Profile** (`/profile`): Personal profile and password settings.

---

### Level 4: Team Member / Operational User
- **Role Code:** `team_user`
- **Organization:** **Acme Corp** (India, ₹ INR)
- **Email:** `user@acme.com`
- **Password:** `User@1234`
- **Default Landing Page:** `http://localhost:5173/dashboard`
- **Accessible Navigation:**
  - 🏠 **Home** (`/dashboard`): Personalized workspace banner, active organization badge, assigned modules status, security overview.
  - 👤 **My Profile** (`/profile`): Update personal contact information and manage login password.

---

## 4. Step-by-Step User Guides

### 4.1 How to Sign In
1. Open your browser and navigate to **`http://localhost:5173/login`**.
2. Either click on one of the **Quick Demo Account** pills (e.g. *Super Admin*), or enter your registered email and password manually.
3. Click the **"Sign in"** button.
4. The system will validate your credentials, initialize a secure JWT session, and automatically route you to your designated portal.

### 4.2 How to Register a New Corporate Tenant (Super Admin Only)
1. Log in as Super Admin (`admin@nclc.com`).
2. In the left navigation sidebar, click **"All Firms"**.
3. Click the **"Add Firm"** button in the top-right corner.
4. Fill in:
   - **Firm Name**: e.g., `Omega Solutions`
   - **Slug**: automatically populates as `omega-solutions`
   - **Plan**: choose from `Free`, `Starter`, `Pro`, or `Enterprise`
   - **Base Country**: select from dropdown (e.g., `United States 🇺🇸`)
   - **Base Currency**: select from dropdown (e.g., `USD ($)`)
5. Click **"Create Firm"**. The new organization is provisioned instantaneously with dedicated settings.

### 4.3 How to Onboard a New Team Member (Firm Admin)
1. Log in as Firm Admin (`admin@acme.com`).
2. Click **"Users"** in the sidebar.
3. Click **"Add Team Member"**.
4. Enter First Name, Last Name, Email, Temporary Password, and select Role (`Manager` or `Team User`).
5. Click **"Add User"**. The user is immediately eligible to log in.

### 4.4 How to Configure GST and Regional Settings (Firm Admin)
1. Navigate to **"Firm Settings"** (`/admin/settings`).
2. Adjust Base Country, Base Currency, Timezone, and Date Display Format.
3. Under the **Tax & Statutory Compliance** card, check **"Enable GST / VAT Tax Compliance"**.
4. Enter your 15-character GSTIN (e.g., `27AAAAA0000A1Z5`).
5. Click **"Save All Changes"**.

### 4.5 How to Sign Out
1. In the bottom-left corner of the sidebar, click the **"Logout"** icon.
2. The session tokens are purged from browser storage and database, returning you to the login screen.

---

## 5. Built-in '?' Section Help & Dynamic Admin Guidance

Every section, dashboard, and settings card throughout the platform features an intuitive, circular **`?`** icon button beside its title.

### 5.1 How End-Users Access Guidance
1. Click the circular **`?`** button situated next to any header or card title.
2. A modal window opens displaying detailed operational guidance, rules, and best practices pre-filled for that section.
3. Click **"Close"** when finished.

### 5.2 How Administrators Add or Edit Help Text
1. Log in with an administrator role (**Super Admin** or **Firm Admin**).
2. Click the **`?`** button on any section you wish to customize.
3. Because you have administrative authority, an **"Edit Help Text"** button appears at the bottom of the modal.
4. Click **"Edit Help Text"** to enter editing mode:
   - Modify the **Help Guide Title**.
   - Type or adjust the **Help Content & Instructions**.
5. Click **"Save Changes"**.
6. The update is sent to the backend (`PUT /api/help-texts/:section_key`), saved in the MySQL `help_texts` table, and immediately available to all team members across the platform!

