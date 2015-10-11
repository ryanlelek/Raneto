/*
Title: Installing Raneto
Sort: 2
*/

Once you are sure you have met the [minimum requirements](%base_url%/install/requirements) you can install
Raneto by following these steps:

1. Download the latest version of Raneto from the [releases page](https://github.com/gilbitron/Raneto/releases)
2. Create a new directory where you would like to run the app, and un-zip the package to that location
3. Fire up a Terminal, the Node Command Prompt or shell and change directory to the root of the Raneto application (where app.js and config.js are)
4. Run `npm install` to install the node dependencies
5. To start Raneto, run `npm start`
6. Visit `http://localhost:3000` in your web browser

You can now start [creating pages](%base_url%/usage/creating-pages).

Note: When running on a live site you'll want to set the `PORT` env variable to `80` so you don't need to
add `:3000` to the URL.
