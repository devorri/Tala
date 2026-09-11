-- Persist farm planning data shown in the TALA calendar.
CREATE TABLE public.calendar_events (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  event_date date NOT NULL,
  title text NOT NULL CHECK (char_length(title) > 0),
  event_type text NOT NULL CHECK (event_type IN ('planting', 'irrigation', 'fertilizer', 'harvest', 'traditional_lunar')),
  description text NOT NULL DEFAULT '',
  event_time text,
  stage text,
  synced_with_google boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX calendar_events_event_date_idx ON public.calendar_events (event_date, event_time);

ALTER TABLE public.calendar_events ENABLE ROW LEVEL SECURITY;

-- The app currently uses the anonymous Supabase client and has no Supabase Auth session.
CREATE POLICY "calendar_events_anon_access"
  ON public.calendar_events
  FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);
