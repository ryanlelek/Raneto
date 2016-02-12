Raneto
======

[Raneto](http://raneto.com) is a free, open, simple Markdown powered Knowledgebase for Node.js.  
[Find out more &rarr;](http://docs.raneto.com/what-is-raneto)  

Visit [http://docs.raneto.com](http://docs.raneto.com) to see a demo and get started!

Install
-------

It is recommended to create a new Git repository to store your documentation files and then install Raneto as a dependency into it.  
See the `example/` directory for how this implementation works.

1. Switch to your existing or new project directory
2. Add Raneto to your project via NPM's package.json file or downloading the latest version from the [releases page](https://github.com/gilbitron/Raneto/releases)
3. In a terminal, run `npm install` to install the node dependencies
4. To start Raneto, run `npm start` (or `npm run start_win` on Windows)
5. Visit `http://localhost:3000` in your web browser

Production Notes
----------------

When running a live site you'll want to set the `PORT` env variable to `80` so you don't need to add `:3000` to the URL.
This requires root privileges and is not recommended.

Instead it is preferred to use a reverse proxy for security reasons.
Heroku and other services handle this aspect for you, but you can implement your own reverse proxy with Nginx or Apache.
**See the "Related Projects" section for deployment scripts to use on your own servers**

You can change the port anytime by setting the environment variable in your propfile, or running in-line as below:
`$ PORT=1234 npm start`

Contribute
----------

See [http://docs.raneto.com/contributing](http://docs.raneto.com/contributing)

Showcase
--------

Using Raneto in the wild? We'd love to see it. Add your site to the [Raneto Showcase](https://github.com/gilbitron/Raneto/wiki/Raneto-Showcase).

Related Projects
----------------
- [Deploy Raneto to your servers with Ansible](https://github.com/ryanlelek/raneto-devops) (@ryanlelek)
- [Run Raneto in a Vagrant container](https://github.com/draptik/vagrant-raneto) (@draptik)

Credits
-------

Raneto was created by [Gilbert Pellegrom](http://gilbert.pellegrom.me) from
[Dev7studios](http://dev7studios.com). Released under the [MIT license](https://raw.githubusercontent.com/gilbitron/Raneto/master/LICENSE).
