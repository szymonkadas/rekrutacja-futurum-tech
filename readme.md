# Futurum Campaign Manager

A Vite + React + TypeScript application that implements the CRUD experience described in *zadanie techniczne.md*. The project follows an onion-inspired architecture with an in-memory data source so the UI, business rules, and persistence concerns stay isolated even during prototyping.

## Quick Start

1. **Install dependencies**
   ```bash
   pnpm install
   ```
2. **Run the dev server**
   ```bash
   pnpm dev
   ```
3. **Quality checks**
   ```bash
   pnpm lint      # ESLint + React rules
   pnpm check     # TypeScript noEmit
   pnpm formatcheck
   ```

## Tech Stack

- React 19 (hooks + function components)
- TypeScript 5.9 with strict configuration
- Vite 7 for bundling and HMR
- Zod for entity validation
- TanStack React Query 5 for caching, mutations, and background refresh
- ESLint + Prettier for consistent formatting

## Architecture & Folder Map

```
src/
├─ domain/          # Pure entities + business primitives
├─ application/     # Use cases, schemas, service contracts
├─ infrastructure/  # Mock DB (api client, data source, db functions)
├─ ui/              # View components & feature pages
├─ assets/          # Static assets (icons, images)
├─ App.tsx          # Root component / routing entry
└─ main.tsx         # ReactDOM bootstrap
```

### Layering Guidelines

1. **Domain**
   - Contains entities such as `Campaign` and domain constants like `MIN_BID_AMOUNT`.
   - No framework imports; plain TypeScript objects and types only. As it's not graded, it seems more than enough.

2. **Application**
   - Implements validation schemas, service contracts, and use cases (`campaignService`).
   - Houses TanStack React Query hooks (`application/hooks`) that wrap the services with cache keys, mutations, and invalidation rules.
   - Translates infrastructure errors into structured `ServiceResponse` objects (`success`, `data`, `errorMessage`, `statusCode`).
   - Never manipulates UI state directly; returns serializable data for the UI layer.

3. **Infrastructure**
   - Hosts adapters such as `db.ts` with in-memory persistence.
   - Responsible for I/O concerns, async delays, and simulating server behaviour.
   - Must not import from `ui`.

4. **UI**
   - React components, hooks for UI usage, and styles that render the application.
   - Consumes services only through the application layer; never talks to `db.ts` directly.

> You may see UI sometimes accessing types from domain -> it's because we're working PRACTICALLY on frontend all the time, it'd be boilerplate to have to move it to application like traditionally it would be done

## Naming Conventions

| Artifact                        | Convention / Example                                           |
|---------------------------------|----------------------------------------------------------------|
| Folders                         | kebab-case (`delete-campaign-modal`)                           |
| Feature related components      | kebab-case (`campaign-form.tsx`)                               |
| component direct parent folders | matching case e.g. (`StatusToggle`) - for easier visual search |
| React components & Contexts     | PascalCase (`Button.tsx`, `AuthProvider.tsx`)                  |
| Hooks                           | camelCase prefixed with `use` (`useCampaigns`)                 |
| Service                         | kebab-case (`campaign-service.ts`)                             |
| Infrastructure                  | snake_case (`database_system.ts`)                              |
| Types & interfaces              | PascalCase (`Campaign`, `ServiceResponse`)                     |
| Constants & enums               | SCREAMING_SNAKE_CASE (`MIN_BID_AMOUNT`)                        |
| Utility functions               | kebab-case (`format-currency.ts`)                              |
| CSS / SCSS modules              | kebab-case (`campaign-form.module.css`)                        |
| query/mutations/schema/page     | file.query/mutation.ts (`useDeleteCampaign.query.ts`)          |
| style                           | camelCase.module.css (`componentName.module.css`)              |

> kebab-case files will use camelCase for its variables/functions intended for export - js doesn't accept "-" for variable/function name usage

> styles should be next to related component in the same folder (not including global styles & utils) - for such - DIRECT parent folders should have matching case to the naming convention for the tsx files in it, it's so because it lowers the vertical height 2x. 

## Coding Standards

- **Type safety**: Avoid `any`. Leverage discriminated unions for service responses.
- **Validation**: Use Zod schemas (eg. `campaignSchema`) both on create and update flows to keep UI and data constraints aligned. (Note: only on "BE" side - we've got everything on client side, and hence time is precious that will suffice)
- **Error handling**: Map infrastructure errors to HTTP-like status codes via `StatusCode` enum; expose user-friendly `errorMessage` texts.
- **State management**: Start with local state + `react-query`-style patterns inside hooks; introduce external state only when multiple features share the same data.
- **Imports**: Use path aliases once configured; group imports: external → domain/application → infrastructure → local.
- **Testing (future)**: Add Vitest + React Testing Library once UI stabilizes; co-locate tests as `*.test.ts(x)`.

## UI & UX Principles

- Responsive breakpoints (mobile-first):
  - `xs: 23rem`, `sm: 31rem`, `md: 48rem`, `lg: 64rem`, `xl: 80rem`, `2xl: 96rem`.
- Forms reuse shared components so the Add/Edit screens stay consistent.
- `CampaignViewPageTemplate` renders shared page template (tabs, copy) for both create and edit flows while `CampaignForm` keeps field parity between modes.
- Campaign list supports delete confirmation modals triggered both from the list row and the edit view.
- Typeahead inputs for keywords/towns reuse one datasource to guarantee consistent options.
- CSS toolchain: vanilla CSS or preferred preprocessor (e.g., SCSS). Avoid Tailwind.

### Design System & CSS Variables

All styles use centralized CSS variables for consistency and maintainability. Variables are organized in `src/styles/variables/`:

**Colors** (`colors.css`)
- Primary/accent colors with gradients and variants
- Semantic text colors (default, muted, subtle, hint, ghost)
- Background colors for cards, panels, controls
- Border colors from subtle to hover states
- Status colors (success, error) with backgrounds
- Shadows (card, button)

**Typography** (`typography.css`)
- Font size scale from `--font-size-2xs` (0.75rem) to `--font-size-3xl` (2rem)
- Font weights: normal (400), medium (500), semibold (600)
- Letter spacing presets: tight, normal, wide

**Spacing** (`spacing.css`)
- Base scale from `--space-1` (0.25rem) to `--space-14` (3.5rem)
- Semantic spacing: inline, stack, section
- Gap presets for flex/grid layouts
- Padding presets for buttons, controls, cards, panels
- Border radius scale (`--radius-sm` to `--radius-full`)

**Breakpoints** (`breakpoints.css`)
- Documented breakpoint values: `--bp-xs` (23rem) through `--bp-2xl` (96rem)
- Reference patterns for media queries

All component modules import these variables via `src/styles/variables/index.css`, ensuring design token consistency across the application.

## Workflow Tips

1. **Add / Edit flows** share the same form component with props controlling the intent.
2. **React Query hooks** in `application/hooks` expose cache keys (`CAMPAIGNS_QUERY_KEY`), CRUD mutations, and helper errors so UI code stays declarative.
3. **Service layer** always returns `ServiceResponse`, so API consumers can rely on the `success` flag instead of try/catch.
4. **Hash Router** exposes both the combined workspace (`#/`) and standalone panes (`#/create`, `#/edit/:id`) without losing the shared layout components.
5. **DB mock** simulates latency via `setTimeout` to mimic real network calls; keep timeouts short (<400 ms) to maintain snappy UX.
6. **Account balance** deductions happen inside `db.ts` to keep side effects centralized.

## Future Enhancements

- [ ] Layer optimistic updates and toast notifications on top of the existing React Query mutations.
- [ ] Testing.
- [ ] Introduce automated accessibility checks (e.g., `@axe-core/react`).
- [ ] Expand `StatusCode` to cover more nuanced failure cases (422, 409) if domain requires it.
- [ ] i18n support.

---