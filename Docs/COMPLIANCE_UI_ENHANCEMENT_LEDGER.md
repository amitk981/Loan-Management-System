# Compliance UI Enhancement Ledger

Goal: Make each Compliance-role screen more intuitive, functionally richer and
visually nicer. Constraint: **no left-accent / left-shadow cards anywhere**.
Hold the design system (theme.css tokens, one accent `#1E88E5`, 3 weights).

| # | Screen / File | Enhancement | Status |
|---|---------------|-------------|--------|
| 1 | CS Dashboard (`ComplianceDashboard.tsx`) | Panel headers get icon + count chip + "view all"; richer deadline rows with day-count pills & severity icons; KYC renewal mini-progress | ✅ Done |
| 2 | KYC Renewal Tracker (`KYCManagement.tsx`) | Stat cards get icons + share bars; coverage progress strip; days-left mini-bar in rows | ✅ Done |
| 3 | Registers & Ops (`ComplianceOperations.tsx`) | Register hub cards get colored icon tiles + arrow affordance; NOC + calendar polish | ✅ Done |
| 4 | Document Workspace (`DocumentWorkspace.tsx`) | Numbered stepper with connectors, completion bar & check-circles (replaced flat pill row) | ✅ Done |
| 5 | Build green (`vite build`) + preview verify | All 4 screens verified in preview, no console errors | ✅ Done |
| 6 | Fix: hooks-in-conditional crash (`DocumentWorkspace.tsx`) | Hoisted `useState`/`useEffect` for hold-to-submit from IIFE inside checklist tab to component top level — was crashing on any tab switch | ✅ Done |

## Notes
- Tokens only, no inline raw hex. Keep `clickable-card` / `clickable-row` classes.
- "Left-shadow card" interpreted as colored left-border accent strips — avoided.
