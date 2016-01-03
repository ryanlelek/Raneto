Raneto
======

[Raneto](http://raneto.com) is a free, open, simple Markdown powered Knowledgebase for Nodejs. [Find out more &rarr;](http://docs.raneto.com/what-is-raneto)

Requirements
------------

* [Node.js](http://nodejs.org) **v4.0.0** (or later)

Demo & Docs
-----------

See [http://docs.raneto.com](http://docs.raneto.com)

Install
-------

It is recommended to create a new Git repository to store your documentation files and then install Raneto as a dependency into it.  
See the `example/` directory for how this implementation works.

1. Switch to your existing or new project directory
2. Add Raneto to your project via NPM's package.json file or downloading the latest version from the [releases page](https://github.com/gilbitron/Raneto/releases)
3. In a terminal, run `npm install` to install the node dependencies
4. To start Raneto, run `npm start` (or `npm run start_win` on Windows)
5. Visit `http://localhost:3000` in your web browser

Running as a Service
--------------------

You can run Raneto easily in the background on your local or production machines with PM2.

1. Install Raneto globally with `npm install -g raneto`
2. Edit the configuration file in your global NPM `node_modules/` directory (locate with `which raneto` on *NIX)
3. Run Raneto with `raneto start` and access logs with `raneto logs`
4. When finished, run `raneto stop`

Production Notes
----------------

When running a live site you'll want to set the `PORT` env variable to `80` so you don't need to add `:3000` to the URL.
This requires root privileges and is not recommended.

Instead it is preferred to use a reverse proxy for security reasons.
Heroku and other services handle this aspect for you, but you can implement your own reverse proxy with Nginx or Apache.
If you want an example with Nginx, please submit an issue.

You can change the port anytime by setting the environment variable in your propfile, or running in-line as below:
`$ PORT=1234 npm start`

Contribute
----------

See [http://docs.raneto.com/contributing](http://docs.raneto.com/contributing)

Showcase
--------

Using Raneto in the wild? We'd love to see it. Add your site to the [Raneto Showcase](https://github.com/gilbitron/Raneto/wiki/Raneto-Showcase).

Credits
-------

Raneto was created by [Gilbert Pellegrom](http://gilbert.pellegrom.me) from
[Dev7studios](http://dev7studios.com). Released under the [MIT license](https://raw.githubusercontent.com/gilbitron/Raneto/master/LICENSE).
