# Tables Used & Comprehensive Data Dictionary
**Document Version:** 1.0.0  
**Last Updated:** November 19, 2026, 20:32:02 IST (+05:30)  
**Project:** NCLC Platform (Database: `nclc_crm`)  
**Classification:** Database Architecture / Internal  

---

## 1. Document Control & Metadata
- **Project Name:** NCLC Business Platform
- **Document Title:** Tables Used & Database Data Dictionary
- **Author:** Lead Database Administrator (DBA)
- **Date & Time of Updation:** 2026-11-19 20:32:02 IST
- **Target Audience:** Backend Developers, Database Architects, Data Engineers

---

## 2. Database Overview
- **Database Engine:** MySQL 26.10 / InnoDB
- **Database Name:** `nclc_crm`
- **Default Character Set:** `utf8mb4`
- **Default Collation:** `utf8mb4_unicode_ci`
- **Total Tables:** 6 core operational tables

---

## 3. Table 1: `countries` (Global Country Directory)
Stores world economies, regional dial codes, ISO standards, and flag emojis.

| Column Name | Data Type | Nullable | Key | Default | Description |
|---|---|---|---|---|---|
| `id` | `INT` | NO | Primary Key (Auto) | Auto Increment | Unique internal country identifier |
| `name` | `VARCHAR(255)` | NO | — | — | English country name (e.g., `'India'`) |
| `iso2` | `CHAR(2)` | NO | Unique | — | ISO 3166-1 alpha-2 code (e.g., `'IN'`) |
| `iso3` | `CHAR(3)` | NO | Unique | — | ISO 3166-1 alpha-3 code (e.g., `'IND'`) |
| `phone_code` | `VARCHAR(255)` | YES | — | NULL | International telephonic prefix (e.g., `'+91'`) |
| `flag_emoji` | `VARCHAR(255)` | YES | — | NULL | Unicode representation of country flag (e.g., `'🇮🇳'`) |
| `region` | `VARCHAR(255)` | YES | — | NULL | Geographical continent/region (e.g., `'Asia'`) |
| `is_active` | `TINYINT(1)` | YES | — | `1` (true) | Active status indicator |
| `createdAt` | `DATETIME` | NO | — | — | Timestamp of creation |
| `updatedAt` | `DATETIME` | NO | — | — | Timestamp of last modification |

---

## 4. Table 2: `currencies` (ISO 4217 Currency Master)
Master directory of world currencies and display attributes.

| Column Name | Data Type | Nullable | Key | Default | Description |
|---|---|---|---|---|---|
| `id` | `INT` | NO | Primary Key (Auto) | Auto Increment | Unique internal currency identifier |
| `name` | `VARCHAR(255)` | NO | — | — | Currency denomination name (e.g., `'Indian Rupee'`) |
| `code` | `CHAR(3)` | NO | Unique | — | ISO 4217 3-letter currency code (e.g., `'INR'`) |
| `symbol` | `VARCHAR(255)` | NO | — | — | Graphical symbol (e.g., `'₹'`, `'$'`, `'€'`) |
| `decimal_places` | `INT` | YES | — | `2` | Fractional unit precision (0 for JPY, 2 for INR/USD) |
| `is_active` | `TINYINT(1)` | YES | — | `1` (true) | Active status indicator |
| `createdAt` | `DATETIME` | NO | — | — | Timestamp of creation |
| `updatedAt` | `DATETIME` | NO | — | — | Timestamp of last modification |

---

## 5. Table 3: `tenants` (Corporate Firm Organizations)
Represents discrete legal organizations or customer tenants in the multi-tenant architecture.

| Column Name | Data Type | Nullable | Key | Default | Description |
|---|---|---|---|---|---|
| `id` | `CHAR(36) BINARY` | NO | Primary Key | UUIDv4 | Unique global tenant UUID |
| `name` | `VARCHAR(255)` | NO | — | — | Legal organization name (e.g., `'Acme Corp'`) |
| `slug` | `VARCHAR(255)` | YES | Unique | NULL | URL-safe identifier (e.g., `'acme-corp'`) |
| `country_id` | `INT` | YES | Foreign Key | NULL | References `countries(id)` ON DELETE SET NULL |
| `currency_id` | `INT` | YES | Foreign Key | NULL | References `currencies(id)` ON DELETE SET NULL |
| `is_active` | `TINYINT(1)` | YES | — | `1` (true) | Operational status (false = suspended) |
| `plan` | `ENUM('free', 'starter', 'pro', 'enterprise')` | YES | — | `'free'` | Subscription commercial tier |
| `logo_url` | `VARCHAR(255)` | YES | — | NULL | Optional corporate logo CDN URL |
| `createdAt` | `DATETIME` | NO | — | — | Timestamp of tenant provisioning |
| `updatedAt` | `DATETIME` | NO | — | — | Timestamp of tenant modification |

---

## 6. Table 4: `users` (User Identity & Credentials)
Stores identity, role, and authentication tokens across all tenants.

| Column Name | Data Type | Nullable | Key | Default | Description |
|---|---|---|---|---|---|
| `id` | `CHAR(36) BINARY` | NO | Primary Key | UUIDv4 | Unique user UUID |
| `tenant_id` | `CHAR(36) BINARY` | YES | Foreign Key | NULL | References `tenants(id)` ON DELETE SET NULL. NULL for `super_admin`. |
| `first_name` | `VARCHAR(255)` | NO | — | — | User's given name |
| `last_name` | `VARCHAR(255)` | NO | — | — | User's family surname |
| `email` | `VARCHAR(255)` | NO | Unique | — | Case-insensitive login email address |
| `password` | `VARCHAR(255)` | NO | — | — | Bcrypt hash (salt factor 12) |
| `role` | `ENUM('super_admin', 'firm_admin', 'manager', 'team_user')` | NO | — | — | Role classification in RBAC hierarchy |
| `is_active` | `TINYINT(1)` | YES | — | `1` (true) | Account active status (false = access blocked) |
| `last_login` | `DATETIME` | YES | — | NULL | Timestamp of most recent authentication |
| `avatar_url` | `VARCHAR(255)` | YES | — | NULL | Optional user profile photo URL |
| `refresh_token` | `TEXT` | YES | — | NULL | Active revolving JWT refresh token |
| `createdAt` | `DATETIME` | NO | — | — | Timestamp of account registration |
| `updatedAt` | `DATETIME` | NO | — | — | Timestamp of last account modification |

---

## 7. Table 5: `tenant_settings` (Firm Localization & Tax Settings)
Specific operational configurations for each tenant.

| Column Name | Data Type | Nullable | Key | Default | Description |
|---|---|---|---|---|---|
| `id` | `CHAR(36) BINARY` | NO | Primary Key | UUIDv4 | Unique settings UUID |
| `tenant_id` | `CHAR(36) BINARY` | NO | Unique FK | — | References `tenants(id)` ON DELETE CASCADE |
| `timezone` | `VARCHAR(255)` | YES | — | `'UTC'` | Default IANA timezone string |
| `date_format` | `VARCHAR(255)` | YES | — | `'DD/MM/YYYY'` | Display format for dates |
| `fiscal_year_start` | `VARCHAR(255)` | YES | — | `'01-01'` | Start of corporate financial year (`MM-DD`) |
| `is_gst_enabled` | `TINYINT(1)` | YES | — | `0` (false) | Flag indicating statutory GST/VAT activation |
| `gstin` | `VARCHAR(255)` | YES | — | NULL | 15-character Goods & Services Tax Number |
| `createdAt` | `DATETIME` | NO | — | — | Timestamp of creation |
| `updatedAt` | `DATETIME` | NO | — | — | Timestamp of modification |

---

## 8. Table 6: `help_texts` (Dynamic Section Guidance & Help Center)
Stores dynamic instructions, help tips, and user guides attached to each section of the platform.

| Column Name | Data Type | Nullable | Key | Default | Description |
|---|---|---|---|---|---|
| `id` | `CHAR(36) BINARY` | NO | Primary Key | UUIDv4 | Unique internal help text UUID |
| `section_key` | `VARCHAR(255)` | NO | Unique | — | Unique functional key identifying the section (e.g. `'sa_dashboard_overview'`) |
| `title` | `VARCHAR(255)` | NO | — | — | Human-readable title of the guide |
| `content` | `TEXT` | NO | — | — | Comprehensive markdown/text explaining features, workflows, and rules |
| `category` | `VARCHAR(255)` | YES | — | `'general'` | Target portal persona (`'super_admin'`, `'firm_admin'`, `'manager'`, `'team_user'`) |
| `updated_by` | `CHAR(36) BINARY` | YES | Foreign Key | NULL | UUID of the Administrator who last updated this guidance |
| `createdAt` | `DATETIME` | NO | — | — | Timestamp of initial creation |
| `updatedAt` | `DATETIME` | NO | — | — | Timestamp of most recent modification |

