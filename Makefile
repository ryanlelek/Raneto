#!/usr/bin/make

# The first command listed is the default
.PHONY: default
default: clean install build;

.PHONY: clean
clean:

	# Remove Temporary Files
	rm -rf ./node_modules/;

.PHONY: install
install:

	# Install Node.js Modules
	npm install;

.PHONY: test
test: delint mocha

.PHONY: delint
delint:

	# JSHint
	./node_modules/jshint/bin/jshint \
		app/                           \
		bin/raneto                     \
		example/;

.PHONY: mocha
mocha:
	npm test;

.PHONY: build
build:
	npm run copylibs;

.PHONY: start
start:

	# Start HTTP Server
	node example/server.js

.PHONY: deploy
deploy:

	# Install Node.js Modules (Production)
	npm install --production; true;

	npm run copylibs;
