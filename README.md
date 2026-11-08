# Dropbox Clone

A Dropbox-inspired file manager built with Node.js, Express, EJS, vanilla JavaScript, and Firebase.

## Requirements

- Node.js 18 or newer
- npm
- A Firebase project with Firestore and Storage enabled

## Project structure

```text
app/
├── app.js                 # Express application setup
├── bin/www                # HTTP server entry point
├── config/                # Runtime Firebase configuration
├── routes/                # Server-side HTTP routes
├── views/                 # EJS pages
└── public/
    ├── assets/             # Browser assets
    │   ├── css/
    │   └── js/
    ├── src/                # Frontend controllers, services, repositories, and helpers
    ├── bower.json          # Legacy browser asset dependencies
    └── package.json        # Frontend tooling and Bower
```

The application keeps server code, templates, and browser code separate. Bootstrap and Ionicons are installed through Bower because the page references them from `public/bower_components`.

## Installation

Run the commands from the `app` directory:

```bash
npm run setup
```

This installs the server dependencies, frontend dependencies, and Bower assets.

If you prefer to run each step separately:

```bash
npm install
npm --prefix public install
npm --prefix public run install:bower
```

## Firebase configuration

Create the runtime configuration file from the example:

```bash
cp config/enviroment.example.js config/enviroment.js
```

On Windows, copy the file manually or use:

```powershell
Copy-Item config/enviroment.example.js config/enviroment.js
```

Fill in `config/enviroment.js` with the Firebase configuration from the Firebase console. The frontend loads this file at runtime, so do not commit real credentials or environment-specific values.

The Firebase browser modules are loaded from the Firebase CDN. Keep the Firebase module versions aligned in `public/src/repositories/FirebaseRepository.js`.

## Running the application

```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000).

## Development commands

```bash
npm run format        # Format the application files
npm run format:check  # Check formatting without changing files
npm --prefix public run install:bower
```

## Dependency maintenance

Bootstrap 4 and Ionicons 2 are part of the current UI markup. Avoid upgrading them automatically with `npm-check-updates` unless the frontend is also migrated to the newer APIs and markup. After changing dependencies, reinstall the frontend assets and verify the page in the browser.
