# Design System

See [PRODUCT.md](./PRODUCT.md) for what this is, [ARCHITECTURE.md](./ARCHITECTURE.md) for how it's built.

## Tokens

OKLCH custom properties in `src/index.css` (`:root` light, `.dark` dark), mapped to Tailwind utilities via `@theme inline`. Add a token in both places + the theme block, or Tailwind won't generate a class for it.

| Token                                                | Tailwind class                                       |
| ---------------------------------------------------- | ---------------------------------------------------- |
| `--background` / `--foreground`                      | `bg-background` / `text-foreground`                  |
| `--primary` / `--secondary` / `--muted` / `--accent` | `bg-*`                                               |
| `--destructive`                                      | `bg-destructive`                                     |
| `--border` / `--input` / `--ring`                    | `border-border` / `border-input` / `outline-ring/50` |
| `--radius` (+ `sm`/`md`/`lg`/`xl`)                   | `rounded-*`                                          |

Known bug: light-mode `--destructive-foreground` duplicates `--destructive` (text would be invisible). Dark mode has it right.

## Theming

Dark-mode tokens exist but no toggle is wired up — nothing sets `.dark` on `<html>` yet.

## Components

Pattern (see `src/components/ui/button.tsx` + `button-variants.ts`):

- Variants via `class-variance-authority`
- Class merging via `cn()` (`clsx` + `tailwind-merge`) — always last, so callers can override
- Polymorphism via Radix `Slot` (`asChild` prop)
- Variants exported from a separate `*-variants.ts` file, not the component file (avoids an `eslint-plugin-react-refresh` warning)

New shared components go in `src/components/ui/`, follow this pattern, get a `*.test.tsx`.

## Icons

`lucide-react` for general use, `@heroicons/react` for `@headlessui/react` overlays (nav dialog).

## Animation

`tw-animate-css` — Tailwind v4-compatible successor to `tailwindcss-animate`.
