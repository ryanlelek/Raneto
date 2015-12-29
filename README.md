Raneto
======

[Raneto](http://raneto.com) is a free, open, simple Markdown powered Knowledgebase for Nodejs. [Find out more &rarr;](http://docs.raneto.com/what-is-raneto)

Requirements
------------

* [Node.js](http://nodejs.org) **v4.0.0** (or later)

Install
-------

```sh
$ npm install -g raneto
```

Install from Source
-------

1. Download the latest version of Raneto from the [releases page](https://github.com/gilbitron/Raneto/releases)
2. Create a new directory where you would like to run the app, and un-zip the package to that location
3. Fire up a Terminal, the Node Command Prompt or shell and change directory to the root of the Raneto application (where app.js and config.js are)
4. run `npm install` to install the node dependencies
5. To start Raneto, run `npm start` (or `npm run start_win` on Windows)

Accessing Raneto
----------------

Visit `http://localhost:3000` in your web browser.

Demo & Docs
-----------

See http://docs.raneto.com

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

See http://docs.raneto.com/contributing

Showcase
--------

Using Raneto in the wild? We'd love to see it. Add your site to the [Raneto Showcase](https://github.com/gilbitron/Raneto/wiki/Raneto-Showcase).

Credits
-------

Raneto was created by [Gilbert Pellegrom](http://gilbert.pellegrom.me) from
[Dev7studios](http://dev7studios.com). Released under the [MIT license](https://raw.githubusercontent.com/gilbitron/Raneto/master/LICENSE).
