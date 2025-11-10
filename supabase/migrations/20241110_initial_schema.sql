create table if not exists public.contact_leads (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  email text not null,
  contact text,
  subject text,
  message text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

create index if not exists contact_leads_created_at_idx
  on public.contact_leads (created_at desc);

create table if not exists public.buyers_data (
  id uuid primary key default uuid_generate_v4(),
  category text not null,
  title text not null,
  description text,
  buyer_from text,
  quantity text,
  destination text,
  payment_terms text,
  looking_suppliers_from text,
  status text default 'Active',
  created_at timestamp with time zone default timezone('utc'::text, now())
);

create index if not exists buyers_data_category_idx
  on public.buyers_data (category);

create index if not exists buyers_data_created_at_idx
  on public.buyers_data (created_at desc);


