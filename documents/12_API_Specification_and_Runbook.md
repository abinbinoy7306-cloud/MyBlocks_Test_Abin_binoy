# API Specification & Operations Runbook
**Document Version:** 1.0.0  
**Last Updated:** November 19, 2026, 20:32:02 IST (+05:30)  
**Project:** NCLC Platform (AI-Native Multi-Tenant Architecture)  
**Classification:** Technical / Developer Reference  

---

## 1. Document Control & Metadata
- **Project Name:** NCLC Business Platform
- **Document Title:** RESTful API Specification & Operations Runbook
- **Author:** API Platform & Integration Team
- **Date & Time of Updation:** 2026-11-19 20:32:02 IST
- **Target Audience:** Integration Engineers, Frontend Developers, QA Automation

---

## 2. API Conventions & Standards
- **Base URL:** `http://localhost:5000/api`
- **Content Type:** `application/json`
- **Authentication Scheme:** `Authorization: Bearer <ACCESS_TOKEN>`
- **Standard Success Response Shape:**
  ```json
  {
    "success": true,
    "message": "Operation completed successfully",
    "data": { ... }
  }
  ```
- **Standard Error Response Shape:**
  ```json
  {
    "success": false,
    "message": "Descriptive error message",
    "errors": [ ... ]
  }
  ```

---

## 3. API Endpoints Reference

### 3.1 Authentication (`/api/auth`)

#### `POST /api/auth/login`
- **Auth Required:** No (Public)
- **Request Body:**
  ```json
  {
    "email": "admin@nclc.com",
    "password": "Admin@123"
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Login successful",
    "data": {
      "user": {
        "id": "16550b32-c388-41e4-9bea-5ce0e7e10080",
        "email": "admin@nclc.com",
        "first_name": "Super",
        "last_name": "Admin",
        "role": "super_admin",
        "tenant_id": null,
        "avatar_url": null,
        "last_login": "2026-11-19T14:56:54.651Z"
      },
      "accessToken": "eyJhbGciOi...",
      "refreshToken": "eyJhbGciOi...",
      "tenant": null
    }
  }
  ```

#### `POST /api/auth/refresh`
- **Auth Required:** No
- **Request Body:** `{ "refreshToken": "<TOKEN>" }`
- **Response (200 OK):** `{ "success": true, "data": { "accessToken": "...", "refreshToken": "..." } }`

#### `GET /api/auth/me`
- **Auth Required:** Yes (Bearer)
- **Response (200 OK):** Returns authenticated profile with tenant and roles.

---

### 3.2 Tenant / Firm Management (`/api/tenants`)

#### `GET /api/tenants`
- **Role Permitted:** `super_admin`
- **Query Params:** `?page=1&limit=10&search=acme`
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "tenants": [
        {
          "id": "3c5b44f4-d963-4dc5-8321-2dd08a821fc5",
          "name": "Acme Corp",
          "slug": "acme-corp",
          "plan": "pro",
          "is_active": true,
          "country": { "name": "India", "flag_emoji": "🇮🇳" },
          "currency": { "code": "INR", "symbol": "₹" }
        }
      ],
      "total": 1,
      "page": 1,
      "limit": 10
    }
  }
  ```

#### `POST /api/tenants`
- **Role Permitted:** `super_admin`
- **Request Body:**
  ```json
  {
    "name": "Nexus Dynamics",
    "slug": "nexus-dynamics",
    "plan": "enterprise",
    "country_id": 1,
    "currency_id": 1
  }
  ```

#### `GET /api/tenants/:id/settings`
- **Role Permitted:** `super_admin`, `firm_admin` (own firm)
- **Response (200 OK):** Returns timezone, date_format, fiscal_year_start, is_gst_enabled, gstin.

#### `PUT /api/tenants/:id/settings`
- **Role Permitted:** `super_admin`, `firm_admin` (own firm)
- **Request Body:**
  ```json
  {
    "timezone": "Asia/Kolkata",
    "date_format": "DD/MM/YYYY",
    "fiscal_year_start": "04-01",
    "is_gst_enabled": true,
    "gstin": "27AAAAA0000A1Z5"
  }
  ```

---

### 3.3 User Directory (`/api/users`)

#### `GET /api/users`
- **Role Permitted:** `super_admin` (all), `firm_admin` (own firm), `manager` (direct reports)
- **Query Params:** `?page=1&limit=10&search=john&role=team_user`

#### `POST /api/users`
- **Role Permitted:** `super_admin` (any firm), `firm_admin` (own firm)
- **Request Body:**
  ```json
  {
    "first_name": "Robert",
    "last_name": "Taylor",
    "email": "robert@acme.com",
    "password": "Password@123",
    "role": "team_user"
  }
  ```

---

### 3.4 Lookups (`/api/countries`, `/api/currencies`)

#### `GET /api/countries`
- **Auth Required:** Yes
- **Returns:** Array of 20 countries with ISO2, ISO3, phone codes, and flag emojis.

#### `GET /api/currencies`
- **Auth Required:** Yes
- **Returns:** Array of 19 currencies with symbols and decimal precisions.

---

## 4. Operational Runbook & Server Management

### 4.1 Starting the Stack from Cold State
1. **Verify MySQL Server is running:**
   ```powershell
   Get-Service *mysql*
   ```
2. **Start Backend Server:**
   ```powershell
   cd "c:\Users\ABIN BINOY\Desktop\NCLC\backend"
   node server.js
   # Output: Database synced | NCLC Backend running on port 5000
   ```
3. **Start Frontend Server:**
   ```powershell
   cd "c:\Users\ABIN BINOY\Desktop\NCLC\frontend"
   npm run dev
   # Output: VITE ready in 5840 ms | Local: http://localhost:5173/
   ```

### 4.2 Re-Seeding Database from Scratch
```powershell
cd "c:\Users\ABIN BINOY\Desktop\NCLC\backend"
npm run db:seed
```
