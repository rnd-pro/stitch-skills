---
page: activity
route: /activity
---
A developer activity timeline page showing recent commits, code reviews, and project events in a vertical feed.

**DESIGN SYSTEM (REQUIRED):**
- Platform: Web, Desktop-first
- Theme: Light, clean and spacious with subtle depth
- Background: Soft Cloud (#f7f8fa) for page, Clean White (#ffffff) for cards
- Primary: Deep Ocean Blue (#1a365d) for navigation and primary actions
- Accent: Bright Blue (#3b82f6) for links, active states, focus rings
- Text: Near-Black (#1a1a2e) for headings, Soft Gray (#6b7280) for secondary
- Borders: Faint Gray (#e5e7eb), 1px solid
- Radius: 4px for inputs, 8px for cards, pill-shaped for badges
- Shadows: Gentle multi-layer shadows for cards, pronounced for modals
- Typography: Inter font family, 14-16px base, semibold for headings

**Page Structure:**
1. **Header:** Navigation bar with active "Activity" tab highlighted
2. **Filter Bar:** Date range selector, event type filter (commits, reviews, deploys)
3. **Timeline Feed:** Vertical list of activity cards with:
   - User avatar and name
   - Event type icon and label
   - Relative timestamp ("2 hours ago")
   - Event description with project link
4. **Footer:** Pagination or infinite scroll trigger
