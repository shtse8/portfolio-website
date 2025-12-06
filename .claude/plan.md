# Portfolio Data Architecture Refactoring Plan

## Overview
Comprehensive refactoring of the portfolio data layer to create a more powerful, type-safe, and maintainable architecture with proper entity relationships.

---

## Phase 1: Unified Period Type (Low Risk)

### Goal
Replace string-based periods with structured `{start, end}` objects.

### Changes

#### 1.1 Update `types.ts`
```typescript
// Add new Period type
type Period = {
  start: string;  // ISO date "YYYY-MM-DD"
  end?: string;   // undefined = present
};

// Update Experience type
type Experience = {
  // ...existing fields
  period: Period;  // Changed from string
};
```

#### 1.2 Update `experiences.ts`
Convert all experience periods:
```typescript
// FROM:
period: '2025 - Present',

// TO:
period: { start: '2025-01-01' },
```

#### 1.3 Add helper function to `index.ts`
```typescript
export function formatPeriod(period: Period): string {
  const startYear = period.start.substring(0, 4);
  const endYear = period.end ? period.end.substring(0, 4) : 'Present';
  return startYear === endYear ? startYear : `${startYear} - ${endYear}`;
}
```

#### 1.4 Update components
- `ExperienceCard.tsx`: Use `formatPeriod(experience.period)`
- `ExperiencesTimeline.tsx`: Update period display

### Files Affected
- `src/data/types.ts`
- `src/data/experiences.ts`
- `src/data/index.ts`
- `src/components/experience/ExperienceCard.tsx`
- `src/components/experience/ExperiencesTimeline.tsx`

---

## Phase 2: Technology Hierarchy (Medium Risk)

### Goal
Add parent/child relationships to skills for experience inheritance.

### Changes

#### 2.1 Update TechSkill type
```typescript
type TechSkill = {
  id: string;
  name: string;
  description: string;
  category: string;

  // NEW: Hierarchy
  parentId?: string;        // e.g., TypeScript → JavaScript
  relatedIds?: string[];    // Similar purpose techs

  // Existing
  color: string;
  bgColor: string;
  keywords: string[];
  icon: string;

  // Computed (runtime)
  yearsOfExperience?: number;
};
```

#### 2.2 Add hierarchy data to skills
```typescript
{
  id: 'typescript',
  name: 'TypeScript',
  parentId: 'javascript',  // NEW
  relatedIds: ['dart', 'flow'],  // NEW
  // ...rest
},
{
  id: 'react',
  name: 'React',
  parentId: 'javascript',
  relatedIds: ['vuejs', 'svelte'],
  // ...rest
}
```

#### 2.3 Enhance experience calculation
```typescript
// In skillExperience.ts
export function calculateSkillExperience(skillId: string): number {
  let directExp = calculateDirectExperience(skillId);

  // Add inherited experience from child skills
  const childSkills = getChildSkills(skillId);
  for (const child of childSkills) {
    directExp += calculateDirectExperience(child.id) * 0.3; // 30% transfer up
  }

  return directExp;
}
```

### Files Affected
- `src/data/types.ts`
- `src/data/skills.ts`
- `src/utils/skillExperience.ts`
- `src/utils/skillHelpers.ts`

---

## Phase 3: Unified Organization Entity (Medium Risk)

### Goal
Merge Company + GitHub Org into single Organization entity.

### Changes

#### 3.1 Create new Organization type
```typescript
type Organization = {
  id: string;
  name: string;
  legalName?: string;      // "Sylphx Limited"
  tradingName?: string;    // "Sylphx"
  type: 'company' | 'github_org' | 'community';
  status: 'active' | 'acquired' | 'closed';

  description: string;
  logo: string;

  // Links
  website?: string;
  github?: string;         // GitHub org URL

  // Meta
  location?: string;
  industry?: string;
  size?: string;
  founded?: string;        // ISO date

  // Relationships
  parentId?: string;       // For subsidiaries
};
```

#### 3.2 Migrate companies.ts → organizations.ts
```typescript
export const ORGANIZATIONS: Record<string, Organization> = {
  sylphx: {
    id: 'sylphx',
    name: 'Sylphx',
    legalName: 'Sylphx Limited',
    type: 'company',
    status: 'active',
    github: 'SylphxAI',
    founded: '2025-01-01',
    location: 'United Kingdom',
    industry: 'AI & Open Source',
    // ...
  },
  // SylphxAI GitHub org is now unified with sylphx company
};
```

#### 3.3 Update Experience.company reference
Keep backward compatible by supporting both:
```typescript
type Experience = {
  organizationId: string;  // NEW: Primary reference
  company?: string;        // DEPRECATED: Keep for migration
};
```

#### 3.4 Create migration helpers
```typescript
// Backward compatible getters
export function getOrganization(id: string): Organization | undefined {
  return ORGANIZATIONS[id];
}

// Alias for old code
export const COMPANIES = ORGANIZATIONS;
```

### Files Affected
- `src/data/types.ts`
- `src/data/companies.ts` → `src/data/organizations.ts`
- `src/data/experiences.ts`
- `src/data/index.ts`
- `src/components/experience/*.tsx`
- `src/components/shared/CompanyModal.tsx`

---

## Phase 4: Metric Entity (Low Risk)

### Goal
Extract metrics into reusable entity for consistent display.

### Changes

#### 4.1 Add Metric type
```typescript
type Metric = {
  type: 'users' | 'downloads' | 'stars' | 'revenue' | 'engagement' | 'custom';
  value: number | string;
  unit?: string;
  context?: 'monthly' | 'total' | 'peak' | 'daily';
  verified?: boolean;
  source?: string;  // URL to source
};
```

#### 4.2 Update Experience.impactStatements
```typescript
type Experience = {
  // Replace
  // impactStatements?: Array<{ value: string; label: string }>;

  // With
  metrics: Metric[];
};
```

#### 4.3 Add helper functions
```typescript
export function formatMetric(metric: Metric): string {
  const value = typeof metric.value === 'number'
    ? metric.value.toLocaleString()
    : metric.value;
  return `${value}${metric.unit ? ` ${metric.unit}` : ''}`;
}

export function aggregateMetrics(metrics: Metric[], type: Metric['type']): number {
  return metrics
    .filter(m => m.type === type)
    .reduce((sum, m) => sum + (typeof m.value === 'number' ? m.value : 0), 0);
}
```

### Files Affected
- `src/data/types.ts`
- `src/data/experiences.ts`
- `src/data/projects.ts`
- `src/data/index.ts`
- `src/components/experience/*.tsx`

---

## Phase 5: Role Entity (High Risk - Major Refactor)

### Goal
Replace Experience with richer Role entity supporting multiple roles per organization.

### Changes

#### 5.1 Create Role type
```typescript
type Role = {
  id: string;
  organizationId: string;

  title: string;
  type: 'founder' | 'cofounder' | 'cto' | 'ceo' | 'employee' | 'contractor' | 'advisor';

  period: Period;
  location?: string;
  isRemote?: boolean;

  description: string;
  responsibilities: string[];
  keyAchievements?: string[];
  metrics: Metric[];

  // Auto-derived from projects
  technologies?: string[];
  projectIds?: string[];
};
```

#### 5.2 Migrate experiences → roles
```typescript
export const ROLES: Role[] = [
  {
    id: 'sylphx-founder',
    organizationId: 'sylphx',
    title: 'Founder',
    type: 'founder',
    period: { start: '2025-01-01' },
    location: 'United Kingdom',
    description: 'Founded Sylphx to democratize AI...',
    responsibilities: [
      'Technical architecture and development',
      'Open source project creation and maintenance',
      'Product strategy and roadmap'
    ],
    metrics: [
      { type: 'stars', value: 348, context: 'total' },
      { type: 'downloads', value: 8000, unit: 'NPM', context: 'total' }
    ]
  },
  // ...
];
```

#### 5.3 Update Project references
```typescript
type Project = {
  organizationId?: string;  // Which org owns this
  roleId?: string;          // Which role created this
  // ...rest
};
```

#### 5.4 Auto-derive role technologies
```typescript
export function getRoleTechnologies(roleId: string): string[] {
  const projects = PROJECTS.filter(p => p.roleId === roleId);
  return [...new Set(projects.flatMap(p => p.skills))];
}
```

#### 5.5 Keep backward compatibility
```typescript
// Alias for components still using EXPERIENCES
export const EXPERIENCES = ROLES.map(roleToExperience);

function roleToExperience(role: Role): Experience {
  return {
    id: role.id,
    title: role.title,
    company: role.organizationId,
    period: formatPeriod(role.period),
    // ...map other fields
  };
}
```

### Files Affected
- `src/data/types.ts`
- `src/data/experiences.ts` → `src/data/roles.ts`
- `src/data/projects.ts`
- `src/data/index.ts`
- All experience components

---

## Implementation Order

| Phase | Risk | Effort | Dependencies |
|-------|------|--------|--------------|
| 1. Period | Low | 2hrs | None |
| 2. Tech Hierarchy | Medium | 3hrs | None |
| 3. Organizations | Medium | 4hrs | None |
| 4. Metrics | Low | 2hrs | Phase 3 |
| 5. Roles | High | 6hrs | Phase 1, 3, 4 |

**Recommended approach**: Complete phases 1-4 in sequence, then tackle Phase 5 as a final consolidation.

---

## Backward Compatibility Strategy

1. **Keep aliases**: `COMPANIES = ORGANIZATIONS`, `EXPERIENCES = ROLES`
2. **Gradual migration**: Components can update one at a time
3. **Runtime derivation**: Don't break existing calculated values
4. **Type guards**: Create helpers for old → new type conversion

---

## Testing Strategy

1. **Visual regression**: Screenshot key pages before/after
2. **Type checking**: `npm run type-check` after each phase
3. **Build verification**: `npm run build` after each phase
4. **Browser testing**: Verify Experience, Skills sections render correctly

---

## Estimated Total Time

- Phase 1: 2 hours
- Phase 2: 3 hours
- Phase 3: 4 hours
- Phase 4: 2 hours
- Phase 5: 6 hours
- **Total: ~17 hours**

Ready to proceed with implementation.
