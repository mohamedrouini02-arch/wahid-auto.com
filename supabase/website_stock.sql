-- Website stock: lets wahid-auto.com show cars that are in stock, live from the app.
-- Run once in Supabase → SQL Editor.
--
-- What it does:
--   1. Adds two switches to car_inventory: show_on_website (off by default) and show_price_on_website.
--   2. Creates a read-only view with ONLY the safe columns. VIN, buying price, notes and who added
--      the car are never exposed.
--   3. Lets anonymous visitors read that view, and nothing else in car_inventory.

alter table public.car_inventory
    add column if not exists show_on_website boolean not null default false,
    add column if not exists show_price_on_website boolean not null default true;

create or replace view public.website_stock as
select
    id,
    brand,
    model,
    year,
    mileage,
    color,
    case when show_price_on_website then selling_price end as price,
    case when show_price_on_website then currency end as currency,
    location,
    photos_urls,
    video_url,
    created_at
from public.car_inventory
where status = 'available'
  and show_on_website = true;

-- The view runs with its owner's rights, so the car_inventory RLS (staff only) stays untouched.
revoke all on public.website_stock from anon, authenticated;
grant select on public.website_stock to anon, authenticated;

-- To publish a car: update public.car_inventory set show_on_website = true where id = '<car id>';
-- (The dashboard makeover adds a "Show on website" switch for this.)
