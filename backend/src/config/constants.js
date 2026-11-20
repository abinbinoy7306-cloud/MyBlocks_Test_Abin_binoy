const ROLES = {
  SUPER_ADMIN: 'super_admin',
  FIRM_ADMIN: 'firm_admin',
  MANAGER: 'manager',
  TEAM_USER: 'team_user',
};

const PLANS = {
  FREE: 'free',
  STARTER: 'starter',
  PRO: 'pro',
  ENTERPRISE: 'enterprise',
};

const ROLE_HIERARCHY = {
  super_admin: 4,
  firm_admin: 3,
  manager: 2,
  team_user: 1,
};

module.exports = { ROLES, PLANS, ROLE_HIERARCHY };
