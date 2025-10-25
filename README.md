# Super Portfolio – README Multilingue / Multilingual / Multilingüe / Mehrsprachig

<div align="center">
  <img src="./logo.png" alt="Super Portfolio Logo" width="140" />
</div>

> **Auteur · Author · Autor · Autor** : Vous, propriétaire du projet. Mettez à jour ce champ avec votre nom complet si vous le souhaitez.

---

## 🌍 Sommaire rapide / Quick Overview / Resumen rápido / Schneller Überblick

- [Français (FR)](#-français-fr)
- [English (EN)](#-english-en)
- [Español (ES)](#-español-es)
- [Deutsch (DE)](#-deutsch-de)
- [🌐 Internationalisation](#-internationalisation)
- [📄 Licence](#-licence--license--licencia--lizenz)

---

## 🇫🇷 Français (FR)

### Présentation

Super Portfolio est une application Nuxt 3 + Tailwind CSS permettant de créer un portfolio moderne, administrable via une interface sécurisée. Cette version du projet est maintenue par **vous, l'auteur principal**.

### Fonctionnalités clés

- Interface responsive et animée avec Tailwind CSS.
- Contenus dynamiques stockés côté serveur dans `server/storage/`.
- Espace d'administration (`/admin`) avec authentification et protection CSRF.
- Internationalisation prête à l'emploi via le dossier `i18n`.
- Structure modulaire avec composables, stores Pinia et plugins Nuxt.

### Technologies utilisées

- Nuxt 3
- TypeScript
- Tailwind CSS
- Iconsax Icons
- Nuxt Google Fonts
- Vitest pour les tests unitaires

### Prérequis

- [Node.js 18+](https://nodejs.org/)
- [PNPM](https://pnpm.io/installation)
- [Git](https://git-scm.com/)

### Installation

```bash
# Cloner votre propre fork ou ce dépôt
git clone https://github.com/USER/super-portfolio.git
cd super-portfolio

# Installer les dépendances
pnpm install
```

### Démarrage

```bash
# Lancer le serveur de développement Nuxt
pnpm dev
```

Accédez ensuite à <http://localhost:3000>.

### Configuration des variables d'environnement

Créez un fichier `.env` ou exportez ces variables si vous souhaitez personnaliser les valeurs par défaut :

```env
SESSION_COOKIE_NAME=bro_world_session
CSRF_COOKIE_NAME=bro_world_csrf
SESSION_MAX_AGE=86400
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=ChangeMe123!
```

### Administration

- Accédez à `/admin` avec les identifiants `admin@example.com` / `ChangeMe123!` (à modifier).
- Les requêtes API sécurisées se trouvent sous `/api/content/*` et `/api/auth/*`.
- Les contenus sont validés par [Zod](https://zod.dev/) côté client et serveur.

### Structure du projet

```
app.vue              # Layout racine Nuxt
components/          # Composants UI et sections réutilisables
composables/         # Hooks et fonctions partagées
pages/               # Pages routées automatiquement par Nuxt
stores/              # Stores Pinia pour l'état global
server/              # API Nitro, middlewares, stockage persistant
utils/               # Fonctions utilitaires (contenus, helpers)
i18n/                # Fichiers de traduction
```

### Scripts PNPM utiles

- `pnpm dev` – serveur de développement
- `pnpm build` – build de production
- `pnpm preview` – prévisualisation de la build
- `pnpm lint` – lint ESLint + Stylelint
- `pnpm test` – tests unitaires avec Vitest

### Tests

```bash
pnpm test
```

Consultez `vitest.config.ts` et `tests/` pour ajouter vos propres scénarios.

### Contribution

1. Créez une branche : `git checkout -b feature/ma-fonctionnalite`
2. Commitez avec des messages clairs (convention Conventional Commits recommandée).
3. Poussez et ouvrez une Pull Request décrivant les changements et ajoutant des captures d'écran si nécessaire.

---

## 🇬🇧 English (EN)

### Overview

Super Portfolio is a Nuxt 3 + Tailwind CSS application for crafting a modern, easily editable portfolio. **You are credited as the primary author and maintainer of this edition.**

### Key Features

- Responsive, animated UI powered by Tailwind CSS.
- Dynamic content stored under `server/storage/` via Nuxt Nitro.
- Admin area (`/admin`) secured with authentication and CSRF protection.
- Built-in internationalisation through the `i18n` directory.
- Modular architecture using composables, Pinia stores, and Nuxt plugins.

### Tech Stack

- Nuxt 3
- TypeScript
- Tailwind CSS
- Iconsax Icons
- Nuxt Google Fonts
- Vitest for unit testing

### Requirements

- [Node.js 18+](https://nodejs.org/)
- [PNPM](https://pnpm.io/installation)
- [Git](https://git-scm.com/)

### Installation

```bash
git clone https://github.com/USER/super-portfolio.git
cd super-portfolio
pnpm install
```

### Development

```bash
pnpm dev
```

Then open <http://localhost:3000>.

### Environment Variables

Create a `.env` file or export the following to customise defaults:

```env
SESSION_COOKIE_NAME=bro_world_session
CSRF_COOKIE_NAME=bro_world_csrf
SESSION_MAX_AGE=86400
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=ChangeMe123!
```

### Admin Panel

- Visit `/admin` with `admin@example.com` / `ChangeMe123!` (change immediately).
- Authenticated API routes live under `/api/content/*` and `/api/auth/*`.
- Data validation uses [Zod](https://zod.dev/) on both client and server.

### Project Structure

```
app.vue              # Root Nuxt layout
components/          # Reusable UI sections
composables/         # Shared hooks/utilities
pages/               # File-based routed pages
stores/              # Pinia global state stores
server/              # Nitro server handlers and storage
utils/               # Content utilities and helpers
i18n/                # Translation resources
```

### PNPM Scripts

- `pnpm dev` – start development server
- `pnpm build` – production build
- `pnpm preview` – preview the production build
- `pnpm lint` – run ESLint and Stylelint checks
- `pnpm test` – run Vitest unit tests

### Testing

```bash
pnpm test
```

See `vitest.config.ts` and `tests/` for guidance on writing additional tests.

### Contributing

1. Create a branch: `git checkout -b feature/my-feature`
2. Commit using clear messages (Conventional Commits encouraged).
3. Push and open a Pull Request detailing your changes and screenshots when relevant.

---

## 🇪🇸 Español (ES)

### Descripción

Super Portfolio es una aplicación creada con Nuxt 3 y Tailwind CSS para construir un portafolio moderno y editable. **Tú eres la persona autora y responsable principal de esta versión.**

### Funcionalidades

- Interfaz responsive con animaciones basada en Tailwind CSS.
- Contenido dinámico guardado en `server/storage/` mediante Nuxt Nitro.
- Panel de administración (`/admin`) con autenticación y protección CSRF.
- Internacionalización preparada gracias al directorio `i18n`.
- Arquitectura modular con composables, stores de Pinia y plugins de Nuxt.

### Tecnologías

- Nuxt 3
- TypeScript
- Tailwind CSS
- Iconsax
- Nuxt Google Fonts
- Vitest para pruebas unitarias

### Requisitos previos

- [Node.js 18+](https://nodejs.org/)
- [PNPM](https://pnpm.io/installation)
- [Git](https://git-scm.com/)

### Instalación

```bash
git clone https://github.com/USER/super-portfolio.git
cd super-portfolio
pnpm install
```

### Ejecución

```bash
pnpm dev
```

Abre <http://localhost:3000> en tu navegador.

### Variables de entorno

```env
SESSION_COOKIE_NAME=bro_world_session
CSRF_COOKIE_NAME=bro_world_csrf
SESSION_MAX_AGE=86400
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=ChangeMe123!
```

### Panel de administración

- Entra a `/admin` con `admin@example.com` / `ChangeMe123!` y cámbialos enseguida.
- Las rutas API protegidas viven en `/api/content/*` y `/api/auth/*`.
- La validación se realiza con [Zod](https://zod.dev/) tanto en cliente como en servidor.

### Estructura del proyecto

```
app.vue              # Diseño raíz de Nuxt
components/          # Componentes reutilizables
composables/         # Hooks y utilidades compartidas
pages/               # Páginas generadas por archivos
stores/              # Stores globales de Pinia
server/              # Manejadores de Nitro y almacenamiento
utils/               # Utilidades y helpers
i18n/                # Recursos de traducción
```

### Scripts útiles

- `pnpm dev` – servidor de desarrollo
- `pnpm build` – compilación de producción
- `pnpm preview` – vista previa de la build
- `pnpm lint` – análisis de código con ESLint/Stylelint
- `pnpm test` – pruebas unitarias con Vitest

### Pruebas

```bash
pnpm test
```

Revisa `vitest.config.ts` y `tests/` para añadir nuevos casos.

### Contribuciones

1. Crea una rama: `git checkout -b feature/mi-funcionalidad`
2. Haz commits con mensajes claros.
3. Abre un Pull Request describiendo los cambios e incluye capturas si aplica.

---

## 🇩🇪 Deutsch (DE)

### Überblick

Super Portfolio ist eine Anwendung auf Basis von Nuxt 3 und Tailwind CSS zum Aufbau eines modernen, leicht pflegbaren Portfolios. **Sie werden als Hauptautor:in dieser Variante genannt.**

### Hauptfunktionen

- Responsives, animiertes UI mit Tailwind CSS.
- Dynamische Inhalte in `server/storage/` gespeichert.
- Administrationsbereich (`/admin`) mit Authentifizierung und CSRF-Schutz.
- Internationalisierung über den Ordner `i18n`.
- Moduläre Architektur mit Composables, Pinia Stores und Nuxt Plugins.

### Technologiestack

- Nuxt 3
- TypeScript
- Tailwind CSS
- Iconsax Icons
- Nuxt Google Fonts
- Vitest für Unit-Tests

### Voraussetzungen

- [Node.js 18+](https://nodejs.org/)
- [PNPM](https://pnpm.io/installation)
- [Git](https://git-scm.com/)

### Installation

```bash
git clone https://github.com/USER/super-portfolio.git
cd super-portfolio
pnpm install
```

### Entwicklung starten

```bash
pnpm dev
```

Danach <http://localhost:3000> öffnen.

### Umgebungsvariablen

```env
SESSION_COOKIE_NAME=bro_world_session
CSRF_COOKIE_NAME=bro_world_csrf
SESSION_MAX_AGE=86400
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=ChangeMe123!
```

### Adminbereich

- Zugriff auf `/admin` mit `admin@example.com` / `ChangeMe123!` (sofort ändern).
- Geschützte API-Routen befinden sich unter `/api/content/*` und `/api/auth/*`.
- Datenvalidierung mit [Zod](https://zod.dev/) auf Client- und Serverseite.

### Projektstruktur

```
app.vue              # Nuxt-Wurzel-Layout
components/          # Wiederverwendbare UI-Komponenten
composables/         # Gemeinsame Hooks/Utilities
pages/               # Seitendateien mit Routing
stores/              # Pinia Stores für globalen Zustand
server/              # Nitro-Server und Storage
utils/               # Hilfsfunktionen
i18n/                # Übersetzungen
```

### Nützliche Skripte

- `pnpm dev` – Entwicklungsserver starten
- `pnpm build` – Produktions-Build
- `pnpm preview` – Build-Vorschau
- `pnpm lint` – ESLint/Stylelint-Prüfungen
- `pnpm test` – Vitest-Unit-Tests

### Tests ausführen

```bash
pnpm test
```

Weitere Beispiele in `tests/` ergänzen.

### Beitrag leisten

1. Branch anlegen: `git checkout -b feature/mein-feature`
2. Aussagekräftige Commit-Messages schreiben.
3. Pull Request mit Beschreibung und ggf. Screenshots eröffnen.

---

## 🌐 Internationalisation

Les fichiers de traduction se trouvent dans `i18n/`. Ajoutez vos propres locales en créant un nouveau dossier ou fichier JSON pour chaque langue, puis enregistrant la configuration dans `nuxt.config.ts` et `plugins/i18n`.

## 📄 Licence / License / Licencia / Lizenz

Ce projet est distribué sous les termes de la licence indiquée dans [`LICENSE`](./LICENSE). Merci de conserver votre mention d'auteur dans les dérivés.
