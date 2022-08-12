Raneto [![CircleCI](https://dl.circleci.com/status-badge/img/gh/ryanlelek/Raneto/tree/master.svg?style=svg)](https://dl.circleci.com/status-badge/redirect/gh/ryanlelek/Raneto/tree/master)
======

[![Raneto Logo](https://raw.githubusercontent.com/ryanlelek/Raneto/master/logo/logo_readme.png)](http://raneto.com/)

[Raneto](http://raneto.com) is a free, open, simple Markdown powered knowledge base for Node.js.
[Find out more &rarr;](http://docs.raneto.com/what-is-raneto)

Important Updates
-----------------

- **Please ensure you're on Raneto v0.17.1 for the latest security fixes**
- Join the [Roadmap Discussion](https://github.com/ryanlelek/Raneto/issues/374)

Demo
----

Visit [http://docs.raneto.com](http://docs.raneto.com) to see a demo and get started!

Quickstart
----------

1. In a terminal, run:
    ```bash
    git clone https://github.com/ryanlelek/Raneto.git
    cd Raneto
    npm install && npm run gulp && npm start
   ```
1. Visit [http://localhost:3000](http://localhost:3000) to display the output.

See the [installation guide](http://docs.raneto.com/install/installing-raneto) for more information.  

Supported Node Versions:
- v18.x.x (Current)
- v16.x.x (LTS)

Please use the latest version available of the above major Node.js releases to ensure you have the latest security fixes!  

Security
--------
Make sure you edit the default username and password in your `config.js` file.  
```
##### WARNING #####
// You MUST change the username and password for security
// Do NOT use "admin" as a username as it's easily guessed.
// You are encouraged to use tools to generate a password
// Preferably, use a local password manager
// If you absolutely must use an online tool, here are some suggestions
// https://bitwarden.com/password-generator/
// https://www.grc.com/passwords.htm
```

Markdown Reference
------------------
If you want to embed links and images, you'll need to use the Markdown syntax.  
[See this Markdown Guide](https://www.markdownguide.org/cheat-sheet)

Links
-----

- [Configuration](http://docs.raneto.com/usage/configuration)
- [Production Notes](http://docs.raneto.com/install/production-notes)
- [Deploying to Heroku](http://docs.raneto.com/tutorials/deploying-raneto-to-heroku)
- [Contributing](https://github.com/ryanlelek/Raneto/blob/master/CONTRIBUTE.md)

Showcase
--------

**Are you using Raneto in the wild?**
We'd love to see it. Please add it to this list:
* [Raneto Docs](http://docs.raneto.com)


Related Projects
----------------

- [Deploy Raneto to your servers with Ansible](https://github.com/ryanlelek/raneto-devops) by @ryanlelek
- [Run Raneto in a Vagrant container](https://github.com/draptik/vagrant-raneto) by @draptik
- [Deploy Raneto using Docker container](https://github.com/appsecco/raneto-docker) by @madhuakula

Credits
-------

- Raneto was created by [Gilbert Pellegrom](https://gilbitron.me) from [Dev7studios](https://gilbitron.me/projects/)
- Maintained by [Ryan Lelek](https://www.ryanlelek.com) from [AnsibleTutorials.com](https://www.ansibletutorials.com)
- Logo by [@mmamrila](https://github.com/mmamrila)
- Released under the [MIT license](https://github.com/ryanlelek/Raneto/blob/master/LICENSE)
