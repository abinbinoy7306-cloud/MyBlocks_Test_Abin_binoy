# Business Requirements Document (BRD)
**Document Version:** 1.0.0  
**Last Updated:** November 19, 2026, 20:32:02 IST (+05:30)  
**Project:** NCLC Platform (AI-Native Multi-Tenant Business Suite)  
**Classification:** Confidential / Enterprise Internal  

---

## 1. Document Control & Metadata
- **Project Name:** NCLC Business Platform
- **Document Title:** Business Requirements Document (BRD)
- **Author:** Product & Architecture Engineering
- **Date & Time of Updation:** 2026-11-19 20:32:02 IST
- **Target Audience:** Executive Stakeholders, Product Managers, Engineering Leads, QA Teams, Compliance Officers

---

## 2. Executive Summary & Vision
The **NCLC Platform** is an enterprise-grade, multi-tenant software system engineered to replace fragmented point SaaS applications (such as Zoho One, HubSpot CRM, ServiceNow ITSM, and Shopify) with a cohesive, AI-orchestrated operational backbone. 

Unlike traditional platforms where multi-tenancy and AI are bolted on retrospectively, NCLC features:
1. **Multi-Tenancy at the Core:** Zero cross-firm data bleeding via strict tenant ID isolation.
2. **Global Commerce & Finance:** Native multi-country compliance masters and multi-currency exchange engines.
3. **Hierarchical RBAC:** Four distinct security rings: Super Admin, Firm Admin, Manager, and Team User.
4. **AI-Native Interface:** Gemini integration ready for autonomous workflow assistance and natural-language queries.

---

## 3. Business Context & Problem Statement
### 3.1 Market Pain Points
1. **SaaS App Sprawl:** Modern enterprises use an average of 130+ distinct tools, causing data silos, synchronization lag, and ballooning license expenditures.
2. **Inflexible Tenancy:** Existing solutions cannot natively partition sister companies, franchise units, or legal entities without purchasing distinct enterprise instances.
3. **Cross-Border Frictions:** Handling multinational entities requires complex add-ons for state-wise taxation (e.g., Indian GST), local currencies, and varying fiscal calendars.
4. **Security Vulnerabilities:** Weak role separation often permits managers or users to inspect sensitive cross-departmental or cross-firm records.

### 3.2 Solution Proposition
NCLC solves these bottlenecks through a single deployed cluster supporting:
- Multi-organization tenancy under a single database with row-level logical separation.
- Universal country and currency lookup masters covering global operations.
- Fine-grained role segregation ensuring each user only accesses their entitled workspace scope.

---

## 4. Stakeholder Matrix & Persona Profiles

| Stakeholder Persona | Role Key | Primary Responsibilities & Business Needs |
|---|---|---|
| **Platform Owner** | `super_admin` | Global platform uptime, onboarding new firm enterprises, monitoring system-wide resource consumption, cross-firm tenant governance. |
| **Firm Managing Director / IT Head** | `firm_admin` | Autonomous organization operations, adding/removing firm staff, configuring firm country, base currency, timezones, and statutory tax registrations (GSTIN). |
| **Department / Team Lead** | `manager` | Day-to-day supervision of direct reports, project assignments, performance tracking, team SLA compliance. |
| **Operational Staff** | `team_user` | Task execution, personal dashboard access, self-service profile and password management. |

---

## 5. Scope of the Application

### 5.1 In-Scope (Phase 1 Delivered & Operational)
1. **Multi-Tenant Foundation:**
   - Automatic UUIDv4 generation for tenant identification.
   - Dynamic firm registration with custom slugs and subscription tiers (`free`, `starter`, `pro`, `enterprise`).
   - Tenant deactivation workflows that instantaneously suspend tenant users.
2. **Authentication & Identity Governance:**
   - Stateless JWT issuance (15-min Access Token, 7-day revolving Refresh Token).
   - Secure bcrypt salted password hashing (work factor 12).
   - Role-Based Access Control (RBAC) middleware guards.
3. **Global Localization & Compliance:**
   - Country Directory (20 global economies pre-seeded with ISO2, ISO3, phone dial codes, flags).
   - Currency Directory (19 ISO 4217 currencies with native symbols and decimal precisions).
   - Firm Settings Engine (Timezone, Date Format, Fiscal Year Start, GST/VAT enable toggle, GSTIN).
4. **Application Portals:**
   - Super Admin Global Console (`/sa/dashboard`, `/sa/tenants`, `/sa/users`).
   - Firm Admin Workspace (`/admin/dashboard`, `/admin/users`, `/admin/settings`).
   - Manager Team Portal (`/manager/dashboard`, `/manager/team`).
   - Team User Self-Service Hub (`/dashboard`, `/profile`).

### 5.2 Out-of-Scope (Roadmap Phase 2 & 3)
- Direct banking API automated payment sweeps (Phase 2).
- Native iOS/Android mobile builds via React Native (Phase 3).
- Offline-first biometric attendance hardware sync (Phase 2).

---

## 6. Functional Business Requirements (FBR)

### 6.1 Tenant Lifecycle Management
- **FBR-TEN-001:** The system shall allow Super Admins to provision new firm tenants with a unique legal name, slug, country, currency, and tier.
- **FBR-TEN-002:** The system shall validate slug uniqueness to prevent subdomain and workspace collisions.
- **FBR-TEN-003:** Deactivating a tenant shall immediately revoke authentication capabilities for all affiliated users.

### 6.2 User & Access Governance
- **FBR-USR-001:** Super Admins can assign users to any firm or maintain global unscoped authority (`tenant_id = NULL`).
- **FBR-USR-002:** Firm Admins can only invite or register users scoped strictly to their own `tenant_id`.
- **FBR-USR-003:** Passwords must adhere to entropy criteria and never appear in any API response or database log.
- **FBR-USR-004:** Users must be able to securely update their first name, last name, and password.

### 6.3 Regional Localization & Tax
- **FBR-LOC-001:** Every firm must designate a Base Currency (e.g., INR ₹, USD $, EUR €) used for reporting.
- **FBR-LOC-002:** Firms operating in India or VAT jurisdictions can toggle statutory tax compliance and enter a valid GSTIN/Tax ID.
- **FBR-LOC-003:** Timezones must support IANA strings (e.g., `Asia/Kolkata`, `UTC`, `America/New_York`).

---

## 7. Non-Functional Business Requirements (NFBR)

### 7.1 Security & Data Isolation
- **NFBR-SEC-001:** Complete tenant segregation: No query executed by a firm admin, manager, or team user may omit the tenant scoping filter.
- **NFBR-SEC-002:** All sensitive payload channels must run over TLS 1.3 in production environments.
- **NFBR-SEC-003:** Protection against brute-force attacks via rate-limiting headers and password salt rounds.

### 7.2 Performance & Responsiveness
- **NFBR-PERF-001:** Average API response latency must remain under 250ms for 95% of standard requests.
- **NFBR-PERF-002:** The web interface must achieve a First Contentful Paint (FCP) of under 1.2 seconds on standard broadband.
- **NFBR-PERF-003:** MySQL database connection pooling must dynamically allocate up to 10 connections per Node instance.

---

## 8. Success Metrics & Business KPIs
1. **Tenant Onboarding Velocity:** Complete onboarding of a new corporate entity in < 3 minutes.
2. **Zero Tenant Bleed:** 100% audit pass rate showing 0 cross-tenant data leaks.
3. **Platform Adoption:** >85% weekly active user rate across onboarded firm team members.
