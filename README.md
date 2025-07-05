# AlarmApp

This is a React Native app refactored to run on the web using React Native Web.

## Features
- Display and toggle alarms
- Uses React Native components with React Native Web for web compatibility

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

## Project Structure

- `App.tsx`: Main app component
- `index.js`: Web entry point
- `webpack.config.js`: Webpack configuration
- `public/index.html`: Web root HTML
- `package.json`: Project dependencies and scripts

## License

MIT
