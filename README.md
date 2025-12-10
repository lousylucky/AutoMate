# AutoMate 🚗🎵

**Assistant Numérique de Covoiturage Universel Libre et Évolutif**

AutoMate est une application web Angular intelligente qui combine la recherche de musique YouTube, les commandes vocales et la synthèse vocale pour créer une expérience de conduite améliorée.

---

## 📋 Table des matières

- [Fonctionnalités](#-fonctionnalités)
- [Architecture](#-architecture)
- [Prérequis](#-prérequis)
- [Installation](#-installation)
- [Utilisation](#-utilisation)
- [Technologies utilisées](#-technologies-utilisées)
- [Crédits](#-crédits)

---

## 🤝 Contributeurs

Anna Clavelier
Gaspard Culis
Laurine De La Chapelle
Lukasz Matyasik
Matthieu Rua 


## ✨ Fonctionnalités

- 🎵 **Recherche de musique YouTube** : Recherchez et jouez des vidéos YouTube directement dans l'application
- 🎤 **Commandes vocales** : Contrôlez l'application par la voix grâce à la reconnaissance vocale
- 🔊 **Synthèse vocale (TTS)** : Réponses audio via ElevenLabs
- 🤖 **Assistant IA** : Intégration avec Mistral AI pour comprendre les commandes naturelles
- 🎧 **Lecteur de musique** : Interface de lecteur avec contrôle de lecture et affichage du temps

---

## 🏗 Architecture

Le projet est une application Angular à la racine du repository :

```
AutoMate/
├── src/
│   └── app/
│       ├── audio-record-button/  # Composant d'enregistrement vocal
│       ├── music/                # Composant lecteur de musique
│       ├── navigation/           # Composant navigation
│       ├── models/               # Modèles de données
│       └── services/             # Services (chat, TTS, YouTube, etc.)
├── public/                       # Ressources statiques
├── package.json
├── angular.json
├── tsconfig.json
└── README.md
```

---

## 📦 Prérequis

Avant de commencer, assurez-vous d'avoir installé :

### Outils requis
- **Node.js** (version 18+) et **npm**

### Clés API nécessaires
Vous devrez obtenir les clés API suivantes :

| Service | Description | Lien |
|---------|-------------|------|
| **Mistral AI** | Pour l'assistant conversationnel | [Mistral AI](https://mistral.ai/) |
| **ElevenLabs** | Pour la synthèse vocale (TTS) | [ElevenLabs](https://elevenlabs.io/) |
| **Google Cloud** | Pour la recherche YouTube | [Google Cloud Console](https://console.cloud.google.com/) |

---

## 🚀 Installation

1. **Clonez le repository** :
   ```bash
   git clone https://github.com/lousylucky/AutoMate.git
   cd AutoMate
   ```

2. **Installez les dépendances** :
   ```bash
   npm install
   ```

3. **Configurez les clés API** :
   
   Créez un fichier `src/environments/environment.ts` :
   ```typescript
   export default {
     MISTRAL_API_KEY: 'votre_clé_mistral',
     ELEVENLABS_API_KEY: 'votre_clé_elevenlabs',
     STT_API_KEY: 'votre_clé_stt',
     GOOGLE_API_KEY: 'votre_clé_google'
   };
   ```

4. **Lancez le serveur de développement** :
   ```bash
   npm start
   ```
   
   L'application sera accessible sur `http://localhost:4200/`.

---

## 🎮 Utilisation

1. **Lancez l'application** avec `npm start`
2. **Ouvrez l'application** dans votre navigateur à `http://localhost:4200/`
3. **Utilisez l'interface** :
   - Appuyez sur **Espace** ou cliquez sur le bouton d'enregistrement pour donner des commandes vocales
   - Naviguez vers `/music` pour le lecteur de musique
   - Naviguez vers `/navigation` pour les fonctionnalités de navigation

---

## 🛠 Technologies utilisées

### Application
- **Angular 19** - Framework web
- **TypeScript** - Langage de programmation
- **TailwindCSS 4** - Framework CSS
- **DaisyUI** - Composants UI
- **RxJS** - Programmation réactive

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
