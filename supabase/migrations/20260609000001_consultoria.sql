-- ─── Tabelas de Consultoria ÁTOM ────────────────────────────────────────────

create table if not exists consultoria_sessions (
  id          uuid primary key default gen_random_uuid(),
  client_id   uuid not null references auth.users(id) on delete cascade,
  path        text,           -- A|B|C|D detectado na conversa
  status      text not null default 'active' check (status in ('active','completed')),
  started_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table if not exists consultoria_messages (
  id          uuid primary key default gen_random_uuid(),
  session_id  uuid not null references consultoria_sessions(id) on delete cascade,
  role        text not null check (role in ('user','agent')),
  content     text not null,
  created_at  timestamptz not null default now()
);

create table if not exists consultoria_insights (
  id          uuid primary key default gen_random_uuid(),
  session_id  uuid not null references consultoria_sessions(id) on delete cascade,
  category    text not null check (category in ('brand','posicionamento','stack','logo','operacao','mercado','geral')),
  title       text not null,
  body        text not null,
  tags        text[] not null default '{}',
  slide_html  text,
  created_at  timestamptz not null default now()
);

create table if not exists consultoria_assets (
  id             uuid primary key default gen_random_uuid(),
  session_id     uuid not null references consultoria_sessions(id) on delete cascade,
  type           text not null check (type in ('logo_upload','generated')),
  storage_path   text not null,
  vision_score   int,
  vision_report  jsonb,
  created_at     timestamptz not null default now()
);

-- ─── Indexes ─────────────────────────────────────────────────────────────────

create index if not exists consultoria_sessions_client_id_idx   on consultoria_sessions(client_id);
create index if not exists consultoria_messages_session_id_idx  on consultoria_messages(session_id);
create index if not exists consultoria_insights_session_id_idx  on consultoria_insights(session_id);
create index if not exists consultoria_assets_session_id_idx    on consultoria_assets(session_id);

-- ─── RLS ─────────────────────────────────────────────────────────────────────

alter table consultoria_sessions enable row level security;
alter table consultoria_messages  enable row level security;
alter table consultoria_insights  enable row level security;
alter table consultoria_assets    enable row level security;

-- Sessions: client sees own rows
create policy "client_own_sessions" on consultoria_sessions
  for all using (auth.uid() = client_id);

-- Messages: client sees own session messages
create policy "client_own_messages" on consultoria_messages
  for all using (
    session_id in (
      select id from consultoria_sessions where client_id = auth.uid()
    )
  );

-- Insights: client sees own session insights
create policy "client_own_insights" on consultoria_insights
  for all using (
    session_id in (
      select id from consultoria_sessions where client_id = auth.uid()
    )
  );

-- Assets: client sees own session assets
create policy "client_own_assets" on consultoria_assets
  for all using (
    session_id in (
      select id from consultoria_sessions where client_id = auth.uid()
    )
  );

-- ─── Storage bucket ───────────────────────────────────────────────────────────

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'consultoria-assets',
  'consultoria-assets',
  false,
  10485760,  -- 10 MB
  array['image/png','image/jpeg','image/webp','image/svg+xml']
)
on conflict (id) do nothing;

-- Storage RLS: client can upload/read own files (path: {user_id}/*)
create policy "client_upload_assets" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'consultoria-assets'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "client_read_assets" on storage.objects
  for select to authenticated
  using (
    bucket_id = 'consultoria-assets'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
