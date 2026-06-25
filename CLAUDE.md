# dhis2-dummy-data-generator

A DHIS2 web app for generating dummy/test data.

## Stack

- **Runtime**: `@dhis2/app-runtime` + `@dhis2/ui` (DHIS2 App Platform)
- **Data fetching**: TanStack Query v4 via `useApiDataQuery` (never use `useDataQuery` directly)
- **Routing**: React Router DOM with `createHashRouter` (hash routing required for DHIS2 shell iframe)
- **Tables**: TanStack Table
- **Build**: `@dhis2/cli-app-scripts` with Vite extension
- **TypeScript**, path alias `@/` → `src/`

## Key architecture decisions

- All routes are nested under `SyncUrlWithGlobalShell` (dispatches `popstate` on route change so the DHIS2 Global Shell stays in sync)
- Layout: `SyncUrlWithGlobalShell` → `Layout` (sidebar + main grid) → `PageWrapper` (max-width 1400px) → page routes
- `collapseSidebar: true` on a route handle hides the sidebar for that route
- `fullWidth: true` on a route handle removes the max-width constraint
- `eslint-import-resolver-typescript` is configured to fix false `import/named` errors from ESLint not following re-exports

## Project structure

```
src/
  App.tsx                        # Router + providers setup
  components/
    layout/
      Layout.tsx                 # Sidebar + main content grid
      Layout.module.css
      PageWrapper.tsx            # Max-width content wrapper
    sidebar/
      Sidebar.tsx                # Collapsible sidebar with nav links
      Sidebar.module.css
      sidenav/                   # Low-level sidenav primitives
  interfaces/
    apiQueryTypes.ts             # ResourceQuery and related types
  utils/
    SyncUrlWithGlobalShell.tsx   # Global Shell URL sync layout route
    useApiDataQuery.ts           # TanStack Query wrapper for DHIS2 data engine
```

## Running

```bash
pnpm start --proxy https://YOUR_DHIS2_INSTANCE_URL
```

## Checks

```bash
pnpm exec tsc --noEmit    # type-check
pnpm exec eslint src/     # lint
```
