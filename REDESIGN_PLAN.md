# Portfolio Website Redesign Plan
## Modern Minimal Style (Vercel/Linear Inspired)

---

## Executive Summary

Complete visual and structural redesign following Modern Minimal design principles. Focus on generous whitespace, purposeful animations, muted colors, and excellent dark mode.

---

## Current State Analysis

### Issues Identified

1. **Inconsistent Design Language**
   - Some sections minimal (Hero), others busy (Philosophy, Contact)
   - Animation density varies wildly between components

2. **Animation Overhead**
   - Blob animations on every section background
   - Excessive Framer Motion usage (every element animates)
   - Performance impact from constant re-renders

3. **Typography Inconsistency**
   - Font weights: extralight, light, normal, medium (too many)
   - Inconsistent heading sizes across sections

4. **Color Usage**
   - Blue accent used but inconsistently applied
   - Background gradients vary per section
   - Dark mode feels like inverted light, not designed

5. **Spacing Chaos**
   - Section padding: py-20, py-32, py-40 (no rhythm)
   - Container widths: max-w-4xl, max-w-5xl, max-w-6xl (inconsistent)

6. **Component Complexity**
   - Contact.tsx: 753 lines
   - Philosophy.tsx: 540 lines
   - Components do too much, hard to maintain

---

## Design System Overhaul

### Color Palette (Muted Neutrals + Accent)

```css
/* Light Mode */
--background: #FAFAFA          /* Warm white */
--surface: #FFFFFF             /* Pure white */
--surface-elevated: #FFFFFF    /* Cards, modals */
--border: #E5E5E5              /* Subtle borders */
--border-subtle: #F0F0F0       /* Very subtle */

--text-primary: #171717        /* Near black */
--text-secondary: #525252      /* Gray 600 */
--text-tertiary: #A3A3A3       /* Gray 400 */

--accent: #2563EB              /* Blue 600 */
--accent-hover: #1D4ED8        /* Blue 700 */
--accent-subtle: #EFF6FF       /* Blue 50 */

/* Dark Mode */
--background: #0A0A0A          /* True black */
--surface: #171717             /* Elevated surface */
--surface-elevated: #262626    /* Cards, modals */
--border: #262626              /* Subtle borders */
--border-subtle: #1C1C1C       /* Very subtle */

--text-primary: #FAFAFA        /* Near white */
--text-secondary: #A3A3A3      /* Gray 400 */
--text-tertiary: #525252       /* Gray 600 */

--accent: #3B82F6              /* Blue 500 */
--accent-hover: #60A5FA        /* Blue 400 */
--accent-subtle: #172554       /* Blue 950 */
```

### Typography Scale

```css
/* Font: Inter (already in use) */
--font-weight-normal: 400;
--font-weight-medium: 500;
/* Remove: extralight (200), light (300) */

/* Size Scale */
--text-xs: 0.75rem;    /* 12px - labels */
--text-sm: 0.875rem;   /* 14px - secondary */
--text-base: 1rem;     /* 16px - body */
--text-lg: 1.125rem;   /* 18px - lead */
--text-xl: 1.25rem;    /* 20px - h4 */
--text-2xl: 1.5rem;    /* 24px - h3 */
--text-3xl: 1.875rem;  /* 30px - h2 */
--text-4xl: 2.25rem;   /* 36px - h1 */
--text-5xl: 3rem;      /* 48px - hero */
```

### Spacing System

```css
/* Base unit: 4px (--space-1 = 4px) */
--space-0: 0;
--space-1: 0.25rem;    /* 4px */
--space-2: 0.5rem;     /* 8px */
--space-3: 0.75rem;    /* 12px */
--space-4: 1rem;       /* 16px */
--space-6: 1.5rem;     /* 24px */
--space-8: 2rem;       /* 32px */
--space-12: 3rem;      /* 48px */
--space-16: 4rem;      /* 64px */
--space-24: 6rem;      /* 96px */
--space-32: 8rem;      /* 128px */

/* Section padding: UNIFORM py-24 (96px) */
/* Container: UNIFORM max-w-5xl (1024px) */
```

### Animation Principles

```
1. REMOVE: Background blob animations
2. REMOVE: Stagger delays > 0.3s
3. KEEP: Hover states (subtle, 150-200ms)
4. KEEP: Page transitions (fade, 200ms)
5. REDUCE: whileInView to entry only, not continuous
6. ADD: Scroll-linked opacity for hero
```

---

## Section-by-Section Redesign

### 1. Header (Priority: High)

**Current Issues:**
- Complex background blur logic
- Too many animations on nav items

**New Design:**
```
┌─────────────────────────────────────────────────────────────┐
│ Logo                    [Nav Links]           [GitHub] [●]  │
└─────────────────────────────────────────────────────────────┘

- Fixed, transparent → solid on scroll (simple transition)
- Logo: Name only, no animation
- Nav: Text links, underline on hover (no background pill)
- Right: GitHub icon + theme toggle (no LinkedIn/SO)
- Remove: Floating nav bar (redundant)
- Mobile: Simple slide-in drawer
```

**Code Changes:**
- Simplify Header.tsx from 383 → ~150 lines
- Remove FloatingNavBar.tsx entirely

---

### 2. Hero (Priority: High)

**Current Issues:**
- CLI terminal effect is nice but complex
- Too many specialty tags
- Multiple blob animations in background

**New Design:**
```
                    ┌─────────────────────────┐
                    │                         │
                    │      Kyle Tse           │
                    │                         │
                    │    Full Stack Engineer  │
                    │   Building tools for    │
                    │   developers            │
                    │                         │
                    │      [GitHub]  [→]      │
                    │                         │
                    │          ↓              │
                    └─────────────────────────┘

- Clean centered text, no terminal effect
- Name: Large, single color (not split)
- Subtitle: Role + one-line description
- CTA: "View Projects" button + GitHub link
- Remove: Specialty tags, social icons row
- Background: Subtle gradient only (no blobs, no grid)
- Scroll indicator: Simple line + arrow
```

**Code Changes:**
- Simplify Hero.tsx from 376 → ~100 lines
- Remove CommandLineText component
- Remove HeroBackground blobs

---

### 3. Tech Stack (Priority: Medium)

**Current Issues:**
- SkillCloud is complex (693 lines)
- Statistics feel forced

**New Design:**
```
┌─────────────────────────────────────────────────────────────┐
│                      Technologies                           │
│                                                             │
│   ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐          │
│   │ TypeScript│ │ React  │ │ Node.js │ │ Next.js │          │
│   └─────────┘ └─────────┘ └─────────┘ └─────────┘          │
│   ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐          │
│   │  Python │ │ Docker │ │  AWS    │ │Postgres │          │
│   └─────────┘ └─────────┘ └─────────┘ └─────────┘          │
│                                                             │
│   "15+ years of experience across 50+ technologies"        │
└─────────────────────────────────────────────────────────────┘

- Simple grid of skill pills/chips
- Group by category (Frontend, Backend, DevOps)
- Click to expand category
- Remove: 3D cloud, rotating animations
- Remove: Statistics cards
- Add: Simple text summary line
```

**Code Changes:**
- Replace SkillCloud with simple SkillGrid component
- Remove SkillCloudView.tsx (535 lines)
- TechStack.tsx from 234 → ~150 lines

---

### 4. Open Source (Priority: Medium)

**Current Issues:**
- GitHub stats feel separate
- Repository cards are detailed

**New Design:**
```
┌─────────────────────────────────────────────────────────────┐
│                     Open Source                             │
│                                                             │
│   ┌───────────────────────────────────────────────────────┐ │
│   │  pdf-reader-mcp          ★ 348  TypeScript            │ │
│   │  Production-ready MCP server for PDF processing       │ │
│   └───────────────────────────────────────────────────────┘ │
│   ┌───────────────────────────────────────────────────────┐ │
│   │  coderag                 ★ 127  TypeScript            │ │
│   │  Lightning-fast semantic code search engine           │ │
│   └───────────────────────────────────────────────────────┘ │
│   ┌───────────────────────────────────────────────────────┐ │
│   │  rapid                   ★ 89   TypeScript            │ │
│   │  Hyper-optimized reactive state management            │ │
│   └───────────────────────────────────────────────────────┘ │
│                                                             │
│              [View all on GitHub →]                         │
└─────────────────────────────────────────────────────────────┘

- List view instead of cards
- Essential info only: name, stars, language, description
- Hover: subtle background highlight
- Remove: GitHub stats section (contributions, streak)
- Add: Simple "View all on GitHub" link
```

---

### 5. Philosophy (Priority: Low)

**Current Issues:**
- 540 lines, very complex
- Modal for each principle (unnecessary)

**New Design:**
```
┌─────────────────────────────────────────────────────────────┐
│                      Philosophy                             │
│                                                             │
│   Simplicity First                                          │
│   Less code, fewer dependencies, cleaner solutions.         │
│                                                             │
│   User-Focused                                              │
│   Every feature starts with understanding the user.         │
│                                                             │
│   Quality Over Speed                                        │
│   I'd rather ship less and ship it right.                   │
│                                                             │
└─────────────────────────────────────────────────────────────┘

- Simple text list, no cards
- No icons, no colors per principle
- No modals, everything visible
- 3-4 principles max
- Typography-focused presentation
```

**Code Changes:**
- Philosophy.tsx from 540 → ~80 lines
- Remove PhilosophyModal component

---

### 6. Projects/Work (Priority: High)

**Current Issues:**
- Category tabs + two different views
- Complex modals with navigation

**New Design:**
```
┌─────────────────────────────────────────────────────────────┐
│                        Work                                 │
│                                                             │
│   Featured Projects                                         │
│   ─────────────────────────────────────────────────────     │
│   ┌─────────────────────────────────────────────────────┐   │
│   │ [Image]                                             │   │
│   │ PDF Reader MCP                                      │   │
│   │ Production-ready server for PDF processing          │   │
│   │ TypeScript · Open Source                            │   │
│   └─────────────────────────────────────────────────────┘   │
│                                                             │
│   ┌───────────────────────┐ ┌───────────────────────────┐   │
│   │ CodeRAG               │ │ Rapid                     │   │
│   │ Semantic code search  │ │ State management          │   │
│   └───────────────────────┘ └───────────────────────────┘   │
│                                                             │
│   Professional Experience                                   │
│   ─────────────────────────────────────────────────────     │
│   2025 - Present  Sylphx Limited         Founder            │
│   2024 - Present  Epiow Limited          Founder            │
│   2018 - 2024     Minimax Games          CEO                │
│                                                             │
└─────────────────────────────────────────────────────────────┘

- Merge Projects + Experience into one "Work" section
- Featured project: Large card at top
- Other projects: Smaller grid
- Experience: Simple timeline list
- Remove: Category tabs
- Remove: Carousel/showcase mode
- Keep: Modal for details (simplified)
```

---

### 7. Contact (Priority: Medium)

**Current Issues:**
- 753 lines (largest component)
- Benefits section, background animations

**New Design:**
```
┌─────────────────────────────────────────────────────────────┐
│                      Get in Touch                           │
│                                                             │
│   Interested in working together?                           │
│   Send me an email and I'll get back to you soon.           │
│                                                             │
│   ┌─────────────────────────────────────────────────────┐   │
│   │ Name                                                │   │
│   │ ─────────────────────────────────────────────────── │   │
│   │ Email                                               │   │
│   │ ─────────────────────────────────────────────────── │   │
│   │ Message                                             │   │
│   │                                                     │   │
│   │                                                     │   │
│   │ ─────────────────────────────────────────────────── │   │
│   │                                    [Send Message]   │   │
│   └─────────────────────────────────────────────────────┘   │
│                                                             │
│   or reach me at hello@kyletse.com                          │
│                                                             │
└─────────────────────────────────────────────────────────────┘

- Simple form, minimal fields
- Remove: Subject dropdown
- Remove: Benefits section
- Remove: Background animations
- Add: Direct email link below form
```

**Code Changes:**
- Contact.tsx from 753 → ~200 lines
- Remove ContactBenefits, ContactBackground components

---

### 8. Footer (Priority: Low)

**Current Issues:**
- Complex grid layout
- Animated heart, social links with colors

**New Design:**
```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│   Kyle Tse                                                  │
│   Full Stack Engineer · Hong Kong                           │
│                                                             │
│   [GitHub]  [LinkedIn]  [Email]                             │
│                                                             │
│   ─────────────────────────────────────────────────────     │
│   © 2025 Kyle Tse                                           │
│                                                             │
└─────────────────────────────────────────────────────────────┘

- Minimal, centered layout
- Remove: Navigation links (already in header)
- Remove: Service tags
- Remove: "Built with ❤️" animation
- Keep: Social links (monochrome icons)
```

---

## Implementation Phases

### Phase 1: Design System Foundation (Day 1)
1. Update `tailwind.config.ts` with new color palette
2. Update `globals.css` with CSS variables
3. Create `design-tokens.ts` for consistent values
4. Remove unused animations from globals.css

### Phase 2: Core Components (Day 1-2)
1. Simplify Header.tsx
2. Remove FloatingNavBar.tsx
3. Redesign Hero.tsx
4. Create new Footer.tsx

### Phase 3: Content Sections (Day 2-3)
1. Replace SkillCloud with SkillGrid
2. Simplify OpenSource.tsx
3. Simplify Philosophy.tsx
4. Merge Projects + Experience into Work section

### Phase 4: Forms & Modals (Day 3)
1. Simplify Contact.tsx
2. Streamline modal components
3. Remove unnecessary modal transitions

### Phase 5: Polish & Performance (Day 4)
1. Remove remaining blob animations
2. Optimize bundle size (remove unused framer-motion)
3. Test responsive design
4. Verify dark mode
5. Performance audit (Lighthouse)

---

## Files to Delete

```
src/components/FloatingNavBar.tsx
src/components/contact/ContactBackground.tsx
src/components/contact/ContactBenefits.tsx
src/components/skills/cloud/SkillCloud.tsx
src/components/skills/cloud/SkillCloudView.tsx
src/components/ParallaxSection.tsx
src/components/ScrollStorySection.tsx
src/components/SectionIndicator.tsx
src/components/ProgressBar.tsx
```

---

## Expected Outcomes

### Code Reduction
- Total lines: ~10,600 → ~5,000 (52% reduction)
- Component count: 47 → ~30

### Performance
- Bundle size: -30% (fewer animations, simpler components)
- First Contentful Paint: Improved
- Cumulative Layout Shift: Near zero

### Maintainability
- Consistent design tokens
- Smaller, focused components
- Clear file organization

---

## Approval Checklist

- [ ] Color palette approved
- [ ] Typography scale approved
- [ ] Section redesigns approved
- [ ] File deletion list approved
- [ ] Implementation timeline acceptable
