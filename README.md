Raneto [![Node.js CI](https://github.com/ryanlelek/Raneto/actions/workflows/node.js.yml/badge.svg)](https://github.com/ryanlelek/Raneto/actions/workflows/node.js.yml)
======

[![Raneto Logo](https://raw.githubusercontent.com/ryanlelek/Raneto/master/logo/logo_readme.png)](https://raneto.com/)

[Raneto](https://raneto.com) is a free, open, simple Markdown powered knowledge base for Node.js.
[Find out more &rarr;](https://docs.raneto.com/what-is-raneto)

Important Updates
-----------------

- **Please ensure you're on Raneto v0.17.1 for the latest security fixes**
- Join the [Roadmap Discussion](https://github.com/ryanlelek/Raneto/issues/374)

Demo and Documentation
----------------------

Visit [https://docs.raneto.com](https://docs.raneto.com) to see a demo.  

Quickstart
----------

Visit the [Example Repo](https://github.com/raneto/example)  
See the [installation guide](https://docs.raneto.com/install/installing-raneto) for more information.  

Docker / Containers
-------------------
Official Raneto container images on [Docker Hub](https://hub.docker.com/r/raneto/raneto/tags)  

Run the default container, and access on [localhost:3000](http://localhost:3000)  
`docker run --rm -it --publish 3000:3000 raneto/raneto:latest`

Same as above, but provide your own content and configuration  
```
docker run --rm -it --publish 3000:3000 \
  --volume \
  --volume \
  raneto/raneto:latest
```

Want to poke around the files in the container? Get a shell:  
`docker run --rm -it --publish 3000:3000 --volume raneto/raneto:latest /bin/sh`

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

- [Configuration](https://docs.raneto.com/usage/configuration)
- [Production Notes](https://docs.raneto.com/install/production-notes)
- [Deploying to Heroku](https://docs.raneto.com/tutorials/deploying-raneto-to-heroku)
- [Contributing](https://github.com/ryanlelek/Raneto/blob/master/CONTRIBUTE.md)

Showcase
--------

**Are you using Raneto in the wild?**
We'd love to see it. Please add it to this list:
* [Raneto Docs](https://docs.raneto.com)


Related Projects
----------------

- [Default Theme](https://github.com/raneto/theme-default)
- [Deploy Raneto to your servers with Ansible](https://github.com/ryanlelek/raneto-devops) by @ryanlelek
- [Run Raneto in a Vagrant container](https://github.com/draptik/vagrant-raneto) by @draptik
- [Deploy Raneto using Docker container](https://github.com/appsecco/raneto-docker) by @madhuakula

Credits
-------

- Raneto was created by [Gilbert Pellegrom](https://gilbitron.me)
- Maintained by [Ryan Lelek](https://www.ryanlelek.com) from [AnsibleTutorials.com](https://www.ansibletutorials.com)
- Logo by [@mmamrila](https://github.com/mmamrila)
- Released under the [MIT license](https://github.com/ryanlelek/Raneto/blob/master/LICENSE)
