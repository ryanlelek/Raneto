/*
Title: Running as a Service
Sort: 2
*/

You can run Raneto easily in the background on your local or production machines with PM2.

1. Install Raneto globally with `npm install -g raneto`
2. Edit the configuration file in your global NPM `node_modules/` directory (locate with `which raneto` on *NIX)
3. Run Raneto with `raneto start` and access logs with `raneto logs`
4. When finished, run `raneto stop`
