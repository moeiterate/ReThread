# UX De-AI-ification

**When to Use:** After MVP is functional. Before considering the project "done".

**Context Needed:** Working application built with a component library (shadcn, Material UI, etc.).

---

## Prompt

```
Take the role of a principal-level UX designer. Review this application built with [COMPONENT LIBRARY NAME].

Your goal: Make the design system unrecognizable from standard [LIBRARY NAME] implementations.

Propose specific changes to:
1. Color palette (move away from defaults)
2. Typography (unique font pairings, hierarchy)
3. Spacing system (break conventional patterns where it helps)
4. Component styling (buttons, inputs, cards, navigation)
5. Micro-interactions (hover, focus, loading states)
6. Layout patterns (grids, spacing, asymmetry)

Maintain accessibility standards (WCAG 2.1 AA minimum) and usability principles. Focus on creating a distinct brand identity without sacrificing function.

Provide specific CSS/Tailwind changes with before/after examples.
```

---

## Usage Notes

- **Run AFTER MVP works** - Don't optimize aesthetics before functionality
- **Provide screenshots** - Share what it currently looks like (if using Claude/GPT-4 with vision)
- **Specify your component library** - shadcn, MUI, Chakra, etc.
- **Request specific changes** - CSS/Tailwind code you can copy-paste
- **Maintain accessibility** - Must stay WCAG 2.1 AA compliant
- **Test after changes** - Especially contrast ratios and keyboard navigation

---

## Problem: Generic AI Aesthetics

AI-generated designs tend to follow predictable patterns:

### ❌ Generic Patterns (Avoid These)
- Blue/purple gradients everywhere
- Perfect 8px spacing grid
- Border radius: 0.5rem on everything
- Drop shadows: `0 1px 3px rgba(0,0,0,0.1)`
- Inter/SF Pro font
- Gray 50/100/200 backgrounds
- Primary buttons: rounded, blue, white text

### ✅ What Makes Design Unique
- **Color:** Unexpected pairings, brand-specific hues
- **Typography:** Mixing serif + sans-serif, varied weights
- **Spacing:** Intentional asymmetry, breathing room
- **Shapes:** Varying border radius, unique button styles
- **Shadows:** Custom shadow systems, not default presets
- **Animation:** Purposeful micro-interactions

---

## What Good Output Looks Like

### Before (Generic)
```css
.button {
  background: #3b82f6; /* blue-500 */
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}
```

### After (Unique)
```css
.button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 2rem 0.5rem 2rem 0.5rem; /* Asymmetric */
  padding: 0.75rem 1.5rem;
  box-shadow: 0 4px 14px rgba(102, 126, 234, 0.4);
  transform: perspective(1000px) rotateX(2deg);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.button:hover {
  transform: perspective(1000px) rotateX(0deg) translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5);
}
```

---

## Areas to Customize

### 1. Color Palette
- **Default:** Blue (#3b82f6), Gray (#6b7280), White (#ffffff)
- **Custom:** Choose unexpected combinations
  - Example: Rust (#B7410E) + Sage (#8F9779) + Cream (#F5F5DC)

### 2. Typography
- **Default:** Inter everywhere, standard weights
- **Custom:** Mix fonts for hierarchy
  - Example: Playfair Display (headings) + IBM Plex Sans (body)

### 3. Component Shapes
- **Default:** Consistent 0.5rem border radius
- **Custom:** Vary by component purpose
  - Example: Buttons (2rem), Cards (1rem), Inputs (0.25rem)

### 4. Spacing
- **Default:** Strict 8px grid (0, 8, 16, 24, 32...)
- **Custom:** Break the grid intentionally
  - Example: Use 12px, 20px, 36px for visual interest

### 5. Shadows
- **Default:** `shadow-sm`, `shadow-md`, `shadow-lg`
- **Custom:** Branded shadow system
  - Example: Colored shadows matching brand

---

## Testing Checklist

After applying changes:
- [ ] Color contrast passes WCAG AA (4.5:1 for text, 3:1 for UI)
- [ ] Keyboard navigation still works
- [ ] Focus states are visible
- [ ] Hover states provide clear feedback
- [ ] Touch targets are 44x44px minimum (mobile)
- [ ] Design feels cohesive, not random
- [ ] Brand identity is recognizable

---

## Common Mistakes

❌ **Changing everything at once**
> Result: Chaotic, no cohesion

✅ **Change one system at a time**
> Color → Typography → Spacing → Components

❌ **Ignoring accessibility**  
> Result: Unusable for many users

✅ **Test with tools**
> Use contrast checkers, keyboard navigation

❌ **Being unique just to be unique**
> Result: Poor UX

✅ **Unique with purpose**
> Every change should serve the brand or improve UX

---

## Tools

- **Contrast Checker:** [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- **Color Palette:** [Coolors](https://coolors.co/)
- **Typography:** [Google Fonts](https://fonts.google.com/)
- **Accessibility Audit:** Browser DevTools Lighthouse

---

## Next Step

After design polish, move to: `../security/security-audit-phase0.md`
