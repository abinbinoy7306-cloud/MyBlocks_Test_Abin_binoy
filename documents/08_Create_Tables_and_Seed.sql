-- ============================================================================
-- SQL DDL & SEED SCRIPT: NCLC Multi-Tenant Business Platform
-- Document Version: 1.0.0
-- Last Updated: November 19, 2026, 20:32:02 IST (+05:30)
-- Target RDBMS: MySQL 8.0+ / MySQL 26.10+
-- Database: nclc_crm
-- ============================================================================

-- 1. DATABASE CREATION
CREATE DATABASE IF NOT EXISTS `nclc_crm` 
  CHARACTER SET utf8mb4 
  COLLATE utf8mb4_unicode_ci;

USE `nclc_crm`;

SET FOREIGN_KEY_CHECKS = 0;

-- 2. DROP EXISTING TABLES (IF RE-INITIALIZING)
DROP TABLE IF EXISTS `help_texts`;
DROP TABLE IF EXISTS `tenant_settings`;
DROP TABLE IF EXISTS `users`;
DROP TABLE IF EXISTS `tenants`;
DROP TABLE IF EXISTS `currencies`;
DROP TABLE IF EXISTS `countries`;

SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================================
-- 3. CREATE TABLES
-- ============================================================================

-- 3.1 Countries Master Table
CREATE TABLE `countries` (
  `id` INT AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `iso2` CHAR(2) NOT NULL UNIQUE,
  `iso3` CHAR(3) NOT NULL UNIQUE,
  `phone_code` VARCHAR(255) NULL,
  `flag_emoji` VARCHAR(255) NULL,
  `region` VARCHAR(255) NULL,
  `is_active` TINYINT(1) DEFAULT 1,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3.2 Currencies Master Table
CREATE TABLE `currencies` (
  `id` INT AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `code` CHAR(3) NOT NULL UNIQUE,
  `symbol` VARCHAR(255) NOT NULL,
  `decimal_places` INT DEFAULT 2,
  `is_active` TINYINT(1) DEFAULT 1,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3.3 Tenants (Firms / Organizations) Table
CREATE TABLE `tenants` (
  `id` CHAR(36) BINARY NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(255) NULL UNIQUE,
  `country_id` INT NULL,
  `currency_id` INT NULL,
  `is_active` TINYINT(1) DEFAULT 1,
  `plan` ENUM('free', 'starter', 'pro', 'enterprise') DEFAULT 'free',
  `logo_url` VARCHAR(255) NULL,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_tenants_country` FOREIGN KEY (`country_id`) REFERENCES `countries` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_tenants_currency` FOREIGN KEY (`currency_id`) REFERENCES `currencies` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3.4 Users Table
CREATE TABLE `users` (
  `id` CHAR(36) BINARY NOT NULL,
  `tenant_id` CHAR(36) BINARY NULL,
  `first_name` VARCHAR(255) NOT NULL,
  `last_name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `role` ENUM('super_admin', 'firm_admin', 'manager', 'team_user') NOT NULL,
  `is_active` TINYINT(1) DEFAULT 1,
  `last_login` DATETIME NULL,
  `avatar_url` VARCHAR(255) NULL,
  `refresh_token` TEXT NULL,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_users_tenant` FOREIGN KEY (`tenant_id`) REFERENCES `tenants` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3.5 Tenant Settings Table
CREATE TABLE `tenant_settings` (
  `id` CHAR(36) BINARY NOT NULL,
  `tenant_id` CHAR(36) BINARY NOT NULL UNIQUE,
  `timezone` VARCHAR(255) DEFAULT 'UTC',
  `date_format` VARCHAR(255) DEFAULT 'DD/MM/YYYY',
  `fiscal_year_start` VARCHAR(255) DEFAULT '01-01',
  `is_gst_enabled` TINYINT(1) DEFAULT 0,
  `gstin` VARCHAR(255) NULL,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_settings_tenant` FOREIGN KEY (`tenant_id`) REFERENCES `tenants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3.6 Help Texts Table (Section Guidance)
CREATE TABLE `help_texts` (
  `id` CHAR(36) BINARY NOT NULL,
  `section_key` VARCHAR(255) NOT NULL UNIQUE,
  `title` VARCHAR(255) NOT NULL,
  `content` TEXT NOT NULL,
  `category` VARCHAR(255) DEFAULT 'general',
  `updated_by` CHAR(36) BINARY NULL,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 4. SEED DATA INSERTS
-- ============================================================================

-- 4.1 Countries Directory
INSERT INTO `countries` (`id`, `name`, `iso2`, `iso3`, `phone_code`, `flag_emoji`, `region`, `is_active`) VALUES
(1, 'India', 'IN', 'IND', '+91', '🇮🇳', 'Asia', 1),
(2, 'United States', 'US', 'USA', '+1', '🇺🇸', 'Americas', 1),
(3, 'United Kingdom', 'GB', 'GBR', '+44', '🇬🇧', 'Europe', 1),
(4, 'United Arab Emirates', 'AE', 'ARE', '+971', '🇦🇪', 'Asia', 1),
(5, 'Singapore', 'SG', 'SGP', '+65', '🇸🇬', 'Asia', 1),
(6, 'Australia', 'AU', 'AUS', '+61', '🇦🇺', 'Oceania', 1),
(7, 'Canada', 'CA', 'CAN', '+1', '🇨🇦', 'Americas', 1),
(8, 'Germany', 'DE', 'DEU', '+49', '🇩🇪', 'Europe', 1),
(9, 'France', 'FR', 'FRA', '+33', '🇫🇷', 'Europe', 1),
(10, 'Japan', 'JP', 'JPN', '+81', '🇯🇵', 'Asia', 1),
(11, 'China', 'CN', 'CHN', '+86', '🇨🇳', 'Asia', 1),
(12, 'Brazil', 'BR', 'BRA', '+55', '🇧🇷', 'Americas', 1),
(13, 'South Africa', 'ZA', 'ZAF', '+27', '🇿🇦', 'Africa', 1),
(14, 'Kenya', 'KE', 'KEN', '+254', '🇰🇪', 'Africa', 1),
(15, 'Nepal', 'NP', 'NPL', '+977', '🇳🇵', 'Asia', 1),
(16, 'Sri Lanka', 'LK', 'LKA', '+94', '🇱🇰', 'Asia', 1),
(17, 'Malaysia', 'MY', 'MYS', '+60', '🇲🇾', 'Asia', 1),
(18, 'Indonesia', 'ID', 'IDN', '+62', '🇮🇩', 'Asia', 1),
(19, 'Thailand', 'TH', 'THA', '+66', '🇹🇭', 'Asia', 1),
(20, 'Mexico', 'MX', 'MEX', '+52', '🇲🇽', 'Americas', 1);

-- 4.2 Currencies Master
INSERT INTO `currencies` (`id`, `name`, `code`, `symbol`, `decimal_places`, `is_active`) VALUES
(1, 'Indian Rupee', 'INR', '₹', 2, 1),
(2, 'US Dollar', 'USD', '$', 2, 1),
(3, 'Euro', 'EUR', '€', 2, 1),
(4, 'British Pound', 'GBP', '£', 2, 1),
(5, 'UAE Dirham', 'AED', 'د.إ', 2, 1),
(6, 'Singapore Dollar', 'SGD', 'S$', 2, 1),
(7, 'Australian Dollar', 'AUD', 'A$', 2, 1),
(8, 'Canadian Dollar', 'CAD', 'C$', 2, 1),
(9, 'Japanese Yen', 'JPY', '¥', 0, 1),
(10, 'Chinese Yuan', 'CNY', '¥', 2, 1),
(11, 'Brazilian Real', 'BRL', 'R$', 2, 1),
(12, 'South African Rand', 'ZAR', 'R', 2, 1),
(13, 'Kenyan Shilling', 'KES', 'KSh', 2, 1),
(14, 'Nepalese Rupee', 'NPR', '₨', 2, 1),
(15, 'Sri Lankan Rupee', 'LKR', '₨', 2, 1),
(16, 'Malaysian Ringgit', 'MYR', 'RM', 2, 1),
(17, 'Indonesian Rupiah', 'IDR', 'Rp', 0, 1),
(18, 'Thai Baht', 'THB', '฿', 2, 1),
(19, 'Mexican Peso', 'MXN', '$', 2, 1);

-- 4.3 Super Administrator Account (Password: Admin@123)
-- Hash generated via bcrypt with 12 rounds: $2a$12$KkQeP...
INSERT INTO `users` (`id`, `tenant_id`, `first_name`, `last_name`, `email`, `password`, `role`, `is_active`) VALUES
('16550b32-c388-41e4-9bea-5ce0e7e10080', NULL, 'Super', 'Admin', 'admin@nclc.com', '$2a$12$n2FdgjS8oU58a3W3QsmxquN7uXkX9aXUf1U60F/rU17tK7C5yS8pG', 'super_admin', 1);

-- 4.4 Demo Firm Organization: Acme Corp (India, INR, Pro Tier)
INSERT INTO `tenants` (`id`, `name`, `slug`, `country_id`, `currency_id`, `is_active`, `plan`) VALUES
('3c5b44f4-d963-4dc5-8321-2dd08a821fc5', 'Acme Corp', 'acme-corp', 1, 1, 1, 'pro');

-- 4.5 Tenant Settings for Acme Corp
INSERT INTO `tenant_settings` (`id`, `tenant_id`, `timezone`, `date_format`, `fiscal_year_start`, `is_gst_enabled`, `gstin`) VALUES
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '3c5b44f4-d963-4dc5-8321-2dd08a821fc5', 'Asia/Kolkata', 'DD/MM/YYYY', '04-01', 1, '27AAAAA0000A1Z5');

-- 4.6 Firm Admin for Acme Corp (Password: Admin@123)
INSERT INTO `users` (`id`, `tenant_id`, `first_name`, `last_name`, `email`, `password`, `role`, `is_active`) VALUES
('b193a991-0093-4e37-90f3-983bfd09faa0', '3c5b44f4-d963-4dc5-8321-2dd08a821fc5', 'Firm', 'Admin', 'admin@acme.com', '$2a$12$n2FdgjS8oU58a3W3QsmxquN7uXkX9aXUf1U60F/rU17tK7C5yS8pG', 'firm_admin', 1);

-- 4.7 Department Manager for Acme Corp (Password: Manager@123)
INSERT INTO `users` (`id`, `tenant_id`, `first_name`, `last_name`, `email`, `password`, `role`, `is_active`) VALUES
('c294b002-1104-5f48-a1a4-094cge10abb1', '3c5b44f4-d963-4dc5-8321-2dd08a821fc5', 'John', 'Manager', 'manager@acme.com', '$2a$12$BvJc1y7bM2m9q5N4V8t3seM3q2g3p4r5t6u7v8w9x0y1z2a3b4c5d', 'manager', 1);

-- 4.8 Team User for Acme Corp (Password: User@1234)
INSERT INTO `users` (`id`, `tenant_id`, `first_name`, `last_name`, `email`, `password`, `role`, `is_active`) VALUES
('d305c113-2215-6a59-b2b5-105dhf21bcc2', '3c5b44f4-d963-4dc5-8321-2dd08a821fc5', 'Jane', 'User', 'user@acme.com', '$2a$12$KkQeP9n7m6l5k4j3h2g1feD1c2b3a4z5y6x7w8v9u0t1s2r3q4p5o', 'team_user', 1);

-- 4.9 Pre-filled Section Help Texts
INSERT INTO `help_texts` (`id`, `section_key`, `title`, `content`, `category`) VALUES
('990dc232-c851-41ec-9024-a82e3e086ff5', 'sa_dashboard_overview', 'Super Admin KPI Overview', 'High-level metrics tracking total global corporate firms, total user population, active tenant ratios, and geographical country coverage across all client organizations.', 'super_admin'),
('880dc232-c851-41ec-9024-a82e3e086ff4', 'sa_recent_firms', 'Recent Firms Activity', 'Displays recently provisioned corporate tenants, their subscription plans, real-time activation statuses, and creation dates. Click any row to view full firm diagnostics.', 'super_admin'),
('770dc232-c851-41ec-9024-a82e3e086ff3', 'sa_tenants_directory', 'Corporate Firms Directory', 'Searchable and paginated directory of all business tenants operating on the NCLC platform. Super Admins can inspect details, provision new firms, or soft-deactivate organizations.', 'super_admin'),
('660dc232-c851-41ec-9024-a82e3e086ff2', 'sa_create_tenant', 'Tenant Onboarding Guide', 'Provision a new business organization with a dedicated slug, subscription tier (Free, Starter, Pro, Enterprise), primary country, and base operating currency.', 'super_admin'),
('550dc232-c851-41ec-9024-a82e3e086ff1', 'sa_tenant_details', 'Tenant 360° Management', 'Full diagnostic view of an individual corporate tenant including localized currency, staffing count, administrative roles, and GST status.', 'super_admin'),
('440dc232-c851-41ec-9024-a82e3e086ff0', 'sa_all_users', 'Global User Management', 'Centralized directory of all user accounts across all client firms and unscoped platform administrators. Allows creating, filtering, and deactivating user profiles.', 'super_admin'),
('330dc232-c851-41ec-9024-a82e3e086eef', 'admin_dashboard_overview', 'Firm Workspace Dashboard', 'Key headcount metrics for your organization, tracking active managers, team members, and overall operational capacity within your firm workspace.', 'firm_admin'),
('220dc232-c851-41ec-9024-a82e3e086eee', 'admin_users_directory', 'Firm Staff Directory', 'Manage your firm\'\'s internal team members. Firm Admins can onboard new managers and team users, assign roles, and revoke account access safely.', 'firm_admin'),
('110dc232-c851-41ec-9024-a82e3e086eed', 'admin_settings_general', 'Firm Corporate Profile', 'Configure the registered business legal name and public workspace branding identity for your firm.', 'firm_admin'),
('000dc232-c851-41ec-9024-a82e3e086eec', 'admin_settings_localization', 'Multi-Country & Currency Localization', 'Set the primary operating jurisdiction, base transactional currency, local timezone (e.g. Asia/Kolkata), and standard date display format for all firm users.', 'firm_admin'),
('ff0dc232-c851-41ec-9024-a82e3e086eeb', 'admin_settings_tax', 'Statutory Tax & GST/VAT Compliance', 'Configure regional tax compliance. For Indian entities, enable GST and input the 15-character Goods and Services Tax Identification Number (GSTIN) for tax invoicing.', 'firm_admin'),
('ee0dc232-c851-41ec-9024-a82e3e086eea', 'manager_dashboard_overview', 'Manager Operations Center', 'Real-time monitoring of active direct reports, team attendance, availability, and SLA compliance within your department.', 'manager'),
('dd0dc232-c851-41ec-9024-a82e3e086ee9', 'manager_team_roster', 'My Team Members', 'Direct communication, contact details, and role statuses for all operational staff assigned to your supervisory team.', 'manager'),
('cc0dc232-c851-41ec-9024-a82e3e086ee8', 'user_dashboard_overview', 'Personal Workspace', 'Overview of your active organizational affiliation, assigned enterprise modules, and encrypted data isolation status.', 'team_user'),
('bb0dc232-c851-41ec-9024-a82e3e086ee7', 'profile_personal', 'Personal Account Profile', 'Update your personal display name, avatar, and view your assigned role and firm organization.', 'general'),
('aa0dc232-c851-41ec-9024-a82e3e086ee6', 'profile_password', 'Security & Password Management', 'Rotate your authentication credentials. Passwords must be at least 6 characters long and adhere to enterprise security policies.', 'general');
