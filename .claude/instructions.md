# Project Guidelines

## Code Style
- Use inline JSX styles exclusively for all components (no external CSS files)
- Follow React hooks patterns with `useState` for state management
- Use `array.map()` for immutable state updates, never mutate arrays directly
- Color system: Red `#E24B4A` for high risk, Orange `#EF9F27` for medium, Green `#1D9E75` for good, Brand orange `#F4600C` for actions

## Architecture
- Single monolithic component structure with tab-based navigation (dashboard, cards, milestones)
- State includes: cards array, current score, milestones array, editing mode, active tab
- Utility functions: `getUtilColor()` and `getScoreColor()` for threshold-based styling

## Build and Test
- No build system configured; this is a raw JSX component
- Import into any React 18+ project with a bundler (Vite, Create React App, etc.)
- No tests present; add unit tests for utility functions and state logic if expanding

## Conventions
- Hard-coded initial data (`INITIAL_CARDS`, `MILESTONES`) at module level
- Utilization calculation: `(balance / limit) * 100`, rounded to nearest percent
- Edit mode: Inline editing with Save/Cancel buttons, clamps values with `Math.max()`
- Tab switching via state variable, conditional rendering for each tab