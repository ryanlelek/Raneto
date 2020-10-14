/*
Title: Updating Raneto
*/

The update process for Raneto is as follows:

1. Make a backup of your `content` folder and your `config.js` outside of your project.

1. (Optional) If you have edited the template, backup the following paths:
   - the `themes/default/` folder
   - any edited files in the `public` folder

1. Download the latest version of Raneto from the [releases page](https://github.com/gilbitron/Raneto/releases).

1. Extract the Raneto archive to your project folder, replacing all existing files in your existing Raneto install.

1. Copy your `content` folder and `config.js` file from your backup location back into the install location.

1. (Optional) If you have edited the template, copy your backed up `themes/default/` and `public` folders to the install location.

1. From the root of your project, run:

   ```bash
   npm update
   ```

1. To build the docs, run:

   ```bash
   npm start
   ```

You are running the lastest version of Raneto.