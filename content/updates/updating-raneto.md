/*
Title: Updating Raneto
*/

The update process for Raneto is as follows:

* Make a backup of your `content` folder and your `config.js`. Copy these files somewhere else
* If you have edited the template you may also need to backup the `themes/default/` folder and anything you
have edited in the `public` folder
* Download the latest version of Raneto from the [releases page](https://github.com/gilbitron/Raneto/releases)
* Extract the Raneto zip/tar.gz and overwrite all of the files in your existing Raneto install, replacing
all files and folders
* Copy your `content` folder and `config.js` file from your backup location back into the install location
* If you have edited the template then copy your custom `themes/default/` and `public` files back as well
* Run `npm update` from the root of your install
* Restart node (`npm start`) and you should be running the new version of Raneto
