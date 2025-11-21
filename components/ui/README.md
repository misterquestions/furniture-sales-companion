# UI foundation

This folder groups the primitive components that the rest of the app will reuse.  They intentionally focus on predictable props and lightweight styling so feature teams can ship faster without re‑implementing visual details.

Current primitives:

- `Card` – lightweight wrapper that handles rounded corners, borders, and padding.  Accepts `variant` ("solid" | "surface") and forwards props to a `div`.
- `InputField` – text input with label / helper text slots.
- `TextareaField` – multiline version of `InputField` for notes or descriptions.
- `SelectField` – Headless UI listbox that mimics a select but lets us brand it consistently.
- `ToggleField` – labeled boolean switch with helper text, wraps Headless UI `Switch`.
- `Chip` – pill/badge helper for statuses (solid, subtle, and outline variants across tones).
- `Accordion` – composable Disclosure-based surface for collapsible panels.
- `Button` – shared CTA with `variant` (primary, secondary, ghost) and full width option.

Whenever we need a new surface (dialogs, tabs, pills, etc.) we should extend this directory and export it through `components/ui/index.ts` so every page pulls from the same palette.
