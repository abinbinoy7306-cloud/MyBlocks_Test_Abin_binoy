require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const bcrypt = require('bcryptjs');
const { sequelize, Country, Currency, Tenant, User, TenantSettings, HelpText } = require('../models');

const countries = [
  { name: 'India', iso2: 'IN', iso3: 'IND', phone_code: '+91', flag_emoji: '🇮🇳', region: 'Asia' },
  { name: 'United States', iso2: 'US', iso3: 'USA', phone_code: '+1', flag_emoji: '🇺🇸', region: 'Americas' },
  { name: 'United Kingdom', iso2: 'GB', iso3: 'GBR', phone_code: '+44', flag_emoji: '🇬🇧', region: 'Europe' },
  { name: 'United Arab Emirates', iso2: 'AE', iso3: 'ARE', phone_code: '+971', flag_emoji: '🇦🇪', region: 'Asia' },
  { name: 'Singapore', iso2: 'SG', iso3: 'SGP', phone_code: '+65', flag_emoji: '🇸🇬', region: 'Asia' },
  { name: 'Australia', iso2: 'AU', iso3: 'AUS', phone_code: '+61', flag_emoji: '🇦🇺', region: 'Oceania' },
  { name: 'Canada', iso2: 'CA', iso3: 'CAN', phone_code: '+1', flag_emoji: '🇨🇦', region: 'Americas' },
  { name: 'Germany', iso2: 'DE', iso3: 'DEU', phone_code: '+49', flag_emoji: '🇩🇪', region: 'Europe' },
  { name: 'France', iso2: 'FR', iso3: 'FRA', phone_code: '+33', flag_emoji: '🇫🇷', region: 'Europe' },
  { name: 'Japan', iso2: 'JP', iso3: 'JPN', phone_code: '+81', flag_emoji: '🇯🇵', region: 'Asia' },
  { name: 'China', iso2: 'CN', iso3: 'CHN', phone_code: '+86', flag_emoji: '🇨🇳', region: 'Asia' },
  { name: 'Brazil', iso2: 'BR', iso3: 'BRA', phone_code: '+55', flag_emoji: '🇧🇷', region: 'Americas' },
  { name: 'South Africa', iso2: 'ZA', iso3: 'ZAF', phone_code: '+27', flag_emoji: '🇿🇦', region: 'Africa' },
  { name: 'Kenya', iso2: 'KE', iso3: 'KEN', phone_code: '+254', flag_emoji: '🇰🇪', region: 'Africa' },
  { name: 'Nepal', iso2: 'NP', iso3: 'NPL', phone_code: '+977', flag_emoji: '🇳🇵', region: 'Asia' },
  { name: 'Sri Lanka', iso2: 'LK', iso3: 'LKA', phone_code: '+94', flag_emoji: '🇱🇰', region: 'Asia' },
  { name: 'Malaysia', iso2: 'MY', iso3: 'MYS', phone_code: '+60', flag_emoji: '🇲🇾', region: 'Asia' },
  { name: 'Indonesia', iso2: 'ID', iso3: 'IDN', phone_code: '+62', flag_emoji: '🇮🇩', region: 'Asia' },
  { name: 'Thailand', iso2: 'TH', iso3: 'THA', phone_code: '+66', flag_emoji: '🇹🇭', region: 'Asia' },
  { name: 'Mexico', iso2: 'MX', iso3: 'MEX', phone_code: '+52', flag_emoji: '🇲🇽', region: 'Americas' },
];

const currencies = [
  { name: 'Indian Rupee', code: 'INR', symbol: '₹', decimal_places: 2 },
  { name: 'US Dollar', code: 'USD', symbol: '$', decimal_places: 2 },
  { name: 'Euro', code: 'EUR', symbol: '€', decimal_places: 2 },
  { name: 'British Pound', code: 'GBP', symbol: '£', decimal_places: 2 },
  { name: 'UAE Dirham', code: 'AED', symbol: 'د.إ', decimal_places: 2 },
  { name: 'Singapore Dollar', code: 'SGD', symbol: 'S$', decimal_places: 2 },
  { name: 'Australian Dollar', code: 'AUD', symbol: 'A$', decimal_places: 2 },
  { name: 'Canadian Dollar', code: 'CAD', symbol: 'C$', decimal_places: 2 },
  { name: 'Japanese Yen', code: 'JPY', symbol: '¥', decimal_places: 0 },
  { name: 'Chinese Yuan', code: 'CNY', symbol: '¥', decimal_places: 2 },
  { name: 'Brazilian Real', code: 'BRL', symbol: 'R$', decimal_places: 2 },
  { name: 'South African Rand', code: 'ZAR', symbol: 'R', decimal_places: 2 },
  { name: 'Kenyan Shilling', code: 'KES', symbol: 'KSh', decimal_places: 2 },
  { name: 'Nepalese Rupee', code: 'NPR', symbol: '₨', decimal_places: 2 },
  { name: 'Sri Lankan Rupee', code: 'LKR', symbol: '₨', decimal_places: 2 },
  { name: 'Malaysian Ringgit', code: 'MYR', symbol: 'RM', decimal_places: 2 },
  { name: 'Indonesian Rupiah', code: 'IDR', symbol: 'Rp', decimal_places: 0 },
  { name: 'Thai Baht', code: 'THB', symbol: '฿', decimal_places: 2 },
  { name: 'Mexican Peso', code: 'MXN', symbol: '$', decimal_places: 2 },
];

async function seed() {
  try {
    await sequelize.authenticate();
    console.log('Connected to database.');

    await sequelize.sync({ alter: true });
    console.log('Schema synced.');

    // 1. Countries
    console.log('Seeding countries...');
    for (const c of countries) {
      await Country.findOrCreate({ where: { iso2: c.iso2 }, defaults: c });
    }
    console.log(`✓ ${countries.length} countries seeded`);

    // 2. Currencies
    console.log('Seeding currencies...');
    for (const c of currencies) {
      await Currency.findOrCreate({ where: { code: c.code }, defaults: c });
    }
    console.log(`✓ ${currencies.length} currencies seeded`);

    // 3. Super admin
    console.log('Seeding super admin...');
    const superPwd = await bcrypt.hash('Admin@123', 12);
    const [superAdmin] = await User.scope('withPassword').findOrCreate({
      where: { email: 'admin@nclc.com' },
      defaults: {
        first_name: 'Super',
        last_name: 'Admin',
        email: 'admin@nclc.com',
        password: superPwd,
        role: 'super_admin',
        tenant_id: null,
      },
    });
    console.log(`✓ Super admin: admin@nclc.com`);

    // 4. Demo tenant Acme Corp
    console.log('Seeding Acme Corp tenant...');
    const india = await Country.findOne({ where: { iso2: 'IN' } });
    const inr = await Currency.findOne({ where: { code: 'INR' } });

    const [acme] = await Tenant.findOrCreate({
      where: { slug: 'acme-corp' },
      defaults: {
        name: 'Acme Corp',
        slug: 'acme-corp',
        country_id: india.id,
        currency_id: inr.id,
        plan: 'pro',
        is_active: true,
      },
    });

    // Auto-create settings for Acme
    await TenantSettings.findOrCreate({
      where: { tenant_id: acme.id },
      defaults: { tenant_id: acme.id },
    });
    console.log(`✓ Tenant: Acme Corp (id: ${acme.id})`);

    // 5. firm_admin for Acme
    const firmPwd = await bcrypt.hash('Admin@123', 12);
    await User.scope('withPassword').findOrCreate({
      where: { email: 'admin@acme.com' },
      defaults: {
        first_name: 'Firm',
        last_name: 'Admin',
        email: 'admin@acme.com',
        password: firmPwd,
        role: 'firm_admin',
        tenant_id: acme.id,
      },
    });
    console.log(`✓ Firm admin: admin@acme.com`);

    // 6. Manager for Acme
    const mgrPwd = await bcrypt.hash('Manager@123', 12);
    await User.scope('withPassword').findOrCreate({
      where: { email: 'manager@acme.com' },
      defaults: {
        first_name: 'John',
        last_name: 'Manager',
        email: 'manager@acme.com',
        password: mgrPwd,
        role: 'manager',
        tenant_id: acme.id,
      },
    });
    console.log(`✓ Manager: manager@acme.com`);

    // 7. Team user for Acme
    const userPwd = await bcrypt.hash('User@1234', 12);
    await User.scope('withPassword').findOrCreate({
      where: { email: 'user@acme.com' },
      defaults: {
        first_name: 'Jane',
        last_name: 'User',
        email: 'user@acme.com',
        password: userPwd,
        role: 'team_user',
        tenant_id: acme.id,
      },
    });
    console.log(`✓ Team user: user@acme.com`);

    // 8. Help Texts for all sections
    console.log('Seeding Section Help Texts...');
    const helpTexts = [
      {
        section_key: 'sa_dashboard_overview',
        title: 'Super Admin KPI Overview',
        category: 'super_admin',
        content: 'High-level metrics tracking total global corporate firms, total user population, active tenant ratios, and geographical country coverage across all client organizations.',
      },
      {
        section_key: 'sa_recent_firms',
        title: 'Recent Firms Activity',
        category: 'super_admin',
        content: 'Displays recently provisioned corporate tenants, their subscription plans, real-time activation statuses, and creation dates. Click any row to view full firm diagnostics.',
      },
      {
        section_key: 'sa_tenants_directory',
        title: 'Corporate Firms Directory',
        category: 'super_admin',
        content: 'Searchable and paginated directory of all business tenants operating on the NCLC platform. Super Admins can inspect details, provision new firms, or soft-deactivate organizations.',
      },
      {
        section_key: 'sa_create_tenant',
        title: 'Tenant Onboarding Guide',
        category: 'super_admin',
        content: 'Provision a new business organization with a dedicated slug, subscription tier (Free, Starter, Pro, Enterprise), primary country, and base operating currency.',
      },
      {
        section_key: 'sa_tenant_details',
        title: 'Tenant 360° Management',
        category: 'super_admin',
        content: 'Full diagnostic view of an individual corporate tenant including localized currency, staffing count, administrative roles, and GST status.',
      },
      {
        section_key: 'sa_all_users',
        title: 'Global User Management',
        category: 'super_admin',
        content: 'Centralized directory of all user accounts across all client firms and unscoped platform administrators. Allows creating, filtering, and deactivating user profiles.',
      },
      {
        section_key: 'admin_dashboard_overview',
        title: 'Firm Workspace Dashboard',
        category: 'firm_admin',
        content: 'Key headcount metrics for your organization, tracking active managers, team members, and overall operational capacity within your firm workspace.',
      },
      {
        section_key: 'admin_users_directory',
        title: 'Firm Staff Directory',
        category: 'firm_admin',
        content: "Manage your firm's internal team members. Firm Admins can onboard new managers and team users, assign roles, and revoke account access safely.",
      },
      {
        section_key: 'admin_settings_general',
        title: 'Firm Corporate Profile',
        category: 'firm_admin',
        content: 'Configure the registered business legal name and public workspace branding identity for your firm.',
      },
      {
        section_key: 'admin_settings_localization',
        title: 'Multi-Country & Currency Localization',
        category: 'firm_admin',
        content: 'Set the primary operating jurisdiction, base transactional currency, local timezone (e.g. Asia/Kolkata), and standard date display format for all firm users.',
      },
      {
        section_key: 'admin_settings_tax',
        title: 'Statutory Tax & GST/VAT Compliance',
        category: 'firm_admin',
        content: 'Configure regional tax compliance. For Indian entities, enable GST and input the 15-character Goods and Services Tax Identification Number (GSTIN) for tax invoicing.',
      },
      {
        section_key: 'manager_dashboard_overview',
        title: 'Manager Operations Center',
        category: 'manager',
        content: 'Real-time monitoring of active direct reports, team attendance, availability, and SLA compliance within your department.',
      },
      {
        section_key: 'manager_team_roster',
        title: 'My Team Members',
        category: 'manager',
        content: 'Direct communication, contact details, and role statuses for all operational staff assigned to your supervisory team.',
      },
      {
        section_key: 'user_dashboard_overview',
        title: 'Personal Workspace',
        category: 'team_user',
        content: 'Overview of your active organizational affiliation, assigned enterprise modules, and encrypted data isolation status.',
      },
      {
        section_key: 'profile_personal',
        title: 'Personal Account Profile',
        category: 'general',
        content: 'Update your personal display name, avatar, and view your assigned role and firm organization.',
      },
      {
        section_key: 'profile_password',
        title: 'Security & Password Management',
        category: 'general',
        content: 'Rotate your authentication credentials. Passwords must be at least 6 characters long and adhere to enterprise security policies.',
      },
    ];

    for (const h of helpTexts) {
      await HelpText.findOrCreate({
        where: { section_key: h.section_key },
        defaults: h,
      });
    }
    console.log(`✓ ${helpTexts.length} Section Help Texts seeded`);

    console.log('\n✅ Seed complete!');
    process.exit(0);
  } catch (err) {
    console.error('Seed failed:', err);
    process.exit(1);
  }
}

seed();
