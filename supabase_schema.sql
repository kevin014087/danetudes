-- Supabase / PostgreSQL schema for DANETUDES

-- Table: offres
CREATE TABLE IF NOT EXISTS offres (
  id TEXT PRIMARY KEY,
  titre TEXT NOT NULL,
  description TEXT NOT NULL,
  categorie TEXT NOT NULL DEFAULT 'Général',
  prix TEXT NOT NULL DEFAULT '',
  image_url TEXT NOT NULL DEFAULT '',
  statut TEXT NOT NULL DEFAULT 'publié',
  date_creation TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table: planning
CREATE TABLE IF NOT EXISTS planning (
  id TEXT PRIMARY KEY,
  titre TEXT NOT NULL,
  date TEXT NOT NULL,
  heure TEXT NOT NULL DEFAULT '',
  lieu TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  statut TEXT NOT NULL DEFAULT 'actif',
  date_creation TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table: testimonials
CREATE TABLE IF NOT EXISTS testimonials (
  id TEXT PRIMARY KEY,
  titre TEXT NOT NULL,
  auteur TEXT NOT NULL DEFAULT 'Anonyme',
  entreprise TEXT NOT NULL DEFAULT '',
  message TEXT NOT NULL,
  statut TEXT NOT NULL DEFAULT 'publié',
  date_creation TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table: contacts
CREATE TABLE IF NOT EXISTS contacts (
  id TEXT PRIMARY KEY,
  nom TEXT NOT NULL,
  email TEXT NOT NULL,
  sujet TEXT NOT NULL DEFAULT 'Sans sujet',
  message TEXT NOT NULL,
  statut TEXT NOT NULL DEFAULT 'non lu',
  date_creation TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Optional: allow anonymous access if you use the anon key directly from the server.
-- WARNING: These policies open the tables for public reads and writes.
-- Use them only if you cannot use a service_role key in the server.

-- ALTER TABLE offres ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Public read offres" ON offres FOR SELECT USING (true);
-- CREATE POLICY "Public write offres" ON offres FOR INSERT WITH CHECK (true);
-- CREATE POLICY "Public update offres" ON offres FOR UPDATE USING (true) WITH CHECK (true);
-- CREATE POLICY "Public delete offres" ON offres FOR DELETE USING (true);

-- ALTER TABLE planning ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Public read planning" ON planning FOR SELECT USING (true);
-- CREATE POLICY "Public write planning" ON planning FOR INSERT WITH CHECK (true);
-- CREATE POLICY "Public update planning" ON planning FOR UPDATE USING (true) WITH CHECK (true);
-- CREATE POLICY "Public delete planning" ON planning FOR DELETE USING (true);

-- ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Public read testimonials" ON testimonials FOR SELECT USING (true);
-- CREATE POLICY "Public write testimonials" ON testimonials FOR INSERT WITH CHECK (true);
-- CREATE POLICY "Public update testimonials" ON testimonials FOR UPDATE USING (true) WITH CHECK (true);
-- CREATE POLICY "Public delete testimonials" ON testimonials FOR DELETE USING (true);

-- ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Public read contacts" ON contacts FOR SELECT USING (true);
-- CREATE POLICY "Public write contacts" ON contacts FOR INSERT WITH CHECK (true);
-- CREATE POLICY "Public update contacts" ON contacts FOR UPDATE USING (true) WITH CHECK (true);
-- CREATE POLICY "Public delete contacts" ON contacts FOR DELETE USING (true);
