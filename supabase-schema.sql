-- Ejecutar en: Supabase Dashboard > SQL Editor

-- Tabla principal de leads
CREATE TABLE IF NOT EXISTS leads (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at    TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  nombre        TEXT NOT NULL,
  email         TEXT NOT NULL,
  telefono      TEXT,
  mensaje       TEXT,
  piso_slug     TEXT NOT NULL,
  chat_historial TEXT,
  staging_elegido TEXT,
  rgpd_aceptado BOOLEAN NOT NULL DEFAULT FALSE
);

-- Índices para consultas frecuentes
CREATE INDEX IF NOT EXISTS leads_piso_slug_idx ON leads(piso_slug);
CREATE INDEX IF NOT EXISTS leads_created_at_idx ON leads(created_at DESC);

-- Row Level Security: solo el service role puede leer/escribir
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Política: solo el backend (service_role) accede a los leads
CREATE POLICY "Solo service role" ON leads
  USING (auth.role() = 'service_role');

-- Borrado automático de leads tras 12 meses (RGPD)
-- Requiere pg_cron habilitado en Supabase (Settings > Extensions)
-- SELECT cron.schedule(
--   'borrar-leads-antiguos',
--   '0 3 * * *',
--   $$DELETE FROM leads WHERE created_at < NOW() - INTERVAL '12 months'$$
-- );
