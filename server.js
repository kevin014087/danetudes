const express = require('express');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();
const { handleContactForm } = require('./contactHandler');

const app = express();
const publicDir = path.join(__dirname);

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Missing Supabase configuration. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY or SUPABASE_ANON_KEY.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { persistSession: false },
});

const isProduction = process.env.NODE_ENV === 'production';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(publicDir));

async function fetchRows(tableName) {
  const { data, error } = await supabase
    .from(tableName)
    .select('*')
    .order('date_creation', { ascending: false });

  if (error) throw error;
  return data || [];
}

async function fetchRow(tableName, id) {
  const { data, error } = await supabase
    .from(tableName)
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  return data;
}

async function insertRow(tableName, payload) {
  const { data, error } = await supabase.from(tableName).insert([payload]).maybeSingle();
  if (error) throw error;
  return data;
}

async function updateRow(tableName, id, changes) {
  const payload = Object.fromEntries(
    Object.entries(changes).filter(([, value]) => value !== undefined)
  );

  const { data, error } = await supabase
    .from(tableName)
    .update(payload)
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  return data;
}

async function deleteRow(tableName, id) {
  const { data, error } = await supabase
    .from(tableName)
    .delete()
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  return data;
}

// Note: login/logout/session endpoints removed. Manage data in Supabase.

app.get('/api/offres', async (req, res) => {
  try {
    const offres = await fetchRows('offres');
    res.json(offres);
  } catch (error) {
    console.error('Supabase /api/offres error:', error.message || error);
    res.status(500).json({ error: 'Impossible de charger les offres.' });
  }
});

app.post('/api/offres', async (req, res) => {
  const { titre, description, categorie, prix, image_url, statut } = req.body;
  if (!titre || !description) {
    return res.status(400).json({ error: 'Titre et description requis.' });
  }

  try {
    const nouvelleOffre = {
      id: Date.now().toString(),
      titre,
      description,
      categorie: categorie || 'Général',
      prix: prix || '',
      image_url: image_url || '',
      statut: statut || 'publié',
      date_creation: new Date().toISOString(),
    };

    const result = await insertRow('offres', nouvelleOffre);
    res.status(201).json(result);
  } catch (error) {
    console.error('Supabase POST /api/offres error:', error.message || error);
    res.status(500).json({ error: 'Impossible de créer l’offre.' });
  }
});

app.put('/api/offres/:id', async (req, res) => {
  const { id } = req.params;
  const { titre, description, categorie, prix, image_url, statut } = req.body;

  try {
    const updated = await updateRow('offres', id, {
      titre,
      description,
      categorie,
      prix,
      image_url,
      statut,
    });

    if (!updated) {
      return res.status(404).json({ error: 'Offre non trouvée.' });
    }

    res.json(updated);
  } catch (error) {
    console.error('Supabase PUT /api/offres/:id error:', error.message || error);
    res.status(500).json({ error: 'Impossible de mettre à jour l’offre.' });
  }
});

app.delete('/api/offres/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await deleteRow('offres', id);
    if (!deleted) {
      return res.status(404).json({ error: 'Offre non trouvée.' });
    }
    res.json({ success: true });
  } catch (error) {
    console.error('Supabase DELETE /api/offres/:id error:', error.message || error);
    res.status(500).json({ error: 'Impossible de supprimer l’offre.' });
  }
});

app.get('/api/planning', async (req, res) => {
  try {
    const planning = await fetchRows('planning');
    res.json(planning);
  } catch (error) {
    console.error('Supabase /api/planning error:', error.message || error);
    res.status(500).json({ error: 'Impossible de charger le planning.' });
  }
});

app.post('/api/planning', async (req, res) => {
  const { titre, date, heure, lieu, description, statut } = req.body;
  if (!titre || !date) {
    return res.status(400).json({ error: 'Titre et date requis.' });
  }

  try {
    const nouvelleEntree = {
      id: Date.now().toString(),
      titre,
      date,
      heure: heure || '',
      lieu: lieu || '',
      description: description || '',
      statut: statut || 'actif',
      date_creation: new Date().toISOString(),
    };

    const result = await insertRow('planning', nouvelleEntree);
    res.status(201).json(result);
  } catch (error) {
    console.error('Supabase POST /api/planning error:', error.message || error);
    res.status(500).json({ error: 'Impossible de créer l’événement.' });
  }
});

app.put('/api/planning/:id', async (req, res) => {
  const { id } = req.params;
  const { titre, date, heure, lieu, description, statut } = req.body;

  try {
    const updated = await updateRow('planning', id, {
      titre,
      date,
      heure,
      lieu,
      description,
      statut,
    });

    if (!updated) {
      return res.status(404).json({ error: 'Événement non trouvé.' });
    }

    res.json(updated);
  } catch (error) {
    console.error('Supabase PUT /api/planning/:id error:', error.message || error);
    res.status(500).json({ error: 'Impossible de mettre à jour l’événement.' });
  }
});

app.delete('/api/planning/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await deleteRow('planning', id);
    if (!deleted) {
      return res.status(404).json({ error: 'Événement non trouvé.' });
    }
    res.json({ success: true });
  } catch (error) {
    console.error('Supabase DELETE /api/planning/:id error:', error.message || error);
    res.status(500).json({ error: 'Impossible de supprimer l’événement.' });
  }
});

app.get('/api/testimonials', async (req, res) => {
  try {
    const testimonials = await fetchRows('testimonials');
    res.json(testimonials);
  } catch (error) {
    console.error('Supabase /api/testimonials error:', error.message || error);
    res.status(500).json({ error: 'Impossible de charger les témoignages.' });
  }
});

app.post('/api/testimonials', async (req, res) => {
  const { titre, auteur, entreprise, message, statut } = req.body;
  if (!titre || !message) {
    return res.status(400).json({ error: 'Titre et message requis.' });
  }

  try {
    const nouvelleTemoignage = {
      id: Date.now().toString(),
      titre,
      auteur: auteur || 'Anonyme',
      entreprise: entreprise || '',
      message,
      statut: statut || 'publié',
      date_creation: new Date().toISOString(),
    };

    const result = await insertRow('testimonials', nouvelleTemoignage);
    res.status(201).json(result);
  } catch (error) {
    console.error('Supabase POST /api/testimonials error:', error.message || error);
    res.status(500).json({ error: 'Impossible de créer le témoignage.' });
  }
});

app.put('/api/testimonials/:id', async (req, res) => {
  const { id } = req.params;
  const { titre, auteur, entreprise, message, statut } = req.body;

  try {
    const updated = await updateRow('testimonials', id, {
      titre,
      auteur,
      entreprise,
      message,
      statut,
    });

    if (!updated) {
      return res.status(404).json({ error: 'Témoignage non trouvé.' });
    }

    res.json(updated);
  } catch (error) {
    console.error('Supabase PUT /api/testimonials/:id error:', error.message || error);
    res.status(500).json({ error: 'Impossible de mettre à jour le témoignage.' });
  }
});

app.delete('/api/testimonials/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await deleteRow('testimonials', id);
    if (!deleted) {
      return res.status(404).json({ error: 'Témoignage non trouvé.' });
    }
    res.json({ success: true });
  } catch (error) {
    console.error('Supabase DELETE /api/testimonials/:id error:', error.message || error);
    res.status(500).json({ error: 'Impossible de supprimer le témoignage.' });
  }
});

app.get('/api/contacts', async (req, res) => {
  try {
    const contacts = await fetchRows('contacts');
    res.json(contacts);
  } catch (error) {
    console.error('Supabase /api/contacts error:', error.message || error);
    res.status(500).json({ error: 'Impossible de charger les contacts.' });
  }
});

app.post('/api/contacts', async (req, res) => {
  const { nom, email, sujet, message } = req.body;
  if (!nom || !email || !message) {
    return res.status(400).json({ error: 'Nom, email et message requis.' });
  }

  try {
    const nouvelleContact = {
      id: Date.now().toString(),
      nom,
      email,
      sujet: sujet || 'Sans sujet',
      message,
      statut: 'non lu',
      date_creation: new Date().toISOString(),
    };

    const result = await insertRow('contacts', nouvelleContact);
    res.status(201).json(result);
  } catch (error) {
    console.error('Supabase POST /api/contacts error:', error.message || error);
    res.status(500).json({ error: 'Impossible de créer le contact.' });
  }
});

app.put('/api/contacts/:id', async (req, res) => {
  const { id } = req.params;
  const { statut } = req.body;

  try {
    const updated = await updateRow('contacts', id, { statut });
    if (!updated) {
      return res.status(404).json({ error: 'Message non trouvé.' });
    }
    res.json(updated);
  } catch (error) {
    console.error('Supabase PUT /api/contacts/:id error:', error.message || error);
    res.status(500).json({ error: 'Impossible de mettre à jour le message.' });
  }
});

app.delete('/api/contacts/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await deleteRow('contacts', id);
    if (!deleted) {
      return res.status(404).json({ error: 'Message non trouvé.' });
    }
    res.json({ success: true });
  } catch (error) {
    console.error('Supabase DELETE /api/contacts/:id error:', error.message || error);
    res.status(500).json({ error: 'Impossible de supprimer le message.' });
  }
});

// ── Route pour traiter les formulaires de contact ──────────────────────────
app.post('/api/contact', async (req, res) => {
  const result = await handleContactForm(req.body, req);
  const statusCode = result.code || (result.success ? 200 : 400);
  res.status(statusCode).json(result);
});

// Alias pour compatibilité avec les anciens formulaires
app.post('/contact.php', async (req, res) => {
  const result = await handleContactForm(req.body, req);
  const statusCode = result.code || (result.success ? 200 : 400);
  res.status(statusCode).json(result);
});

// (admin UI removed)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur Node.js démarré sur http://localhost:${PORT}`);
});
