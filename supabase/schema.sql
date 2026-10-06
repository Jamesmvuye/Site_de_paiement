-- ==========================================================================
-- LEARN MORE DATA - Schéma Supabase
-- À coller en entier dans : Supabase > SQL Editor > New query > Run
-- Peut être relancé sans danger (idempotent).
-- ==========================================================================

-- --------------------------------------------------------------------------
-- 1. Administrateurs (les seuls à pouvoir voir et valider les paiements)
-- --------------------------------------------------------------------------
create table if not exists public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade
);
alter table public.admins enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
set search_path = ''
as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

-- Un admin peut seulement voir sa propre ligne (la vérification passe par is_admin()).
drop policy if exists "admins_select_self" on public.admins;
create policy "admins_select_self" on public.admins
  for select to authenticated
  using (user_id = auth.uid());

-- --------------------------------------------------------------------------
-- 2. Paiements
-- --------------------------------------------------------------------------
create table if not exists public.payments (
  id           uuid primary key default gen_random_uuid(),
  created_at   timestamptz not null default now(),
  full_name    text not null check (char_length(full_name) between 2 and 120),
  email        text not null check (char_length(email) between 5 and 254 and email like '%_@_%._%'),
  rail         text not null check (rail in ('RDC', 'GLOBAL')),
  operator     text check (operator in ('orangeMoney', 'airtelMoney', 'mPesa')),
  country_code text check (country_code ~ '^[A-Z]{2}$'),
  amount_usd   numeric(8, 2) not null check (amount_usd > 0),
  proof_path   text not null check (char_length(proof_path) between 5 and 300),
  status       text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  reviewed_at  timestamptz,
  reviewed_by  uuid references auth.users (id)
);
create index if not exists payments_status_created_idx on public.payments (status, created_at desc);

alter table public.payments enable row level security;

-- Le visiteur (anonyme) peut UNIQUEMENT créer une demande "pending". Il ne peut rien lire.
drop policy if exists "payments_insert_public" on public.payments;
create policy "payments_insert_public" on public.payments
  for insert to anon, authenticated
  with check (status = 'pending' and reviewed_at is null and reviewed_by is null);

drop policy if exists "payments_select_admin" on public.payments;
create policy "payments_select_admin" on public.payments
  for select to authenticated
  using (public.is_admin());

drop policy if exists "payments_update_admin" on public.payments;
create policy "payments_update_admin" on public.payments
  for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- --------------------------------------------------------------------------
-- 3. Stockage des preuves de paiement (bucket privé)
-- --------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'payment-proofs', 'payment-proofs', false, 10485760,
  array['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif']
)
on conflict (id) do update
  set public = false,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "proofs_insert_public" on storage.objects;
create policy "proofs_insert_public" on storage.objects
  for insert to anon, authenticated
  with check (bucket_id = 'payment-proofs');

drop policy if exists "proofs_select_admin" on storage.objects;
create policy "proofs_select_admin" on storage.objects
  for select to authenticated
  using (bucket_id = 'payment-proofs' and public.is_admin());

-- --------------------------------------------------------------------------
-- 4. Premier administrateur
-- Étape préalable : Supabase > Authentication > Users > Add user
--   (e-mail ci-dessous + mot de passe, cocher "Auto Confirm User").
-- Puis relancez cette requête : elle ne fait rien tant que l'utilisateur n'existe pas.
-- --------------------------------------------------------------------------
insert into public.admins (user_id)
select id from auth.users where email = 'teachingdep@gmail.com'
on conflict do nothing;
