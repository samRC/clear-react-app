#!/usr/bin/env node

console.log("--- clear-react-app ---\n");

const fs = require("fs");
const rl = require("readline").createInterface(process.stdin, process.stdout);

const filesToDelete = [
  "./src/App.css",
  "./src/App.test.js",
  "./src/index.css",
  "./src/logo.svg",
  "./src/reportWebVitals.js",
  "./src/setupTests.js",
  "./public/favicon.ico",
  "./public/logo192.png",
  "./public/logo512.png",
];

const filesToRewrite = {
  readme: "./README.md",
  indexHtml: "./public/index.html",
  manifest: "./public/manifest.json",
  app: "./src/App.js",
  indexJs: "./src/index.js",
};

(async function () {
  // Confirmation prompt

  console.warn(
    "\nThis is a potentially destructive action... Files will be deleted and overwritten\n"
  );

  await (function () {
    return new Promise((resolve) =>
      rl.question("Do you want to continue with the clean up?(y/n)", (resp) => {
        if (resp === "y" || resp === "Y") {
          console.log("\nClean up in progress...\n");
        } else {
          console.log("\nAborting operation...\n");
          process.exit(0);
        }
        rl.close();
        resolve();
      })
    );
  })();

  // Delete Unwanted files
  console.log("\n--- Deleting unwanted files...\n");
  filesToDelete.forEach((f) => {
    fs.unlink(f, (err) => {
      if (err) {
        if (err.code === "ENOENT") console.log(`Already deleted ${f}`);
        else console.log(`\nCouldn't delete ${f}`);
        // console.log(err);
      } else {
        console.log(`Deleted ${f}`);
      }
    });
  });

  // Get app info

  const app_name = JSON.parse(fs.readFileSync("./package.json")).name;

  // REWRITE FILES

  console.log("\n--- Rewriting files...\n");

  fs.writeFile(filesToRewrite.readme, `# ${app_name}`, (err) => {
    if (!err) console.log(`Rewritten ${filesToRewrite.readme}`);
  });

  // REWRITE index.html
  const indexHtml = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <meta
      name="description"
      content="${app_name}"
    />
    <link rel="apple-touch-icon" href="%PUBLIC_URL%/logo192.png" />
    <link rel="manifest" href="%PUBLIC_URL%/manifest.json" />
    <title>${app_name}</title>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
  </body>
</html>
`;
  fs.writeFile(filesToRewrite.indexHtml, indexHtml, (err) => {
    if (!err) console.log(`Rewritten ${filesToRewrite.indexHtml}`);
  });

  // REWRITE manifest
  const manifest = `
{
  "short_name": "${app_name}",
  "name": "${app_name}",
  "icons": [],
  "start_url": ".",
  "display": "standalone",
  "theme_color": "#000000",
  "background_color": "#ffffff"
}
`;
  fs.writeFile(filesToRewrite.manifest, manifest, (err) => {
    if (!err) console.log(`Rewritten ${filesToRewrite.manifest}`);
  });

  // REWRITE App.js

  const app = `
function App() {
  return (
    <div>
      <h1>${app_name}</h1>
    </div>
  );
}

export default App;
`;

  fs.writeFile(filesToRewrite.app, app, (err) => {
    if (!err) console.log(`Rewritten ${filesToRewrite.app}`);
  });

  // REWRITE index.js

  const indexJs = `
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
`;

  fs.writeFile(filesToRewrite.indexJs, indexJs, (err) => {
    if (!err) console.log(`Rewritten ${filesToRewrite.indexJs}`);
  });
})();
