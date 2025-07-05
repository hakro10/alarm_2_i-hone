# AlarmApp

This is a React Native app refactored to run on the web using React Native Web.

## Features
- Display and toggle alarms
- Uses React Native components with React Native Web for web compatibility
- Progressive Web App (PWA) support for offline usage and installability

## Getting Started

### Prerequisites
- Node.js (>=18)
- npm or yarn

### Installation

```bash
npm install
# or
# yarn
```

### Running Locally

```bash
npm run web
# or
# yarn web
```

This will start a development server and open the app in your default browser at http://localhost:8080

### Building for Production

```bash
npm run build:web
# or
# yarn build:web
```

This will create a production build in the `dist` folder.

### Deploying to Netlify

1. Run the production build command.
2. Deploy the contents of the `dist` folder to Netlify.
3. Add a `_redirects` file in the `public` folder with the following content to handle SPA routing:

```
/*    /index.html   200
```

## Progressive Web App (PWA)

This app supports PWA features:

- Offline caching of static assets
- Installable on supported devices

To use as a PWA:

1. Build and deploy the app.
2. Access the app in a supported browser.
3. Use the browser's "Add to Home Screen" feature to install.

## Project Structure

- `App.tsx`: Main app component
- `index.js`: Web entry point
- `webpack.config.js`: Webpack configuration
- `public/index.html`: Web root HTML
- `public/manifest.json`: PWA manifest
- `public/service-worker.js`: Service worker for caching
- `package.json`: Project dependencies and scripts

## License

MIT
