ALTER TABLE public.calendar_events
  ADD COLUMN IF NOT EXISTS completed boolean NOT NULL DEFAULT false;
