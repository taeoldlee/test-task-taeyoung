# Architectural Decisions Record (ADR)

This document captures the key architectural decisions made during the development of TRMNL4 Admin Panel.

## ADR-001: One-to-Many Program-Application Relationship

### Context
Applications need to be associated with specific accelerator programs. The task description showed separate `Program` and `Application` entities but didn't specify the relationship.

### Decision
Implemented a one-to-many relationship where each Application belongs to exactly one Program via a `programId` foreign key.

### Reasoning
- Each accelerator program has distinct criteria, partners, and cohort sizes
- Applications should be filterable by program
- The relationship enables program-specific analytics and cohort management
- Using a foreign key with `ON DELETE CASCADE` ensures data integrity

### Consequences
- Applications can be easily filtered and grouped by program
- Program deletion cascades to applications (intentional for cleanup)
- Applications cannot exist without a valid program

---

## ADR-002: Expanded Application Schema

### Context
The original task specification had minimal fields: `founderName`, `email`, `startupName`, `status`.

### Decision
Implemented a comprehensive schema with fields matching real-world accelerator application forms:
- Founder info: `firstName`, `lastName`, `email`, `jobRole`, `country`
- Company info: `startupName`, `websiteUrl`, `productDescription`, `industry`, `businessModel`, `stage`
- Admin fields: `status`, timestamps

### Reasoning
- Demonstrates understanding of real-world requirements
- Provides more realistic demo data and filtering options
- Shows ability to design for production use cases
- Industry, stage, and business model filters are common in accelerator tools

### Consequences
- More complex migrations and seed data
- Richer filtering and search capabilities
- Better demonstration of the application's capabilities

---

## ADR-003: Dual Status Change UX

### Context
Admins need to change application status. Two approaches were considered: inline-only or detail-page-only.

### Decision
Implemented both:
1. **Inline dropdown** on the applications list for quick triage
2. **Detail page form** for deliberate status changes with full context

### Reasoning
Real accelerator workflows involve:
- Rapid triage of obvious rejections (95%+ of applications)
- Careful review of promising candidates before final decisions
- Different friction levels are appropriate for different decisions

### Trade-offs
- Slightly more complex UI implementation
- Better matches actual admin workflows
- Inline changes provide immediate feedback without navigation

---

## ADR-004: Notes Without Authentication

### Context
The task explicitly specified "no authorization and users table" for simplification, but collaborative notes are valuable.

### Decision
Implemented a Notes feature with a simple `authorName` text field instead of a user foreign key.

### Reasoning
- Enables collaboration demo without authentication complexity
- Admin enters their name when adding a note
- Simple and functional for the MVP scope
- Easy to migrate to proper user references later

### Migration Path
In production:
```sql
-- Add user table
CREATE TABLE users (id INT PRIMARY KEY, name VARCHAR(255), email VARCHAR(255));

-- Migrate notes
ALTER TABLE notes ADD COLUMN userId INT;
UPDATE notes SET userId = (SELECT id FROM users WHERE name = notes.authorName);
ALTER TABLE notes DROP COLUMN authorName;
ALTER TABLE notes ADD FOREIGN KEY (userId) REFERENCES users(id);
```

---

## ADR-005: Shareable Application Links

### Context
Team members need to share specific applications for review discussions.

### Decision
Each application has a dedicated route (`/applications/[id]`) instead of using query parameters or modals.

### Reasoning
- Stable, bookmarkable URLs
- Works correctly with browser back/forward buttons
- Easy to share via Slack, email, etc.
- Standard RESTful routing pattern

### Implementation Details
- The `returnUrl` query parameter preserves filter state when navigating back
- Direct access to `/applications/[id]` works without any context

---

## ADR-006: MySQL ENUMs for Constrained Values

### Context
Multiple fields have fixed sets of valid values (status, industry, stage, etc.).

### Decision
Used MySQL ENUM types for all constrained values.

### Reasoning
- **Data integrity** - Database rejects invalid values
- **Documentation** - Schema is self-documenting
- **Performance** - ENUMs are stored efficiently
- **Type safety** - TypeScript types mirror database constraints

### Trade-offs
- Adding new enum values requires migration
- Some prefer varchar with application-level validation
- ENUMs are MySQL-specific (minor portability concern)

---

## ADR-007: Server-Side Rendering with Progressive Enhancement

### Context
SvelteKit supports both SSR and client-side rendering. Form handling can use JavaScript or native form submissions.

### Decision
- Server-side rendering for all pages
- `use:enhance` for form submissions (progressive enhancement)
- Server load functions for data fetching

### Reasoning
- Fast initial page loads
- Works without JavaScript (accessibility)
- Graceful degradation
- SEO-friendly (though less relevant for admin tools)

---

## ADR-007b: Svelte 5 Runes API

### Context
Svelte 5 introduces a new reactivity system with runes (`$state`, `$derived`, `$props`) replacing the implicit reactivity of Svelte 4.

### Decision
Used Svelte 5 runes throughout all components.

### Implementation Examples
```svelte
// Component props with $props()
let { applications, showProgram = false }: Props = $props();

// Derived state with $derived()
let allSelected = $derived(
  applications.every(app => selectedIds.includes(app.id))
);

// Reactive store subscriptions preserved via $app/stores
import { page } from '$app/stores';
```

### Reasoning
- Explicit reactivity is easier to understand and debug
- Better TypeScript integration
- Consistent with Svelte 5 best practices
- Clearer mental model for state management

---

## ADR-008: Column Sorting

### Context
Admins need to quickly find and prioritize applications when reviewing large lists.

### Decision
Implemented sortable columns on the applications table with visual indicators.

### Implementation
- Clickable column headers for: Startup, Founder, Industry, Stage, Program, Applied date, Status
- Toggle between ascending/descending on repeated clicks
- Arrow indicators (↑/↓) show current sort state
- Sort state persisted in URL query parameters (`sort` and `dir`)

### Reasoning
- URL-based state allows bookmarking specific views
- Visual indicators provide clear feedback
- Server-side sorting ensures consistency with pagination

---

## ADR-009: Bulk Selection and Actions

### Context
Rapid triage of applications requires ability to act on multiple items simultaneously.

### Decision
Implemented checkbox-based selection with bulk status updates.

### Implementation
- "Select all" checkbox in table header
- Individual row selection
- Selected rows highlighted with blue background
- Bulk status update action processes all selected IDs in single request

### Reasoning
- Accelerates common workflows (e.g., rejecting multiple obvious non-fits)
- Single database query for bulk updates improves performance
- Visual feedback confirms selection state

---

## ADR-010: Full-Text Search Including Notes

### Context
Admins need to find applications by various criteria, including internal notes added during review.

### Decision
Implemented a dedicated search page (`/search`) with cross-field search including notes content.

### Implementation
- Search across: startup name, founder name, email, industry, stage, product description, and note content
- LEFT JOIN with notes table to include note content in search
- DISTINCT grouping to prevent duplicate results from multiple matching notes
- Paginated results

### Reasoning
- Notes often contain key context ("founder has YC experience", "met at conference")
- Single search box simplifies UX vs. multiple field-specific filters
- Including notes enables finding applications by review context

---

## ADR-011: Configurable Pagination

### Context
Different admin workflows benefit from different page sizes - quick scanning vs. detailed review.

### Decision
Implemented pagination with selectable page size (20, 50, 100 items).

### Implementation
- Default: 20 items per page
- Page size selector in pagination controls
- Page resets to 1 when changing page size
- Count and range display ("Showing 1 to 20 of 150 applications")

### Reasoning
- 20 items balances loading speed with content density
- Larger options (50, 100) for power users doing bulk triage
- Server-side validation prevents invalid page sizes

---

## ADR-012: Toast Notification System

### Context
Users need feedback for async actions and quick operations that don't warrant full page feedback.

### Decision
Implemented a lightweight toast notification system using Svelte stores.

### Implementation
- Store-based toast management (`$lib/stores/toast.ts`)
- Auto-dismiss after timeout
- Success/error variants
- Used for: email copy confirmation, status update feedback

### Reasoning
- Non-blocking feedback keeps users in flow
- Store-based approach integrates naturally with Svelte
- Consistent UX pattern across the application

---

## ADR-013: Quick Email Copy

### Context
Admins frequently need to contact founders, often outside the admin panel (via email client, Slack, etc.).

### Decision
Added one-click email copy functionality in the applications table.

### Implementation
- Email displayed as clickable button with hover state
- Copy icon appears on hover
- Clipboard API for copy operation
- Toast confirmation on success

### Reasoning
- Reduces friction in outreach workflows
- Visual affordance (icon on hover) maintains clean default state
- Toast confirms action completed

---

## ADR-014: Note Deletion

### Context
Notes added during review may become outdated or contain errors that need to be removed.

### Decision
Implemented note deletion via form action on the application detail page.

### Implementation
- Delete button on each note
- Server-side `deleteNote` action
- Cascading delete handled by database foreign key constraint

### Reasoning
- Simple implementation with SvelteKit form actions
- No soft delete needed for MVP (notes are internal only)
- Immediate visual feedback via page reload

---

## Database Design Details

### Index Strategy

```sql
-- On applications table
CREATE INDEX idx_applications_programId ON applications(programId);
CREATE INDEX idx_applications_status ON applications(status);

-- On notes table
CREATE INDEX idx_notes_applicationId ON notes(applicationId);
```

**Reasoning:**
- `programId` - Frequent filter in list views
- `status` - Frequent filter in list views
- `applicationId` - Notes lookup by application

### Timestamp Handling

```sql
createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
```

**Reasoning:**
- Automatic timestamp management
- `updatedAt` auto-updates on any row change
- MySQL-native, no application code needed

---

## Security Considerations

### Current Implementation (MVP)

1. **No authentication** - As specified in requirements
2. **SQL injection protection** - Kysely uses parameterized queries
3. **XSS protection** - Svelte auto-escapes by default
4. **CSRF protection** - SvelteKit handles this for form actions

### Production Recommendations

1. **Add authentication** (OAuth with Google/GitHub)
2. **Implement RBAC** (admin, reviewer, viewer roles)
3. **Add rate limiting** on status updates
4. **Audit logging** for all status changes
5. **Input validation** - Add zod schemas for form validation

---

## What Would Change at Scale

### Database Layer

1. **Connection pooling** - Configure pool size based on traffic
2. **Read replicas** - Offload search queries to replicas
3. **Caching** - Redis for program list and frequently accessed data

### Application Layer

1. **Cursor-based pagination** - Better performance for large datasets
2. **Background jobs** - Email notifications, bulk operations
3. **Full-text search** - MySQL FULLTEXT or Elasticsearch

### Infrastructure

1. **Horizontal scaling** - Multiple SvelteKit instances behind load balancer
2. **CDN** - Static assets and edge caching
3. **Monitoring** - APM, error tracking, database metrics

---

## Technology Choices Summary

| Choice | Reasoning |
|--------|-----------|
| SvelteKit | Required by spec, excellent DX, SSR support |
| Svelte 5 | Required by spec, modern reactive syntax |
| Kysely | Required by spec, type-safe SQL, no codegen |
| MySQL 8.0 | Preferred in spec, production-ready, ENUM support |
| Tailwind CSS v4 | Preferred in spec, rapid UI development, CSS-first config |
| bits-ui | Headless UI components for Svelte, accessible primitives |
| tailwind-variants | Variant-based styling for consistent component APIs |
| Docker | Easy local MySQL setup, reproducible environment |
| TypeScript | Required by spec, end-to-end type safety |
