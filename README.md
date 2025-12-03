# AutoMate 🚗🎵

**Assistant Numérique de Covoiturage Universel Libre et Évolutif**

AutoMate est une application web intelligente qui combine la recherche de musique YouTube, les commandes vocales et la synthèse vocale pour créer une expérience de conduite améliorée.

---

## 📋 Table des matières

- [Fonctionnalités](#-fonctionnalités)
- [Architecture](#-architecture)
- [Prérequis](#-prérequis)
- [Installation](#-installation)
  - [Backend (Python)](#backend-python)
  - [Frontend (Angular)](#frontend-angular)
- [Configuration](#-configuration)
- [Utilisation](#-utilisation)
- [Technologies utilisées](#-technologies-utilisées)
- [Crédits](#-crédits)

---

## ✨ Fonctionnalités

- 🎵 **Recherche de musique YouTube** : Recherchez et jouez des vidéos YouTube directement dans l'application
- 🎤 **Commandes vocales** : Contrôlez l'application par la voix grâce à la reconnaissance vocale
- 🔊 **Synthèse vocale (TTS)** : Réponses audio via ElevenLabs
- 🤖 **Assistant IA** : Intégration avec Mistral AI pour comprendre les commandes naturelles
- 🎧 **Lecteur de musique** : Interface de lecteur avec contrôle de lecture et affichage du temps

---

## 🏗 Architecture

Le projet est divisé en deux parties principales :

```
AutoMate/
├── backend/          # Serveur Python avec WebSocket
│   ├── main.py       # Point d'entrée du serveur WebSocket
│   ├── music.py      # Service de recherche YouTube
│   └── pyproject.toml
│
├── frontend/         # Application Angular
│   ├── src/
│   │   └── app/
│   │       ├── audio-record-button/  # Composant d'enregistrement vocal
│   │       ├── music/                # Composant lecteur de musique
│   │       ├── navigation/           # Composant navigation
│   │       └── services/             # Services (chat, TTS, YouTube, etc.)
│   └── package.json
│
└── README.md
```

---

## 📦 Prérequis

Avant de commencer, assurez-vous d'avoir installé :

### Outils requis
- **Node.js** (version 18+) et **npm**
- **Python** (version 3.10+)
- **uv** (gestionnaire de paquets Python) ou **pip**

### Clés API nécessaires
Vous devrez obtenir les clés API suivantes :

| Service | Description | Lien |
|---------|-------------|------|
| **Google API** | Pour la recherche YouTube | [Console Google Cloud](https://console.cloud.google.com/) |
| **Mistral AI** | Pour l'assistant conversationnel | [Mistral AI](https://mistral.ai/) |
| **ElevenLabs** | Pour la synthèse vocale (TTS) | [ElevenLabs](https://elevenlabs.io/) |

---

## 🚀 Installation

### Backend (Python)

1. **Accédez au répertoire backend** :
   ```bash
   cd backend
   ```

2. **Installez les dépendances** :
   
   Avec **uv** (recommandé) :
   ```bash
   uv sync
   ```
   
   Ou avec **pip** :
   ```bash
   pip install -e .
   ```

3. **Configurez les variables d'environnement** :
   ```bash
   export GOOGLE_API_KEY="votre_clé_api_google"
   ```

4. **Lancez le serveur** :
   ```bash
   python main.py
   ```
   
   Le serveur WebSocket démarrera sur `localhost:4703`.

### Frontend (Angular)

1. **Accédez au répertoire frontend** :
   ```bash
   cd frontend
   ```

2. **Installez les dépendances** :
   ```bash
   npm install
   ```

3. **Configurez les variables d'environnement** :
   
   Créez un fichier `src/environments/environment.ts` :
   ```typescript
   export default {
     MISTRAL_API_KEY: 'votre_clé_mistral',
     ELEVENLABS_API_KEY: 'votre_clé_elevenlabs',
     STT_API_KEY: 'votre_clé_stt'
   };
   ```

4. **Lancez le serveur de développement** :
   ```bash
   npm start
   ```
   
   L'application sera accessible sur `http://localhost:4200/`.

---

## ⚙️ Configuration

### Variables d'environnement Backend

| Variable | Description |
|----------|-------------|
| `GOOGLE_API_KEY` | Clé API Google pour YouTube Data API v3 |

### Variables d'environnement Frontend

| Variable | Description |
|----------|-------------|
| `MISTRAL_API_KEY` | Clé API Mistral pour l'assistant IA |
| `ELEVENLABS_API_KEY` | Clé API ElevenLabs pour la synthèse vocale |
| `STT_API_KEY` | Clé API pour la reconnaissance vocale (Speech-to-Text) |

---

## 🎮 Utilisation

1. **Démarrez le backend** en premier (serveur WebSocket)
2. **Démarrez le frontend** (serveur Angular)
3. **Ouvrez l'application** dans votre navigateur à `http://localhost:4200/`
4. **Utilisez l'interface** :
   - Appuyez sur **Espace** ou cliquez sur le bouton d'enregistrement pour donner des commandes vocales
   - Naviguez vers `/music` pour le lecteur de musique
   - Naviguez vers `/navigation` pour les fonctionnalités de navigation

---

## 🛠 Technologies utilisées

### Frontend
- **Angular 19** - Framework web
- **TypeScript** - Langage de programmation
- **TailwindCSS 4** - Framework CSS
- **DaisyUI** - Composants UI
- **RxJS** - Programmation réactive

### Backend
- **Python 3.10+** - Langage de programmation
- **WebSockets** - Communication temps réel
- **Google API Client** - Intégration YouTube

### Services externes
- **Mistral AI** - Modèle de langage (ministral-3b-2410)
- **ElevenLabs** - Synthèse vocale multilingue
- **YouTube IFrame API** - Lecteur vidéo intégré

---

## 👏 Crédits

### Inspiration

Ce projet s'inspire des travaux de Kyutai Labs :

- [delayed-streams-modeling](https://github.com/kyutai-labs/delayed-streams-modeling)
- [unmute](https://github.com/kyutai-labs/unmute)

---

## 📄 Licence

Ce projet est un logiciel libre et évolutif. Consultez le fichier LICENSE pour plus de détails.

---

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request pour améliorer le projet.
