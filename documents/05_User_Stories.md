# Agile User Stories & Acceptance Criteria
**Document Version:** 1.0.0  
**Last Updated:** November 19, 2026, 20:32:02 IST (+05:30)  
**Project:** NCLC Platform (AI-Native Multi-Tenant Architecture)  
**Classification:** Agile Artifacts / Internal  

---

## 1. Document Control & Metadata
- **Project Name:** NCLC Business Platform
- **Document Title:** User Stories & Gherkin Acceptance Criteria
- **Author:** Agile Product Manager
- **Date & Time of Updation:** 2026-11-19 20:32:02 IST
- **Target Audience:** Scrum Teams, QA Engineers, Developers

---

## 2. Epic 1: Multi-Tenancy & Platform Governance

### Story US-TEN-01: Firm Tenant Creation
**As a** Super Administrator,  
**I want to** register new firm organizations with custom slugs and subscription tiers,  
**So that** multiple corporate entities can run autonomously on a single cluster.

#### Acceptance Criteria (Gherkin):
```gherkin
Scenario: Successfully creating a new firm tenant
  Given I am logged in as a Super Admin at "/sa/dashboard"
  When I navigate to "/sa/tenants/new"
  And I fill in "Firm Name" with "Nexus Tech Inc"
  And I select Plan "pro", Country "India", and Currency "INR"
  And I click "Create Firm"
  Then the system should save the new tenant in the database
  And an associated "tenant_settings" row should be automatically provisioned
  And I should be redirected to "/sa/tenants" with a success notification

Scenario: Preventing duplicate slug registration
  Given a tenant with slug "acme-corp" already exists
  When I attempt to create a firm with slug "acme-corp"
  Then the API should reject the request with HTTP 409 Conflict
  And the UI should display "A firm with this slug already exists"
```

---

### Story US-TEN-02: Cross-Tenant Data Isolation
**As a** Firm Admin,  
**I want to** ensure that I can only view and manage users from my own firm,  
**So that** confidential employee records are never leaked to competitor organizations.

#### Acceptance Criteria:
```gherkin
Scenario: Querying user directory as a Firm Admin
  Given I am authenticated as Firm Admin for "Acme Corp" (tenant_id = T1)
  When I send a request to "GET /api/users"
  Then the response should only contain users whose "tenant_id" equals T1
  And users belonging to other firms (tenant_id != T1) must never be returned
```

---

## 3. Epic 2: Role-Based Access Control & Identity

### Story US-AUTH-01: Role-Aware Redirection
**As a** registered platform user,  
**I want to** be automatically directed to my designated role portal upon sign-in,  
**So that** I land directly on the tools pertinent to my responsibilities.

#### Acceptance Criteria:
```gherkin
Scenario Outline: Dynamic role landing
  Given I have valid credentials with role "<Role>"
  When I submit my login at "/login"
  Then the system should verify my password using bcrypt
  And issue a signed JWT access token containing my role
  And redirect me to "<Landing_Route>"

  Examples:
    | Role        | Landing_Route         |
    | super_admin | /sa/dashboard         |
    | firm_admin  | /admin/dashboard      |
    | manager     | /manager/dashboard    |
    | team_user   | /dashboard            |
```

---

## 4. Epic 3: Regional Compliance, Tax & Localization

### Story US-LOC-01: Setting Base Currency and Country
**As a** Firm Admin,  
**I want to** establish the base country and operating currency for my organization,  
**So that** financial calculations and reports reflect our operational jurisdiction.

#### Acceptance Criteria:
```gherkin
Scenario: Updating firm localization settings
  Given I am logged in as Firm Admin at "/admin/settings"
  When I select Country "United Arab Emirates 🇦🇪"
  And I select Currency "AED (د.إ)"
  And I select Timezone "Asia/Dubai"
  And I click "Save All Changes"
  Then the tenant record should be updated in MySQL
  And the settings should persist across subsequent logins
```

---

### Story US-LOC-02: Statutory GST & VAT Configuration
**As a** Firm Admin in India,  
**I want to** toggle GST compliance and input my firm's GSTIN,  
**So that** all generated invoices comply with government tax regulations.

#### Acceptance Criteria:
```gherkin
Scenario: Enabling GST tax compliance
  Given I am on the "/admin/settings" page
  When I check the "Enable GST / VAT Tax Compliance" toggle
  Then the GSTIN input field should become visible
  When I enter "27AAAAA0000A1Z5" and save
  Then the database should store "is_gst_enabled = true" and "gstin = '27AAAAA0000A1Z5'"
```
