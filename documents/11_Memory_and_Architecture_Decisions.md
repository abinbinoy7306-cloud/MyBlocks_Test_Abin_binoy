# Project Memory & Architectural Decision Records (ADR)
**Document Version:** 1.0.0  
**Last Updated:** November 19, 2026, 20:32:02 IST (+05:30)  
**Project:** NCLC Platform (AI-Native Multi-Tenant Architecture)  
**Classification:** Engineering Memory / Architecture Decision Log  

---

## 1. Document Control & Metadata
- **Project Name:** NCLC Business Platform
- **Document Title:** Project Memory & Architecture Decision Records (ADR)
- **Author:** Principal Software Architect
- **Date & Time of Updation:** 2026-11-19 20:32:02 IST
- **Target Audience:** Engineering Leads, Future Maintainers, Technical Stakeholders

---

## 2. Key Architecture Decision Records (ADR)

### ADR-01: Multi-Tenancy Strategy — Discriminator Column (Shared DB, Shared Schema)
- **Context:** The application must support multiple corporate firms simultaneously with dynamic provisioning.
- **Alternatives Considered:**
  1. *Database-per-tenant:* High operational overhead, connection pooling issues with hundreds of small tenants.
  2. *Schema-per-tenant (PostgreSQL schemas):* Not natively ergonomic in MySQL without multi-database switching.
  3. *Discriminator Column (`tenant_id` on all rows):* Highly scalable, cost-efficient, native to Sequelize ORM.
- **Decision:** Selected Discriminator Column.
- **Consequences:** All backend queries must strictly enforce tenant scoping via middleware (`req.tenantId`). Super Admin can query cross-tenant by passing `tenant_id = NULL`.

---

### ADR-02: Authentication Architecture — Dual Token JWT
- **Context:** The app requires stateless authentication with immediate revokability for deactivations.
- **Decision:**
  - Access Token: 15-minute expiration, containing `{ id, email, role, tenant_id }`.
  - Refresh Token: 7-day expiration, stored in `users.refresh_token` column.
- **Consequences:** Access tokens remain fast and stateless. Refresh tokens allow instant session invalidation when an admin deactivates an employee or firm.

---

### ADR-03: Localization & Tax Compliance Engine
- **Context:** Businesses operate across diverse geographic jurisdictions requiring specific currencies and tax rules.
- **Decision:**
  - Decoupled `countries` and `currencies` into distinct normalization lookup tables.
  - Provided a dedicated `tenant_settings` table carrying localized timezone strings, date formats, and statutory GST / GSTIN records.
- **Consequences:** Seamlessly supports multinational organizations with subsidiaries operating under different currency and tax regimes.

---

### ADR-04: Frontend State & Component Strategy
- **Context:** Role switching and user experience require instant rendering without redundant network roundtrips.
- **Decision:**
  - Zustand with `persist` middleware for token and profile storage.
  - Role-gated route boundaries (`ProtectedRoute`, `RoleGate`) preventing unauthorized client renders.
  - One-click demo credential switcher on the login interface to streamline multi-persona evaluation.

---

## 3. Tech Debt & Optimization Roadmap
1. **API Rate Limiting:** Implement `express-rate-limit` with Redis backing for distributed deployments.
2. **Audit Logging Table:** Add a dedicated `audit_logs` table tracking every admin action (who, what, when, IP).
3. **Database Migrations:** Transition Sequelize `sync({ alter: true })` to strict Sequelize CLI migration files for zero-downtime production schema changes.
