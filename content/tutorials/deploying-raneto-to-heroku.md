/*
Title: Deploying Raneto to Heroku
Sort: 1
*/

[Heroku](https://www.heroku.com) is a cloud hosting platform which allows you to host your code for
free (for 1 dyno, see [pricing](https://www.heroku.com/pricing) for more info). In this tutorial we
are going to use Heroku to host our Raneto Knowledgebase.

## Prerequisites

Before we get going there are a few things we need to make sure we have in place first:

1. We are going to assume you have already [installed](%base_url%/install/installing-raneto) and setup Raneto on your local machine
2. You are going to need a [Heroku user account](https://signup.heroku.com/signup) (its free)
3. You will also need to have the [Heroku Toolbelt](https://toolbelt.heroku.com) installed

## Login to Heroku

First you need to open a command shell in the root of your Raneto install. You then need to login to Heroku
using the `heroku login` command. You will be asked to setup some `ssh` keys if you haven't done so already.
Just follow the instructions.

	$ heroku login
	Enter your Heroku credentials.
	Email: zeke@example.com
	Password:
	Could not find an existing public key.
	Would you like to generate one? [Yn]
	Generating new SSH public key.
	Uploading ssh public key /Users/adam/.ssh/id_rsa.pub

## Create a Procfile

Next you will need to create a `Procfile` in the root of your Raneto install. This lets Heroku know how to
run the app. Simple create a file called `Procfile` (with no extension) and add the following line:

    web: node bin/www

This lets Heroku know we want to run a `web` server and the node command we need to start the app.

## Create a Git Repo

Heroku works by deploying a Git repository to their servers. So we need to make your Raneto install is a
Git repository. This also means you will need to commit any changes you make to Git before deploying
them to Heroku. Thankfully this is easy to setup.

	$ git init
	$ git add .
	$ git commit -m "init"

Remeber you will need to `git commit` any future changes you make before deployment.

## Deploy Raneto to Heroku

First we need to create the app in Heroku by running:

	$ heroku create
	Creating sharp-rain-871... done, stack is cedar
	http://sharp-rain-871.herokuapp.com/ | git@heroku.com:sharp-rain-871.git
	Git remote heroku added

Heroku will assign you a random subdomain that your app will be available at.

Next we need to "push" our Git repository to Heroku by running:

    $ git push heroku master

You should see Heroku do a bunch of stuff and successfully deploy your app. Note that you will need to run the
`git push heroku master` command every time you want to publish changes to your Raneto site.

Finally we just need to make sure that we have one dyno running our `web` process. This command only
needs to be run this one time.

    $ heroku ps:scale web=1

You can now visit your live Raneto install in the browser by running the `heroku open` command.

	$ heroku open
	Opening sharp-rain-871... done

## Further Reading

* [Getting Started with Node.js on Heroku](https://devcenter.heroku.com/articles/getting-started-with-nodejs)
* [Process Types and the Procfile](https://devcenter.heroku.com/articles/procfile)
* [Dynos and the Dyno Manager](https://devcenter.heroku.com/articles/dynos)
* [Custom Domains](https://devcenter.heroku.com/articles/custom-domains)
