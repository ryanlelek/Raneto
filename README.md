Raneto
======

[Raneto](http://raneto.com) is a free, open, simple Markdown powered Knowledgebase for Nodejs. [Find out more &rarr;](http://docs.raneto.com/what-is-raneto)

What's New?
-----------

### Release v0.7.x ###
This set of releases add a lot of new functionality.
- **Something Broken?** Submit a new Issue and we'll help you out.
- **Something Missing?** Submit a new Issue or a Pull Request to get the conversation started
- **Enjoying Raneto?** Add your site to the [Raneto Showcase](https://github.com/gilbitron/Raneto/wiki/Raneto-Showcase).

### 2015.10.11 / v0.7.1 ###

  * **[New]** Theme support. Copy `themes/default/` to `themes/<new name>/` and edit.
  * **[Upgraded]** Bower modules in bower.json (current)
  * **[Upgraded]** Node.js modules in package.json (current)
  * **[Removed]** ./bin/www script. Replace with "npm start"

### 2015.10.10 / v0.7.0 ###

This is the first set of changes, mostly from submitted Pull Requests.

  * **[New]** Added online editing of pages
    - contributed by **@matthiassb**
  * **[New]** Added HTTP Basic authentication
    - contributed by **@eighteyes**
  * **[New]** Added custom template layouts
    - contributed by **@zulfajuniadi**
  * **[Fixed]** Highlight.js language detection
    - contributed by **@thurloat**
  * **[Fixed]** Mobile design layout
    - contributed by **@adimitrov**
  * **[Fixed]** Added config.base_url in front of all assets
    - contributed by **@valeriangalliat**


Requirements
------------

* [Node.js](http://nodejs.org) **v0.10+**

Install
-------

1. Download the latest version of Raneto from the [releases page](https://github.com/gilbitron/Raneto/releases)
2. Create a new directory where you would like to run the app, and un-zip the package to that location
3. Fire up a Terminal, the Node Command Prompt or shell and change directory to the root of the Raneto application (where app.js and config.js are)
4. run `npm install` to install the node dependencies
5. To start Raneto, run `npm start`
6. Visit `http://localhost:3000` in your web browser

Note: When running on a live site you'll want to set the `PORT` env variable to `80` so you don't need to add `:3000` to the URL.

Demo & Docs
-----------

See http://docs.raneto.com

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
