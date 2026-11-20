# System Test Cases & Quality Assurance Protocol
**Document Version:** 1.0.0  
**Last Updated:** November 19, 2026, 20:32:02 IST (+05:30)  
**Project:** NCLC Platform (AI-Native Multi-Tenant Architecture)  
**Classification:** Quality Assurance / Testing  

---

## 1. Document Control & Metadata
- **Project Name:** NCLC Business Platform
- **Document Title:** System Test Suites & Validation Matrix
- **Author:** Lead Quality Assurance & Security Engineer
- **Date & Time of Updation:** 2026-11-19 20:32:02 IST
- **Target Audience:** QA Engineers, Automation Developers, Release Managers

---

## 2. Test Suite 1: Authentication & Session Governance

| Test Case ID | Test Description | Steps to Execute | Expected Outcome | Status |
|---|---|---|---|---|
| **TC-AUTH-01** | Successful Super Admin Authentication | 1. Navigate to `/login`<br>2. Enter `admin@nclc.com` & `Admin@123`<br>3. Click Sign in | HTTP 200 returned; JWT stored in Zustand; redirected to `/sa/dashboard` | **PASS** |
| **TC-AUTH-02** | Successful Firm Admin Authentication | 1. Enter `admin@acme.com` & `Admin@123`<br>2. Click Sign in | HTTP 200 returned; Tenant Acme Corp metadata attached; routed to `/admin/dashboard` | **PASS** |
| **TC-AUTH-03** | Invalid Password Rejection | 1. Enter `admin@nclc.com` & `WrongPwd999`<br>2. Submit | HTTP 401 Unauthorized; Error banner displayed; No tokens issued | **PASS** |
| **TC-AUTH-04** | Deactivated Account Rejection | 1. Set `is_active = false` on user record<br>2. Attempt login | HTTP 403 Forbidden; "Account is deactivated" banner | **PASS** |
| **TC-AUTH-05** | One-Click Demo Credentials Quick Switch | 1. Click "Manager" button on login page<br>2. Form auto-fills `manager@acme.com` / `Manager@123`<br>3. Submit | Successfully logs in and routes to `/manager/dashboard` | **PASS** |
| **TC-AUTH-06** | Secure Logout Execution | 1. Click Logout in Sidebar | Tokens purged from localStorage; subsequent API call fails with 401; redirected to `/login` | **PASS** |

---

## 3. Test Suite 2: Multi-Tenancy & Data Isolation

| Test Case ID | Test Description | Steps to Execute | Expected Outcome | Status |
|---|---|---|---|---|
| **TC-ISO-01** | Firm Admin User Query Isolation | 1. Log in as `admin@acme.com`<br>2. Send `GET /api/users` | Only returns users where `tenant_id = Acme_Corp_ID`. Super admin and other firm users are absent. | **PASS** |
| **TC-ISO-02** | Cross-Tenant User Creation Block | 1. Authenticate as Firm Admin (`admin@acme.com`)<br>2. Attempt `POST /api/users` with foreign `tenant_id` | Backend overrides or ignores submitted `tenant_id` and binds user to caller's `req.tenantId`. | **PASS** |
| **TC-ISO-03** | Unauthorized Tenant Settings Tampering | 1. Authenticate as Firm Admin for Tenant A<br>2. Send `PUT /api/tenants/:TenantB_ID/settings` | API rejects with HTTP 403 Forbidden. | **PASS** |
| **TC-ISO-04** | Super Admin Cross-Tenant Governance | 1. Authenticate as `admin@nclc.com`<br>2. Send `GET /api/tenants` | Returns all global registered firms without filter restriction. | **PASS** |

---

## 4. Test Suite 3: Localization, Country & Currency Masters

| Test Case ID | Test Description | Steps to Execute | Expected Outcome | Status |
|---|---|---|---|---|
| **TC-LOC-01** | Country Directory Retrieval | Send `GET /api/countries` with valid Bearer token | Returns 20 countries with ISO2, ISO3, phone codes, and flag emojis. | **PASS** |
| **TC-LOC-02** | Currency Directory Retrieval | Send `GET /api/currencies` with valid Bearer token | Returns 19 ISO 4217 currencies with native symbols and decimal precisions. | **PASS** |
| **TC-LOC-03** | GST / VAT Compliance Toggle | 1. Navigate to `/admin/settings`<br>2. Check "Enable GST"<br>3. Enter `27AAAAA0000A1Z5`<br>4. Save | Settings persist in DB: `is_gst_enabled = 1`, `gstin = '27AAAAA0000A1Z5'`. | **PASS** |

---

## 5. Test Suite 4: Role-Based Access Control (RBAC) Barrier

| Test Case ID | Test Description | Steps to Execute | Expected Outcome | Status |
|---|---|---|---|---|
| **TC-RBAC-01** | Team User accessing Super Admin Route | 1. Log in as `user@acme.com`<br>2. Directly navigate to `http://localhost:5173/sa/tenants` | `ProtectedRoute` and `RoleGate` intercept; user prevented from viewing admin console. | **PASS** |
| **TC-RBAC-02** | Manager creating New Firms | 1. Log in as `manager@acme.com`<br>2. Attempt `POST /api/tenants` | API rejects with 403 Forbidden. | **PASS** |
| **TC-RBAC-03** | Profile Password Update | 1. Log in as `user@acme.com`<br>2. Navigate to `/profile`<br>3. Change password | Password re-hashed and updated; subsequent login with old password rejected. | **PASS** |
