# errePlate – Weekly Menu System (v1 Locked Spec)

## Purpose
Define the exact structure and constraints for the Chef Weekly Menu creation flow. This document is the source of truth for database migrations, backend validation, and state machine updates.

---

# 1. Core Concept Separation

The system separates:

1. Dish (reusable recipe unit)
2. Weekly Menu (chef-curated bundle for 5 or 7 days)
3. Order (customer purchase of a weekly menu bundle)

Customers purchase a Weekly Menu bundle — not individual dishes.

---

# 2. Weekly Menu Creation Flow

## Step 1: Create Weekly Menu

Chef selects:

- Duration:
  - 5 days
  - 7 days

- Menu Type:
  - Full Week (Breakfast + Lunch + Dinner)
  - Breakfast Only
  - Lunch Only
  - Dinner Only

System auto-calculates required meal count:

- 7-day full week → 21 meals
- 5-day full week → 15 meals
- 7-day single meal type → 7 meals
- 5-day single meal type → 5 meals

UI Requirement:

Display live requirement message:

"You must assign X total meals to publish this menu."

Menu cannot be published unless exact requirement is met.

---

## Step 2: Dish Builder (Reusable)

Chef may:

- Select an existing Dish
- Create a new Dish

### Dish Fields

- title
- description
- meal_type (breakfast | lunch | dinner)
- servings_per_batch
- allow_protein_substitution (boolean)
- active (boolean)

### Ingredients (Dynamic Array)

Each ingredient contains:

- name
- quantity
- unit
- is_protein (boolean)
- substitution_group_id (nullable)

Protein substitution rules:

- Substitutions must be selected from predefined system options.
- No free-text substitutions allowed.

---

## Step 3: Assign Dish to Weekly Menu

When attaching a Dish to a Weekly Menu, Chef selects:

- meals_covered (integer)

Constraints:

- meals_covered minimum: 1
- meals_covered maximum: 3

System tracks live tally:

Breakfast: X / required
Lunch: X / required
Dinner: X / required
Total: X / required

---

# 3. System Constraints (Locked)

1. Full-week menus must include at least 1 dish per meal type.
2. Maximum meals_covered per dish = 3.
3. Menu must exactly equal required meal total before publishing.
4. Once a Weekly Menu receives its first Order:
   - It becomes immutable.
   - Editing requires cloning into a new Weekly Menu record.

---

# 4. Pricing Model (v1)

Pricing is per Weekly Menu bundle only.

No per-meal pricing.
No dynamic ingredient pricing.

Weekly Menu includes:

- base_price (decimal)

Customer purchases entire bundle.

Order stores:

- weekly_menu_id
- bundle_price
- credit_used
- cash_paid

---

# 5. Order Integration Changes

Customer Order Flow:

1. Select Chef
2. Select Published Weekly Menu
3. Select delivery date
4. Apply credits (optional)
5. Confirm purchase

Order automatically snapshots:

- Menu metadata
- Dish list
- meals_covered per dish

Order does NOT depend on future edits to Weekly Menu.

---

# 6. Future Enhancements (Not v1)

- Grocery store API integration
- Ingredient-level cost estimation
- AI-assisted menu optimization
- Per-meal customization
- Dynamic protein upcharge pricing

These are explicitly out of scope for v1.

---

Status: LOCKED FOR IMPLEMENTATION (v1)

