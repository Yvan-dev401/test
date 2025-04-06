const express = require("express");
const app = express();
const { MongoClient } = require("mongodb");
const cors = require("cors");
require("dotenv").config(); // Assurez-vous d'avoir installé dotenv pour charger les variables d'environnement

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("Erreur : MONGO_URI n'est pas défini dans les variables d'environnement.");
  process.exit(1); // Arrêter le serveur si MONGO_URI est manquant
}

let db;

// Middleware pour activer CORS
app.use(cors());

// Middleware pour parser les requêtes JSON
app.use(express.json());

// Connexion à MongoDB
MongoClient.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then((client) => {
    db = client.db();
    console.log("MongoDB connecté avec succès !");
  })
  .catch((err) => {
    console.error("Erreur de connexion à MongoDB :", err);
    process.exit(1); // Arrêter le serveur en cas d'erreur
  });

// Middleware pour injecter la base de données dans les requêtes
app.use((req, res, next) => {
  if (!db) {
    return res.status(500).json({ message: "Base de données non connectée" });
  }
  req.db = db;
  next();
});

// Exemple de route pour tester le serveur
app.get("/", (req, res) => res.send("Serveur Express opérationnel !"));

// Démarrage du serveur
app.listen(PORT, () => console.log(`Server ready on port ${PORT}.`));

module.exports = app;