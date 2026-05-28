const express = require('express');
const fs = require('fs');
const path = require('path');
const { handleContactForm } = require('./contactHandler');

const app = express();
const publicDir = path.join(__dirname);

// Use Render's persistent disk if available, otherwise use local data directory
const dataDir = process.env.RENDER_DISK_MOUNT_PATH 
  ? path.join(process.env.RENDER_DISK_MOUNT_PATH, 'data')
  : path.join(__dirname, 'data');
const offersFile = path.join(dataDir, 'offres.json');
const planningFile = path.join(dataDir, 'planning.json');
const testimonialsFile = path.join(dataDir, 'testimonials.json');
const contactsFile = path.join(dataDir, 'contacts.json');

const isProduction = process.env.NODE_ENV === 'production';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(publicDir));

function ensureDataDir() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

function loadJson(filePath, defaultValue) {
  try {
    if (!fs.existsSync(filePath)) {
      return defaultValue;
    }
    const content = fs.readFileSync(filePath, 'utf8') || JSON.stringify(defaultValue);
    return JSON.parse(content);
  } catch (error) {
    console.error(`Erreur lecture ${filePath}:`, error);
    return defaultValue;
  }
}

function saveJson(filePath, data) {
  ensureDataDir();
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
}

function loadOffers() {
  return loadJson(offersFile, []);
}

function saveOffers(offers) {
  saveJson(offersFile, offers);
}

function loadPlanning() {
  return loadJson(planningFile, []);
}

function savePlanning(planning) {
  saveJson(planningFile, planning);
}

function loadTestimonials() {
  return loadJson(testimonialsFile, []);
}

function saveTestimonials(testimonials) {
  saveJson(testimonialsFile, testimonials);
}

function loadContacts() {
  return loadJson(contactsFile, []);
}

function saveContacts(contacts) {
  saveJson(contactsFile, contacts);
}

// Note: login/logout/session endpoints removed. Manage data directly in `data/`.

app.get('/api/offres', (req, res) => {
  res.json(loadOffers());
});

app.post('/api/offres', (req, res) => {
  const { titre, description, categorie, prix, image_url, statut } = req.body;
  if (!titre || !description) {
    return res.status(400).json({ error: 'Titre et description requis.' });
  }

  const offres = loadOffers();
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

  offres.unshift(nouvelleOffre);
  saveOffers(offres);
  res.status(201).json(nouvelleOffre);
});

app.put('/api/offres/:id', (req, res) => {
  const { id } = req.params;
  const { titre, description, categorie, prix, image_url, statut } = req.body;
  const offres = loadOffers();
  const index = offres.findIndex((offre) => offre.id === id);

  if (index < 0) {
    return res.status(404).json({ error: 'Offre non trouvée.' });
  }

  offres[index] = {
    ...offres[index],
    titre: titre || offres[index].titre,
    description: description || offres[index].description,
    categorie: categorie || offres[index].categorie,
    prix: prix || offres[index].prix,
    image_url: image_url || offres[index].image_url,
    statut: statut || offres[index].statut,
  };

  saveOffers(offres);
  res.json(offres[index]);
});

app.delete('/api/offres/:id', (req, res) => {
  const { id } = req.params;
  const offres = loadOffers();
  const filtered = offres.filter((offre) => offre.id !== id);
  if (filtered.length === offres.length) {
    return res.status(404).json({ error: 'Offre non trouvée.' });
  }
  saveOffers(filtered);
  res.json({ success: true });
});

app.get('/api/planning', (req, res) => {
  res.json(loadPlanning());
});

app.post('/api/planning', (req, res) => {
  const { titre, date, heure, lieu, description, statut } = req.body;
  if (!titre || !date) {
    return res.status(400).json({ error: 'Titre et date requis.' });
  }

  const planning = loadPlanning();
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

  planning.unshift(nouvelleEntree);
  savePlanning(planning);
  res.status(201).json(nouvelleEntree);
});

app.put('/api/planning/:id', (req, res) => {
  const { id } = req.params;
  const { titre, date, heure, lieu, description, statut } = req.body;
  const planning = loadPlanning();
  const index = planning.findIndex((item) => item.id === id);

  if (index < 0) {
    return res.status(404).json({ error: 'Événement non trouvé.' });
  }

  planning[index] = {
    ...planning[index],
    titre: titre || planning[index].titre,
    date: date || planning[index].date,
    heure: heure || planning[index].heure,
    lieu: lieu || planning[index].lieu,
    description: description || planning[index].description,
    statut: statut || planning[index].statut,
  };

  savePlanning(planning);
  res.json(planning[index]);
});

app.delete('/api/planning/:id', (req, res) => {
  const { id } = req.params;
  const planning = loadPlanning();
  const filtered = planning.filter((item) => item.id !== id);
  if (filtered.length === planning.length) {
    return res.status(404).json({ error: 'Événement non trouvé.' });
  }

  savePlanning(filtered);
  res.json({ success: true });
});

app.get('/api/testimonials', (req, res) => {
  res.json(loadTestimonials());
});

app.post('/api/testimonials', (req, res) => {
  const { titre, auteur, entreprise, message, statut } = req.body;
  if (!titre || !message) {
    return res.status(400).json({ error: 'Titre et message requis.' });
  }

  const testimonials = loadTestimonials();
  const nouvelleTemoignage = {
    id: Date.now().toString(),
    titre,
    auteur: auteur || 'Anonyme',
    entreprise: entreprise || '',
    message,
    statut: statut || 'publié',
    date_creation: new Date().toISOString(),
  };

  testimonials.unshift(nouvelleTemoignage);
  saveTestimonials(testimonials);
  res.status(201).json(nouvelleTemoignage);
});

app.put('/api/testimonials/:id', (req, res) => {
  const { id } = req.params;
  const { titre, auteur, entreprise, message, statut } = req.body;
  const testimonials = loadTestimonials();
  const index = testimonials.findIndex((item) => item.id === id);
  if (index < 0) {
    return res.status(404).json({ error: 'Témoignage non trouvé.' });
  }

  testimonials[index] = {
    ...testimonials[index],
    titre: titre || testimonials[index].titre,
    auteur: auteur || testimonials[index].auteur,
    entreprise: entreprise || testimonials[index].entreprise,
    message: message || testimonials[index].message,
    statut: statut || testimonials[index].statut,
  };

  saveTestimonials(testimonials);
  res.json(testimonials[index]);
});

app.delete('/api/testimonials/:id', (req, res) => {
  const { id } = req.params;
  const testimonials = loadTestimonials();
  const filtered = testimonials.filter((item) => item.id !== id);
  if (filtered.length === testimonials.length) {
    return res.status(404).json({ error: 'Témoignage non trouvé.' });
  }

  saveTestimonials(filtered);
  res.json({ success: true });
});

app.get('/api/contacts', (req, res) => {
  res.json(loadContacts());
});

app.post('/api/contacts', (req, res) => {
  const { nom, email, sujet, message } = req.body;
  if (!nom || !email || !message) {
    return res.status(400).json({ error: 'Nom, email et message requis.' });
  }

  const contacts = loadContacts();
  const nouvelleContact = {
    id: Date.now().toString(),
    nom,
    email,
    sujet: sujet || 'Sans sujet',
    message,
    statut: 'non lu',
    date_creation: new Date().toISOString(),
  };

  contacts.unshift(nouvelleContact);
  saveContacts(contacts);
  res.status(201).json(nouvelleContact);
});

app.put('/api/contacts/:id', (req, res) => {
  const { id } = req.params;
  const { statut } = req.body;
  const contacts = loadContacts();
  const index = contacts.findIndex((item) => item.id === id);
  if (index < 0) {
    return res.status(404).json({ error: 'Message non trouvé.' });
  }

  contacts[index] = {
    ...contacts[index],
    statut: statut || contacts[index].statut,
  };

  saveContacts(contacts);
  res.json(contacts[index]);
});

app.delete('/api/contacts/:id', (req, res) => {
  const { id } = req.params;
  const contacts = loadContacts();
  const filtered = contacts.filter((item) => item.id !== id);
  if (filtered.length === contacts.length) {
    return res.status(404).json({ error: 'Message non trouvé.' });
  }

  saveContacts(filtered);
  res.json({ success: true });
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
const HOST = process.env.RENDER ? '0.0.0.0' : 'localhost';
app.listen(PORT, HOST, () => {
  console.log(`Serveur Node.js démarré sur http://${HOST}:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
